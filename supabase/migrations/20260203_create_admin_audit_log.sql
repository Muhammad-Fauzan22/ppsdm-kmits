-- ============================================================================
-- ADMIN AUDIT LOG TABLE
-- ============================================================================
-- Purpose: Track all admin operations for security and compliance
-- Created: 2026-02-03
-- ============================================================================

-- Create admin_audit_log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL,
  user_id UUID,
  target_user_id UUID,
  details JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  environment TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT true,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT admin_audit_log_operation_not_empty CHECK (length(operation) > 0),
  CONSTRAINT admin_audit_log_environment_not_empty CHECK (length(environment) > 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_user_id 
  ON public.admin_audit_log(user_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_user_id 
  ON public.admin_audit_log(target_user_id);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_operation 
  ON public.admin_audit_log(operation);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_timestamp 
  ON public.admin_audit_log(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_environment 
  ON public.admin_audit_log(environment);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_success 
  ON public.admin_audit_log(success);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_user_timestamp 
  ON public.admin_audit_log(user_id, timestamp DESC);

-- Create index for IP-based queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_ip_address 
  ON public.admin_audit_log(ip_address);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs"
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role IN ('admin', 'superadmin')
    )
  );

-- Only admins can insert audit logs (via server-side)
CREATE POLICY "Server can insert audit logs"
  ON public.admin_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- No one can update audit logs (immutable)
CREATE POLICY "No updates on audit logs"
  ON public.admin_audit_log
  FOR UPDATE
  TO authenticated
  WITH CHECK (false);

-- No one can delete audit logs (immutable)
CREATE POLICY "No deletes on audit logs"
  ON public.admin_audit_log
  FOR DELETE
  TO authenticated
  WITH CHECK (false);

-- Add comments for documentation
COMMENT ON TABLE public.admin_audit_log IS 'Audit log for all admin operations';

COMMENT ON COLUMN public.admin_audit_log.operation IS 'Type of operation performed (e.g., delete_user, update_user_metadata)';

COMMENT ON COLUMN public.admin_audit_log.user_id IS 'ID of the admin who performed the operation';

COMMENT ON COLUMN public.admin_audit_log.target_user_id IS 'ID of the user affected by the operation';

COMMENT ON COLUMN public.admin_audit_log.details IS 'Additional details about the operation (JSON)';

COMMENT ON COLUMN public.admin_audit_log.ip_address IS 'IP address of the request';

COMMENT ON COLUMN public.admin_audit_log.timestamp IS 'When the operation occurred';

COMMENT ON COLUMN public.admin_audit_log.environment IS 'Environment where operation occurred (development, staging, production)';

COMMENT ON COLUMN public.admin_audit_log.success IS 'Whether the operation was successful';

COMMENT ON COLUMN public.admin_audit_log.error IS 'Error message if operation failed';

-- ============================================================================
-- HELPER FUNCTIONS
// ============================================================================

-- Function to get audit summary for a user
CREATE OR REPLACE FUNCTION get_user_audit_summary(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  operation TEXT,
  count BIGINT,
  success_count BIGINT,
  failure_count BIGINT,
  last_operation TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    operation,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE success = true) as success_count,
    COUNT(*) FILTER (WHERE success = false) as failure_count,
    MAX(timestamp) as last_operation
  FROM public.admin_audit_log
  WHERE user_id = p_user_id
    AND timestamp >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY operation
  ORDER BY last_operation DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent admin activity
CREATE OR REPLACE FUNCTION get_recent_admin_activity(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  operation TEXT,
  user_id UUID,
  target_user_id UUID,
  ip_address TEXT,
  timestamp TIMESTAMPTZ,
  success BOOLEAN,
  error TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    operation,
    user_id,
    target_user_id,
    ip_address,
    timestamp,
    success,
    error
  FROM public.admin_audit_log
  ORDER BY timestamp DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get failed operations (for security monitoring)
CREATE OR REPLACE FUNCTION get_failed_admin_operations(p_hours INTEGER DEFAULT 24)
RETURNS TABLE (
  id UUID,
  operation TEXT,
  user_id UUID,
  ip_address TEXT,
  timestamp TIMESTAMPTZ,
  error TEXT,
  details JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    operation,
    user_id,
    ip_address,
    timestamp,
    error,
    details
  FROM public.admin_audit_log
  WHERE success = false
    AND timestamp >= NOW() - (p_hours || ' hours')::INTERVAL
  ORDER BY timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT INSERT ON public.admin_audit_log TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_user_audit_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_recent_admin_activity TO authenticated;
GRANT EXECUTE ON FUNCTION get_failed_admin_operations TO authenticated;
