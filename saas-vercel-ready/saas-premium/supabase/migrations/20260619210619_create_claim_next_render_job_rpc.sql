/*
# Atomic render-job claim function

Adds `claim_next_render_job()` SQL function that atomically picks the highest-priority,
oldest queued job whose queued_at <= now() and marks it as processing.

This avoids race conditions when multiple processor invocations run concurrently: the
function uses `FOR UPDATE SKIP LOCKED` so concurrent callers don't pick the same row.

The function returns the full row (columns) of the claimed job, or NULL if none available.
It does NOT mark complete - the caller (render-processor) does that after the work.
*/

CREATE OR REPLACE FUNCTION claim_next_render_job()
RETURNS render_jobs
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claimed render_jobs;
BEGIN
  SELECT * INTO claimed
  FROM render_jobs
  WHERE status = 'queued'
    AND queued_at <= now()
  ORDER BY priority ASC, queued_at ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1;

  IF claimed.id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE render_jobs
  SET status = 'processing',
      started_at = now(),
      attempt = attempt + 1,
      updated_at = now()
  WHERE id = claimed.id
  RETURNING * INTO claimed;

  RETURN claimed;
END;
$$;

GRANT EXECUTE ON FUNCTION claim_next_render_job() TO authenticated, anon, service_role;

REVOKE ALL ON render_jobs FROM anon;
GRANT SELECT, UPDATE, INSERT, DELETE ON render_jobs TO service_role;
