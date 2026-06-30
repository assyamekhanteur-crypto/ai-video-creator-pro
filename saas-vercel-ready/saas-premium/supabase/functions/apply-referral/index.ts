import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const REFERRER_REWARD = 50;
const REFERRED_REWARD = 50;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return new Response(JSON.stringify({ error: "Missing auth token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData, error: uErr } = await userClient.auth.getUser();
    if (uErr || !userData.user) return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = userData.user.id;

    const body = (await req.json()) as { referralCode?: string };
    const code = body.referralCode?.trim().toUpperCase();
    if (!code) return new Response(JSON.stringify({ error: "referralCode is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const serviceClient = createClient(supabaseUrl, serviceRole);

    // Look up referral by code
    const { data: referral, error: rErr } = await serviceClient
      .from("referrals")
      .select("*")
      .eq("referral_code", code)
      .maybeSingle();
    if (rErr) throw new Error(`Referral lookup failed: ${rErr.message}`);
    if (!referral) return new Response(JSON.stringify({ error: "Invalid referral code" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const r = referral as { id: string; referrer_user_id: string; referred_user_id: string | null; status: string };
    if (r.referrer_user_id === userId) {
      return new Response(JSON.stringify({ error: "You cannot use your own referral code" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (r.referred_user_id) {
      return new Response(JSON.stringify({ error: "This referral code has already been used" }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Mark referral as completed + reward both parties
    const { error: updErr } = await serviceClient.from("referrals").update({
      referred_user_id: userId,
      status: "completed",
      credits_awarded: REFERRER_REWARD + REFERRED_REWARD,
      completed_at: new Date().toISOString(),
    }).eq("id", r.id);
    if (updErr) throw new Error(`Failed to update referral: ${updErr.message}`);

    // Reward referrer
    const { data: refProfile } = await serviceClient.from("profiles").select("credits").eq("id", r.referrer_user_id).maybeSingle();
    if (refProfile) {
      const cur = (refProfile as { credits: number }).credits;
      await serviceClient.from("profiles").update({ credits: cur + REFERRER_REWARD }).eq("id", r.referrer_user_id);
      await serviceClient.from("credit_ledger").insert({ user_id: r.referrer_user_id, delta: REFERRER_REWARD, reason: "topup", ref_id: r.id });
      await serviceClient.from("analytics_events").insert({ user_id: r.referrer_user_id, event_type: "referral_reward", properties: { referredUserId: userId, role: "referrer" }, credits_delta: REFERRER_REWARD });
    }

    // Reward referred
    const { data: referredProfile } = await serviceClient.from("profiles").select("credits").eq("id", userId).maybeSingle();
    if (referredProfile) {
      const cur = (referredProfile as { credits: number }).credits;
      await serviceClient.from("profiles").update({ credits: cur + REFERRED_REWARD }).eq("id", userId);
      await serviceClient.from("credit_ledger").insert({ user_id: userId, delta: REFERRED_REWARD, reason: "topup", ref_id: r.id });
      await serviceClient.from("analytics_events").insert({ user_id: userId, event_type: "referral_reward", properties: { referrerUserId: r.referrer_user_id, role: "referred" }, credits_delta: REFERRED_REWARD });
    }

    return new Response(JSON.stringify({
      success: true,
      rewarded: { referrer: REFERRER_REWARD, referred: REFERRED_REWARD },
      message: `Referral applied! You earned ${REFERRED_REWARD} credits; the referrer earned ${REFERRER_REWARD}.`,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
