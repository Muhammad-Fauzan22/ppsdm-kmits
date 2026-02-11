-- ==========================================
-- Database Migration Script
-- PPSDM KMITS - Clean Architecture Schema
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- IDENTITY MODULE
-- ==========================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'lecturer', 'admin', 'super_admin')),
    status VARCHAR(50) DEFAULT 'pending_verification' CHECK (status IN ('active', 'inactive', 'suspended', 'pending_verification')),
    full_name VARCHAR(255),
    student_id VARCHAR(50),
    department VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    phone_number VARCHAR(20),
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'manage')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User permissions junction table
CREATE TABLE IF NOT EXISTS user_permissions (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, permission_id)
);

-- Role permissions (default permissions per role)
CREATE TABLE IF NOT EXISTS role_permissions (
    role VARCHAR(50) NOT NULL,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role, permission_id)
);

-- ==========================================
-- ASSESSMENT MODULE
-- ==========================================

-- Dimensions table (9 dimensions of holistic development)
CREATE TABLE IF NOT EXISTS dimensions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    weight DECIMAL(3,2) DEFAULT 0.11 CHECK (weight > 0 AND weight <= 1),
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert 9 dimensions
INSERT INTO dimensions (id, name, description, weight) VALUES
(1, 'Self Management', 'Kemampuan mengelola diri, waktu, dan produktivitas', 0.11),
(2, 'Intellectual', 'Kecerdasan intelektual dan akademik', 0.11),
(3, 'Financial', 'Literasi keuangan dan manajemen uang', 0.11),
(4, 'Physical Health', 'Kesehatan fisik dan kebugaran', 0.11),
(5, 'Emotional Intelligence', 'Kecerdasan emosional dan sosial', 0.11),
(6, 'Mental Health', 'Kesehatan mental dan psikologis', 0.11),
(7, 'Character', 'Karakter, etika, dan integritas', 0.11),
(8, 'Spiritual', 'Pengembangan spiritual dan makna hidup', 0.11),
(9, 'Environmental', 'Kesadaran lingkungan dan gaya hidup', 0.11)
ON CONFLICT (id) DO NOTHING;

-- Assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    dimension_id INTEGER REFERENCES dimensions(id),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_dimension_id ON assessments(dimension_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);

-- Assessment questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dimension_id INTEGER REFERENCES dimensions(id),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'scale', 'text', 'scenario')),
    options JSONB,
    correct_answer JSONB,
    points INTEGER DEFAULT 1,
    order_number INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User answers table
CREATE TABLE IF NOT EXISTS user_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id),
    answer JSONB NOT NULL,
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment recommendations table
CREATE TABLE IF NOT EXISTS assessment_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    dimension_id INTEGER REFERENCES dimensions(id),
    recommendation_text TEXT NOT NULL,
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    resource_links JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- AUDIT LOGGING
-- ==========================================

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ==========================================
-- SECURITY TABLES
-- ==========================================

-- Rate limiting tracking (if not using Redis)
CREATE TABLE IF NOT EXISTS rate_limit_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(255) NOT NULL, -- IP address or user ID
    endpoint VARCHAR(255),
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    window_end TIMESTAMP WITH TIME ZONE,
    UNIQUE(identifier, endpoint, window_start)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_rate_limit_tracking_identifier ON rate_limit_tracking(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limit_tracking_window ON rate_limit_tracking(window_end);

-- Failed login attempts (security monitoring)
CREATE TABLE IF NOT EXISTS failed_login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255),
    ip_address INET NOT NULL,
    user_agent TEXT,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_failed_login_ip ON failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_failed_login_email ON failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_time ON failed_login_attempts(attempted_at);

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
DO $$
BEGIN
    -- Users
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    -- Assessments
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_assessments_updated_at') THEN
        CREATE TRIGGER update_assessments_updated_at
        BEFORE UPDATE ON assessments
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_recommendations ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- Assessments RLS policies
CREATE POLICY "Users can view own assessments"
ON assessments FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create own assessments"
ON assessments FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own assessments"
ON assessments FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all assessments"
ON assessments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- ==========================================
-- VIEWS FOR REPORTING
-- ==========================================

-- User assessment summary view
CREATE OR REPLACE VIEW user_assessment_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    COUNT(DISTINCT a.id) as total_assessments,
    COUNT(DISTINCT CASE WHEN a.completed_at IS NOT NULL THEN a.id END) as completed_assessments,
    AVG(a.score) as average_score,
    MAX(a.completed_at) as last_assessment_date
FROM users u
LEFT JOIN assessments a ON u.id = a.user_id
GROUP BY u.id, u.email, u.full_name;

-- Dimension statistics view
CREATE OR REPLACE VIEW dimension_statistics AS
SELECT 
    d.id as dimension_id,
    d.name as dimension_name,
    COUNT(a.id) as total_assessments,
    AVG(a.score) as average_score,
    MIN(a.score) as min_score,
    MAX(a.score) as max_score
FROM dimensions d
LEFT JOIN assessments a ON d.id = a.dimension_id AND a.completed_at IS NOT NULL
GROUP BY d.id, d.name;

-- ==========================================
-- STORED PROCEDURES
-- ==========================================

-- Calculate user progress across all dimensions
CREATE OR REPLACE FUNCTION calculate_user_progress(p_user_id UUID)
RETURNS TABLE (
    dimension_id INTEGER,
    dimension_name VARCHAR,
    completed BOOLEAN,
    score INTEGER,
    last_assessment_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.name,
        CASE WHEN a.completed_at IS NOT NULL THEN TRUE ELSE FALSE END as completed,
        a.score,
        a.completed_at
    FROM dimensions d
    LEFT JOIN LATERAL (
        SELECT * FROM assessments
        WHERE user_id = p_user_id AND dimension_id = d.id
        ORDER BY completed_at DESC NULLS LAST
        LIMIT 1
    ) a ON true
    ORDER BY d.id;
END;
$$ LANGUAGE plpgsql;

-- Get user recommendations based on lowest scores
CREATE OR REPLACE FUNCTION get_user_recommendations(p_user_id UUID)
RETURNS TABLE (
    dimension_id INTEGER,
    dimension_name VARCHAR,
    current_score INTEGER,
    recommendation_text TEXT,
    priority INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH user_scores AS (
        SELECT 
            a.dimension_id,
            d.name as dim_name,
            a.score,
            ROW_NUMBER() OVER (PARTITION BY a.dimension_id ORDER BY a.completed_at DESC) as rn
        FROM assessments a
        JOIN dimensions d ON a.dimension_id = d.id
        WHERE a.user_id = p_user_id AND a.completed_at IS NOT NULL
    ),
    lowest_scores AS (
        SELECT dimension_id, dim_name, score
        FROM user_scores
        WHERE rn = 1
        ORDER BY score ASC
        LIMIT 3
    )
    SELECT 
        ls.dimension_id,
        ls.dim_name,
        ls.score,
        'Focus on improving ' || ls.dim_name || ' dimension. Current score: ' || ls.score || '/100'::TEXT,
        CASE 
            WHEN ls.score < 50 THEN 5
            WHEN ls.score < 70 THEN 4
            ELSE 3
        END
    FROM lowest_scores ls;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- SEED DATA
-- ==========================================

-- Insert default admin user (change password immediately after setup!)
INSERT INTO users (id, email, email_verified, role, status, full_name)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@ppsdm-kmits.com',
    TRUE,
    'super_admin',
    'active',
    'System Administrator'
)
ON CONFLICT (id) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
('users.read', 'users', 'read', 'View user profiles'),
('users.create', 'users', 'create', 'Create new users'),
('users.update', 'users', 'update', 'Update user profiles'),
('users.delete', 'users', 'delete', 'Delete users'),
('users.manage', 'users', 'manage', 'Full user management'),
('assessments.read', 'assessments', 'read', 'View assessments'),
('assessments.create', 'assessments', 'create', 'Create assessments'),
('assessments.update', 'assessments', 'update', 'Update assessments'),
('assessments.delete', 'assessments', 'delete', 'Delete assessments'),
('assessments.manage', 'assessments', 'manage', 'Full assessment management'),
('admin.access', 'admin', 'manage', 'Access admin panel')
ON CONFLICT DO NOTHING;

-- Assign permissions to super_admin
INSERT INTO role_permissions (role, permission_id)
SELECT 'super_admin', id FROM permissions
ON CONFLICT DO NOTHING;

-- Assign permissions to admin
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions WHERE action != 'delete'
ON CONFLICT DO NOTHING;

COMMIT;
