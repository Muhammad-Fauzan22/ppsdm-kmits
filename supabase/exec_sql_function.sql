-- ============================================
-- SQL Execution Function for Setup Scripts
-- ============================================
-- This function allows executing arbitrary SQL via RPC
-- SECURITY WARNING: Only grant to service_role
-- ============================================

-- Create function to execute arbitrary SQL (for setup script)
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to service role only
-- WARNING: This is powerful - only use for initial setup
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;

-- Revoke from anonymous and authenticated users
REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM anon;
REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM authenticated;

COMMENT ON FUNCTION exec_sql(text) IS 
'Execute arbitrary SQL. Restricted to service_role only. Used for automated database setup.';

-- ============================================
-- Alternative: Direct SQL Execution Function
-- For users who prefer to run statements individually
-- ============================================

-- Helper function to check if setup is complete
CREATE OR REPLACE FUNCTION check_setup_status()
RETURNS TABLE (
    table_name text,
    exists boolean,
    row_count bigint
) AS $$
DECLARE
    tables text[] := ARRAY[
        'profiles', 'dimensions', 'assessments', 'dimension_stats',
        'goals', 'idp_plans', 'courses', 'modules', 'lessons',
        'enrollments', 'ebooks', 'ebook_chapters', 'user_xp',
        'badges', 'certificates', 'course_prerequisites',
        'learning_paths', 'path_courses', 'user_achievements',
        'notifications', 'student_activities'
    ];
    t text;
    cnt bigint;
BEGIN
    FOREACH t IN ARRAY tables
    LOOP
        table_name := t;
        BEGIN
            EXECUTE format('SELECT COUNT(*) FROM %I', t) INTO cnt;
            exists := true;
            row_count := cnt;
        EXCEPTION WHEN OTHERS THEN
            exists := false;
            row_count := 0;
        END;
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION check_setup_status() TO authenticated;
GRANT EXECUTE ON FUNCTION check_setup_status() TO anon;

COMMENT ON FUNCTION check_setup_status() IS 
'Check if all required tables exist and their row counts. Available to all users.';

-- ============================================
-- Setup Audit Log
-- Track when setup was performed
-- ============================================

CREATE TABLE IF NOT EXISTS setup_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    performed_by UUID REFERENCES auth.users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB
);

-- Function to log setup actions
CREATE OR REPLACE FUNCTION log_setup_action(action_name text, details jsonb DEFAULT '{}')
RETURNS void AS $$
BEGIN
    INSERT INTO setup_audit_log (action, performed_by, details)
    VALUES (action_name, auth.uid(), details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION log_setup_action(text, jsonb) TO service_role;
