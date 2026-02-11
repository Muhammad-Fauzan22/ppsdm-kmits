-- ============================================
-- PPSDM KMITS - Baseline Migration (Consolidated)
-- ============================================
-- Author: PPSDM KMITS Team
-- Description: Consolidated baseline migration from all previous schemas
-- Version: 2.0.0 (Baseline)
-- Date: 2026-02-11
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. USER MANAGEMENT & AUTH
-- ============================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    faculty TEXT,
    department TEXT,
    student_id TEXT UNIQUE,
    role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'student', 'tutor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- UU PDP Compliance fields
    deletion_requested_at TIMESTAMPTZ,
    deletion_scheduled_at TIMESTAMPTZ,
    deletion_cancelled_at TIMESTAMPTZ
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users with UU PDP compliance';

-- ============================================
-- 2. 9 DIMENSIONS FRAMEWORK
-- ============================================

CREATE TABLE IF NOT EXISTS dimensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    icon TEXT,
    color TEXT,
    order_index INTEGER DEFAULT 0,
    version TEXT DEFAULT '2.0.0',
    engine TEXT DEFAULT 'generic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE dimensions IS 'The 9 Dimensions of Holistic Student Development Framework';

-- Insert 9 dimensions
INSERT INTO dimensions (slug, name, name_en, description, icon, color, order_index) VALUES
('cognitive', 'Kognitif & Intelektual', 'Cognitive & Intellectual', 'Asesmen kemampuan kognitif dan intelektual', 'brain', 'blue', 1),
('self-management', 'Manajemen Diri', 'Self Management', 'Asesmen kemampuan manajemen diri dan produktivitas', 'target', 'green', 2),
('financial', 'Keuangan', 'Financial', 'Asesmen literasi keuangan dan manajemen finansial', 'dollar-sign', 'yellow', 3),
('physical', 'Kesehatan Fisik', 'Physical Health', 'Asesmen kesehatan fisik dan vitalitas', 'heart', 'red', 4),
('emotional', 'Kecerdasan Emosional & Sosial', 'Emotional & Social', 'Asesmen kecerdasan emosional dan kemampuan sosial', 'users', 'purple', 5),
('mental', 'Kesehatan Mental', 'Mental Health', 'Asesmen kesehatan mental dan psikologis', 'brain-circuit', 'indigo', 6),
('character', 'Karakter & Etika', 'Character & Ethics', 'Asesmen karakter dan integritas pribadi', 'shield', 'orange', 7),
('spiritual', 'Spiritualitas', 'Spiritual', 'Asesmen pertumbuhan spiritual dan makna hidup', 'sparkles', 'teal', 8),
('environmental', 'Lingkungan', 'Environmental', 'Asesmen kesadaran lingkungan dan gaya hidup', 'leaf', 'green', 9)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. ASSESSMENT ENGINE
-- ============================================

-- Assessment sessions (supports anonymous users)
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES dimensions(id),
    session_token VARCHAR(255) UNIQUE,
    device_fingerprint VARCHAR(255),
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment responses (supports anonymous users)
CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    response_data JSONB NOT NULL,
    score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment results
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES dimensions(id),
    total_score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    percentage DECIMAL(5,2),
    level TEXT CHECK (level IN ('low', 'medium', 'high')),
    recommendations JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. LEARNING RESOURCES
-- ============================================

CREATE TABLE IF NOT EXISTS learning_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('video', 'article', 'book', 'course', 'exercise')),
    dimension_id UUID REFERENCES dimensions(id),
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    url TEXT,
    metadata JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User resource progress
CREATE TABLE IF NOT EXISTS user_resource_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES learning_resources(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_data JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. ACTIVITIES & EVENTS
-- ============================================

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('workshop', 'seminar', 'competition', 'social', 'sports')),
    dimension_id UUID REFERENCES dimensions(id),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity registrations
CREATE TABLE IF NOT EXISTS activity_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('registered', 'attended', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, activity_id)
);

-- Activity feedback
CREATE TABLE IF NOT EXISTS activity_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    feedback_submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, activity_id)
);

-- ============================================
-- 6. GAMIFICATION
-- ============================================

CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    condition JSONB NOT NULL,
    points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    source TEXT NOT NULL, -- 'assessment', 'activity', 'achievement', etc.
    reference_id UUID, -- Reference to source record
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. ADMIN & MONITORING
-- ============================================

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User deletion audit logs (UU PDP Compliance)
CREATE TABLE IF NOT EXISTS user_deletion_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL CHECK (action IN ('requested', 'scheduled', 'cancelled', 'completed')),
    reason TEXT,
    ip_address INET,
    user_agent TEXT,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================

-- User-related indexes
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_deletion ON profiles(deletion_requested_at, deletion_scheduled_at);

-- Assessment-related indexes
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_dimension ON assessment_sessions(dimension_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_token ON assessment_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_session ON assessment_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_dimension ON assessment_results(dimension_id);

-- Learning resources indexes
CREATE INDEX IF NOT EXISTS idx_learning_resources_dimension ON learning_resources(dimension_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON learning_resources(type);
CREATE INDEX IF NOT EXISTS idx_user_resource_progress_user ON user_resource_progress(user_id);

-- Activities indexes
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_dimension ON activities(dimension_id);
CREATE INDEX IF NOT EXISTS idx_activities_start_time ON activities(start_time);
CREATE INDEX IF NOT EXISTS idx_activity_registrations_user ON activity_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_registrations_activity ON activity_registrations(activity_id);

-- Gamification indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_user ON user_points(user_id);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created ON admin_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_deletion_audit_logs_user ON user_deletion_audit_logs(user_id);

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_resource_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Assessment sessions policies (supports anonymous users)
CREATE POLICY "Users can view own sessions" ON assessment_sessions
    FOR SELECT USING (
        user_id = auth.uid() OR 
        (user_id IS NULL AND session_token IS NOT NULL)
    );

CREATE POLICY "Users can create own sessions" ON assessment_sessions
    FOR INSERT WITH CHECK (
        user_id = auth.uid() OR 
        (user_id IS NULL AND session_token IS NOT NULL)
    );

-- Assessment responses policies
CREATE POLICY "Users can view own responses" ON assessment_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM assessment_sessions 
            WHERE assessment_sessions.id = assessment_responses.session_id
            AND (
                assessment_sessions.user_id = auth.uid() OR
                (assessment_sessions.user_id IS NULL AND assessment_sessions.session_token IS NOT NULL)
            )
        )
    );

-- Assessment results policies
CREATE POLICY "Users can view own results" ON assessment_results
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all results" ON assessment_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Learning resources policies (public for reading, restricted for writing)
CREATE POLICY "Everyone can view active resources" ON learning_resources
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage resources" ON learning_resources
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Activities policies
CREATE POLICY "Everyone can view active activities" ON activities
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage activities" ON activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Activity registrations policies
CREATE POLICY "Users can manage own registrations" ON activity_registrations
    FOR ALL USING (user_id = auth.uid());

-- User achievements and points policies
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own points" ON user_points
    FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- 10. FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_resources_updated_at BEFORE UPDATE ON learning_resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activity_registrations_updated_at BEFORE UPDATE ON activity_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 11. VIEWS FOR COMMON QUERIES
-- ============================================

-- User dashboard view
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
    p.id,
    p.full_name,
    p.student_id,
    COUNT(DISTINCT ar.id) as total_activities,
    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'attended') as attended_activities,
    COUNT(DISTINCT ua.achievement_id) as total_achievements,
    COALESCE(SUM(up.points), 0) as total_points,
    COUNT(DISTINCT ars.id) as completed_assessments
FROM profiles p
LEFT JOIN activity_registrations ar ON p.id = ar.user_id
LEFT JOIN user_achievements ua ON p.id = ua.user_id
LEFT JOIN user_points up ON p.id = up.user_id
LEFT JOIN assessment_results ars ON p.id = ars.user_id
WHERE p.id = auth.uid()
GROUP BY p.id, p.full_name, p.student_id;

-- Assessment summary view
CREATE OR REPLACE VIEW assessment_summary AS
SELECT 
    d.slug as dimension_slug,
    d.name as dimension_name,
    d.color as dimension_color,
    COUNT(ar.id) as total_assessments,
    AVG(ar.percentage) as average_score,
    COUNT(DISTINCT ar.user_id) as unique_users
FROM dimensions d
LEFT JOIN assessment_results ar ON d.id = ar.dimension_id
GROUP BY d.id, d.slug, d.name, d.color
ORDER BY d.order_index;

-- ============================================
-- 12. FINAL NOTES
-- ============================================

COMMENT ON SCHEMA public IS 'PPSDM KMITS Database - Baseline Migration v2.0.0';

-- Migration complete
-- This baseline replaces all previous migrations
-- Future migrations should start from 20260211000001_baseline_v2.sql