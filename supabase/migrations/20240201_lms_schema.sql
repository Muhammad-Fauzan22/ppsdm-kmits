-- ============================================
-- LMS Database Schema for PPSDM KMM ITS
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE LMS TABLES
-- ============================================

-- Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT(280),
    cover_image TEXT,
    thumbnail_image TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    duration INTEGER, -- in minutes
    xp_reward INTEGER DEFAULT 0,
    certificate_enabled BOOLEAN DEFAULT true,
    passing_score INTEGER DEFAULT 70,
    max_attempts INTEGER DEFAULT 3,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Course Prerequisites
CREATE TABLE course_prerequisites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    prerequisite_course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, prerequisite_course_id)
);

-- Modules Table (Course Sections)
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    xp_reward INTEGER DEFAULT 0,
    duration INTEGER, -- in minutes
    is_published BOOLEAN DEFAULT false,
    unlock_condition JSONB DEFAULT '{}'::jsonb, -- e.g., {"previous_module_complete": true}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, order_index)
);

-- Lessons Table
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- HTML/Markdown content
    content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'audio', 'pdf', 'interactive', 'quiz', 'assignment')),
    video_url TEXT,
    video_duration INTEGER, -- in seconds
    pdf_url TEXT,
    external_resource_url TEXT,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    xp_reward INTEGER DEFAULT 0,
    estimated_time INTEGER, -- in minutes
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id, order_index)
);

-- Lesson Progress Table
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent INTEGER DEFAULT 0, -- in seconds
    video_progress INTEGER DEFAULT 0, -- seconds watched
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- ============================================
-- ENROLLMENTS & PROGRESS
-- ============================================

-- Course Enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped', 'expired')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    total_time_spent INTEGER DEFAULT 0, -- in minutes
    xp_earned INTEGER DEFAULT 0,
    grade DECIMAL(5,2),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    notes TEXT,
    UNIQUE(user_id, course_id)
);

-- Course Bookmarks
CREATE TABLE course_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ============================================
-- ASSESSMENTS
-- ============================================

-- Assessments Table
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('quiz', 'assignment', 'exam', 'survey', 'peer_review')),
    instructions TEXT,
    time_limit INTEGER, -- in minutes, NULL for no limit
    max_attempts INTEGER DEFAULT 1,
    passing_score INTEGER DEFAULT 70,
    total_points INTEGER DEFAULT 100,
    randomize_questions BOOLEAN DEFAULT false,
    show_correct_answers BOOLEAN DEFAULT true,
    show_correct_answers_after DATE,
    availability_start TIMESTAMP WITH TIME ZONE,
    availability_end TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT false,
    weight_percentage DECIMAL(5,2) DEFAULT 0, -- weight in final grade
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions Table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'matching', 'fill_in_blank', 'multiple_select')),
    question_text TEXT NOT NULL,
    question_html TEXT, -- Rich text version
    explanation TEXT, -- Explanation shown after answering
    points INTEGER DEFAULT 10,
    order_index INTEGER,
    media_url TEXT, -- Image/video for question
    correct_answer JSONB NOT NULL, -- Stored as JSON for flexibility
    options JSONB DEFAULT '[]'::jsonb, -- For multiple choice
    case_sensitive BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Attempts
CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER, -- in seconds
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'expired')),
    score DECIMAL(5,2),
    max_score INTEGER,
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    answers JSONB DEFAULT '{}'::jsonb,
    graded_by UUID REFERENCES auth.users(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    feedback TEXT,
    ip_address INET,
    user_agent TEXT,
    UNIQUE(assessment_id, user_id, attempt_number)
);

-- ============================================
-- GAMIFICATION
-- ============================================

-- User XP and Levels
CREATE TABLE user_xp (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    xp_to_next_level INTEGER DEFAULT 100,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    daily_xp_earned INTEGER DEFAULT 0,
    weekly_xp_earned INTEGER DEFAULT 0,
    monthly_xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- XP History/Transactions
CREATE TABLE xp_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    xp_amount INTEGER NOT NULL,
    action_type TEXT NOT NULL, -- 'course_complete', 'quiz_pass', 'streak', 'daily_login', etc.
    description TEXT,
    reference_type TEXT, -- 'course', 'lesson', 'assessment', etc.
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges Definition
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    badge_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    category TEXT,
    criteria_type TEXT NOT NULL, -- 'course_count', 'xp_total', 'streak_days', 'assessment_score', etc.
    criteria_value INTEGER NOT NULL,
    criteria_details JSONB DEFAULT '{}'::jsonb,
    xp_reward INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    displayed BOOLEAN DEFAULT true,
    UNIQUE(user_id, badge_id)
);

-- Achievements (More complex than badges)
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    achievement_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    tier INTEGER DEFAULT 1, -- Tier 1, 2, 3 for progressive achievements
    max_tier INTEGER DEFAULT 1,
    requirements JSONB NOT NULL, -- Complex requirements structure
    rewards JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    current_tier INTEGER DEFAULT 1,
    progress INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Leaderboard Entries
CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT DEFAULT 'overall' CHECK (category IN ('overall', 'weekly', 'monthly', 'course', 'department')),
    reference_id UUID, -- course_id or department_id if category-specific
    score INTEGER DEFAULT 0,
    rank INTEGER,
    period_start DATE,
    period_end DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category, reference_id, period_start)
);

-- ============================================
-- CERTIFICATES
-- ============================================

-- Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    template_id UUID REFERENCES certificate_templates(id),
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    grade TEXT,
    score DECIMAL(5,2),
    completion_time INTEGER, -- in days
    pdf_url TEXT,
    verification_url TEXT,
    verified_count INTEGER DEFAULT 0,
    last_verified_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revocation_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(user_id, course_id)
);

-- Certificate Templates
CREATE TABLE certificate_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    template_image_url TEXT NOT NULL,
    background_image_url TEXT,
    layout_config JSONB DEFAULT '{}'::jsonb, -- Positioning of name, course, date, etc.
    font_config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NOTES & BOOKMARKS
-- ============================================

-- User Notes
CREATE TABLE user_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    timestamp INTEGER, -- For video/audio - timestamp in seconds
    is_private BOOLEAN DEFAULT true,
    color TEXT DEFAULT 'yellow',
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson Bookmarks
CREATE TABLE lesson_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    timestamp INTEGER, -- For video/audio
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, lesson_id, timestamp)
);

-- ============================================
-- DISCUSSIONS & COLLABORATION
-- ============================================

-- Discussion Topics
CREATE TABLE discussion_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_announcement BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    upvotes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion Replies
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES discussion_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES discussion_replies(id) ON DELETE CASCADE, -- For nested replies
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ANALYTICS & TRACKING
-- ============================================

-- xAPI Statements
CREATE TABLE xapi_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    statement_id TEXT UNIQUE NOT NULL,
    verb TEXT NOT NULL,
    object_type TEXT NOT NULL,
    object_id TEXT NOT NULL,
    result JSONB,
    context JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    stored TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    raw_statement JSONB NOT NULL
);

-- Activity Logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT, -- 'course', 'lesson', 'assessment', etc.
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Performance indexes
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_featured ON courses(featured) WHERE featured = true;

CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);

CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, order_index);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_course_id ON lesson_progress(course_id);

CREATE INDEX idx_assessments_course_id ON assessments(course_id);
CREATE INDEX idx_assessment_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX idx_assessment_attempts_assessment_id ON assessment_attempts(assessment_id);

CREATE INDEX idx_xp_history_user_id ON xp_history(user_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);

CREATE INDEX idx_discussion_topics_course_id ON discussion_topics(course_id);
CREATE INDEX idx_discussion_replies_topic_id ON discussion_replies(topic_id);

CREATE INDEX idx_xapi_statements_user_id ON xapi_statements(user_id);
CREATE INDEX idx_xapi_statements_timestamp ON xapi_statements(timestamp);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_xp_updated_at BEFORE UPDATE ON user_xp
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_notes_updated_at BEFORE UPDATE ON user_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussion_topics_updated_at BEFORE UPDATE ON discussion_topics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- Courses: Published visible to all, drafts only to creators
CREATE POLICY courses_select ON courses
    FOR SELECT USING (status = 'published' OR created_by = auth.uid());

-- Enrollments: Users see their own
CREATE POLICY enrollments_select ON enrollments
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY enrollments_insert ON enrollments
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY enrollments_update ON enrollments
    FOR UPDATE USING (user_id = auth.uid());

-- Similar policies for other tables...
-- (Add more specific policies based on your authorization requirements)

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default badges
INSERT INTO badges (badge_code, name, description, image_url, rarity, category, criteria_type, criteria_value, xp_reward) VALUES
('first_course', 'First Steps', 'Complete your first course', '/badges/first-course.svg', 'common', 'milestone', 'course_count', 1, 50),
('course_collector_5', 'Course Collector', 'Complete 5 courses', '/badges/collector-5.svg', 'uncommon', 'milestone', 'course_count', 5, 100),
('course_collector_10', 'Knowledge Seeker', 'Complete 10 courses', '/badges/collector-10.svg', 'rare', 'milestone', 'course_count', 10, 250),
('xp_1000', 'Rising Star', 'Earn 1,000 XP', '/badges/xp-1000.svg', 'uncommon', 'xp', 'xp_total', 1000, 0),
('xp_5000', 'Expert Learner', 'Earn 5,000 XP', '/badges/xp-5000.svg', 'rare', 'xp', 'xp_total', 5000, 0),
('streak_7', 'Week Warrior', 'Maintain a 7-day learning streak', '/badges/streak-7.svg', 'uncommon', 'streak', 'streak_days', 7, 100),
('streak_30', 'Monthly Master', 'Maintain a 30-day learning streak', '/badges/streak-30.svg', 'epic', 'streak', 'streak_days', 30, 500),
('perfect_quiz', 'Perfect Score', 'Score 100% on any quiz', '/badges/perfect-quiz.svg', 'rare', 'achievement', 'quiz_perfect', 1, 200),
('night_owl', 'Night Owl', 'Complete a lesson between 12 AM and 5 AM', '/badges/night-owl.svg', 'uncommon', 'special', 'night_learning', 1, 50),
('early_bird', 'Early Bird', 'Complete a lesson before 7 AM', '/badges/early-bird.svg', 'uncommon', 'special', 'morning_learning', 1, 50);

-- Insert certificate template
INSERT INTO certificate_templates (name, description, template_image_url, layout_config, font_config) VALUES
('Standard Certificate', 'Default certificate template for course completion', 
 '/certificates/templates/standard.png',
 '{"namePosition": {"x": 400, "y": 300}, "coursePosition": {"x": 400, "y": 400}, "datePosition": {"x": 400, "y": 500}, "signaturePosition": {"x": 600, "y": 600}}'::jsonb,
 '{"nameFont": "Playfair Display", "courseFont": "Open Sans", "size": 24}'::jsonb
);
