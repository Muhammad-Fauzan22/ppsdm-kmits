-- ============================================================================
-- PPSDM KMITS - Anonymous User Support Migration
-- ============================================================================
-- Date: 2026-02-08
-- Purpose: Allow anonymous (guest) users to complete assessments
-- Issue: user_id NOT NULL constraint blocks anonymous submissions
-- ============================================================================

-- 1. Drop NOT NULL constraints to allow anonymous sessions
ALTER TABLE assessment_sessions 
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE assessment_responses 
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE assessment_progress 
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE assessment_results 
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE holistic_assessment_results 
  ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add session_token for anonymous session tracking
ALTER TABLE assessment_sessions 
  ADD COLUMN IF NOT EXISTS session_token VARCHAR(255) UNIQUE;

ALTER TABLE assessment_sessions 
  ADD COLUMN IF NOT EXISTS device_fingerprint VARCHAR(255);

ALTER TABLE assessment_sessions 
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days');

-- Add session_token to progress for tracking anonymous progress
ALTER TABLE assessment_progress 
  ADD COLUMN IF NOT EXISTS session_token VARCHAR(255);

-- 3. Fix UNIQUE constraints to support Anonymous (NULL user_id)
-- Responses: session_id + question_id is unique enough (session belongs to one user/anon)
ALTER TABLE assessment_responses 
  DROP CONSTRAINT IF EXISTS assessment_responses_user_id_session_id_question_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_assessment_responses_unique_session_question 
  ON assessment_responses(session_id, question_id);

-- Progress: Must be unique by user_id OR session_token
ALTER TABLE assessment_progress 
  DROP CONSTRAINT IF EXISTS assessment_progress_user_id_dimension_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_assessment_progress_user_dim 
  ON assessment_progress(user_id, dimension) WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_assessment_progress_token_dim 
  ON assessment_progress(session_token, dimension) WHERE session_token IS NOT NULL;

-- Results: session_id + dimension should be unique
ALTER TABLE assessment_results
  DROP CONSTRAINT IF EXISTS assessment_results_user_id_session_id_dimension_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_assessment_results_unique_session_dim 
  ON assessment_results(session_id, dimension);

-- 3. Add index for session_token lookups
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_token 
  ON assessment_sessions(session_token) WHERE session_token IS NOT NULL;

-- ============================================================================
-- UPDATE RLS POLICIES FOR ANONYMOUS ACCESS
-- ============================================================================

-- Assessment Sessions: Allow anonymous inserts with session_token
DROP POLICY IF EXISTS "Users can manage own sessions" ON assessment_sessions;

CREATE POLICY "Users or anon can manage sessions"
  ON assessment_sessions FOR ALL
  USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_token IS NOT NULL)
  )
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_token IS NOT NULL)
  );

-- Assessment Responses: Allow anonymous inserts
DROP POLICY IF EXISTS "Users can view own responses" ON assessment_responses;
DROP POLICY IF EXISTS "Users can create own responses" ON assessment_responses;
DROP POLICY IF EXISTS "Users can update own responses" ON assessment_responses;

CREATE POLICY "Users or anon can view responses"
  ON assessment_responses FOR SELECT
  USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_id IN (
      SELECT id FROM assessment_sessions WHERE session_token IS NOT NULL
    ))
  );

CREATE POLICY "Users or anon can create responses"
  ON assessment_responses FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL)
  );

CREATE POLICY "Users or anon can update responses"
  ON assessment_responses FOR UPDATE
  USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_id IN (
      SELECT id FROM assessment_sessions WHERE session_token IS NOT NULL
    ))
  );

-- Assessment Progress: Allow anonymous access
DROP POLICY IF EXISTS "Users can manage own progress" ON assessment_progress;

CREATE POLICY "Users or anon can manage progress"
  ON assessment_progress FOR ALL
  USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL)
  )
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL)
  );

-- Assessment Results: Allow anonymous inserts (read after signup)
DROP POLICY IF EXISTS "Users can view own results" ON assessment_results;
DROP POLICY IF EXISTS "Users can create own results" ON assessment_results;

CREATE POLICY "Users or anon can view results"
  ON assessment_results FOR SELECT
  USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_id IN (
      SELECT id FROM assessment_sessions WHERE session_token IS NOT NULL
    ))
  );

CREATE POLICY "Users or anon can create results"
  ON assessment_results FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL)
  );

-- Holistic Results: Same pattern
DROP POLICY IF EXISTS "Users can view own holistic results" ON holistic_assessment_results;
DROP POLICY IF EXISTS "Users can create own holistic results" ON holistic_assessment_results;

CREATE POLICY "Users or anon can view holistic results"
  ON holistic_assessment_results FOR SELECT
  USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_id IN (
      SELECT id FROM assessment_sessions WHERE session_token IS NOT NULL
    ))
  );

CREATE POLICY "Users or anon can create holistic results"
  ON holistic_assessment_results FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL)
  );

-- ============================================================================
-- FUNCTION: Migrate anonymous session to user account
-- ============================================================================
CREATE OR REPLACE FUNCTION migrate_anonymous_session(
  p_session_token VARCHAR,
  p_user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_session_id UUID;
BEGIN
  -- Find the anonymous session
  SELECT id INTO v_session_id 
  FROM assessment_sessions 
  WHERE session_token = p_session_token AND user_id IS NULL;
  
  IF v_session_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Update session with user_id
  UPDATE assessment_sessions 
  SET user_id = p_user_id, session_token = NULL
  WHERE id = v_session_id;
  
  -- Update all related records
  UPDATE assessment_responses 
  SET user_id = p_user_id 
  WHERE session_id = v_session_id AND user_id IS NULL;
  
  UPDATE assessment_results 
  SET user_id = p_user_id 
  WHERE session_id = v_session_id AND user_id IS NULL;
  
  UPDATE holistic_assessment_results 
  SET user_id = p_user_id 
  WHERE session_id = v_session_id AND user_id IS NULL;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Cleanup expired anonymous sessions
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_expired_anonymous_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM assessment_sessions
    WHERE user_id IS NULL 
      AND expires_at < NOW()
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON FUNCTION migrate_anonymous_session IS 
  'Migrates an anonymous session to a registered user account after signup';
COMMENT ON FUNCTION cleanup_expired_anonymous_sessions IS 
  'Removes expired anonymous sessions (called by cron job)';
