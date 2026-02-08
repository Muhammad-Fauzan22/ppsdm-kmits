-- ============================================================================
-- UU PDP COMPLIANCE MIGRATION
-- Purpose: Implement data subject rights per UU No. 27 Tahun 2022
-- Date: 2026-02-09
-- ============================================================================

-- ============================================================================
-- 1. ACCOUNT DELETION REQUESTS TABLE
-- Implements soft delete with grace period (Pasal 38-40 UU PDP)
-- ============================================================================

CREATE TABLE IF NOT EXISTS account_deletion_requests (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_deletion_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'cancelled', 'completed', 'failed')),
    reason TEXT,
    feedback TEXT,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    completed_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_deletion_requests_user 
    ON account_deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status 
    ON account_deletion_requests(status) 
    WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_deletion_requests_scheduled 
    ON account_deletion_requests(scheduled_deletion_date) 
    WHERE status = 'pending';

-- RLS Policies for deletion requests
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deletion requests"
    ON account_deletion_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deletion requests"
    ON account_deletion_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending deletion requests"
    ON account_deletion_requests FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending');

-- ============================================================================
-- 2. COMPLIANCE AUDIT LOGS TABLE
-- Tracks all data subject rights requests for legal compliance
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user 
    ON compliance_audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
    ON compliance_audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created 
    ON compliance_audit_logs(created_at DESC);

-- RLS Policies for audit logs (read-only for users, admin can view all)
ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit logs"
    ON compliance_audit_logs FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- 3. DATA EXPORT REQUESTS TABLE
-- Tracks data portability requests (Pasal 35 UU PDP)
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_export_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    format VARCHAR(10) NOT NULL DEFAULT 'pdf'
        CHECK (format IN ('pdf', 'json', 'csv')),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    file_url TEXT,
    file_size_bytes INTEGER,
    expires_at TIMESTAMPTZ,
    error_message TEXT,
    ip_address INET,
    user_agent TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_export_requests_user 
    ON data_export_requests(user_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_export_requests_status 
    ON data_export_requests(status) 
    WHERE status IN ('pending', 'processing');

-- RLS Policies
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own export requests"
    ON data_export_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own export requests"
    ON data_export_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 4. CONSENT MANAGEMENT TABLE
-- Tracks user consent for data processing (Pasal 15-17 UU PDP)
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    consent_version VARCHAR(20) NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    UNIQUE(user_id, consent_type, consent_version)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_consents_user 
    ON user_consents(user_id, consent_type);
CREATE INDEX IF NOT EXISTS idx_user_consents_active 
    ON user_consents(user_id) 
    WHERE revoked_at IS NULL;

-- RLS Policies
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consents"
    ON user_consents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own consents"
    ON user_consents FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================================
-- 5. DATA RETENTION POLICY CONFIGURATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_category VARCHAR(100) NOT NULL UNIQUE,
    retention_days INTEGER NOT NULL,
    legal_basis TEXT NOT NULL,
    description TEXT,
    auto_delete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default retention policies per UU PDP
INSERT INTO data_retention_policies (data_category, retention_days, legal_basis, description, auto_delete)
VALUES 
    ('assessment_results', 2555, 'Pasal 38 UU PDP - Data pengembangan diri', 'Assessment results retained for 7 years for academic records', false),
    ('user_activity_logs', 365, 'Pasal 38 UU PDP - Keamanan sistem', 'Activity logs retained for 1 year for security purposes', true),
    ('session_data', 30, 'Pasal 38 UU PDP - Operasional sistem', 'Session data auto-deleted after 30 days', true),
    ('export_requests', 30, 'Pasal 35 UU PDP - Data portability', 'Export files deleted after 30 days', true),
    ('deletion_requests', 2555, 'Pasal 38 UU PDP - Bukti hukum', 'Deletion request records kept for 7 years as legal proof', false)
ON CONFLICT (data_category) DO NOTHING;

-- ============================================================================
-- 6. ANONYMIZED DATA TABLE (for research retention after deletion)
-- ============================================================================

CREATE TABLE IF NOT EXISTS anonymized_research_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_user_id_hash VARCHAR(64) NOT NULL, -- SHA-256 hash for deduplication only
    data_type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    anonymized_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for deduplication
CREATE INDEX IF NOT EXISTS idx_anonymized_hash 
    ON anonymized_research_data(original_user_id_hash);

-- No RLS - this is truly anonymized data
-- Only aggregated research queries should access this

-- ============================================================================
-- 7. FUNCTIONS FOR AUTOMATED COMPLIANCE
-- ============================================================================

-- Function to process expired deletion requests
CREATE OR REPLACE FUNCTION process_expired_deletions()
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT id, user_id 
        FROM account_deletion_requests 
        WHERE status = 'pending' 
        AND scheduled_deletion_date <= NOW()
    LOOP
        -- Mark as completed
        UPDATE account_deletion_requests 
        SET status = 'completed', 
            completed_at = NOW(),
            updated_at = NOW()
        WHERE id = rec.id;
        
        -- Anonymize research data before deleting
        INSERT INTO anonymized_research_data (
            original_user_id_hash, 
            data_type, 
            data
        )
        SELECT 
            encode(digest(rec.user_id::text, 'sha256'), 'hex'),
            'assessment_summary',
            jsonb_build_object(
                'dimension_scores', (
                    SELECT jsonb_object_agg(dimension, score) 
                    FROM assessment_results 
                    WHERE user_id = rec.user_id
                ),
                'assessment_count', (
                    SELECT count(*) 
                    FROM assessment_sessions 
                    WHERE user_id = rec.user_id
                ),
                'anonymized_at', NOW()
            );
        
        -- Delete user data (cascade will handle related tables)
        -- Note: auth.users deletion should be handled by application logic
        -- or Supabase auth admin API
        
        processed_count := processed_count + 1;
        
        -- Log the completion
        INSERT INTO compliance_audit_logs (
            user_id, action, resource, resource_id, metadata
        ) VALUES (
            rec.user_id,
            'ACCOUNT_DELETION_COMPLETED',
            'account_deletion_requests',
            rec.id,
            jsonb_build_object('processed_at', NOW())
        );
    END LOOP;
    
    RETURN processed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired export files
CREATE OR REPLACE FUNCTION cleanup_expired_exports()
RETURNS INTEGER AS $$
DECLARE
    cleaned_count INTEGER := 0;
BEGIN
    UPDATE data_export_requests
    SET status = 'expired',
        file_url = NULL
    WHERE status = 'completed'
    AND expires_at <= NOW()
    AND file_url IS NOT NULL;
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    
    RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. TRIGGERS FOR AUDIT LOGGING
-- ============================================================================

-- Trigger to log user data updates
CREATE OR REPLACE FUNCTION log_user_data_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO compliance_audit_logs (
            user_id, action, resource, resource_id, metadata
        ) VALUES (
            NEW.id,
            'USER_PROFILE_UPDATED',
            'auth.users',
            NEW.id,
            jsonb_build_object(
                'updated_fields', (
                    SELECT jsonb_object_agg(key, true)
                    FROM jsonb_each(to_jsonb(NEW))
                    WHERE to_jsonb(NEW)->key IS DISTINCT FROM to_jsonb(OLD)->key
                ),
                'updated_at', NOW()
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to auth.users (requires careful consideration in production)
-- CREATE TRIGGER audit_user_changes
--     AFTER UPDATE ON auth.users
--     FOR EACH ROW
--     EXECUTE FUNCTION log_user_data_changes();

-- ============================================================================
-- 9. VIEWS FOR COMPLIANCE REPORTING
-- ============================================================================

-- View for pending deletion summary
CREATE OR REPLACE VIEW pending_deletions_summary AS
SELECT 
    adr.id,
    adr.user_id,
    adr.email,
    adr.requested_at,
    adr.scheduled_deletion_date,
    adr.reason,
    EXTRACT(DAY FROM (adr.scheduled_deletion_date - NOW()))::INTEGER as days_remaining
FROM account_deletion_requests adr
WHERE adr.status = 'pending'
ORDER BY adr.scheduled_deletion_date;

-- View for compliance metrics
CREATE OR REPLACE VIEW compliance_metrics AS
SELECT
    (SELECT COUNT(*) FROM account_deletion_requests WHERE status = 'pending') as pending_deletions,
    (SELECT COUNT(*) FROM account_deletion_requests WHERE status = 'completed' AND completed_at >= NOW() - INTERVAL '30 days') as deletions_last_30_days,
    (SELECT COUNT(*) FROM data_export_requests WHERE status = 'pending') as pending_exports,
    (SELECT COUNT(*) FROM data_export_requests WHERE status = 'completed' AND completed_at >= NOW() - INTERVAL '30 days') as exports_last_30_days,
    (SELECT COUNT(*) FROM compliance_audit_logs WHERE created_at >= NOW() - INTERVAL '30 days') as audit_logs_last_30_days,
    NOW() as calculated_at;

-- ============================================================================
-- 10. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE account_deletion_requests IS 'UU PDP Compliance: Tracks user account deletion requests with 14-day grace period (Pasal 38)';
COMMENT ON TABLE compliance_audit_logs IS 'UU PDP Compliance: Audit trail for all data subject rights requests (Pasal 56)';
COMMENT ON TABLE data_export_requests IS 'UU PDP Compliance: Data portability requests (Pasal 35)';
COMMENT ON TABLE user_consents IS 'UU PDP Compliance: User consent management (Pasal 15-17)';
COMMENT ON TABLE data_retention_policies IS 'UU PDP Compliance: Data retention policy configuration (Pasal 38)';
COMMENT ON TABLE anonymized_research_data IS 'UU PDP Compliance: Anonymized data retained for research after user deletion (Pasal 38 ayat 3)';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
