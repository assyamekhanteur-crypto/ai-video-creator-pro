/*
# Migration: allow 'subtitles' job type on ai_jobs

The original CHECK constraint only allowed ('script','voice','video').
Adding real subtitle generation (OpenAI Whisper transcription) needs a
new job_type value.
*/

ALTER TABLE ai_jobs DROP CONSTRAINT IF EXISTS ai_jobs_job_type_check;
ALTER TABLE ai_jobs ADD CONSTRAINT ai_jobs_job_type_check
  CHECK (job_type IN ('script','voice','video','subtitles'));
