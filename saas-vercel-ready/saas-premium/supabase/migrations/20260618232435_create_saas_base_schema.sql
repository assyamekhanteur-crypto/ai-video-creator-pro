/*
# Base SaaS schema: profiles, projects, ai_jobs, credit_ledger

## 1. New Tables

- `profiles` — one row per auth user. Holds subscription tier + monthly credits.
  - id (uuid, PK, FK -> auth.users, ON DELETE CASCADE)
  - email (text)
  - subscription_tier (text, default 'free')
  - credits (int, default 100)
  - stripe_customer_id (text, nullable)
  - created_at (timestamptz)

- `projects` — user-owned video projects.
  - id (uuid, PK)
  - user_id (uuid, FK -> auth.users, DEFAULT auth.uid())
  - name, description, thumbnail_url
  - status (default 'draft')
  - duration, resolution
  - created_at, updated_at

- `ai_jobs` — tracks each AI generation request (script, voice, video).
  - id, user_id, project_id (nullable), job_type, provider, status, prompt
  - result_url, result_text, credits_cost, error_message
  - created_at, completed_at

- `credit_ledger` — records every credit transaction for audit.
  - id, user_id, delta, reason, ref_id (nullable), created_at

## 2. Security

- RLS enabled on all tables.
- Owner-scoped CRUD for authenticated users.
- user_id columns default to auth.uid() so inserts without user_id succeed.

## 3. Notes

- Free tier: 100 credits at signup.
- Credit decrements happen server-side in edge functions via service-role client.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  subscription_tier text NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free','pro','business')),
  credits integer NOT NULL DEFAULT 100,
  stripe_customer_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  thumbnail_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','processing','completed')),
  duration numeric NOT NULL DEFAULT 0,
  resolution text NOT NULL DEFAULT '1080p',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  job_type text NOT NULL CHECK (job_type IN ('script','voice','video')),
  provider text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  prompt text NOT NULL,
  result_url text,
  result_text text,
  credits_cost integer NOT NULL DEFAULT 1,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS credit_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  delta integer NOT NULL,
  reason text NOT NULL CHECK (reason IN ('signup_bonus','subscription','usage','topup','refund')),
  ref_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_user_id ON ai_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_project_id ON ai_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_user_id ON credit_ledger(user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- projects
DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ai_jobs
DROP POLICY IF EXISTS "select_own_ai_jobs" ON ai_jobs;
CREATE POLICY "select_own_ai_jobs" ON ai_jobs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_ai_jobs" ON ai_jobs;
CREATE POLICY "insert_own_ai_jobs" ON ai_jobs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_ai_jobs" ON ai_jobs;
CREATE POLICY "update_own_ai_jobs" ON ai_jobs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_ai_jobs" ON ai_jobs;
CREATE POLICY "delete_own_ai_jobs" ON ai_jobs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- credit_ledger
DROP POLICY IF EXISTS "select_own_credit_ledger" ON credit_ledger;
CREATE POLICY "select_own_credit_ledger" ON credit_ledger FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_credit_ledger" ON credit_ledger;
CREATE POLICY "insert_own_credit_ledger" ON credit_ledger FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
