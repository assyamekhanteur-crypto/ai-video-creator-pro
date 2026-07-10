import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import Stripe from "npm:stripe@17.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return new Response(JSON.stringify({ error: "Missing auth token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) throw new Error("STRIPE_SECRET_KEY secret is not configured.");

    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData, error: uErr } = await userClient.auth.getUser();
    if (uErr || !userData.user) return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const serviceClient = createClient(supabaseUrl, serviceRole);
    const { data: profile } = await serviceClient.from("profiles").select("stripe_customer_id").eq("id", userData.user.id).maybeSingle();
    const customerId = (profile as { stripe_customer_id: string | null } | null)?.stripe_customer_id;
    if (!customerId) return new Response(JSON.stringify({ error: "No billing account found — subscribe to a plan first." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-12-18.acacia" as any });
    const appUrl = Deno.env.get("APP_URL") ?? "https://aicreatorpro.com";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/billing`,
    });

    return new Response(JSON.stringify({ url: portalSession.url }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
