import { createClient } from "npm:@supabase/supabase-js@2.108.2";

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/**
 * Enforces a sliding-window rate limit: at most `maxRequests` calls to
 * `functionName` by `userId` within the last `windowSeconds`. Fails open
 * on infra errors — a broken rate-limit check should never be the reason
 * a legitimate request gets blocked.
 */
export async function checkRateLimit(
  serviceClient: ReturnType<typeof createClient>,
  userId: string,
  functionName: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count, error } = await serviceClient
    .from("rate_limit_log")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("function_name", functionName)
    .gte("created_at", windowStart);

  if (error) {
    return { allowed: true };
  }

  if ((count ?? 0) >= maxRequests) {
    return { allowed: false, retryAfterSeconds: windowSeconds };
  }

  await serviceClient.from("rate_limit_log").insert({ user_id: userId, function_name: functionName });

  // Opportunistic cleanup — avoids needing a separate cron job for a
  // low-traffic table like this. ~2% chance per call to purge stale rows.
  if (Math.random() < 0.02) {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await serviceClient.from("rate_limit_log").delete().lt("created_at", cutoff);
  }

  return { allowed: true };
}

export function rateLimitResponse(corsHeaders: Record<string, string>, retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({ error: `Too many requests. Try again in ${retryAfterSeconds}s.`, code: "RATE_LIMITED" }),
    { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(retryAfterSeconds) } },
  );
}
