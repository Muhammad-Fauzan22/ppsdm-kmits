-- ============================================
-- CREATE EXEC_SQL FUNCTION
-- ============================================
-- This function allows executing SQL via REST API
-- Required for automated schema execution

-- Drop existing if exists
DROP FUNCTION IF EXISTS exec_sql(text);

-- Create the function with service_role security
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
BEGIN
    -- Execute the SQL and capture result
    EXECUTE sql;
    
    -- Return success
    result := jsonb_build_object(
        'success', true,
        'message', 'SQL executed successfully'
    );
    
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    -- Return error details
    result := jsonb_build_object(
        'success', false,
        'error', SQLERRM,
        'detail', SQLSTATE
    );
    
    RETURN result;
END;
$$;

-- Grant execute permission to service_role
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO anon;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'exec_sql function created successfully' as status;
