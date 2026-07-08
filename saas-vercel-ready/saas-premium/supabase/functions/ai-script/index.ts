import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import { resolveApiKey } from "../_shared/apiKeys.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ScriptRequest {
  prompt: string;
  style?: "tutorial" | "vlog" | "news" | "story" | "promo";
  tone?: "professional" | "casual" | "energetic" | "inspirational";
  durationSec?: number;
}

interface ScriptScene {
  id: number;
  heading: string;
  narration: string;
  visuals: string;
  durationSec: number;
}

interface ScriptResponse {
  title: string;
  hook: string;
  scenes: ScriptScene[];
  totalDurationSec: number;
  creditsCost: number;
  jobId: string;
}

const SCENE_CREDITS = 2;

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
  const { error: updErr } = await supabase
    .from("profiles")
    .update({ credits: (profile as { credits: number }).credits - cost })
    .eq("id", userId);
  if (updErr) throw new Error(`Failed to deduct credits: ${updErr.message}`);
  await supabase.from("credit_ledger").insert({
    user_id: userId,
    delta: -cost,
    reason: "usage",
    ref_id: jobId,
  });
}

async function callOpenAI(apiKey: string, prompt: string, style: string, tone: string, targetSec: number): Promise<{ title: string; hook: string; scenes: ScriptScene[] }> {
  const sys = `You are a professional video scriptwriter. Output STRICT JSON only, no prose.
Return: { "title": string, "hook": string (1 sentence, must grab attention), "scenes": [{ "id": number, "heading": string, "narration": string (voiceover text), "visuals": string (description of what to show), "durationSec": number }] }
Constraints:
- Style: ${style}
- Tone: ${tone}
- Target total duration ~ ${targetSec}s. Distribute across 3-7 scenes.
- Each narration should be 1-2 sentences suitable for TTS.
- JSON must be valid and parseable.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: `Write a video script for: ${prompt}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error (${res.status}): ${txt}`);
  }
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content");
  const parsed = JSON.parse(content);
  if (!parsed.scenes || !Array.isArray(parsed.scenes)) throw new Error("OpenAI response missing scenes array");
  return parsed;
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
    if (!supabaseUrl || !serviceRole) throw new Error("Supabase env not configured");

    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData, error: uErr } = await userClient.auth.getUser();
    if (uErr || !userData.user) return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = userData.user.id;
    const email = userData.user.email ?? "";

    const body = (await req.json()) as ScriptRequest;
    if (!body.prompt || !body.prompt.trim()) throw new Error("prompt is required");

    const serviceClient = createClient(supabaseUrl, serviceRole);

    const { data: job, error: jobErr } = await serviceClient.from("ai_jobs").insert({
      user_id: userId,
      job_type: "script",
      provider: "openai",
      status: "processing",
      prompt: body.prompt.slice(0, 2000),
      credits_cost: SCENE_CREDITS,
    }).select().maybeSingle();
    if (jobErr || !job) throw new Error(`Failed to create job: ${jobErr?.message ?? "no row"}`);
    const jobId = (job as { id: string }).id;

    try {
      const style = body.style ?? "tutorial";
      const tone = body.tone ?? "professional";
      const targetSec = body.durationSec ?? 45;
      const { apiKey, isUserKey } = await resolveApiKey(serviceClient, userId, "openai", "OPENAI_API_KEY");
      const result = await callOpenAI(apiKey, body.prompt, style, tone, targetSec);
      const total = (result.scenes as ScriptScene[]).reduce((s, sc) => s + sc.durationSec, 0);

      if (!isUserKey) {
        await deductCredits(serviceClient, userId, SCENE_CREDITS, jobId);
      }

      const { result_text } = { result_text: JSON.stringify(result) };
      await serviceClient.from("ai_jobs").update({
        status: "completed",
        result_text,
        completed_at: new Date().toISOString(),
      }).eq("id", jobId);

      const payload: ScriptResponse = {
        title: result.title,
        hook: result.hook,
        scenes: result.scenes,
        totalDurationSec: total,
        creditsCost: isUserKey ? 0 : SCENE_CREDITS,
        jobId,
      };
      return new Response(JSON.stringify(payload), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
