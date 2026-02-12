-- ============================================
-- PPSDM KMITS - Complete Database Schema
-- ============================================
-- Author: PPSDM KMITS Team
-- Description: Complete database setup for PPSDM KMITS Supabase
-- Version: 1.0.0
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN profiles.role IS 'User role: admin, student, or tutor';

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE dimensions IS 'The 9 Dimensions of Holistic Student Development Framework';

-- Insert 9 Dimensions
INSERT INTO dimensions (slug, name, name_en, description, icon, color, order_index) VALUES
('spiritual', 'Kecerdasan Spiritual', 'Spiritual Intelligence', 'Pengembangan spiritual dan nilai-nilai keagamaan', 'Sparkles', '#8B5CF6', 1),
('emotional', 'Kecerdasan Emosional', 'Emotional Intelligence', 'Kemampuan mengelola emosi dan memahami orang lain', 'Heart', '#EC4899', 2),
('intellectual', 'Kecerdasan Intelektual', 'Intellectual Intelligence', 'Pengembangan akademik dan kognitif', 'Brain', '#3B82F6', 3),
('physical', 'Kesehatan Fisik', 'Physical Health', 'Kebugaran dan kesehatan jasmani', 'Dumbbell', '#10B981', 4),
('social', 'Kecerdasan Sosial', 'Social Intelligence', 'Kemampuan berinteraksi dan berkolaborasi', 'Users', '#F59E0B', 5),
('financial', 'Kecerdasan Finansial', 'Financial Intelligence', 'Manajemen keuangan dan kewirausahaan', 'Wallet', '#14B8A6', 6),
('occupational', 'Kecerdasan Okupasional', 'Occupational Intelligence', 'Pengembangan karir dan profesionalisme', 'Briefcase', '#6366F1', 7),
('environmental', 'Kecerdasan Lingkungan', 'Environmental Intelligence', 'Kesadaran dan kepedulian lingkungan', 'Leaf', '#22C55E', 8),
('character', 'Karakter', 'Character', 'Pembentukan karakter dan integritas diri', 'Shield', '#EF4444', 9)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. ASSESSMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES dimensions(id),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE assessments IS 'Assessment results for each dimension';
COMMENT ON COLUMN assessments.answers IS 'JSON containing detailed assessment answers';

-- Dimension Stats (aggregated scores)
CREATE TABLE IF NOT EXISTS dimension_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES dimensions(id),
    current_score INTEGER DEFAULT 0,
    previous_score INTEGER DEFAULT 0,
    improvement INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, dimension_id)
);

COMMENT ON TABLE dimension_stats IS 'Aggregated statistics for user performance in each dimension';
COMMENT ON COLUMN dimension_stats.improvement IS 'Calculated difference between current and previous score';

-- ============================================
-- 4. GOALS & IDP
-- ============================================

CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES dimensions(id),
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE goals IS 'User personal development goals per dimension';
COMMENT ON COLUMN goals.status IS 'Goal status: active, completed, or cancelled';

-- IDP (Individual Development Plan)
CREATE TABLE IF NOT EXISTS idps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    current_state TEXT,
    desired_state TEXT,
    action_plan JSONB,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE idps IS 'Individual Development Plans for comprehensive growth';
COMMENT ON COLUMN idps.action_plan IS 'JSON containing structured action steps';

-- ============================================
-- 5. LMS - COURSES & CONTENT
-- ============================================

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    category TEXT,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration INTEGER, -- in minutes
    xp_reward INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE courses IS 'Learning Management System - Courses';
COMMENT ON COLUMN courses.xp_reward IS 'Experience points awarded upon completion';
COMMENT ON COLUMN courses.level IS 'Difficulty level: beginner, intermediate, or advanced';

CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE modules IS 'Course modules containing multiple lessons';
COMMENT ON COLUMN modules.order_index IS 'Display order within the course';

CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    duration INTEGER,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE lessons IS 'Individual lessons within modules';

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);

COMMENT ON TABLE enrollments IS 'User course enrollments and progress tracking';
COMMENT ON COLUMN enrollments.progress IS 'Completion percentage (0-100)';

-- ============================================
-- 6. EBOOKS & CONTENT GENERATION
-- ============================================

CREATE TABLE IF NOT EXISTS ebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    drive_id TEXT UNIQUE,
    title TEXT NOT NULL,
    author TEXT,
    file_name TEXT,
    file_size BIGINT,
    mime_type TEXT,
    category TEXT,
    description TEXT,
    cover_image TEXT,
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    drive_folder_id TEXT,
    drive_folder_url TEXT,
    drive_upload_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE ebooks IS 'Ebook management for content generation pipeline';
COMMENT ON COLUMN ebooks.processing_status IS 'AI processing status: pending, processing, completed, or failed';
COMMENT ON COLUMN ebooks.drive_id IS 'Google Drive file ID';

CREATE TABLE IF NOT EXISTS courses_from_ebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ebook_id UUID REFERENCES ebooks(id),
    course_id UUID REFERENCES courses(id),
    quality_score INTEGER,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE courses_from_ebooks IS 'Link between ebooks and generated courses';
COMMENT ON COLUMN courses_from_ebooks.quality_score IS 'AI-generated quality score (0-100)';

-- ============================================
-- 7. GAMIFICATION
-- ============================================

CREATE TABLE IF NOT EXISTS user_xp (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    total_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE user_xp IS 'User experience points and leveling system';
COMMENT ON COLUMN user_xp.streak_days IS 'Consecutive days of activity';

CREATE TABLE IF NOT EXISTS xp_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT,
    source_type TEXT,
    source_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE xp_history IS 'History of all XP transactions';
COMMENT ON COLUMN xp_history.source_type IS 'Type of activity that generated XP';

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    xp_reward INTEGER DEFAULT 0,
    requirement_type TEXT,
    requirement_value INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE badges IS 'Achievement badges for gamification';
COMMENT ON COLUMN badges.requirement_type IS 'Type of requirement to earn badge';

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

COMMENT ON TABLE user_badges IS 'User earned badges';

-- Insert default badges
INSERT INTO badges (slug, name, description, icon, color, xp_reward, requirement_type, requirement_value) VALUES
('first_login', 'First Steps', 'Login pertama ke sistem', 'LogIn', '#3B82F6', 10, 'login', 1),
('complete_profile', 'Identity Established', 'Lengkapi profil Anda', 'User', '#8B5CF6', 20, 'profile_complete', 1),
('first_assessment', 'Self Discovery', 'Selesaikan assessment pertama', 'ClipboardCheck', '#10B981', 50, 'assessment_complete', 1),
('dimension_master', 'Dimension Master', 'Capai skor 90+ pada satu dimensi', 'Award', '#F59E0B', 100, 'dimension_score', 90),
('course_complete', 'Knowledge Seeker', 'Selesaikan satu course', 'BookOpen', '#EC4899', 75, 'course_complete', 1),
('streak_7', 'Weekly Warrior', '7 hari streak belajar', 'Flame', '#EF4444', 50, 'streak', 7),
('streak_30', 'Monthly Master', '30 hari streak belajar', 'Crown', '#FFD700', 200, 'streak', 30)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 8. CERTIFICATES
-- ============================================

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    certificate_number TEXT UNIQUE,
    template_id TEXT,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    downloaded_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE certificates IS 'Course completion certificates';
COMMENT ON COLUMN certificates.certificate_number IS 'Unique certificate identifier';

-- ============================================
-- 9. SOCIAL FEATURES
-- ============================================

CREATE TABLE IF NOT EXISTS study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id),
    created_by UUID REFERENCES auth.users(id),
    max_members INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE study_groups IS 'Study groups for collaborative learning';
COMMENT ON COLUMN study_groups.max_members IS 'Maximum number of group members';

CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

COMMENT ON TABLE group_members IS 'Study group membership';
COMMENT ON COLUMN group_members.role IS 'Role in group: admin or member';

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE idps ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Assessments: Users can CRUD own
CREATE POLICY "Users can view own assessments" 
    ON assessments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" 
    ON assessments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" 
    ON assessments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments" 
    ON assessments FOR DELETE 
    USING (auth.uid() = user_id);

-- Goals: Users can CRUD own
CREATE POLICY "Users can view own goals" 
    ON goals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals" 
    ON goals FOR ALL 
    USING (auth.uid() = user_id);

-- IDPs: Users can CRUD own
CREATE POLICY "Users can view own IDPs" 
    ON idps FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own IDPs" 
    ON idps FOR ALL 
    USING (auth.uid() = user_id);

-- Courses: Public read, admin write
CREATE POLICY "Courses are viewable by everyone" 
    ON courses FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Admins can manage courses" 
    ON courses FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Modules: Public read for published courses
CREATE POLICY "Modules are viewable for published courses" 
    ON modules FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM courses WHERE id = modules.course_id AND status = 'published'
    ));

CREATE POLICY "Admins can manage modules" 
    ON modules FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Lessons: Public read for published courses
CREATE POLICY "Lessons are viewable for published courses" 
    ON lessons FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM modules m 
        JOIN courses c ON m.course_id = c.id 
        WHERE m.id = lessons.module_id AND c.status = 'published'
    ));

CREATE POLICY "Admins can manage lessons" 
    ON lessons FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Enrollments: Users can view own
CREATE POLICY "Users can view own enrollments" 
    ON enrollments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" 
    ON enrollments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" 
    ON enrollments FOR UPDATE 
    USING (auth.uid() = user_id);

-- Dimension Stats: Users can view own
CREATE POLICY "Users can view own dimension stats" 
    ON dimension_stats FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own dimension stats" 
    ON dimension_stats FOR ALL 
    USING (auth.uid() = user_id);

-- Gamification: Users can view own
CREATE POLICY "Users can view own XP" 
    ON user_xp FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" 
    ON user_badges FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert user badges" 
    ON user_badges FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own XP history" 
    ON xp_history FOR SELECT 
    USING (auth.uid() = user_id);

-- Badges: Public read
CREATE POLICY "Badges are viewable by everyone" 
    ON badges FOR SELECT 
    USING (true);

-- Ebooks: Admin only management
CREATE POLICY "Admins can manage ebooks" 
    ON ebooks FOR ALL 
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Users can view ebooks" 
    ON ebooks FOR SELECT 
    USING (true);

-- Certificates: Users can view own
CREATE POLICY "Users can view own certificates" 
    ON certificates FOR SELECT 
    USING (auth.uid() = user_id);

-- Study Groups: Public read
CREATE POLICY "Study groups are viewable by everyone" 
    ON study_groups FOR SELECT 
    USING (true);

CREATE POLICY "Users can create study groups" 
    ON study_groups FOR INSERT 
    WITH CHECK (auth.uid() = created_by);

-- Group Members: Users can view groups they belong to
CREATE POLICY "Users can view own group memberships" 
    ON group_members FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can join groups" 
    ON group_members FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Group admins can manage members" 
    ON group_members FOR DELETE 
    USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM group_members gm 
            WHERE gm.group_id = group_members.group_id 
            AND gm.user_id = auth.uid() 
            AND gm.role = 'admin'
        )
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates the updated_at timestamp';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_xp_updated_at 
    BEFORE UPDATE ON user_xp
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dimension_stats_updated_at 
    BEFORE UPDATE ON dimension_stats
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON courses
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at 
    BEFORE UPDATE ON goals
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Calculate dimension improvement
CREATE OR REPLACE FUNCTION calculate_dimension_improvement()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.current_score IS NOT NULL THEN
        NEW.improvement = NEW.current_score - OLD.current_score;
    END IF;
    NEW.previous_score = OLD.current_score;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_dimension_improvement() IS 'Calculates score improvement on dimension stats update';

CREATE TRIGGER update_dimension_improvement 
    BEFORE UPDATE ON dimension_stats
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_dimension_improvement();

-- Add XP trigger
CREATE OR REPLACE FUNCTION add_xp_to_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_xp (user_id, total_xp, last_activity)
    VALUES (NEW.user_id, NEW.amount, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET 
        total_xp = user_xp.total_xp + NEW.amount,
        last_activity = NOW(),
        level = CASE 
            WHEN user_xp.total_xp + NEW.amount >= (user_xp.level * 1000) 
            THEN user_xp.level + 1 
            ELSE user_xp.level 
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION add_xp_to_user() IS 'Adds XP to user and calculates level progression';

CREATE TRIGGER xp_added 
    AFTER INSERT ON xp_history
    FOR EACH ROW 
    EXECUTE FUNCTION add_xp_to_user();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, avatar_url, role)
    VALUES (
        NEW.id, 
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates profile when new user signs up';

-- Drop trigger if exists to avoid errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Auto-create dimension stats when assessment is completed
CREATE OR REPLACE FUNCTION handle_new_assessment()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO dimension_stats (user_id, dimension_id, current_score)
    VALUES (NEW.user_id, NEW.dimension_id, NEW.score)
    ON CONFLICT (user_id, dimension_id)
    DO UPDATE SET 
        current_score = NEW.score,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION handle_new_assessment() IS 'Updates dimension stats when assessment is completed';

DROP TRIGGER IF EXISTS on_assessment_completed ON assessments;

CREATE TRIGGER on_assessment_completed
    AFTER INSERT ON assessments
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_assessment();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Assessment indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_dimension_id ON assessments(dimension_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);

-- Goals indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_dimension_id ON goals(dimension_id);

-- Enrollments indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- XP indexes
CREATE INDEX IF NOT EXISTS idx_xp_history_user_id ON xp_history(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_history_created_at ON xp_history(created_at);

-- Course content indexes
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order_index ON modules(order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(order_index);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);

-- Dimension stats indexes
CREATE INDEX IF NOT EXISTS idx_dimension_stats_user_id ON dimension_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_dimension_stats_dimension_id ON dimension_stats(dimension_id);

-- Ebooks indexes
CREATE INDEX IF NOT EXISTS idx_ebooks_processing_status ON ebooks(processing_status);
CREATE INDEX IF NOT EXISTS idx_ebooks_category ON ebooks(category);

-- Gamification indexes
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id);

-- Social indexes
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_course_id ON study_groups(course_id);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- User progress summary view
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
    p.id as user_id,
    p.full_name,
    p.role,
    COALESCE(ux.total_xp, 0) as total_xp,
    COALESCE(ux.level, 1) as level,
    COALESCE(ux.streak_days, 0) as streak_days,
    COUNT(DISTINCT a.id) as assessments_completed,
    COUNT(DISTINCT g.id) FILTER (WHERE g.status = 'completed') as goals_completed,
    COUNT(DISTINCT g.id) FILTER (WHERE g.status = 'active') as active_goals,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'completed') as courses_completed,
    COUNT(DISTINCT e.id) FILTER (WHERE e.status = 'active') as active_courses,
    COUNT(DISTINCT ub.id) as badges_earned
FROM profiles p
LEFT JOIN user_xp ux ON p.id = ux.user_id
LEFT JOIN assessments a ON p.id = a.user_id
LEFT JOIN goals g ON p.id = g.user_id
LEFT JOIN enrollments e ON p.id = e.user_id
LEFT JOIN user_badges ub ON p.id = ub.user_id
GROUP BY p.id, p.full_name, p.role, ux.total_xp, ux.level, ux.streak_days;

COMMENT ON VIEW user_progress_summary IS 'Comprehensive user progress overview';

-- Dimension leaderboard view
CREATE OR REPLACE VIEW dimension_leaderboard AS
SELECT 
    d.id as dimension_id,
    d.slug,
    d.name,
    d.color,
    ds.user_id,
    p.full_name,
    p.avatar_url,
    ds.current_score,
    ds.improvement,
    RANK() OVER (PARTITION BY d.id ORDER BY ds.current_score DESC) as rank
FROM dimensions d
LEFT JOIN dimension_stats ds ON d.id = ds.dimension_id
LEFT JOIN profiles p ON ds.user_id = p.id
WHERE ds.current_score > 0
ORDER BY d.order_index, ds.current_score DESC;

COMMENT ON VIEW dimension_leaderboard IS 'Leaderboard for each dimension';

-- Course enrollment stats view
CREATE OR REPLACE VIEW course_enrollment_stats AS
SELECT 
    c.id as course_id,
    c.title,
    c.category,
    c.level,
    c.xp_reward,
    COUNT(e.id) as total_enrollments,
    COUNT(e.id) FILTER (WHERE e.status = 'completed') as completed_count,
    COUNT(e.id) FILTER (WHERE e.status = 'active') as active_count,
    AVG(e.progress) as average_progress,
    MAX(e.enrolled_at) as last_enrollment_date
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
WHERE c.status = 'published'
GROUP BY c.id, c.title, c.category, c.level, c.xp_reward;

COMMENT ON VIEW course_enrollment_stats IS 'Course enrollment statistics';

-- ============================================
-- COMPLETE!
-- ============================================
-- Database setup complete! Next steps:
-- 1. Verify tables: SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- 2. Verify dimensions: SELECT * FROM dimensions ORDER BY order_index;
-- 3. Verify badges: SELECT * FROM badges;
-- 4. Test RLS: Check policies in pg_policies table
