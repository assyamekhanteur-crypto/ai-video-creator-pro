import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VIDEO_CREDITS = 10;

interface VideoRequest {
  prompt: string;
  provider?: "runway" | "kling" | "google";
  durationSec?: number;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  imageUrl?: string;
  projectId?: string;
}

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
  if (error && !error.message.includes("already exists")) throw new Error(`Storage bucket error: ${error.message}`);
}

async function callRunway(prompt: string, opts: VideoRequest): Promise<{ id: string }> {
  const apiKey = Deno.env.get("RUNWAY_API_KEY");
  if (!apiKey) throw new Error("RUNWAY_API_KEY secret is not configured. Add it in your Supabase project secrets.");
  const res = await fetch("https://api.runwayml.com/v1/image_to_video", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "X-Runway-Version": "2024-11-06" },
    body: JSON.stringify({
      model: "gen3_turbo",
      promptText: prompt,
      duration: opts.durationSec ?? 5,
      ratio: opts.aspectRatio ?? "16:9",
      ...(opts.imageUrl ? { promptImage: opts.imageUrl } : {}),
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Runway error (${res.status}): ${txt}`);
  }
  const json = await res.json();
  return { id: json.id };
}

async function callKling(prompt: string, opts: VideoRequest): Promise<{ id: string }> {
  const apiKey = Deno.env.get("KLING_API_KEY");
  if (!apiKey) throw new Error("KLING_API_KEY secret is not configured. Add it in your Supabase project secrets.");
  const jwtPath = Deno.env.get("KLING_JWT");
  if (!jwtPath) throw new Error("KLING_JWT secret is not configured.");
  const res = await fetch("https://api.klingai.com/v1/videos/text2video", {
    method: "POST",
    headers: { Authorization: `Bearer ${jwtPath}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "kling-v1",
      prompt,
      duration: opts.durationSec ?? 5,
      aspect_ratio: opts.aspectRatio ?? "16:9",
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Kling error (${res.status}): ${txt}`);
  }
  const json = await res.json();
  return { id: json.data?.video_id ?? json.id };
}

async function callGoogle(prompt: string, opts: VideoRequest): Promise<{ id: string }> {
  const apiKey = Deno.env.get("GOOGLE_AI_API_KEY");
  if (!apiKey) throw new Error("GOOGLE_AI_API_KEY secret is not configured. Add it in your Supabase project secrets.");
  const model = Deno.env.get("GOOGLE_VIDEO_MODEL") ?? "veo-2.0-generate-001";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { aspectRatio: opts.aspectRatio ?? "16:9", sampleCount: 1 },
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Google Veo error (${res.status}): ${txt}`);
  }
  const json = await res.json();
  return { id: json.name };
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

    const body = (await req.json()) as VideoRequest;
    if (!body.prompt || !body.prompt.trim()) throw new Error("prompt is required");
    const provider = body.provider ?? "runway";

    const serviceClient = createClient(supabaseUrl, serviceRole);
    await ensureBucket(serviceClient);

    const { data: job, error: jobErr } = await serviceClient.from("ai_jobs").insert({
      user_id: userId,
      project_id: body.projectId ?? null,
      job_type: "video",
      provider,
      status: "processing",
      prompt: body.prompt.slice(0, 2000),
      credits_cost: VIDEO_CREDITS,
    }).select().maybeSingle();
    if (jobErr || !job) throw new Error(`Failed to create job: ${jobErr?.message ?? "no row"}`);
    const jobId = (job as { id: string }).id;

    try {
      await deductCredits(serviceClient, userId, VIDEO_CREDITS, jobId);

      let providerJobId: string;
      switch (provider) {
        case "kling": providerJobId = (await callKling(body.prompt, body)).id; break;
        case "google": providerJobId = (await callGoogle(body.prompt, body)).id; break;
        case "runway":
        default: providerJobId = (await callRunway(body.prompt, body)).id; break;
      }

      await serviceClient.from("ai_jobs").update({
        status: "completed",
        result_url: null,
        result_text: JSON.stringify({ providerJobId, provider }),
        completed_at: new Date().toISOString(),
      }).eq("id", jobId);

      return new Response(JSON.stringify({
        provider,
        providerJobId,
        jobId,
        creditsCost: VIDEO_CREDITS,
        status: "processing",
        message: "Video generation started. Poll status via GET /ai-video?jobId=...",
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
