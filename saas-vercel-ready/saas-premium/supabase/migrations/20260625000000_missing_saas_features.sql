/*
# Migration: missing SaaS features
# Adds: email trigger on signup, rate limiting helpers, admin policies hardening

## Changes
1. Trigger Supabase Auth → welcome email on new user
2. rate_limit_log table for basic edge-function rate limiting
3. Tighten RLS: ensure is_admin cannot be set by the user themselves
4. Index improvements for email_notifications queued status
*/

-- 1. Ensure email_notifications has an index on queued status for fast polling
CREATE INDEX IF NOT EXISTS idx_email_notifications_queued
  ON email_notifications(status, created_at)
  WHERE status = 'queued';

-- 2. Rate limiting log table (used by Edge Functions to check call frequency)
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_log_user_endpoint
  ON rate_limit_log(user_id, endpoint, created_at DESC);

-- RLS: users can only insert their own entries; no reads needed client-side
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rate_limit_insert_own" ON rate_limit_log
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 3. Prevent users from granting themselves admin via client update
-- The existing RLS on profiles allows users to update their own row.
-- We add a CHECK policy that blocks is_admin and is_suspended from being set by the owner.
DROP POLICY IF EXISTS "profiles_update_own_safe" ON profiles;

CREATE POLICY "profiles_update_own_safe" ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    -- Users cannot flip their own admin or suspended flags
    AND is_admin = (SELECT is_admin FROM profiles WHERE id = auth.uid())
    AND is_suspended = (SELECT is_suspended FROM profiles WHERE id = auth.uid())
  );

-- 4. Function to auto-enqueue welcome email when a profile is first created
-- (fires via trigger on profiles INSERT, so it works even if the client call fails)
CREATE OR REPLACE FUNCTION enqueue_welcome_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO email_notifications (user_id, to_email, template, subject, body, status)
  VALUES (
    NEW.id,
    NEW.email,
    'welcome',
    'Welcome to AI Creator Pro 🎬',
    'Hi there,' || E'\n\n' ||
    'Welcome to AI Creator Pro! Your account is ready and 100 free credits have been added to get you started.' || E'\n\n' ||
    'Head to your dashboard to create your first AI video.' || E'\n\n' ||
    'The AI Creator Pro team',
    'queued'
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop existing trigger if any, then recreate
DROP TRIGGER IF EXISTS trg_welcome_email ON profiles;

CREATE TRIGGER trg_welcome_email
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION enqueue_welcome_email();

-- 5. Ensure render_jobs has an index for admin error log queries
CREATE INDEX IF NOT EXISTS idx_render_jobs_failed
  ON render_jobs(status, created_at DESC)
  WHERE status = 'failed';

-- 6. Ensure email_notifications has index for failed emails admin view
CREATE INDEX IF NOT EXISTS idx_email_notifications_failed
  ON email_notifications(status, created_at DESC)
  WHERE status = 'failed';
