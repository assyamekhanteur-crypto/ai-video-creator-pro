/*
# Migration: track async provider job ids on ai_jobs

Fixes a broken pipeline: async video providers (Runway/Kling/Google) were
being marked 'completed' with result_url = null the instant the provider
job was *submitted*, with no way to ever fetch the real result. This column
lets the ai-video function poll the provider until the render is actually
done.
*/

ALTER TABLE ai_jobs
  ADD COLUMN IF NOT EXISTS provider_job_id text;
