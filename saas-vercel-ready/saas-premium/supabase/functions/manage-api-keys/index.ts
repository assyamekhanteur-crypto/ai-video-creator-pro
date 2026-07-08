import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import { encryptSecret, maskKey } from "../_shared/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const VALID_PROVIDERS = ["openai", "elevenlabs", "runway", "kling", "google"];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) return new Response(JSON.stringify({ error: "Missing auth token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const encryptionSecret = Deno.env.get("API_KEY_ENCRYPTION_SECRET");
    if (!encryptionSecret) throw new Error("API_KEY_ENCRYPTION_SECRET secret is not configured. Add it in your Supabase project secrets.");

    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: userData, error: uErr } = await userClient.auth.getUser();
    if (uErr || !userData.user) return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = userData.user.id;

    const serviceClient = createClient(supabaseUrl, serviceRole);

    if (req.method === "GET") {
      const { data, error } = await serviceClient
        .from("user_api_keys")
        .select("provider, masked_preview, updated_at")
        .eq("user_id", userId);
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ keys: data ?? [] }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const provider = url.searchParams.get("provider");
      if (!provider) throw new Error("provider query param is required");
      const { error } = await serviceClient.from("user_api_keys").delete().eq("user_id", userId).eq("provider", provider);
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // POST: save/update a key
    const body = (await req.json()) as { provider: string; apiKey: string };
    if (!VALID_PROVIDERS.includes(body.provider)) throw new Error(`Invalid provider. Must be one of: ${VALID_PROVIDERS.join(", ")}`);
    if (!body.apiKey || body.apiKey.trim().length < 8) throw new Error("API key looks too short to be valid");

    const encrypted = await encryptSecret(body.apiKey.trim(), encryptionSecret);
    const masked = maskKey(body.apiKey.trim());

    const { error } = await serviceClient.from("user_api_keys").upsert({
      user_id: userId,
      provider: body.provider,
      encrypted_value: encrypted,
      masked_preview: masked,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,provider" });
    if (error) throw new Error(error.message);

    return new Response(JSON.stringify({ success: true, maskedPreview: masked }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
