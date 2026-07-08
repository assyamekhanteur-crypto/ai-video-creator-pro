import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import { decryptSecret } from "./crypto.ts";

export interface ResolvedKey {
  apiKey: string;
  isUserKey: boolean;
}

/**
 * Returns the API key to use for a given provider: the user's own key if
 * they've configured one in Settings, otherwise the platform's key from
 * Edge Function secrets. When the user's own key is used, callers should
 * skip credit deduction — they're paying the provider directly.
 */
export async function resolveApiKey(
  serviceClient: ReturnType<typeof createClient>,
  userId: string,
  provider: string,
  platformEnvVar: string,
): Promise<ResolvedKey> {
  const encryptionSecret = Deno.env.get("API_KEY_ENCRYPTION_SECRET");

  if (encryptionSecret) {
    const { data } = await serviceClient
      .from("user_api_keys")
      .select("encrypted_value")
      .eq("user_id", userId)
      .eq("provider", provider)
      .maybeSingle();

    if (data) {
      const row = data as { encrypted_value: string };
      const apiKey = await decryptSecret(row.encrypted_value, encryptionSecret);
      return { apiKey, isUserKey: true };
    }
  }

  const platformKey = Deno.env.get(platformEnvVar);
  if (!platformKey) {
    throw new Error(`${platformEnvVar} secret is not configured, and no user-supplied ${provider} key was found. Add a platform secret or ask the user to add their own key in Settings.`);
  }
  return { apiKey: platformKey, isUserKey: false };
}
