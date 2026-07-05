/*
# Migration: ai_jobs table + Supabase Storage bucket
# Required for ai-script, ai-voice, ai-video edge functions

## Changes
1. ai_jobs table — tracks direct AI calls (non-queued)
2. Supabase Storage bucket "ai-assets" — stores audio/video files
3. RLS on ai_jobs
*/

-- 1. ai_jobs table
CREATE TABLE IF NOT EXISTS ai_jobs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id    uuid REFERENCES projects(id) ON DELETE SET NULL,
  job_type      text NOT NULL CHECK (job_type IN ('script', 'voice', 'video', 'thumbnail', 'subtitles', 'music', 'seo')),
  provider      text NOT NULL,
  status        text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  prompt        text NOT NULL,
  result_url    text,
  result_text   text,
  error_message text,
  error_code    text,
  credits_cost  integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_jobs_user_id    ON ai_jobs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status     ON ai_jobs(status);

-- RLS
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_jobs_select_own" ON ai_jobs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "ai_jobs_insert_own" ON ai_jobs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admins can read all
CREATE POLICY "ai_jobs_select_admin" ON ai_jobs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 2. Storage bucket (idempotent via DO block)
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('ai-assets', 'ai-assets', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Storage RLS: users can upload to their own folder
DROP POLICY IF EXISTS "ai_assets_upload_own" ON storage.objects;
CREATE POLICY "ai_assets_upload_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'ai-assets' AND
    (storage.foldername(name))[1] IN ('voice', 'video', 'thumbnail', 'exports') AND
    (storage.foldername(name))[2] = auth.uid()::text
  );

DROP POLICY IF EXISTS "ai_assets_select_public" ON storage.objects;
CREATE POLICY "ai_assets_select_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'ai-assets');

-- 3. Index on render_jobs for polling by jobId
CREATE INDEX IF NOT EXISTS idx_render_jobs_id_status
  ON render_jobs(id, status, result_url);
