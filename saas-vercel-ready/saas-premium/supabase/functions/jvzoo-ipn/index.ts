import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";

const corsHeaders = { "Access-Control-Allow-Origin": "*" };

// Map JVZoo Product IDs (Sellers Dashboard → your product → Buy Buttons →
// the number in the generated button URL) to what a successful sale grants.
// Add one entry per product/plan you sell through JVZoo.
const PRODUCT_MAP: Record<string, { tier: "pro" | "business"; credits: number }> = {
  "446085": { tier: "pro", credits: 700 },
};

async function verifyIpn(fields: Record<string, string>, secretKey: string): Promise<boolean> {
  const { cverify, ...rest } = fields;
  if (!cverify) return false;

  const sortedKeys = Object.keys(rest).sort();
  const pop = sortedKeys.map(k => rest[k]).join("|") + "|" + secretKey;

  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(pop));
  const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
  const calculated = hex.slice(0, 8).toUpperCase();

  return calculated === cverify.toUpperCase();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    // JVZoo posts application/x-www-form-urlencoded, not JSON.
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const fields: Record<string, string> = {};
    for (const [k, v] of params.entries()) fields[k] = v;

    const secretKey = Deno.env.get("JVZOO_SECRET_KEY");
    if (!secretKey) {
      console.error("JVZOO_SECRET_KEY is not configured");
      return new Response("Server not configured", { status: 500 });
    }

    const valid = await verifyIpn(fields, secretKey);
    if (!valid) {
      console.error("JVZoo IPN verification failed", fields.ctransaction, fields.cproditem);
      return new Response("Invalid signature", { status: 401 });
    }

    const receipt = fields.ctransreceipt ?? "";
    const transactionType = fields.ctransaction ?? "";
    const buyerEmail = (fields.ccustemail ?? "").toLowerCase().trim();
    const productId = fields.cproditem ?? "";
    const amount = fields.ctransamount ? Number(fields.ctransamount) : null;

    if (!receipt || !buyerEmail) return new Response("Missing required fields", { status: 400 });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRole);

    // Idempotency: JVZoo retries IPNs — never process the same receipt twice.
    const { data: existing } = await admin.from("jvzoo_transactions").select("id").eq("receipt", receipt).maybeSingle();
    if (existing) return new Response("Already processed", { status: 200 });

    let userId: string | null = null;

    if (transactionType === "SALE") {
      const plan = PRODUCT_MAP[productId];
      if (!plan) {
        console.error(`No PRODUCT_MAP entry for JVZoo product ${productId} — update jvzoo-ipn/index.ts`);
        return new Response("Unknown product", { status: 400 });
      }

      // Find an existing account by email, or create+invite one for a brand-new buyer.
      const { data: existingProfile } = await admin.from("profiles").select("id").eq("email", buyerEmail).maybeSingle();

      if (existingProfile) {
        userId = (existingProfile as { id: string }).id;
        await admin.from("profiles").update({ subscription_tier: plan.tier, credits: plan.credits }).eq("id", userId);
      } else {
        const { data: created, error: createErr } = await admin.auth.admin.inviteUserByEmail(buyerEmail);
        if (createErr || !created.user) {
          console.error("Failed to create/invite JVZoo buyer", createErr?.message);
          return new Response("Failed to create account", { status: 500 });
        }
        userId = created.user.id;
        // profiles row is created by the same trigger/flow as normal signups;
        // set the plan once it exists (small delay-tolerant upsert).
        await admin.from("profiles").upsert({ id: userId, email: buyerEmail, subscription_tier: plan.tier, credits: plan.credits });
      }

      await admin.from("credit_ledger").insert({ user_id: userId, delta: plan.credits, reason: "subscription", ref_id: receipt });
    } else if (transactionType === "RFND" || transactionType === "CGBK") {
      const { data: existingProfile } = await admin.from("profiles").select("id").eq("email", buyerEmail).maybeSingle();
      if (existingProfile) {
        userId = (existingProfile as { id: string }).id;
        await admin.from("profiles").update({ subscription_tier: "free", credits: 100 }).eq("id", userId);
      }
    }
    // Other transaction types (e.g. test pings) are logged but otherwise ignored.

    await admin.from("jvzoo_transactions").insert({
      receipt, transaction_type: transactionType, buyer_email: buyerEmail,
      product_id: productId, amount, user_id: userId,
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("jvzoo-ipn error", err);
    return new Response("Internal error", { status: 500 });
  }
});
