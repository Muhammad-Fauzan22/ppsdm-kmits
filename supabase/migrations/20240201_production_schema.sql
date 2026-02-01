-- ==============================================
-- PPSDM KMITS - PRODUCTION SCHEMA (Phase 1)
-- ==============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- CORE TABLES
-- ==============================================

-- Faculties
CREATE TABLE IF NOT EXISTS faculties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dean_name VARCHAR(255),
    established_year INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES faculties(id) ON DELETE CASCADE,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    head_name VARCHAR(255),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase auth)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    student_id VARCHAR(50),
    department_id UUID REFERENCES departments(id),
    year_of_study INTEGER,
    avatar_url TEXT,
    bio TEXT,
    learning_style VARCHAR(50),
    interests TEXT[],
    skills JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- LEARNING CONTENT TABLES
-- ==============================================

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    credit_points INTEGER DEFAULT 0,
    department_id UUID REFERENCES departments(id),
    instructor_id UUID REFERENCES user_profiles(id),
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    prerequisites UUID[] DEFAULT '{}',
    learning_objectives JSONB DEFAULT '[]',
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules (sections within courses)
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sequence_order INTEGER NOT NULL,
    duration_minutes INTEGER,
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlock_requirements JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    content_type VARCHAR(50) CHECK (content_type IN ('text', 'video', 'audio', 'pdf', 'quiz', 'interactive')),
    video_url TEXT,
    duration_seconds INTEGER,
    sequence_order INTEGER NOT NULL,
    is_optional BOOLEAN DEFAULT FALSE,
    resources JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- PROGRESS TRACKING
-- ==============================================

-- User Course Progress
CREATE TABLE IF NOT EXISTS user_course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    total_time_spent_seconds INTEGER DEFAULT 0,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url TEXT,
    UNIQUE(user_id, course_id)
);

-- Lesson Progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_percentage INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    last_position_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- ==============================================
-- ASSESSMENT TABLES
-- ==============================================

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER,
    passing_score INTEGER DEFAULT 70,
    max_attempts INTEGER DEFAULT 3,
    randomize_questions BOOLEAN DEFAULT TRUE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'code')),
    options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    points INTEGER DEFAULT 1,
    difficulty VARCHAR(20),
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    sequence_order INTEGER
);

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score INTEGER,
    total_points INTEGER,
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    attempt_number INTEGER,
    answers JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}'
);

-- ==============================================
-- EBOOK & CONTENT TABLES
-- ==============================================

-- Ebooks
CREATE TABLE IF NOT EXISTS ebooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(50),
    publisher VARCHAR(255),
    published_year INTEGER,
    description TEXT,
    cover_url TEXT,
    pdf_url TEXT,
    file_size_bytes BIGINT,
    page_count INTEGER,
    category VARCHAR(100),
    tags TEXT[],
    difficulty_level VARCHAR(20),
    estimated_reading_time_minutes INTEGER,
    is_processed BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(50) DEFAULT 'pending',
    drive_folder_id TEXT,
    drive_file_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Processed Ebook Content
CREATE TABLE IF NOT EXISTS ebook_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
    content_type VARCHAR(50) CHECK (content_type IN ('summary', 'deep_dive', 'action_plan', 'audio_script', 'gamification', 'presentation', 'podcast_script', 'scenarios', 'infographic')),
    content JSONB NOT NULL,
    ai_provider VARCHAR(50),
    processing_time_ms INTEGER,
    quality_score DECIMAL(4,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- GAMIFICATION TABLES
-- ==============================================

-- Badges
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    category VARCHAR(50),
    criteria JSONB NOT NULL,
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    points_value INTEGER DEFAULT 0,
    is_nft_ready BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Badges
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    nft_minted BOOLEAN DEFAULT FALSE,
    nft_token_id TEXT,
    UNIQUE(user_id, badge_id)
);

-- Experience Points
CREATE TABLE IF NOT EXISTS user_xp (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    xp_to_next_level INTEGER DEFAULT 100,
    streak_days INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- XP Transactions
CREATE TABLE IF NOT EXISTS xp_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    description TEXT,
    reference_id UUID,
    reference_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- SOCIAL & COLLABORATION TABLES
-- ==============================================

-- Study Groups
CREATE TABLE IF NOT EXISTS study_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    course_id UUID REFERENCES courses(id),
    created_by UUID REFERENCES user_profiles(id),
    max_members INTEGER DEFAULT 10,
    is_private BOOLEAN DEFAULT FALSE,
    invite_code VARCHAR(20),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Group Members
CREATE TABLE IF NOT EXISTS study_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- Peer Reviews
CREATE TABLE IF NOT EXISTS peer_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID REFERENCES user_profiles(id),
    reviewee_id UUID REFERENCES user_profiles(id),
    submission_id UUID,
    submission_type VARCHAR(50),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    criteria_scores JSONB,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- AI TUTOR TABLES (Phase 2)
-- ==============================================

-- Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255),
    context_type VARCHAR(50),
    context_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    model_used VARCHAR(50),
    tokens_used INTEGER,
    referenced_content JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector Store for RAG
CREATE TABLE IF NOT EXISTS knowledge_vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    source_type VARCHAR(50),
    source_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- INDEXES
-- ==============================================

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course ON user_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

-- Vector similarity index
CREATE INDEX IF NOT EXISTS idx_knowledge_vectors_embedding ON knowledge_vectors USING ivfflat (embedding vector_cosine_ops);

-- ==============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_group_members ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses: Public read, admin write
CREATE POLICY "Courses are viewable by everyone" ON courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage courses" ON courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles WHERE id = auth.uid() AND metadata->>'role' = 'admin'
        )
    );

-- Modules & Lessons: Public read for published courses
CREATE POLICY "Modules viewable if course published" ON modules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM courses WHERE id = modules.course_id AND is_published = true
        )
    );

CREATE POLICY "Lessons viewable if course published" ON lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM modules m 
            JOIN courses c ON m.course_id = c.id 
            WHERE m.id = lessons.module_id AND c.is_published = true
        )
    );

-- User Progress: Users can only access their own
CREATE POLICY "Users can view own progress" ON user_course_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_course_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lesson progress" ON user_lesson_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" ON user_lesson_progress
    FOR ALL USING (auth.uid() = user_id);

-- Quiz Attempts: Users can only access their own
CREATE POLICY "Users can view own attempts" ON quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ebooks: Public read
CREATE POLICY "Ebooks are viewable by everyone" ON ebooks
    FOR SELECT USING (true);

-- Badges: Public read
CREATE POLICY "Badges are viewable by everyone" ON badges
    FOR SELECT USING (true);

CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

-- XP: Public read, own write
CREATE POLICY "XP is viewable by everyone" ON user_xp
    FOR SELECT USING (true);

CREATE POLICY "Users can update own XP" ON user_xp
    FOR ALL USING (auth.uid() = user_id);

-- Chat: Private to user
CREATE POLICY "Users can view own chats" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chats" ON chat_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_sessions WHERE id = chat_messages.session_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own messages" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions WHERE id = chat_messages.session_id AND user_id = auth.uid()
        )
    );

-- Study Groups
CREATE POLICY "Study groups are viewable by everyone" ON study_groups
    FOR SELECT USING (is_private = false);

CREATE POLICY "Members can view private groups" ON study_groups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM study_group_members WHERE group_id = study_groups.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage groups" ON study_groups
    FOR ALL USING (created_by = auth.uid());

-- ==============================================
-- FUNCTIONS & TRIGGERS
-- ==============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- XP Calculation Function
CREATE OR REPLACE FUNCTION calculate_level(p_total_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level = sqrt(xp / 100) rounded down
    RETURN FLOOR(SQRT(p_total_xp / 100.0)) + 1;
END;
$$ LANGUAGE plpgsql;

-- XP to Next Level Function
CREATE OR REPLACE FUNCTION xp_for_next_level(p_current_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- XP needed = (level ^ 2) * 100
    RETURN (p_current_level * p_current_level) * 100;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update level on XP change
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
DECLARE
    new_level INTEGER;
    next_level_xp INTEGER;
BEGIN
    new_level := calculate_level(NEW.total_xp);
    next_level_xp := xp_for_next_level(new_level);
    
    NEW.current_level := new_level;
    NEW.xp_to_next_level := next_level_xp;
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_level BEFORE UPDATE ON user_xp
    FOR EACH ROW EXECUTE FUNCTION update_user_level();

-- ==============================================
-- STORAGE BUCKETS
-- ==============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('avatars', 'avatars', true),
    ('course-content', 'course-content', true),
    ('ebooks', 'ebooks', true),
    ('certificates', 'certificates', true),
    ('badges', 'badges', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Avatar public access" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Course content public access" ON storage.objects
    FOR SELECT USING (bucket_id = 'course-content');

CREATE POLICY "Ebooks public access" ON storage.objects
    FOR SELECT USING (bucket_id = 'ebooks');

CREATE POLICY "Certificates accessible by owner" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'certificates' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- ==============================================
-- INITIAL DATA SEEDING (will be in separate file)
-- ==============================================

-- Note: Faculties and departments will be seeded separately
