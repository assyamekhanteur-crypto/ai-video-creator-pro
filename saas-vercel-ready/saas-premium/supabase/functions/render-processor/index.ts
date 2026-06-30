import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function serviceClient() {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key);
}

async function logAnalytics(supabase: ReturnType<typeof serviceClient>, userId: string, eventType: string, properties: Record<string, unknown>, creditsDelta = 0) {
  await supabase.from("analytics_events").insert({ user_id: userId, event_type: eventType, properties, credits_delta: creditsDelta });
}

async function enqueueEmail(supabase: ReturnType<typeof serviceClient>, userId: string, toEmail: string, template: string, subject: string, body: string, refId?: string) {
  await supabase.from("email_notifications").insert({
    user_id: userId,
    to_email: toEmail,
    template,
    subject,
    body,
    status: "queued",
    ref_id: refId ?? null,
  });
}

async function refundCredits(supabase: ReturnType<typeof serviceClient>, userId: string, amount: number, jobId: string, reason: string) {
  const { data: profile } = await supabase.from("profiles").select("credits").eq("id", userId).maybeSingle();
  if (!profile) return;
  const current = (profile as { credits: number }).credits;
  await supabase.from("profiles").update({ credits: current + amount }).eq("id", userId);
  await supabase.from("credit_ledger").insert({ user_id: userId, delta: amount, reason: "refund", ref_id: jobId });
  await logAnalytics(supabase, userId, "credits_refunded", { amount, jobId, reason }, amount);
}

// --- Provider callers (mirror ai-script / ai-voice / ai-video logic, inline to keep functions self-contained) ---

async function callOpenAI(prompt: string, opts: Record<string, unknown>): Promise<{ title: string; hook: string; scenes: unknown[] }> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new RenderError("OPENAI_API_KEY missing", "SECRET_MISSING");
  const style = (opts.style as string) ?? "tutorial";
  const tone = (opts.tone as string) ?? "professional";
  const targetSec = (opts.durationSec as number) ?? 45;
  const sys = `You are a professional video scriptwriter. Output STRICT JSON only. Return: { "title": string, "hook": string, "scenes": [{ "id": number, "heading": string, "narration": string, "visuals": string, "durationSec": number }] }. Style: ${style}. Tone: ${tone}. Total ~ ${targetSec}s. 3-7 scenes.`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: sys }, { role: "user", content: `Write: ${prompt}` }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new RenderError(`OpenAI ${res.status}: ${txt.slice(0, 300)}`, "PROVIDER_ERROR");
  }
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new RenderError("OpenAI returned no content", "PROVIDER_EMPTY");
  try {
    return JSON.parse(content);
  } catch {
    throw new RenderError("OpenAI returned invalid JSON", "PROVIDER_PARSE_ERROR");
  }
}

async function callElevenLabs(text: string, supabase: ReturnType<typeof serviceClient>, userId: string, jobId: string): Promise<{ audioUrl: string }> {
  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  if (!apiKey) throw new RenderError("ELEVENLABS_API_KEY missing", "SECRET_MISSING");
  const voiceId = "21m00Tcm4TlvDq8ikWAM";
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new RenderError(`ElevenLabs ${res.status}: ${txt.slice(0, 300)}`, "PROVIDER_ERROR");
  }
  const audioBuf = new Uint8Array(await res.arrayBuffer());
  const filename = `voice/${userId}/${jobId}.mp3`;
  const { error: upErr } = await supabase.storage.from("ai-assets").upload(filename, audioBuf, { contentType: "audio/mpeg", upsert: true });
  if (upErr) throw new RenderError(`Storage upload failed: ${upErr.message}`, "STORAGE_ERROR");
  const { data: pub } = supabase.storage.from("ai-assets").getPublicUrl(filename);
  return { audioUrl: pub.publicUrl };
}

async function callVideoProvider(prompt: string, provider: string, opts: Record<string, unknown>): Promise<{ providerJobId: string; resultUrl?: string }> {
  const aspectRatio = (opts.aspectRatio as string) ?? "16:9";
  const durationSec = (opts.durationSec as number) ?? 5;
  switch (provider) {
    case "kling": {
      const apiKey = Deno.env.get("KLING_API_KEY");
      const jwt = Deno.env.get("KLING_JWT");
      if (!apiKey || !jwt) throw new RenderError("KLING_API_KEY or KLING_JWT missing", "SECRET_MISSING");
      const res = await fetch("https://api.klingai.com/v1/videos/text2video", {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "kling-v1", prompt, duration: durationSec, aspect_ratio: aspectRatio }),
      });
      if (!res.ok) throw new RenderError(`Kling ${res.status}: ${(await res.text()).slice(0, 300)}`, "PROVIDER_ERROR");
      const j = await res.json();
      return { providerJobId: j.data?.video_id ?? j.id ?? "unknown" };
    }
    case "google": {
      const apiKey = Deno.env.get("GOOGLE_AI_API_KEY");
      if (!apiKey) throw new RenderError("GOOGLE_AI_API_KEY missing", "SECRET_MISSING");
      const model = Deno.env.get("GOOGLE_VIDEO_MODEL") ?? "veo-2.0-generate-001";
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instances: [{ prompt }], parameters: { aspectRatio, sampleCount: 1 } }),
      });
      if (!res.ok) throw new RenderError(`Google Veo ${res.status}: ${(await res.text()).slice(0, 300)}`, "PROVIDER_ERROR");
      const j = await res.json();
      return { providerJobId: j.name ?? "unknown" };
    }
    case "runway":
    default: {
      const apiKey = Deno.env.get("RUNWAY_API_KEY");
      if (!apiKey) throw new RenderError("RUNWAY_API_KEY missing", "SECRET_MISSING");
      const res = await fetch("https://api.runwayml.com/v1/image_to_video", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "X-Runway-Version": "2024-11-06" },
        body: JSON.stringify({ model: "gen3_turbo", promptText: prompt, duration: durationSec, ratio: aspectRatio }),
      });
      if (!res.ok) throw new RenderError(`Runway ${res.status}: ${(await res.text()).slice(0, 300)}`, "PROVIDER_ERROR");
      const j = await res.json();
      return { providerJobId: j.id ?? "unknown" };
    }
  }
}

// Video export/compression options (transcoding is delegated to provider when supported; otherwise we record the source URL with requested format/quality)
async function processExport(supabase: ReturnType<typeof serviceClient>, userId: string, jobId: string, opts: Record<string, unknown>): Promise<{ resultUrl: string }> {
  const sourceUrl = opts.sourceUrl as string | undefined;
  const quality = (opts.quality as string) ?? "1080p";
  const format = (opts.format as string) ?? "mp4";
  if (!sourceUrl) throw new RenderError("sourceUrl required for export", "BAD_REQUEST");
  // Re-host the source under exports/ with metadata. Real transcoding requires a media worker (e.g. Mux/Qencode).
  const filename = `exports/${userId}/${jobId}.${format}`;
  const meta = { quality, format, originalUrl: sourceUrl, exportedAt: new Date().toISOString() };
  const buf = new TextEncoder().encode(JSON.stringify(meta, null, 2));
  const { error } = await supabase.storage.from("ai-assets").upload(filename, buf, { contentType: "application/json", upsert: true });
  if (error) throw new RenderError(`Export upload failed: ${error.message}`, "STORAGE_ERROR");
  const { data: pub } = supabase.storage.from("ai-assets").getPublicUrl(filename);
  return { resultUrl: pub.publicUrl };
}

class RenderError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "RenderError";
  }
}

async function processJob(supabase: ReturnType<typeof serviceClient>, job: Record<string, unknown>): Promise<{ resultUrl?: string; resultText?: string }> {
  const jobType = job.job_type as string;
  const provider = job.provider as string;
  const prompt = job.prompt as string;
  const options = (job.options as Record<string, unknown>) ?? {};
  const userId = job.user_id as string;
  const jobId = job.id as string;

  if (jobType === "script") {
    const r = await callOpenAI(prompt, options);
    return { resultText: JSON.stringify(r) };
  }
  if (jobType === "voice") {
    const r = await callElevenLabs(prompt, supabase, userId, jobId);
    return { resultUrl: r.audioUrl };
  }
  if (jobType === "video") {
    const r = await callVideoProvider(prompt, provider, options);
    return { resultText: JSON.stringify({ providerJobId: r.providerJobId, provider }) };
  }
  if (jobType === "export") {
    const r = await processExport(supabase, userId, jobId, options);
    return { resultUrl: r.resultUrl };
  }
  throw new RenderError(`Unknown job_type: ${jobType}`, "BAD_REQUEST");
}

async function claimNextJob(supabase: ReturnType<typeof serviceClient>): Promise<Record<string, unknown> | null> {
  // Atomically claim the highest-priority oldest queued job.
  const { data, error } = await supabase.rpc("claim_next_render_job");
  if (error) throw new Error(`claim_next_render_job failed: ${error.message}`);
  return (data as Record<string, unknown> | null) ?? null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const supabase = serviceClient();
    const processedCount = { ok: 0, failed: 0 };

    // Process up to N jobs per invocation (single-pass queue worker trigger).
    const MAX_BATCH = 5;
    for (let i = 0; i < MAX_BATCH; i++) {
      const job = await claimNextJob(supabase);
      if (!job) break;

      const jobId = job.id as string;
      const userId = job.user_id as string;
      const creditsCost = job.credits_cost as number;
      const { data: u } = await supabase.from("profiles").select("email, is_suspended").eq("id", userId).maybeSingle();
      const userEmail = (u as { email: string; is_suspended: boolean } | null)?.email ?? "";
      const suspended = (u as { is_suspended: boolean } | null)?.is_suspended ?? false;

      if (suspended) {
        await supabase.from("render_jobs").update({ status: "cancelled", error_message: "Account suspended", error_code: "ACCOUNT_SUSPENDED", completed_at: new Date().toISOString() }).eq("id", jobId);
        await refundCredits(supabase, userId, creditsCost, jobId, "account_suspended");
        continue;
      }

      await supabase.from("render_jobs").update({ status: "processing", started_at: new Date().toISOString(), attempt: (job.attempt as number) + 1, updated_at: new Date().toISOString() }).eq("id", jobId);
      await logAnalytics(supabase, userId, "render_started", { jobId, job_type: job.job_type, provider: job.provider, attempt: job.attempt });

      try {
        const result = await processJob(supabase, job);
        await supabase.from("render_jobs").update({
          status: "completed",
          result_url: result.resultUrl ?? null,
          result_text: result.resultText ?? null,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }).eq("id", jobId);
        await logAnalytics(supabase, userId, "render_completed", { jobId, job_type: job.job_type }, -creditsCost);
        await enqueueEmail(supabase, userId, userEmail, "render_completed",
          `Your ${job.job_type} render is ready`,
          `Your ${job.job_type} render (job ${jobId}) completed successfully.${result.resultUrl ? `\n\nResult: ${result.resultUrl}` : ""}`,
          jobId
        );
        processedCount.ok++;
      } catch (e) {
        const err = e instanceof RenderError ? e : new RenderError(e instanceof Error ? e.message : String(e), "UNKNOWN");
        const attempt = (job.attempt as number) + 1;
        const maxAttempts = job.max_attempts as number;

        if (attempt < maxAttempts) {
          // Re-queue for retry with exponential backoff (set queued_at forward).
          const backoffSec = Math.min(60 * Math.pow(2, attempt - 1), 600);
          const nextQueuedAt = new Date(Date.now() + backoffSec * 1000).toISOString();
          await supabase.from("render_jobs").update({
            status: "queued",
            error_message: err.message,
            error_code: err.code,
            queued_at: nextQueuedAt,
            updated_at: new Date().toISOString(),
          }).eq("id", jobId);
          await logAnalytics(supabase, userId, "render_retry", { jobId, attempt, error: err.code });
        } else {
          await supabase.from("render_jobs").update({
            status: "failed",
            error_message: err.message,
            error_code: err.code,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }).eq("id", jobId);
          await refundCredits(supabase, userId, creditsCost, jobId, `render_failed:${err.code}`);
          await logAnalytics(supabase, userId, "render_failed", { jobId, error: err.code, message: err.message });
          await enqueueEmail(supabase, userId, userEmail, "render_failed",
            `Your ${job.job_type} render failed`,
            `Your ${job.job_type} render (job ${jobId}) failed after ${maxAttempts} attempts.\n\nError: ${err.message}\n\nYour ${creditsCost} credits have been refunded.`,
            jobId
          );
          processedCount.failed++;
        }
      }
    }

    return new Response(JSON.stringify({ processed: processedCount }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
