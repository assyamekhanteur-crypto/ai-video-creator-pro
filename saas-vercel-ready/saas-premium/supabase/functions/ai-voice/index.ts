import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import { resolveApiKey } from "../_shared/apiKeys.ts";
import { checkRateLimit, rateLimitResponse } from "../_shared/rateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VOICE_CREDITS = 5; // ElevenLabs Multilingual v2 ≈ $0.045/30s narration; 1 credit ≈ $0.01 real cost

async function deductCredits(supabase: ReturnType<typeof createClient>, userId: string, cost: number, jobId: string) {
  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .maybeSingle();
  if (pErr) throw new Error(`Profile lookup failed: ${pErr.message}`);
  if (!profile) throw new Error("Profile not found");
  if ((profile as { credits: number }).credits < cost) {
    throw new Error(`Insufficient credits: need ${cost}, have ${(profile as { credits: number }).credits}`);
  }
  await supabase.from("profiles").update({ credits: (profile as { credits: number }).credits - cost }).eq("id", userId);
  await supabase.from("credit_ledger").insert({ user_id: userId, delta: -cost, reason: "usage", ref_id: jobId });
}

async function ensureBucket(supabase: ReturnType<typeof createClient>) {
  const { error } = await supabase.storage.createBucket("ai-assets", { public: true });
  if (error && !error.message.includes("already exists")) {
    throw new Error(`Storage bucket error: ${error.message}`);
  }
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
    const rateLimit = await checkRateLimit(serviceClient, userId, "ai-voice", 10, 300);
    if (!rateLimit.allowed) return rateLimitResponse(corsHeaders, rateLimit.retryAfterSeconds!);

    const body = (await req.json()) as { text: string; voiceId?: string; projectId?: string };
    if (!body.text || !body.text.trim()) throw new Error("text is required");

    await ensureBucket(serviceClient);

    const { data: job, error: jobErr } = await serviceClient.from("ai_jobs").insert({
      user_id: userId,
      project_id: body.projectId ?? null,
      job_type: "voice",
      provider: "elevenlabs",
      status: "processing",
      prompt: body.text.slice(0, 5000),
      credits_cost: VOICE_CREDITS,
    }).select().maybeSingle();
    if (jobErr || !job) throw new Error(`Failed to create job: ${jobErr?.message ?? "no row"}`);
    const jobId = (job as { id: string }).id;

    try {
      const { apiKey, isUserKey } = await resolveApiKey(serviceClient, userId, "elevenlabs", "ELEVENLABS_API_KEY");

      const voiceId = body.voiceId ?? "21m00Tcm4TlvDq8ikWAM";
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: body.text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`ElevenLabs error (${res.status}): ${txt}`);
      }

      const audioBuf = new Uint8Array(await res.arrayBuffer());
      const filename = `voice/${userId}/${jobId}.mp3`;
      const { error: upErr } = await serviceClient.storage.from("ai-assets").upload(filename, audioBuf, { contentType: "audio/mpeg", upsert: true });
      if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

      const { data: pub } = serviceClient.storage.from("ai-assets").getPublicUrl(filename);
      const audioUrl = pub.publicUrl;

      if (!isUserKey) {
        await deductCredits(serviceClient, userId, VOICE_CREDITS, jobId);
      }

      await serviceClient.from("ai_jobs").update({
        status: "completed",
        result_url: audioUrl,
        completed_at: new Date().toISOString(),
      }).eq("id", jobId);

      return new Response(JSON.stringify({
        audioUrl,
        creditsCost: isUserKey ? 0 : VOICE_CREDITS,
        jobId,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (e) {
      await serviceClient.from("ai_jobs").update({
        status: "failed",
        error_message: e instanceof Error ? e.message : String(e),
        completed_at: new Date().toISOString(),
      }).eq("id", jobId);
      throw e;
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
