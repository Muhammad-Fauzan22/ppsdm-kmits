-- ============================================================================
-- UU PDP Compliance Migration
-- Implements Indonesian Personal Data Protection Law (UU No. 27 Tahun 2022)
-- Pasal 35-40: Data Subject Rights (Access, Delete, Portability)
-- ============================================================================

-- ============================================================================
-- 1. Account Deletion Requests Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS account_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'failed')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_deletion_date TIMESTAMPTZ NOT NULL,
    grace_period_days INTEGER NOT NULL DEFAULT 14,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    completed_at TIMESTAMPTZ,
    deletion_method VARCHAR(20) CHECK (deletion_method IN ('soft', 'hard', 'anonymized')),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_deletion_requests_user_id ON account_deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON account_deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_scheduled ON account_deletion_requests(scheduled_deletion_date) WHERE status = 'pending';

-- ============================================================================
-- 2. Compliance Audit Logs Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS compliance_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON compliance_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON compliance_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON compliance_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON compliance_audit_logs(resource, resource_id);

-- ============================================================================
-- 3. Data Export Requests Table (Pasal 35-37: Right to Data Portability)
-- ============================================================================
CREATE TABLE IF NOT EXISTS data_export_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    format VARCHAR(20) NOT NULL CHECK (format IN ('pdf', 'json', 'csv', 'xml')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    file_url TEXT,
    file_size_bytes BIGINT,
    checksum VARCHAR(64),
    data_categories JSONB DEFAULT '[]', -- Which data categories were included
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_export_requests_user_id ON data_export_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_export_requests_status ON data_export_requests(status);

-- ============================================================================
-- 4. Consent Management Table (Pasal 14-16: Consent Requirements)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL, -- 'privacy_policy', 'terms_of_service', 'data_processing', 'marketing'
    version VARCHAR(20) NOT NULL,
    consented BOOLEAN NOT NULL DEFAULT FALSE,
    consented_at TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT,
    consent_text_hash VARCHAR(64), -- Hash of the consent text at time of agreement
    withdrawal_requested_at TIMESTAMPTZ,
    withdrawal_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, consent_type, version)
);

CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON user_consents(consent_type);

-- ============================================================================
-- 5. Data Retention Policy Configuration
-- ============================================================================
CREATE TABLE IF NOT EXISTS data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_category VARCHAR(100) NOT NULL UNIQUE,
    retention_days INTEGER NOT NULL,
    legal_basis VARCHAR(100), -- 'consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests'
    description TEXT,
    auto_delete BOOLEAN DEFAULT FALSE,
    anonymize_after_days INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default retention policies
INSERT INTO data_retention_policies (data_category, retention_days, legal_basis, description, auto_delete, anonymize_after_days)
VALUES 
    ('assessment_results', 2555, 'legitimate_interests', 'Student development records (7 years)', FALSE, 365),
    ('user_profile', 365, 'consent', 'User profile data', FALSE, NULL),
    ('session_logs', 90, 'legitimate_interests', 'Authentication logs', TRUE, NULL),
    ('audit_logs', 2555, 'legal_obligation', 'Compliance audit logs (7 years)', FALSE, NULL),
    ('deleted_accounts', 90, 'legal_obligation', 'Soft-deleted account data before permanent deletion', TRUE, NULL),
    ('export_files', 30, 'consent', 'User data export files', TRUE, NULL)
ON CONFLICT (data_category) DO NOTHING;

-- ============================================================================
-- 6. RLS Policies for Compliance Tables
-- ============================================================================

-- Account Deletion Requests RLS
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

-- Compliance Audit Logs RLS
ALTER TABLE compliance_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit logs"
ON compliance_audit_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create audit logs"
ON compliance_audit_logs FOR INSERT
WITH CHECK (true); -- Allow system to log

-- Data Export Requests RLS
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own export requests"
ON data_export_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own export requests"
ON data_export_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User Consents RLS
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own consents"
ON user_consents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own consents"
ON user_consents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own consents"
ON user_consents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 7. Functions for Automated Compliance
-- ============================================================================

-- Function to process expired deletion requests
CREATE OR REPLACE FUNCTION process_expired_deletion_requests()
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
        -- Update status to processing
        UPDATE account_deletion_requests 
        SET status = 'processing', updated_at = NOW()
        WHERE id = rec.id;
        
        -- Log the action
        INSERT INTO compliance_audit_logs (
            user_id, action, resource, resource_id, metadata
        ) VALUES (
            rec.user_id, 
            'ACCOUNT_DELETION_EXECUTED', 
            'account_deletion_requests',
            rec.id,
            jsonb_build_object('method', 'automated', 'trigger', 'scheduled_job')
        );
        
        processed_count := processed_count + 1;
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
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'completed' 
    AND expires_at <= NOW()
    AND status != 'expired';
    
    GET DIAGNOSTICS cleaned_count = ROW_COUNT;
    
    RETURN cleaned_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log data access for audit trail
CREATE OR REPLACE FUNCTION log_data_access(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_resource VARCHAR(100),
    p_resource_id UUID,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO compliance_audit_logs (
        user_id, action, resource, resource_id, metadata, ip_address
    ) VALUES (
        p_user_id, p_action, p_resource, p_resource_id, p_metadata, 
        inet_client_addr()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. Triggers for Automated Compliance
-- ============================================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_account_deletion_requests_updated_at
    BEFORE UPDATE ON account_deletion_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_export_requests_updated_at
    BEFORE UPDATE ON data_export_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_consents_updated_at
    BEFORE UPDATE ON user_consents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. Comments for Documentation
-- ============================================================================

COMMENT ON TABLE account_deletion_requests IS 'UU PDP Pasal 38-40: Records of user account deletion requests with 14-day grace period';
COMMENT ON TABLE compliance_audit_logs IS 'UU PDP Pasal 56: Audit trail for all data processing activities';
COMMENT ON TABLE data_export_requests IS 'UU PDP Pasal 35-37: User data portability requests';
COMMENT ON TABLE user_consents IS 'UU PDP Pasal 14-16: User consent management for data processing';
COMMENT ON TABLE data_retention_policies IS 'UU PDP Pasal 29: Data retention policy configuration';

-- ============================================================================
-- Migration Complete
-- ============================================================================
