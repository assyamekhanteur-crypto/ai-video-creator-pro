import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import Stripe from "npm:stripe@17.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PLAN_CREDITS: Record<string, number> = { pro: 700, business: 2400 };

async function grantCredits(supabase: ReturnType<typeof createClient>, userId: string, planId: string, reason: string) {
  const credits = PLAN_CREDITS[planId] ?? 0;
  if (!credits) return;
  const { data: profile, error } = await supabase.from("profiles").select("credits, email").eq("id", userId).maybeSingle();
  if (error || !profile) return;
  const current = (profile as { credits: number; email: string }).credits;
  const email = (profile as { credits: number; email: string }).email;
  const { error: updErr } = await supabase.from("profiles").update({ credits: current + credits, subscription_tier: planId }).eq("id", userId);
  if (updErr) return;
  await supabase.from("credit_ledger").insert({ user_id: userId, delta: credits, reason, });
  // Send payment confirmation email
  await supabase.from("email_notifications").insert({
    user_id: userId,
    to_email: email,
    template: "payment_confirmation",
    subject: `Your AI Creator Pro ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan is now active`,
    body: `Your subscription to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan has been activated.\n\n${credits} credits have been added to your account.\n\nManage your subscription at: ${Deno.env.get("APP_URL") ?? "https://aicreatorpro.com"}/billing\n\nThank you for your support!\nThe AI Creator Pro team`,
    status: "queued",
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    return new Response(JSON.stringify({ error: "STRIPE_WEBHOOK_SECRET not configured" }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecret) {
    return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY not configured" }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRole);
  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-12-18.acacia" as any });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response(JSON.stringify({ error: "Missing signature" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);
  } catch (e) {
    return new Response(JSON.stringify({ error: `Invalid signature: ${e instanceof Error ? e.message : String(e)}` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planId = session.metadata?.plan_id ?? "";
        if (userId) await grantCredits(supabase, userId, planId, "subscription");
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = (invoice as unknown as { metadata?: { user_id?: string } }).metadata?.user_id ?? invoice.parent?.subscription_details?.metadata?.user_id;
        const planId = invoice.parent?.subscription_details?.metadata?.plan_id ?? "";
        if (userId) {
          await grantCredits(supabase, userId, planId, "subscription");
          await supabase.from("profiles").update({ payment_issue: false }).eq("id", userId);
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const userId = (invoice as unknown as { metadata?: { user_id?: string } }).metadata?.user_id ?? invoice.parent?.subscription_details?.metadata?.user_id;
        if (userId) {
          const { data: profile } = await supabase.from("profiles").select("email").eq("id", userId).maybeSingle();
          await supabase.from("profiles").update({ payment_issue: true }).eq("id", userId);
          if (profile) {
            const email = (profile as { email: string }).email;
            await supabase.from("email_notifications").insert({
              user_id: userId,
              to_email: email,
              template: "payment_failed",
              subject: "Action needed: your AI Creator Pro payment failed",
              body: `We couldn't process your latest payment. Your subscription and credits are unaffected for now, but please update your payment method to avoid losing access.\n\nUpdate your payment method: ${Deno.env.get("APP_URL") ?? "https://aicreatorpro.com"}/billing\n\nThe AI Creator Pro team`,
              status: "queued",
            });
            // Fire-and-forget: try to send it right away rather than waiting on whatever process drains the queue.
            const sendEmailUrl = `${supabaseUrl}/functions/v1/send-email`;
            EdgeRuntime.waitUntil(
              fetch(sendEmailUrl, { method: "POST", headers: { Authorization: `Bearer ${serviceRole}`, "Content-Type": "application/json" } }).catch(() => {})
            );
          }
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (userId) {
          await supabase.from("profiles").update({ subscription_tier: "free" }).eq("id", userId);
        }
        break;
      }
      default:
        break;
    }
    return new Response(JSON.stringify({ received: true, type: event.type }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Webhook handler failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
