/*
# Fix: infinite recursion in RLS policies on `profiles`

Several policies (across profiles, projects, ai_jobs, render_jobs,
analytics_events, email_notifications, referrals, admin_audit_log,
credit_ledger) check admin status with:
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
Since that subquery reads from `profiles` itself, and `profiles` has RLS
enabled, evaluating the policy re-triggers the same policy — infinite
recursion, surfaced by PostgREST as a 500 error on every read/write.

Fix: a SECURITY DEFINER helper function bypasses RLS for this one lookup
(functions run as their owner, which has BYPASSRLS during migrations),
so it can safely read `profiles.is_admin` without re-entering RLS.
*/

CREATE OR REPLACE FUNCTION is_user_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT p.is_admin FROM profiles p WHERE p.id = check_user_id), false);
$$;

-- profiles
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = id OR is_user_admin(auth.uid())
  );

DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
CREATE POLICY "admin_update_profiles" ON profiles FOR UPDATE
  TO authenticated USING (
    is_user_admin(auth.uid())
  ) WITH CHECK (
    is_user_admin(auth.uid())
  );

DROP POLICY IF EXISTS "profiles_update_own_safe" ON profiles;
CREATE POLICY "profiles_update_own_safe" ON profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND is_admin = is_user_admin(auth.uid())
    AND is_suspended = (SELECT p.is_suspended FROM profiles p WHERE p.id = auth.uid())
  );

-- admin_audit_log
DROP POLICY IF EXISTS "admin_read_audit_log" ON admin_audit_log;
CREATE POLICY "admin_read_audit_log" ON admin_audit_log FOR SELECT
  TO authenticated USING (is_user_admin(auth.uid()));

DROP POLICY IF EXISTS "admin_insert_audit_log" ON admin_audit_log;
CREATE POLICY "admin_insert_audit_log" ON admin_audit_log FOR INSERT
  TO authenticated WITH CHECK (is_user_admin(auth.uid()));

-- render_jobs
DROP POLICY IF EXISTS "admin_read_render_jobs" ON render_jobs;
DROP POLICY IF EXISTS "select_own_render_jobs" ON render_jobs;
CREATE POLICY "select_own_render_jobs" ON render_jobs FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id OR is_user_admin(auth.uid())
  );

-- analytics_events
DROP POLICY IF EXISTS "admin_read_analytics_events" ON analytics_events;
DROP POLICY IF EXISTS "select_own_analytics_events" ON analytics_events;
CREATE POLICY "select_own_analytics_events" ON analytics_events FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id OR is_user_admin(auth.uid())
  );

-- email_notifications
DROP POLICY IF EXISTS "admin_read_email_notifications" ON email_notifications;
DROP POLICY IF EXISTS "select_own_email_notifications" ON email_notifications;
CREATE POLICY "select_own_email_notifications" ON email_notifications FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id OR is_user_admin(auth.uid())
  );

-- referrals
DROP POLICY IF EXISTS "admin_read_referrals" ON referrals;
DROP POLICY IF EXISTS "select_own_referrals" ON referrals;
CREATE POLICY "select_own_referrals" ON referrals FOR SELECT
  TO authenticated USING (
    auth.uid() = referrer_user_id OR is_user_admin(auth.uid())
  );

-- projects
DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id OR is_user_admin(auth.uid())
  );

-- ai_jobs
DROP POLICY IF EXISTS "select_own_ai_jobs" ON ai_jobs;
DROP POLICY IF EXISTS "ai_jobs_select_admin" ON ai_jobs;
CREATE POLICY "select_own_ai_jobs" ON ai_jobs FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id OR is_user_admin(auth.uid())
  );

-- credit_ledger
DROP POLICY IF EXISTS "select_own_credit_ledger" ON credit_ledger;
CREATE POLICY "select_own_credit_ledger" ON credit_ledger FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id OR is_user_admin(auth.uid())
  );
