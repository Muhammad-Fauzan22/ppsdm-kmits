-- PPSDM KMM Learning Management System Database Schema
-- Database: PostgreSQL (Supabase)
-- Created: 2026-01-31
-- Status: Production Ready

-- ============================================================================
-- 1. AUTHENTICATION & USERS
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    profile_pic URL,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. COURSES & CURRICULUM
-- ============================================================================

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    category VARCHAR(100),
    level VARCHAR(50) DEFAULT 'beginner',
    duration_hours INTEGER,
    instructor_id UUID REFERENCES users(id),
    cover_image URL,
    modules_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (category, level, is_published)
);

-- ============================================================================
-- 3. LEARNING MODULES
-- ============================================================================

CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    content TEXT,
    module_order INTEGER,
    duration_minutes INTEGER,
    learning_outcomes JSONB DEFAULT '[]',
    resources JSONB DEFAULT '[]',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (course_id, module_order)
);

-- ============================================================================
-- 4. LEARNING CONTENT & RESOURCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50),
    google_drive_id VARCHAR(255),
    file_path VARCHAR(500),
    file_size_kb INTEGER,
    mime_type VARCHAR(100),
    download_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (course_id, module_id)
);

-- ============================================================================
-- 5. ASSESSMENTS & QUIZZES
-- ============================================================================

CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(50),
    description TEXT,
    questions JSONB NOT NULL DEFAULT '[]',
    total_points INTEGER DEFAULT 100,
    passing_score DECIMAL(5, 2) DEFAULT 70,
    is_graded_by_ai BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (module_id)
);

-- ============================================================================
-- 6. STUDENT SUBMISSIONS & GRADES
-- ============================================================================

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id),
    user_id UUID NOT NULL REFERENCES users(id),
    answers JSONB NOT NULL,
    score DECIMAL(5, 2),
    feedback TEXT,
    ai_feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    graded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (assessment_id, user_id)
);

-- ============================================================================
-- 7. LEARNING PROGRESS TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    module_id UUID REFERENCES modules(id),
    is_module_completed BOOLEAN DEFAULT FALSE,
    is_course_completed BOOLEAN DEFAULT FALSE,
    completion_percentage DECIMAL(5, 2) DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    score DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (user_id, course_id, module_id)
);

-- ============================================================================
-- 8. CERTIFICATES & ACHIEVEMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    certificate_number VARCHAR(100) UNIQUE,
    issue_date DATE,
    valid_until DATE,
    verification_token VARCHAR(255) UNIQUE,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    badge_name VARCHAR(100),
    description TEXT,
    icon_url URL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (user_id)
);

-- ============================================================================
-- 9. DISCUSSIONS & FORUMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id),
    course_id UUID REFERENCES courses(id),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    ai_response TEXT,
    ai_model VARCHAR(50),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_answered BOOLEAN DEFAULT FALSE,
    reply_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (module_id, course_id, user_id)
);

CREATE TABLE IF NOT EXISTS discussion_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (discussion_id, user_id)
);

-- ============================================================================
-- 10. STUDY GROUPS & COLLABORATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS study_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    course_id UUID REFERENCES courses(id),
    description TEXT,
    creator_id UUID NOT NULL REFERENCES users(id),
    max_members INTEGER DEFAULT 10,
    member_count INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (course_id, creator_id)
);

CREATE TABLE IF NOT EXISTS group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- ============================================================================
-- 11. AI INTERACTIONS & LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    module_id UUID REFERENCES modules(id),
    interaction_type VARCHAR(100),
    prompt TEXT NOT NULL,
    response TEXT,
    model_used VARCHAR(50),
    tokens_used INTEGER,
    response_time_ms INTEGER,
    was_helpful BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (user_id, module_id, interaction_type)
);

-- ============================================================================
-- 12. ACTIVITY & ANALYTICS
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    activity_type VARCHAR(100),
    entity_type VARCHAR(100),
    entity_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (user_id, activity_type, created_at)
);

-- ============================================================================
-- 13. NOTIFICATIONS & PREFERENCES
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(100),
    title VARCHAR(255),
    message TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    INDEX (user_id, is_read, created_at)
);

-- ============================================================================
-- 14. ENROLL MENTS & COURSE ACCESS
-- ============================================================================

CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    status VARCHAR(50) DEFAULT 'active',
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id),
    INDEX (user_id, course_id)
);

-- ============================================================================
-- 15. INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_course ON learning_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_module ON discussions(module_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity(user_id);

-- ============================================================================
-- 16. VIEWS FOR ANALYTICS
-- ============================================================================

CREATE OR REPLACE VIEW course_statistics AS
SELECT 
    c.id,
    c.title,
    COUNT(DISTINCT e.user_id) as total_students,
    COUNT(DISTINCT CASE WHEN lp.is_course_completed THEN e.user_id END) as completed_students,
    ROUND(AVG(lp.completion_percentage), 2) as avg_completion,
    COUNT(DISTINCT d.id) as total_discussions,
    c.rating as course_rating,
    c.created_at
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
LEFT JOIN learning_progress lp ON c.id = lp.course_id
LEFT JOIN discussions d ON c.id = d.course_id
GROUP BY c.id;

CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(DISTINCT e.course_id) as enrolled_courses,
    COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN e.course_id END) as completed_courses,
    ROUND(AVG(lp.completion_percentage), 2) as avg_progress,
    COUNT(DISTINCT s.id) as total_submissions,
    COUNT(DISTINCT d.id) as discussions_posted
FROM users u
LEFT JOIN enrollments e ON u.id = e.user_id
LEFT JOIN learning_progress lp ON u.id = lp.user_id
LEFT JOIN submissions s ON u.id = s.user_id
LEFT JOIN discussions d ON u.id = d.user_id
GROUP BY u.id;

-- ============================================================================
-- SCHEMA COMPLETED
-- Total Tables: 15
-- Total Views: 2
-- Status: Ready for Data Import
-- ============================================================================
