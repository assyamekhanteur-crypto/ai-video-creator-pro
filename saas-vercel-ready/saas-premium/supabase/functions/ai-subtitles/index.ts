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

// Whisper API: $0.006/minute. 1 credit ≈ $0.01 real cost basis (see ai-video/ai-voice).
const SUBTITLES_CREDITS = 3;

interface SubtitlesRequest {
  sourceUrl: string;
  projectId?: string;
  language?: string;
}

interface WhisperSegment {
  start: number;
  end: number;
  text: string;
}

interface TranscriptionResult {
  segments: WhisperSegment[];
  language: string | null;
}

async function deductCredits(supabase: ReturnType<typeof createClient>, userId: string, cost: number, jobId: string) {
  const { data: profile, error: pErr } = await supabase.from("profiles").select("credits").eq("id", userId).maybeSingle();
  if (pErr) throw new Error(`Profile lookup failed: ${pErr.message}`);
  if (!profile) throw new Error("Profile not found");
  if ((profile as { credits: number }).credits < cost) {
    throw new Error(`Insufficient credits: need ${cost}, have ${(profile as { credits: number }).credits}`);
  }
  await supabase.from("profiles").update({ credits: (profile as { credits: number }).credits - cost }).eq("id", userId);
  await supabase.from("credit_ledger").insert({ user_id: userId, delta: -cost, reason: "usage", ref_id: jobId });
}

async function transcribe(apiKey: string, audioUrl: string, language?: string): Promise<TranscriptionResult> {

  const audioRes = await fetch(audioUrl);
  if (!audioRes.ok) throw new Error(`Could not fetch audio from ${audioUrl} (${audioRes.status})`);
  const audioBlob = await audioRes.blob();

  const form = new FormData();
  form.append("file", audioBlob, "audio.mp3");
  form.append("model", "whisper-1");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "segment");
  if (language) form.append("language", language);

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Whisper error (${res.status}): ${txt}`);
  }
  const json = await res.json();
  const segments = (json.segments ?? []) as { start: number; end: number; text: string }[];
  return {
    segments: segments.map(s => ({ start: s.start, end: s.end, text: s.text.trim() })),
    language: json.language ?? null,
  };
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

    const rateLimit = await checkRateLimit(serviceClient, userId, "ai-subtitles", 10, 300);
    if (!rateLimit.allowed) return rateLimitResponse(corsHeaders, rateLimit.retryAfterSeconds!);

    const body = (await req.json()) as SubtitlesRequest;
    if (!body.sourceUrl) throw new Error("sourceUrl is required");

    const { data: job, error: jobErr } = await serviceClient.from("ai_jobs").insert({
      user_id: userId,
      project_id: body.projectId ?? null,
      job_type: "subtitles",
      provider: "openai",
      status: "processing",
      prompt: body.sourceUrl.slice(0, 2000),
      credits_cost: SUBTITLES_CREDITS,
    }).select().maybeSingle();
    if (jobErr || !job) throw new Error(`Failed to create job: ${jobErr?.message ?? "no row"}`);
    const jobId = (job as { id: string }).id;

    try {
      const { apiKey, isUserKey } = await resolveApiKey(serviceClient, userId, "openai", "OPENAI_API_KEY");
      const { segments, language } = await transcribe(apiKey, body.sourceUrl, body.language);

      if (!isUserKey) {
        await deductCredits(serviceClient, userId, SUBTITLES_CREDITS, jobId);
      }

      await serviceClient.from("ai_jobs").update({
        status: "completed",
        result_text: JSON.stringify({ segments, language }),
        completed_at: new Date().toISOString(),
      }).eq("id", jobId);

      return new Response(JSON.stringify({ jobId, segments, language, creditsCost: isUserKey ? 0 : SUBTITLES_CREDITS }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
