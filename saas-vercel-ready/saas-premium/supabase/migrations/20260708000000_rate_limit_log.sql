/*
# Migration: rate limiting log

Tracks recent calls per user per Edge Function so expensive/abusable
endpoints (AI generation, API key management) can enforce a sliding-window
request cap. Locked down the same way as user_api_keys — no RLS policies
for authenticated/anon, service-role (Edge Functions) only.
*/

CREATE TABLE IF NOT EXISTS rate_limit_log (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  function_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup ON rate_limit_log (user_id, function_name, created_at);

ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies: default-deny, service-role only.
