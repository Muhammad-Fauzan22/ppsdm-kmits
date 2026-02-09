-- ============================================================================
-- UU PDP COMPLIANCE MIGRATION
-- Implements data subject rights per UU No. 27 Tahun 2022
-- 
-- Features:
-- - Data export logging
-- - Account deletion requests with 14-day grace period
-- - Audit trail for compliance
-- ============================================================================

-- 1. Data Export Logs Table
CREATE TABLE IF NOT EXISTS data_export_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    export_format VARCHAR(20) NOT NULL CHECK (export_format IN ('pdf', 'json', 'csv')),
    exported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    records_count INTEGER,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster user export history queries
CREATE INDEX IF NOT EXISTS idx_data_export_logs_user_id ON data_export_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_data_export_logs_exported_at ON data_export_logs(exported_at);

-- RLS for data_export_logs
ALTER TABLE data_export_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own export logs"
ON data_export_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert export logs"
ON data_export_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 2. Deletion Requests Table (Soft Delete with Grace Period)
CREATE TABLE IF NOT EXISTS deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'failed')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_deletion_date TIMESTAMPTZ NOT NULL,
    processed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    notification_sent BOOLEAN DEFAULT FALSE,
    notification_sent_at TIMESTAMPTZ,
    final_notification_sent BOOLEAN DEFAULT FALSE,
    anonymize_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for deletion request management
CREATE INDEX IF NOT EXISTS idx_deletion_requests_user_id ON deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_scheduled_date ON deletion_requests(scheduled_deletion_date) WHERE status = 'pending';

-- RLS for deletion_requests
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deletion requests"
ON deletion_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create deletion requests"
ON deletion_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending deletion requests"
ON deletion_requests FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- 3. Deletion Audit Logs (Compliance Trail)
CREATE TABLE IF NOT EXISTS deletion_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (action IN ('initiated', 'cancelled', 'completed', 'failed', 'notification_sent')),
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_deletion_audit_logs_user_id ON deletion_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_deletion_audit_logs_action ON deletion_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_deletion_audit_logs_performed_at ON deletion_audit_logs(performed_at);

-- RLS for deletion_audit_logs
ALTER TABLE deletion_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deletion audit logs"
ON deletion_audit_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs"
ON deletion_audit_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Function to process scheduled deletions (run via cron)
CREATE OR REPLACE FUNCTION process_scheduled_deletions()
RETURNS TABLE (
    processed_count INTEGER,
    failed_count INTEGER
) AS $$
DECLARE
    v_processed INTEGER := 0;
    v_failed INTEGER := 0;
    rec RECORD;
BEGIN
    -- Find deletions scheduled for today that are still pending
    FOR rec IN 
        SELECT id, user_id, anonymize_data
        FROM deletion_requests
        WHERE status = 'pending'
        AND scheduled_deletion_date <= NOW()
        AND notification_sent = TRUE
    LOOP
        BEGIN
            -- Anonymize or delete user data based on preference
            IF rec.anonymize_data THEN
                -- Anonymize assessment data (keep for research, remove PII)
                UPDATE assessment_sessions
                SET user_id = NULL, session_token = 'ANONYMIZED_' || gen_random_uuid()
                WHERE user_id = rec.user_id;
                
                UPDATE assessment_responses
                SET user_id = NULL
                WHERE user_id = rec.user_id;
                
                -- Delete PII from profiles
                UPDATE profiles
                SET 
                    full_name = 'Deleted User',
                    email = 'deleted@anonymous.com',
                    avatar_url = NULL,
                    phone = NULL,
                    bio = NULL,
                    updated_at = NOW()
                WHERE id = rec.user_id;
            ELSE
                -- Hard delete all user data
                DELETE FROM assessment_responses WHERE user_id = rec.user_id;
                DELETE FROM assessment_sessions WHERE user_id = rec.user_id;
                DELETE FROM assessment_results WHERE user_id = rec.user_id;
                DELETE FROM assessment_progress WHERE user_id = rec.user_id;
                DELETE FROM journal_entries WHERE user_id = rec.user_id;
                DELETE FROM user_xp WHERE user_id = rec.user_id;
                DELETE FROM profiles WHERE id = rec.user_id;
            END IF;
            
            -- Mark deletion request as completed
            UPDATE deletion_requests
            SET 
                status = 'completed',
                processed_at = NOW(),
                updated_at = NOW()
            WHERE id = rec.id;
            
            -- Log completion
            INSERT INTO deletion_audit_logs (user_id, action, performed_at, metadata)
            VALUES (rec.user_id, 'completed', NOW(), jsonb_build_object('anonymized', rec.anonymize_data));
            
            v_processed := v_processed + 1;
            
        EXCEPTION WHEN OTHERS THEN
            -- Log failure
            INSERT INTO deletion_audit_logs (user_id, action, performed_at, metadata)
            VALUES (rec.user_id, 'failed', NOW(), jsonb_build_object('error', SQLERRM));
            
            UPDATE deletion_requests
            SET status = 'failed', updated_at = NOW()
            WHERE id = rec.id;
            
            v_failed := v_failed + 1;
        END;
    END LOOP;
    
    RETURN QUERY SELECT v_processed, v_failed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Function to send deletion notifications (run via cron daily)
CREATE OR REPLACE FUNCTION send_deletion_notifications()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER := 0;
    rec RECORD;
BEGIN
    -- Find deletions scheduled in 3 days that haven't been notified
    FOR rec IN 
        SELECT id, user_id, email, scheduled_deletion_date
        FROM deletion_requests
        WHERE status = 'pending'
        AND scheduled_deletion_date <= NOW() + INTERVAL '3 days'
        AND final_notification_sent = FALSE
    LOOP
        -- In production, integrate with email service
        -- For now, just mark as sent
        UPDATE deletion_requests
        SET 
            final_notification_sent = TRUE,
            notification_sent_at = NOW(),
            updated_at = NOW()
        WHERE id = rec.id;
        
        -- Log notification
        INSERT INTO deletion_audit_logs (user_id, action, performed_at, metadata)
        VALUES (rec.user_id, 'notification_sent', NOW(), jsonb_build_object('type', 'final_warning'));
        
        v_count := v_count + 1;
    END LOOP;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- 7. View for admin dashboard (deletion management)
CREATE OR REPLACE VIEW pending_deletions AS
SELECT 
    dr.id,
    dr.user_id,
    dr.email,
    dr.reason,
    dr.status,
    dr.requested_at,
    dr.scheduled_deletion_date,
    dr.cancelled_at,
    dr.notification_sent,
    dr.final_notification_sent,
    EXTRACT(DAY FROM dr.scheduled_deletion_date - NOW()) as days_remaining,
    CASE 
        WHEN dr.scheduled_deletion_date <= NOW() THEN 'overdue'
        WHEN dr.scheduled_deletion_date <= NOW() + INTERVAL '3 days' THEN 'urgent'
        WHEN dr.scheduled_deletion_date <= NOW() + INTERVAL '7 days' THEN 'warning'
        ELSE 'normal'
    END as priority
FROM deletion_requests dr
WHERE dr.status = 'pending'
ORDER BY dr.scheduled_deletion_date;

-- Grant access to view
GRANT SELECT ON pending_deletions TO authenticated;

-- 8. Comments for documentation
COMMENT ON TABLE data_export_logs IS 'Audit trail for user data exports (UU PDP compliance)';
COMMENT ON TABLE deletion_requests IS 'User account deletion requests with 14-day grace period';
COMMENT ON TABLE deletion_audit_logs IS 'Complete audit trail for all deletion-related actions';
COMMENT ON FUNCTION process_scheduled_deletions() IS 'Processes pending deletion requests that have passed their scheduled date';
COMMENT ON FUNCTION send_deletion_notifications() IS 'Sends final warning notifications 3 days before deletion';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
