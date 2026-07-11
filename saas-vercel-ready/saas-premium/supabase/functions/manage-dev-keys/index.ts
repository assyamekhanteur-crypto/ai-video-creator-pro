import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import { checkRateLimit, rateLimitResponse } from "../_shared/rateLimit.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function generateKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const random = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  return `aicp_live_${random}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    // This function always authenticates via a real Supabase session — you
    // manage your API keys from the dashboard, not with another API key.
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

    const serviceClient = createClient(supabaseUrl, serviceRole);
    const rateLimit = await checkRateLimit(serviceClient, userId, "manage-dev-keys", 20, 300);
    if (!rateLimit.allowed) return rateLimitResponse(corsHeaders, rateLimit.retryAfterSeconds!);

    if (req.method === "GET") {
      const { data, error } = await serviceClient
        .from("developer_api_keys")
        .select("id, name, key_prefix, created_at, last_used_at, revoked")
        .eq("user_id", userId)
        .eq("revoked", false)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ keys: data ?? [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      if (!id) throw new Error("id query param is required");
      const { error } = await serviceClient.from("developer_api_keys").update({ revoked: true }).eq("id", id).eq("user_id", userId);
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // POST: create a new key
    const body = (await req.json().catch(() => ({}))) as { name?: string };
    const fullKey = generateKey();
    const hash = await sha256Hex(fullKey);
    const prefix = fullKey.slice(0, 18);

    const { error } = await serviceClient.from("developer_api_keys").insert({
      user_id: userId,
      name: body.name?.trim() || "API Key",
      key_hash: hash,
      key_prefix: prefix,
    });
    if (error) throw new Error(error.message);

    // The only time the full key is ever returned.
    return new Response(JSON.stringify({ key: fullKey, prefix }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
