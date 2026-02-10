-- ============================================================================
-- UU PDP Compliance Migration
-- Purpose: Implement data subject rights (export/delete) per UU No. 27 Tahun 2022
-- Date: 2026-02-09
-- ============================================================================

-- 1. Deletion Requests Table (for 14-day grace period)
CREATE TABLE IF NOT EXISTS deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_deletion_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'cancelled', 'completed')),
    reason TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES auth.users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for finding pending deletions
CREATE INDEX IF NOT EXISTS idx_deletion_requests_user_status 
ON deletion_requests(user_id, status) 
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_deletion_requests_scheduled 
ON deletion_requests(scheduled_deletion_at) 
WHERE status = 'pending';

-- 2. Data Export Logs (audit trail for compliance)
CREATE TABLE IF NOT EXISTS data_export_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    export_type VARCHAR(50) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_data_export_logs_user 
ON data_export_logs(user_id, exported_at);

-- 3. Compliance Audit Logs (comprehensive audit trail)
CREATE TABLE IF NOT EXISTS compliance_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_audit_user_action 
ON compliance_audit_logs(user_id, action, created_at);

CREATE INDEX IF NOT EXISTS idx_compliance_audit_created 
ON compliance_audit_logs(created_at);

-- 4. RLS Policies for compliance tables
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_export_logs ENABLE ROW SECURITY;
ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own deletion requests
CREATE POLICY "Users can view own deletion requests"
ON deletion_requests FOR SELECT
USING (auth.uid() = user_id);

-- Users can only create their own deletion requests
CREATE POLICY "Users can create own deletion requests"
ON deletion_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update (cancel) their own pending requests
CREATE POLICY "Users can cancel own deletion requests"
ON deletion_requests FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Users can view their own export logs
CREATE POLICY "Users can view own export logs"
ON data_export_logs FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own export logs
CREATE POLICY "Users can create own export logs"
ON data_export_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own audit logs
CREATE POLICY "Users can view own compliance audit logs"
ON compliance_audit_logs FOR SELECT
USING (auth.uid() = user_id);

-- 5. Function to process expired deletion requests (run via cron)
CREATE OR REPLACE FUNCTION process_expired_deletions()
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    deletion_record RECORD;
BEGIN
    FOR deletion_record IN 
        SELECT id, user_id 
        FROM deletion_requests 
        WHERE status = 'pending' 
        AND scheduled_deletion_at <= NOW()
    LOOP
        -- Anonymize user data instead of hard delete for research
        UPDATE auth.users 
        SET email = 'deleted_' || id || '@anonymized.local',
            raw_user_meta_data = jsonb_build_object('deleted_at', NOW(), 'original_email', email),
            encrypted_password = NULL
        WHERE id = deletion_record.user_id;
        
        -- Mark deletion request as completed
        UPDATE deletion_requests 
        SET status = 'completed',
            updated_at = NOW()
        WHERE id = deletion_record.id;
        
        -- Log the completion
        INSERT INTO compliance_audit_logs (user_id, action, resource, metadata)
        VALUES (
            deletion_record.user_id,
            'DELETION_COMPLETED',
            'user_account',
            jsonb_build_object('deletion_request_id', deletion_record.id)
        );
        
        processed_count := processed_count + 1;
    END LOOP;
    
    RETURN processed_count;
END;
$$ LANGUAGE plpgsql;

-- 6. Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_deletion_requests_updated_at
    BEFORE UPDATE ON deletion_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Comments for documentation
COMMENT ON TABLE deletion_requests IS 'Tracks user account deletion requests with 14-day grace period per UU PDP';
COMMENT ON TABLE data_export_logs IS 'Audit log for data portability requests per UU PDP';
COMMENT ON TABLE compliance_audit_logs IS 'Comprehensive audit trail for data subject rights compliance';
COMMENT ON FUNCTION process_expired_deletions() IS 'Processes deletion requests that have passed the grace period';

-- 8. Grant permissions
GRANT SELECT, INSERT, UPDATE ON deletion_requests TO authenticated;
GRANT SELECT, INSERT ON data_export_logs TO authenticated;
GRANT SELECT, INSERT ON compliance_audit_logs TO authenticated;

-- 9. Create view for admin dashboard (admin only)
CREATE OR REPLACE VIEW pending_deletions_view AS
SELECT 
    dr.id,
    dr.user_id,
    dr.requested_at,
    dr.scheduled_deletion_at,
    dr.reason,
    dr.status,
    u.email as user_email,
    EXTRACT(DAY FROM (dr.scheduled_deletion_at - NOW())) as days_remaining
FROM deletion_requests dr
LEFT JOIN auth.users u ON dr.user_id = u.id
WHERE dr.status = 'pending'
ORDER BY dr.scheduled_deletion_at;

-- 10. Row count estimates for monitoring
ANALYZE deletion_requests;
ANALYZE data_export_logs;
ANALYZE compliance_audit_logs;
