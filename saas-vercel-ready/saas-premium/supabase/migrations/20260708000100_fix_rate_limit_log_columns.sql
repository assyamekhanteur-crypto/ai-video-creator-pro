/*
# Fix: rate_limit_log was missing expected columns

A prior partial run left a rate_limit_log table without the columns this
feature needs. This migration is defensive: it adds whatever's missing
rather than assuming a clean slate, then creates the lookup index.
*/

ALTER TABLE rate_limit_log ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE rate_limit_log ADD COLUMN IF NOT EXISTS function_name text;
ALTER TABLE rate_limit_log ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup ON rate_limit_log (user_id, function_name, created_at);
