/*
# Migration: user-supplied API keys (bring-your-own-key)

Stores AES-256-GCM encrypted API keys so users can use their own OpenAI /
ElevenLabs / Runway / Kling / Google credentials instead of the platform's.
The encryption secret lives only in Edge Function env vars, never in the
database.

Security posture: RLS is enabled with NO policies granted to
`authenticated` or `anon` — meaning this table is completely invisible to
PostgREST/the client, even the encrypted blob. The only way in or out is
through the `manage-api-keys` Edge Function (service role), which never
returns the raw key to the client after saving (only a masked preview).
*/

CREATE TABLE IF NOT EXISTS user_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('openai','elevenlabs','runway','kling','google')),
  encrypted_value text NOT NULL,
  masked_preview text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies for authenticated/anon: default-deny, service-role only.
