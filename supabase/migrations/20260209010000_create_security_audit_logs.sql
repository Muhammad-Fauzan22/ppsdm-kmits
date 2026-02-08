-- ============================================================================
-- PPSDM KMITS - Security Audit Logs
-- ============================================================================
-- Date: 2026-02-09
-- Purpose: Track security-critical user actions (Export, Delete, Login, etc.)
-- Distinction: different from admin_audit_log (admin actions) or audit_logs (generic)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'DATA_EXPORT', 'ACCOUNT_DELETION_REQUEST'
    resource VARCHAR(100), -- e.g. 'user_data', 'assessment_session'
    resource_id VARCHAR(255), -- e.g. session_id (optional)
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    severity VARCHAR(20) DEFAULT 'info' -- 'info', 'warning', 'critical'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_security_audit_user ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_action ON public.security_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_date ON public.security_audit_logs(created_at DESC);

-- RLS: Read-only for admins, Insert-only for service/users (via API)
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Users cannot see audit logs (internal only)
DROP POLICY IF EXISTS "No select for users" ON public.security_audit_logs;
CREATE POLICY "No select for users" ON public.security_audit_logs FOR SELECT USING (false);

-- Service role implies bypass, but if we insert from authenticated user context:
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.security_audit_logs;
CREATE POLICY "Users can insert own audit logs" 
ON public.security_audit_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);
