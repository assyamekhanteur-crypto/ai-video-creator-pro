import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import { resolveApiKey } from "../_shared/apiKeys.ts";
import { checkRateLimit, rateLimitResponse } from "../_shared/rateLimit.ts";
import { resolveAuth } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// 1 credit ≈ $0.01 of real provider cost, so credits consumed always map to a
// consistent dollar figure no matter which video provider the user picks.
// Runway Gen-3 Turbo: 5 credits/sec × $0.01/credit = $0.05/sec → 5s = $0.25 → 25 credits
// Kling text2video:   ~$0.08/sec → 5s = $0.40 → 40 credits
// Google Veo 3.1 Fast: $0.10/sec → 5s = $0.50 → 50 credits
const VIDEO_CREDITS: Record<string, number> = { runway: 25, kling: 40, google: 50 };

interface VideoRequest {
  prompt: string;
  provider?: "runway" | "kling" | "google";
  durationSec?: number;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  imageUrl?: string;
  projectId?: string;
}

interface ProviderStatus {
  status: "processing" | "completed" | "failed";
  videoUrl?: string;
  error?: string;
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

/* ─── Submit: start an async render, return the provider's job id ─── */

async function callRunway(apiKey: string, prompt: string, opts: VideoRequest): Promise<{ id: string }> {
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

async function callKling(apiKey: string, prompt: string, opts: VideoRequest): Promise<{ id: string }> {
  const res = await fetch("https://api.klingai.com/v1/videos/text2video", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
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

async function callGoogle(apiKey: string, prompt: string, opts: VideoRequest): Promise<{ id: string }> {
  // veo-2.0-generate-001 was shut down by Google on 2026-06-30 — do not revert to it.
  const model = Deno.env.get("GOOGLE_VIDEO_MODEL") ?? "veo-3.1-fast-generate-preview";
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

/* ─── Poll: ask the provider whether the render is actually done ─── */

async function checkRunway(apiKey: string, providerJobId: string): Promise<ProviderStatus> {
  const res = await fetch(`https://api.runwayml.com/v1/tasks/${providerJobId}`, {
    headers: { Authorization: `Bearer ${apiKey}`, "X-Runway-Version": "2024-11-06" },
  });
  if (!res.ok) return { status: "failed", error: `Runway status check failed (${res.status})` };
  const json = await res.json();
  if (json.status === "SUCCEEDED") return { status: "completed", videoUrl: json.output?.[0] };
  if (json.status === "FAILED") return { status: "failed", error: json.failure ?? "Runway render failed" };
  return { status: "processing" };
}

async function checkKling(apiKey: string, providerJobId: string): Promise<ProviderStatus> {
  const res = await fetch(`https://api.klingai.com/v1/videos/text2video/${providerJobId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return { status: "failed", error: `Kling status check failed (${res.status})` };
  const json = await res.json();
  const state = json.data?.task_status;
  if (state === "succeed") return { status: "completed", videoUrl: json.data?.task_result?.videos?.[0]?.url };
  if (state === "failed") return { status: "failed", error: json.data?.task_status_msg ?? "Kling render failed" };
  return { status: "processing" };
}

async function checkGoogle(apiKey: string, providerJobId: string): Promise<ProviderStatus> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${providerJobId}?key=${apiKey}`);
  if (!res.ok) return { status: "failed", error: `Google Veo status check failed (${res.status})` };
  const json = await res.json();
  if (json.done) {
    const uri = json.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
      ?? json.response?.videos?.[0]?.uri;
    if (json.error) return { status: "failed", error: json.error.message ?? "Google Veo render failed" };
    return { status: "completed", videoUrl: uri };
  }
  return { status: "processing" };
}

async function checkProviderStatus(apiKey: string, provider: string, providerJobId: string): Promise<ProviderStatus> {
  switch (provider) {
    case "kling": return checkKling(apiKey, providerJobId);
    case "google": return checkGoogle(apiKey, providerJobId);
    case "runway":
    default: return checkRunway(providerJobId);
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

    const serviceClient = createClient(supabaseUrl, serviceRole);
    const auth = await resolveAuth(token, supabaseUrl, anonKey, serviceClient);
    if (!auth) return new Response(JSON.stringify({ error: "Invalid session or API key" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = auth.userId;

    /* ── GET: poll an existing job's real status from the provider ── */
    if (req.method === "GET") {
      const url = new URL(req.url);
      const jobId = url.searchParams.get("jobId");
      if (!jobId) throw new Error("jobId query param is required");

      const { data: job, error: jobErr } = await serviceClient
        .from("ai_jobs")
        .select("*")
        .eq("id", jobId)
        .eq("user_id", userId)
        .maybeSingle();
      if (jobErr || !job) return new Response(JSON.stringify({ error: "Job not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

      const row = job as { status: string; provider: string; provider_job_id: string | null; result_url: string | null; error_message: string | null };

      if (row.status !== "processing" || !row.provider_job_id) {
        return new Response(JSON.stringify({ status: row.status, resultUrl: row.result_url, error: row.error_message }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const platformEnvVar = row.provider === "kling" ? "KLING_JWT" : row.provider === "google" ? "GOOGLE_AI_API_KEY" : "RUNWAY_API_KEY";
      const { apiKey } = await resolveApiKey(serviceClient, userId, row.provider, platformEnvVar);
      const check = await checkProviderStatus(apiKey, row.provider, row.provider_job_id);

      if (check.status === "completed") {
        await serviceClient.from("ai_jobs").update({
          status: "completed",
          result_url: check.videoUrl ?? null,
          completed_at: new Date().toISOString(),
        }).eq("id", jobId);
      } else if (check.status === "failed") {
        await serviceClient.from("ai_jobs").update({
          status: "failed",
          error_message: check.error ?? "Render failed",
          completed_at: new Date().toISOString(),
        }).eq("id", jobId);
      }

      return new Response(JSON.stringify({ status: check.status, resultUrl: check.videoUrl ?? null, error: check.error ?? null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    /* ── POST: submit a new video generation job ── */
    const rateLimit = await checkRateLimit(serviceClient, userId, "ai-video", 5, 600);
    if (!rateLimit.allowed) return rateLimitResponse(corsHeaders, rateLimit.retryAfterSeconds!);

    const body = (await req.json()) as VideoRequest;
    if (!body.prompt || !body.prompt.trim()) throw new Error("prompt is required");
    const provider = body.provider ?? "runway";
    const creditsCost = VIDEO_CREDITS[provider] ?? VIDEO_CREDITS.runway;

    await ensureBucket(serviceClient);

    const { data: job, error: jobErr } = await serviceClient.from("ai_jobs").insert({
      user_id: userId,
      project_id: body.projectId ?? null,
      job_type: "video",
      provider,
      status: "processing",
      prompt: body.prompt.slice(0, 2000),
      credits_cost: creditsCost,
    }).select().maybeSingle();
    if (jobErr || !job) throw new Error(`Failed to create job: ${jobErr?.message ?? "no row"}`);
    const jobId = (job as { id: string }).id;

    try {
      const platformEnvVar = provider === "kling" ? "KLING_JWT" : provider === "google" ? "GOOGLE_AI_API_KEY" : "RUNWAY_API_KEY";
      const { apiKey, isUserKey } = await resolveApiKey(serviceClient, userId, provider, platformEnvVar);

      if (!isUserKey) {
        await deductCredits(serviceClient, userId, creditsCost, jobId);
      }

      let providerJobId: string;
      switch (provider) {
        case "kling": providerJobId = (await callKling(apiKey, body.prompt, body)).id; break;
        case "google": providerJobId = (await callGoogle(apiKey, body.prompt, body)).id; break;
        case "runway":
        default: providerJobId = (await callRunway(apiKey, body.prompt, body)).id; break;
      }

      // Stays 'processing' — only the GET poll above (backed by the real
      // provider status) is allowed to mark this job 'completed'.
      await serviceClient.from("ai_jobs").update({
        provider_job_id: providerJobId,
      }).eq("id", jobId);

      return new Response(JSON.stringify({
        provider,
        providerJobId,
        jobId,
        creditsCost: isUserKey ? 0 : creditsCost,
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
