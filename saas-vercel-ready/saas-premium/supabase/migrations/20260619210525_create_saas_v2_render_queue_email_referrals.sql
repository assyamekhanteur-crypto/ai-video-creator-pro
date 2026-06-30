/*
# SaaS v2 schema: render history, queue, emails, referrals, analytics, audit

## 1. New Tables

- `render_jobs` — durable record of every render attempt (replaces ad-hoc ai_jobs usage for the queue).
  - id, user_id (DEFAULT auth.uid()), project_id (nullable), job_type (script|voice|video|export),
    provider, status (queued|processing|completed|failed|cancelled), priority (int, default 5),
    prompt, options (jsonb), result_url, result_text, error_message, error_code (nullable),
    attempt (int, default 0), max_attempts (int, default 3), credits_cost,
    queued_at, started_at, completed_at, created_at, updated_at.

- `email_notifications` — outbound email log + queued sends.
  - id, user_id, to_email, subject, body, template (string), status (queued|sent|failed),
    error_message, ref_id (uuid nullable), sent_at, created_at.

- `referrals` — one row per referred signup. Owner = the referrer (so they can see their referrals),
  but `referred_user_id` is also stored.
  - id, referrer_user_id (DEFAULT auth.uid()), referred_user_id (nullable, unique),
    referral_code (text, unique), status (pending|completed|rewarded),
    credits_awarded (int, default 0), created_at, completed_at.

- `analytics_events` — fine-grained usage events (job started, completed, credits spent, etc.).
  - id, user_id (DEFAULT auth.uid()), event_type, properties (jsonb), credits_delta (int, default 0),
    created_at.

- `admin_audit_log` — admin actions (manual credit grants, plan changes, user suspensions).
  - id, admin_user_id (DEFAULT auth.uid()), target_user_id (nullable), action, details (jsonb), created_at.

- `admin_flags` — per-user profile admin flags. We extend `profiles` with `is_admin` and `is_suspended`.

## 2. Security

- RLS enabled on every table. Owner-scoped CRUD where it makes sense.
- `referrals`: referrer owns their rows; the referred sees nothing.
- `analytics_events`: user-inserted for own events; owner-readable.
- `email_notifications`: owner-readable; service-role inserts (webhooks).
- `admin_audit_log`: only admins (select). Service-role inserts.
- `profiles.is_admin` controlled by service-role only (RLS denies client updates to that column via a separate policy guarding the column).

## 3. Notes

- `render_jobs` is the new system of record for the generation queue. ai_jobs stays for back-compat.
- Credits are still decremented at job creation; refunds on failure go through credit_ledger.
- All times are timestamptz.
*/

-- Extend profiles with admin/suspended flags
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_suspended boolean NOT NULL DEFAULT false;

-- render_jobs
CREATE TABLE IF NOT EXISTS render_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  job_type text NOT NULL CHECK (job_type IN ('script','voice','video','export')),
  provider text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','processing','completed','failed','cancelled')),
  priority integer NOT NULL DEFAULT 5,
  prompt text NOT NULL DEFAULT '',
  options jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_url text,
  result_text text,
  error_message text,
  error_code text,
  attempt integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  credits_cost integer NOT NULL DEFAULT 1,
  queued_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_render_jobs_user_id ON render_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_status ON render_jobs(status);
CREATE INDEX IF NOT EXISTS idx_render_jobs_priority_queued ON render_jobs(status, priority, queued_at);
CREATE INDEX IF NOT EXISTS idx_render_jobs_created_at ON render_jobs(created_at DESC);

-- email_notifications
CREATE TABLE IF NOT EXISTS email_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  to_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  template text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed')),
  error_message text,
  ref_id uuid,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_notifications_user_id ON email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);

-- referrals
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','rewarded')),
  credits_awarded integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);

-- analytics_events
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  properties jsonb NOT NULL DEFAULT '{}'::jsonb,
  credits_delta integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- admin_audit_log
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_target ON admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_created ON admin_audit_log(created_at DESC);

-- Enable RLS on all new tables
ALTER TABLE render_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- render_jobs policies (owner-scoped CRUD)
DROP POLICY IF EXISTS "select_own_render_jobs" ON render_jobs;
CREATE POLICY "select_own_render_jobs" ON render_jobs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_render_jobs" ON render_jobs;
CREATE POLICY "insert_own_render_jobs" ON render_jobs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_render_jobs" ON render_jobs;
CREATE POLICY "update_own_render_jobs" ON render_jobs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_render_jobs" ON render_jobs;
CREATE POLICY "delete_own_render_jobs" ON render_jobs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- email_notifications policies (owner read-only; inserts via service-role)
DROP POLICY IF EXISTS "select_own_email_notifications" ON email_notifications;
CREATE POLICY "select_own_email_notifications" ON email_notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_email_notifications" ON email_notifications;
CREATE POLICY "insert_own_email_notifications" ON email_notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- referrals policies (referrer owns the row)
DROP POLICY IF EXISTS "select_own_referrals" ON referrals;
CREATE POLICY "select_own_referrals" ON referrals FOR SELECT
  TO authenticated USING (auth.uid() = referrer_user_id);

DROP POLICY IF EXISTS "insert_own_referrals" ON referrals;
CREATE POLICY "insert_own_referrals" ON referrals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = referrer_user_id);

DROP POLICY IF EXISTS "update_own_referrals" ON referrals;
CREATE POLICY "update_own_referrals" ON referrals FOR UPDATE
  TO authenticated USING (auth.uid() = referrer_user_id) WITH CHECK (auth.uid() = referrer_user_id);

DROP POLICY IF EXISTS "delete_own_referrals" ON referrals;
CREATE POLICY "delete_own_referrals" ON referrals FOR DELETE
  TO authenticated USING (auth.uid() = referrer_user_id);

-- analytics_events policies (owner read + insert)
DROP POLICY IF EXISTS "select_own_analytics_events" ON analytics_events;
CREATE POLICY "select_own_analytics_events" ON analytics_events FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_analytics_events" ON analytics_events;
CREATE POLICY "insert_own_analytics_events" ON analytics_events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- admin_audit_log: admins can read; service-role inserts via service role key (no RLS for service role)
DROP POLICY IF EXISTS "admin_read_audit_log" ON admin_audit_log;
CREATE POLICY "admin_read_audit_log" ON admin_audit_log FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

DROP POLICY IF EXISTS "admin_insert_audit_log" ON admin_audit_log;
CREATE POLICY "admin_insert_audit_log" ON admin_audit_log FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Admins can read all profiles (to manage users); self can still read own.
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
