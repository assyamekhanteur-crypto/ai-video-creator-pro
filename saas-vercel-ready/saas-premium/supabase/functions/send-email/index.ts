import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Use POST" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRole);

    // Claim up to 20 queued emails
    const { data: emails, error } = await supabase
      .from("email_notifications")
      .select("*")
      .eq("status", "queued")
      .order("created_at", { ascending: true })
      .limit(20);
    if (error) throw new Error(`Fetch emails failed: ${error.message}`);
    if (!emails || emails.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("EMAIL_FROM") ?? "AI Creator Pro <noreply@example.com>";

    let sentCount = 0;
    let failedCount = 0;

    for (const email of emails as Array<{ id: string; to_email: string; subject: string; body: string; }>) {
      try {
        if (!resendApiKey) {
          // Mark as failed so they don't pile up; admin sees them
          await supabase.from("email_notifications").update({ status: "failed", error_message: "RESEND_API_KEY not configured" }).eq("id", email.id);
          failedCount++;
          continue;
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: fromEmail, to: [email.to_email], subject: email.subject, text: email.body }),
        });

        if (!res.ok) {
          const txt = await res.text();
          // If it's a permanent error (4xx), mark failed; if 5xx, leave queued for next run
          if (res.status >= 400 && res.status < 500) {
            await supabase.from("email_notifications").update({ status: "failed", error_message: `Resend ${res.status}: ${txt.slice(0, 300)}` }).eq("id", email.id);
            failedCount++;
          } else {
            await supabase.from("email_notifications").update({ error_message: `Resend ${res.status}: ${txt.slice(0, 300)}` }).eq("id", email.id);
          }
          continue;
        }

        await supabase.from("email_notifications").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", email.id);
        sentCount++;
      } catch (e) {
        await supabase.from("email_notifications").update({ error_message: e instanceof Error ? e.message : String(e) }).eq("id", email.id);
        failedCount++;
      }
    }

    return new Response(JSON.stringify({ sent: sentCount, failed: failedCount, total: (emails as unknown[]).length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
