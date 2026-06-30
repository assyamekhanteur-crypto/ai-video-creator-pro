import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import Stripe from "npm:stripe@17.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Price IDs configured in Stripe Dashboard. When the user sets up Stripe,
// run the migration mapping these plan IDs to Stripe price IDs in the `subscriptions` table
// (or replace with hardcoded price IDs here once known).
const PLAN_CONFIG: Record<string, { credits: number }> = {
  pro: { credits: 2000 },
  business: { credits: 10000 },
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Stripe is not configured. Set STRIPE_SECRET_KEY in your project secrets to enable billing." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
    const email = userData.user.email ?? "";

    const { planId } = await req.json() as { planId: string };
    if (!planId || planId === "free") throw new Error("Invalid plan. Choose 'pro' or 'business'.");
    if (!PLAN_CONFIG[planId]) throw new Error(`Unknown plan: ${planId}`);

    // Pull the Stripe price ID from env (user sets STRIPE_PRICE_PRO / STRIPE_PRICE_BUSINESS).
    const priceEnv = `STRIPE_PRICE_${planId.toUpperCase()}`;
    const priceId = Deno.env.get(priceEnv);
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: `${priceEnv} is not configured. Create products/prices in Stripe Dashboard and set the price ID as a project secret.` }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceClient = createClient(supabaseUrl, serviceRole);
    const { data: profile } = await serviceClient.from("profiles").select("stripe_customer_id").eq("id", userId).maybeSingle();
    const existingCustomerId = (profile as { stripe_customer_id: string | null } | null)?.stripe_customer_id ?? null;

    const stripe = new Stripe(apiKey, { apiVersion: "2024-12-18.acacia" as any });
    let customerId = existingCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({ email, metadata: { supabase_uid: userId } });
      customerId = customer.id;
      await serviceClient.from("profiles").update({ stripe_customer_id: customerId }).eq("id", userId);
    }

    const origin = req.headers.get("origin") ?? req.headers.get("referer") ?? "https://example.com";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/billing?status=success`,
      cancel_url: `${origin}/billing?status=canceled`,
      metadata: { user_id: userId, plan_id: planId, credits: String(PLAN_CONFIG[planId].credits) },
      subscription_data: { metadata: { user_id: userId, plan_id: planId, credits: String(PLAN_CONFIG[planId].credits) } },
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
