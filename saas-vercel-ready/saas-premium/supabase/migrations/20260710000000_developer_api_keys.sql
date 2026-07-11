/*
# Migration: developer API keys (public API access)

Lets users generate long-lived API keys (format: aicp_live_...) to call the
platform's AI endpoints programmatically, authenticated as their account
and billed against their own credits — instead of a short-lived Supabase
session JWT. Only a SHA-256 hash is stored; the full key is shown once at
creation and never retrievable again.
*/

CREATE TABLE IF NOT EXISTS developer_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'API Key',
  key_hash text NOT NULL UNIQUE,
  key_prefix text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz,
  revoked boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_developer_api_keys_hash ON developer_api_keys (key_hash) WHERE NOT revoked;

ALTER TABLE developer_api_keys ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies: default-deny, service-role (Edge Functions) only.
