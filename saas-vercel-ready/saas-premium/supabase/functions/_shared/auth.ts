import { createClient } from "npm:@supabase/supabase-js@2.108.2";

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export interface ResolvedAuth {
  userId: string;
  viaApiKey: boolean;
}

/**
 * Resolves the calling user from an Authorization header that's either:
 *  - a normal Supabase session JWT (browser app usage), or
 *  - a platform developer API key, format `aicp_live_<random>` (public API usage)
 * This lets every existing AI endpoint double as a public, documented API
 * without duplicating any generation logic.
 */
export async function resolveAuth(
  token: string,
  supabaseUrl: string,
  anonKey: string,
  serviceClient: ReturnType<typeof createClient>,
): Promise<ResolvedAuth | null> {
  if (token.startsWith("aicp_live_")) {
    const hash = await sha256Hex(token);
    const { data } = await serviceClient
      .from("developer_api_keys")
      .select("id, user_id, revoked")
      .eq("key_hash", hash)
      .maybeSingle();
    if (!data || (data as { revoked: boolean }).revoked) return null;

    const row = data as { id: string; user_id: string };
    // Fire-and-forget last-used tracking — never block the actual request on it.
    serviceClient.from("developer_api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", row.id).then(() => {});
    return { userId: row.user_id, viaApiKey: true };
  }

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: userData, error } = await userClient.auth.getUser();
  if (error || !userData.user) return null;
  return { userId: userData.user.id, viaApiKey: false };
}
