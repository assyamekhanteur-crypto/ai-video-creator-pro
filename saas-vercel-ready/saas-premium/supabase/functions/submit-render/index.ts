import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CREDITS: Record<string, number> = {
  script: 2,
  voice: 3,
  video: 10,
  export: 5,
};

const VALID_PROVIDERS: Record<string, string[]> = {
  script: ["openai"],
  voice: ["elevenlabs"],
  video: ["runway", "kling", "google"],
  export: ["internal"],
};

interface SubmitRequest {
  jobType: "script" | "voice" | "video" | "export";
  provider?: string;
  prompt: string;
  options?: Record<string, unknown>;
  projectId?: string;
  priority?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return new Response(JSON.stringify({ error: "Missing auth token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData, error: uErr } = await userClient.auth.getUser();
    if (uErr || !userData.user) return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = userData.user.id;

    const serviceClient = createClient(supabaseUrl, serviceRole);

    /* ── GET: poll a previously submitted job's status ── */
    if (req.method === "GET") {
      const url = new URL(req.url);
      const jobId = url.searchParams.get("jobId");
      if (!jobId) throw new Error("jobId query param is required");

      const { data: job, error: jobErr } = await serviceClient
        .from("render_jobs")
        .select("status, result_url, result_text, error_message, credits_cost")
        .eq("id", jobId)
        .eq("user_id", userId)
        .maybeSingle();
      if (jobErr || !job) return new Response(JSON.stringify({ error: "Job not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

      return new Response(JSON.stringify(job), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = (await req.json()) as SubmitRequest;
    if (!body.jobType || !CREDITS[body.jobType]) throw new Error(`Invalid jobType: ${body.jobType}`);
    if (!body.prompt || !body.prompt.trim()) throw new Error("prompt is required");

    const provider = body.provider ?? VALID_PROVIDERS[body.jobType][0];
    if (!VALID_PROVIDERS[body.jobType].includes(provider)) {
      throw new Error(`Provider ${provider} not valid for ${body.jobType}. Valid: ${VALID_PROVIDERS[body.jobType].join(", ")}`);
    }

    // Check suspended
    const { data: profile } = await serviceClient.from("profiles").select("credits, is_suspended").eq("id", userId).maybeSingle();
    const p = profile as { credits: number; is_suspended: boolean } | null;
    if (!p) throw new Error("Profile not found");
    if (p.is_suspended) throw new Error("Account suspended. Contact support.");

    const cost = CREDITS[body.jobType];
    if (p.credits < cost) {
      return new Response(JSON.stringify({ error: `Insufficient credits: need ${cost}, have ${p.credits}`, code: "INSUFFICIENT_CREDITS" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Deduct credits up front (refunded on failure by render-processor)
    const { error: updErr } = await serviceClient.from("profiles").update({ credits: p.credits - cost }).eq("id", userId);
    if (updErr) throw new Error(`Failed to deduct credits: ${updErr.message}`);
    await serviceClient.from("credit_ledger").insert({ user_id: userId, delta: -cost, reason: "usage" });
    await serviceClient.from("analytics_events").insert({ user_id: userId, event_type: "credits_spent", properties: { jobType: body.jobType, provider }, credits_delta: -cost });

    // Enqueue job
    const { data: job, error: jobErr } = await serviceClient.from("render_jobs").insert({
      user_id: userId,
      project_id: body.projectId ?? null,
      job_type: body.jobType,
      provider,
      status: "queued",
      priority: body.priority ?? 5,
      prompt: body.prompt.slice(0, 5000),
      options: body.options ?? {},
      credits_cost: cost,
    }).select().maybeSingle();
    if (jobErr || !job) {
      // Refund on enqueue failure
      await serviceClient.from("profiles").update({ credits: p.credits }).eq("id", userId);
      await serviceClient.from("credit_ledger").insert({ user_id: userId, delta: cost, reason: "refund" });
      throw new Error(`Failed to enqueue job: ${jobErr?.message ?? "no row"}`);
    }

    const jobId = (job as { id: string }).id;

    // Fire-and-forget: trigger the processor (non-blocking so client doesn't wait for render)
    const processorUrl = `${supabaseUrl}/functions/v1/render-processor`;
    EdgeRuntime.waitUntil(
      fetch(processorUrl, { method: "POST", headers: { Authorization: `Bearer ${serviceRole}`, "Content-Type": "application/json" } }).catch(() => {})
    );

    return new Response(JSON.stringify({
      jobId,
      status: "queued",
      creditsCost: cost,
      message: "Job queued. Poll GET /submit-render?jobId=... for status, or watch /render-history.",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});