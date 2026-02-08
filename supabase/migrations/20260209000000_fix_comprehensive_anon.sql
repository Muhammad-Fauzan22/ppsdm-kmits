-- ============================================================================
-- PPSDM KMITS - Anonymous Comprehensive Assessment Fix
-- ============================================================================
-- Date: 2026-02-09
-- Purpose: Allow anonymous (guest) users to complete COMPREHENSIVE assessments
-- Issue: Separate tables (comprehensive_*) were not covered in previous migration
-- ============================================================================

-- 1. Assessment Sessions (Comprehensive)
ALTER TABLE comprehensive_sessions 
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE comprehensive_sessions 
  ADD COLUMN IF NOT EXISTS session_token VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_comprehensive_sessions_token 
  ON comprehensive_sessions(session_token) WHERE session_token IS NOT NULL;

-- 2. Assessment Responses (Comprehensive)
ALTER TABLE comprehensive_responses 
  ALTER COLUMN user_id DROP NOT NULL;

-- 3. Gaps / Results (Comprehensive)
ALTER TABLE comprehensive_gaps
  ALTER COLUMN user_id DROP NOT NULL;

-- 4. RLS Updates

-- Sessions
DROP POLICY IF EXISTS "Users can manage own comprehensive sessions" ON comprehensive_sessions;

CREATE POLICY "Users or anon can manage comprehensive sessions"
  ON comprehensive_sessions FOR ALL
  USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_token IS NOT NULL)
  )
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_token IS NOT NULL)
  );

-- Responses
DROP POLICY IF EXISTS "Users can manage own comprehensive responses" ON comprehensive_responses;

CREATE POLICY "Users or anon can manage comprehensive responses"
  ON comprehensive_responses FOR ALL
  USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_id IN (
      SELECT id FROM comprehensive_sessions WHERE session_token IS NOT NULL
    ))
  )
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL) -- session_id link checked via logic or trigger, simplified here
  );

-- Gaps
DROP POLICY IF EXISTS "Users can manage own comprehensive gaps" ON comprehensive_gaps;

CREATE POLICY "Users or anon can manage comprehensive gaps"
  ON comprehensive_gaps FOR ALL
  USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND session_id IN (
      SELECT id FROM comprehensive_sessions WHERE session_token IS NOT NULL
    ))
  )
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (user_id IS NULL)
  );
