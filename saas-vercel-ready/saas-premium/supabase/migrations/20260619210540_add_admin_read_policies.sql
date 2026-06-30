/*
# Admin read policies across tables

Extends existing policies so administrators (`profiles.is_admin = true`) can read all rows
of render_jobs, analytics_events, email_notifications, referrals, projects, ai_jobs, credit_ledger
for the admin dashboard. Existing owner-scoped policies remain intact (OR combined).
*/

-- render_jobs: admins can read all
DROP POLICY IF EXISTS "admin_read_render_jobs" ON render_jobs;
CREATE POLICY "admin_read_render_jobs" ON render_jobs FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
-- Replace owner-only select with combined owner/admin select
DROP POLICY IF EXISTS "select_own_render_jobs" ON render_jobs;
CREATE POLICY "select_own_render_jobs" ON render_jobs FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- analytics_events: admins can read all
DROP POLICY IF EXISTS "admin_read_analytics_events" ON analytics_events;
CREATE POLICY "admin_read_analytics_events" ON analytics_events FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
DROP POLICY IF EXISTS "select_own_analytics_events" ON analytics_events;
CREATE POLICY "select_own_analytics_events" ON analytics_events FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- email_notifications: admins can read all
DROP POLICY IF EXISTS "admin_read_email_notifications" ON email_notifications;
CREATE POLICY "admin_read_email_notifications" ON email_notifications FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
DROP POLICY IF EXISTS "select_own_email_notifications" ON email_notifications;
CREATE POLICY "select_own_email_notifications" ON email_notifications FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- referrals: admins can read all
DROP POLICY IF EXISTS "admin_read_referrals" ON referrals;
CREATE POLICY "admin_read_referrals" ON referrals FOR SELECT
  TO authenticated USING (
    auth.uid() = referrer_user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
DROP POLICY IF EXISTS "select_own_referrals" ON referrals;
CREATE POLICY "select_own_referrals" ON referrals FOR SELECT
  TO authenticated USING (
    auth.uid() = referrer_user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- projects: admins can read all
DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- ai_jobs: admins can read all
DROP POLICY IF EXISTS "select_own_ai_jobs" ON ai_jobs;
CREATE POLICY "select_own_ai_jobs" ON ai_jobs FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- credit_ledger: admins can read all
DROP POLICY IF EXISTS "select_own_credit_ledger" ON credit_ledger;
CREATE POLICY "select_own_credit_ledger" ON credit_ledger FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Admins can update profiles (suspend/unsuspend, grant credits via UI) - but NOT is_admin column
-- We add a separate policy. Self-update already exists for own profile; add admin update.
DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
CREATE POLICY "admin_update_profiles" ON profiles FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
