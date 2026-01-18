-- ============================================
-- PPSDM KMM - Complete Supabase Setup Script
-- ============================================
-- Jalankan script ini di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================

-- =============================================
-- BAGIAN 1: EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- BAGIAN 2: ENUM TYPES
-- =============================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'lecturer', 'admin', 'mentor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dimension_type AS ENUM (
        'cognitive', 'affective', 'psychomotor', 'spiritual',
        'social', 'financial', 'health', 'character', 'environmental'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE activity_status AS ENUM ('upcoming', 'in-progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE program_status AS ENUM ('draft', 'active', 'completed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mood_type AS ENUM ('very_happy', 'happy', 'neutral', 'sad', 'very_sad');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('achievement', 'reminder', 'feedback', 'system', 'program');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================
-- BAGIAN 3: TABEL UTAMA
-- =============================================

-- 3.1 Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    nrp TEXT UNIQUE, -- Nomor Registrasi Pokok (Student ID)
    avatar_url TEXT,
    department TEXT,
    faculty TEXT,
    semester INTEGER DEFAULT 1 CHECK (semester >= 0 AND semester <= 14),
    role user_role DEFAULT 'student',
    bio TEXT,
    phone TEXT,
    
    -- Gamification
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE,
    
    -- Settings
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'id',
    theme TEXT DEFAULT 'system',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Dimension Scores (9 Dimensi)
CREATE TABLE IF NOT EXISTS public.dimension_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    dimension dimension_type NOT NULL,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    previous_score INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, dimension)
);

-- 3.3 Activities
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    dimension dimension_type NOT NULL,
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    status activity_status DEFAULT 'upcoming',
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    completed_at TIMESTAMPTZ,
    evidence_url TEXT, -- Link to proof/evidence
    verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Programs
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    category TEXT NOT NULL,
    dimensions dimension_type[] DEFAULT '{}', -- Multiple dimensions
    status program_status DEFAULT 'draft',
    start_date DATE NOT NULL,
    end_date DATE,
    registration_deadline DATE,
    location TEXT,
    is_online BOOLEAN DEFAULT false,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    points_reward INTEGER DEFAULT 0,
    image_url TEXT,
    requirements TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Program Enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'enrolled' CHECK (status IN ('pending', 'enrolled', 'completed', 'dropped', 'rejected')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    attendance_count INTEGER DEFAULT 0,
    certificate_url TEXT,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, program_id)
);

-- 3.6 Mentorship Relations
CREATE TABLE IF NOT EXISTS public.mentorship_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'inactive', 'completed')),
    notes TEXT,
    meeting_frequency TEXT DEFAULT 'weekly',
    next_meeting_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mentor_id, mentee_id)
);

-- 3.7 Mentorship Sessions
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relation_id UUID NOT NULL REFERENCES public.mentorship_relations(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location TEXT,
    is_online BOOLEAN DEFAULT false,
    meeting_link TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    agenda TEXT,
    notes TEXT,
    mentor_feedback TEXT,
    mentee_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 Badges
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT NOT NULL,
    color TEXT DEFAULT '#330066',
    category TEXT DEFAULT 'general',
    requirement_type TEXT CHECK (requirement_type IN ('activity_count', 'score_threshold', 'streak', 'program_completion', 'special')),
    requirement_value INTEGER DEFAULT 0,
    requirement_dimension dimension_type,
    points_reward INTEGER DEFAULT 0,
    rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9 User Badges
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    displayed BOOLEAN DEFAULT true,
    UNIQUE(user_id, badge_id)
);

-- 3.10 Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type DEFAULT 'system',
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.11 Reflection Entries
CREATE TABLE IF NOT EXISTS public.reflection_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    mood mood_type,
    dimension dimension_type,
    is_private BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.12 RPI Goals (Rencana Pengembangan Individu)
CREATE TABLE IF NOT EXISTS public.rpi_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    dimension dimension_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    milestones JSONB DEFAULT '[]',
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in-progress', 'achieved', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    mentor_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.13 Portfolio Sections
CREATE TABLE IF NOT EXISTS public.portfolio_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    section_type TEXT CHECK (section_type IN ('about', 'experience', 'education', 'skills', 'achievements', 'projects', 'certifications')),
    title TEXT NOT NULL,
    content JSONB DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.14 Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    to_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.15 Points History (Audit Trail)
CREATE TABLE IF NOT EXISTS public.points_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    source_type TEXT, -- 'activity', 'program', 'badge', 'admin'
    source_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BAGIAN 4: INDEXES untuk Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_nrp ON public.profiles(nrp);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_dimension_scores_user ON public.dimension_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_dimension_scores_dimension ON public.dimension_scores(dimension);

CREATE INDEX IF NOT EXISTS idx_activities_user ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_status ON public.activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_dimension ON public.activities(dimension);
CREATE INDEX IF NOT EXISTS idx_activities_due_date ON public.activities(due_date);

CREATE INDEX IF NOT EXISTS idx_programs_status ON public.programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_category ON public.programs(category);

CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program ON public.enrollments(program_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

CREATE INDEX IF NOT EXISTS idx_rpi_goals_user ON public.rpi_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_rpi_goals_semester ON public.rpi_goals(semester);

CREATE INDEX IF NOT EXISTS idx_mentorship_mentor ON public.mentorship_relations(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_mentee ON public.mentorship_relations(mentee_id);

-- =============================================
-- BAGIAN 5: ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dimension_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflection_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rpi_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;

-- =============================================
-- BAGIAN 6: RLS POLICIES
-- =============================================

-- Profiles Policies
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by all" 
    ON public.profiles FOR SELECT 
    USING (true);

-- Dimension Scores Policies
CREATE POLICY "Users can view own scores" 
    ON public.dimension_scores FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own scores" 
    ON public.dimension_scores FOR UPDATE 
    USING (auth.uid() = user_id);

-- Activities Policies
CREATE POLICY "Users can manage own activities" 
    ON public.activities FOR ALL 
    USING (auth.uid() = user_id);

-- Programs Policies
CREATE POLICY "Anyone can view active programs" 
    ON public.programs FOR SELECT 
    USING (status = 'active' OR created_by = auth.uid());

CREATE POLICY "Admins can manage programs" 
    ON public.programs FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'lecturer')
        )
    );

-- Enrollments Policies
CREATE POLICY "Users can view own enrollments" 
    ON public.enrollments FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" 
    ON public.enrollments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Badges Policies
CREATE POLICY "Anyone can view badges" 
    ON public.badges FOR SELECT 
    USING (true);

-- User Badges Policies
CREATE POLICY "Users can view own badges" 
    ON public.user_badges FOR SELECT 
    USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can manage own notifications" 
    ON public.notifications FOR ALL 
    USING (auth.uid() = user_id);

-- Reflection Entries Policies
CREATE POLICY "Users can manage own reflections" 
    ON public.reflection_entries FOR ALL 
    USING (auth.uid() = user_id);

-- RPI Goals Policies
CREATE POLICY "Users can manage own goals" 
    ON public.rpi_goals FOR ALL 
    USING (auth.uid() = user_id);

-- Portfolio Sections Policies
CREATE POLICY "Users can manage own portfolio" 
    ON public.portfolio_sections FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Public portfolios are viewable" 
    ON public.portfolio_sections FOR SELECT 
    USING (visible = true);

-- Mentorship Policies
CREATE POLICY "Mentors and mentees can view their relations" 
    ON public.mentorship_relations FOR SELECT 
    USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "View sessions for own mentorships" 
    ON public.mentorship_sessions FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.mentorship_relations 
            WHERE id = relation_id AND (mentor_id = auth.uid() OR mentee_id = auth.uid())
        )
    );

-- Feedback Policies
CREATE POLICY "Users can view feedback to them" 
    ON public.feedback FOR SELECT 
    USING (auth.uid() = to_user_id OR auth.uid() = from_user_id);

-- Points History Policies
CREATE POLICY "Users can view own points history" 
    ON public.points_history FOR SELECT 
    USING (auth.uid() = user_id);

-- =============================================
-- BAGIAN 7: FUNCTIONS
-- =============================================

-- 7.1 Function: Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Initialize dimension scores with 0
    INSERT INTO public.dimension_scores (user_id, dimension, score)
    SELECT NEW.id, d::dimension_type, 0
    FROM UNNEST(ARRAY['cognitive', 'affective', 'psychomotor', 'spiritual', 'social', 'financial', 'health', 'character', 'environmental']) AS d;
    
    -- Send welcome notification
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (
        NEW.id,
        'system',
        'Selamat Datang di PPSDM KMM! 🎉',
        'Mulai perjalanan pengembangan holistik Anda sekarang.'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.2 Function: Update profile timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7.3 Function: Award points to user
CREATE OR REPLACE FUNCTION public.award_points(
    p_user_id UUID,
    p_points INTEGER,
    p_reason TEXT,
    p_source_type TEXT DEFAULT NULL,
    p_source_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Update total points
    UPDATE public.profiles 
    SET total_points = total_points + p_points,
        level = FLOOR((total_points + p_points) / 100) + 1
    WHERE id = p_user_id;
    
    -- Record in history
    INSERT INTO public.points_history (user_id, points, reason, source_type, source_id)
    VALUES (p_user_id, p_points, p_reason, p_source_type, p_source_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.4 Function: Check and award badges
CREATE OR REPLACE FUNCTION public.check_badge_eligibility(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_badge RECORD;
    v_count INTEGER;
    v_score INTEGER;
BEGIN
    FOR v_badge IN SELECT * FROM public.badges LOOP
        -- Skip if already earned
        IF EXISTS (SELECT 1 FROM public.user_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN
            CONTINUE;
        END IF;
        
        -- Check eligibility based on requirement type
        CASE v_badge.requirement_type
            WHEN 'activity_count' THEN
                SELECT COUNT(*) INTO v_count FROM public.activities 
                WHERE user_id = p_user_id AND status = 'completed';
                IF v_count >= v_badge.requirement_value THEN
                    INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
                    PERFORM public.award_points(p_user_id, v_badge.points_reward, 'Badge: ' || v_badge.name, 'badge', v_badge.id);
                END IF;
                
            WHEN 'score_threshold' THEN
                IF v_badge.requirement_dimension IS NOT NULL THEN
                    SELECT score INTO v_score FROM public.dimension_scores 
                    WHERE user_id = p_user_id AND dimension = v_badge.requirement_dimension;
                ELSE
                    SELECT ROUND(AVG(score)) INTO v_score FROM public.dimension_scores WHERE user_id = p_user_id;
                END IF;
                IF v_score >= v_badge.requirement_value THEN
                    INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
                    PERFORM public.award_points(p_user_id, v_badge.points_reward, 'Badge: ' || v_badge.name, 'badge', v_badge.id);
                END IF;
                
            WHEN 'streak' THEN
                SELECT streak_days INTO v_count FROM public.profiles WHERE id = p_user_id;
                IF v_count >= v_badge.requirement_value THEN
                    INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, v_badge.id);
                    PERFORM public.award_points(p_user_id, v_badge.points_reward, 'Badge: ' || v_badge.name, 'badge', v_badge.id);
                END IF;
                
            ELSE NULL;
        END CASE;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.5 Function: Complete activity and award points
CREATE OR REPLACE FUNCTION public.complete_activity(p_activity_id UUID)
RETURNS void AS $$
DECLARE
    v_activity RECORD;
BEGIN
    SELECT * INTO v_activity FROM public.activities WHERE id = p_activity_id;
    
    IF v_activity.status != 'completed' THEN
        -- Mark as completed
        UPDATE public.activities SET status = 'completed', completed_at = NOW() WHERE id = p_activity_id;
        
        -- Award points
        PERFORM public.award_points(v_activity.user_id, v_activity.points, 'Completed: ' || v_activity.title, 'activity', p_activity_id);
        
        -- Update dimension score
        UPDATE public.dimension_scores 
        SET score = LEAST(score + 2, 100), updated_at = NOW()
        WHERE user_id = v_activity.user_id AND dimension = v_activity.dimension;
        
        -- Check for new badges
        PERFORM public.check_badge_eligibility(v_activity.user_id);
        
        -- Send notification
        INSERT INTO public.notifications (user_id, type, title, message)
        VALUES (v_activity.user_id, 'achievement', 'Activity Completed! 🎯', 'You earned ' || v_activity.points || ' points for completing ' || v_activity.title);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.6 Function: Get user stats
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'total_points', p.total_points,
        'level', p.level,
        'streak_days', p.streak_days,
        'activities_completed', (SELECT COUNT(*) FROM public.activities WHERE user_id = p_user_id AND status = 'completed'),
        'activities_in_progress', (SELECT COUNT(*) FROM public.activities WHERE user_id = p_user_id AND status = 'in-progress'),
        'badges_earned', (SELECT COUNT(*) FROM public.user_badges WHERE user_id = p_user_id),
        'programs_enrolled', (SELECT COUNT(*) FROM public.enrollments WHERE user_id = p_user_id),
        'average_score', (SELECT ROUND(AVG(score)) FROM public.dimension_scores WHERE user_id = p_user_id)
    ) INTO v_result
    FROM public.profiles p WHERE p.id = p_user_id;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- BAGIAN 8: TRIGGERS
-- =============================================

-- Trigger: Create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update timestamps
CREATE TRIGGER update_profiles_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_programs_timestamp
    BEFORE UPDATE ON public.programs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_rpi_goals_timestamp
    BEFORE UPDATE ON public.rpi_goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_portfolio_timestamp
    BEFORE UPDATE ON public.portfolio_sections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- BAGIAN 9: SEED DATA - BADGES
-- =============================================
INSERT INTO public.badges (name, description, icon, color, category, requirement_type, requirement_value, points_reward, rarity) VALUES
    ('First Step', 'Completed your first activity', 'flag', '#4CAF50', 'starter', 'activity_count', 1, 10, 'common'),
    ('Getting Started', 'Completed 5 activities', 'trending_up', '#2196F3', 'progress', 'activity_count', 5, 25, 'common'),
    ('Active Learner', 'Completed 10 activities', 'school', '#9C27B0', 'progress', 'activity_count', 10, 50, 'rare'),
    ('Dedicated', 'Completed 25 activities', 'star', '#FF9800', 'progress', 'activity_count', 25, 100, 'rare'),
    ('Champion', 'Completed 50 activities', 'emoji_events', '#F44336', 'progress', 'activity_count', 50, 200, 'epic'),
    ('Legend', 'Completed 100 activities', 'workspace_premium', '#FFD700', 'progress', 'activity_count', 100, 500, 'legendary'),
    
    ('Cognitive Master', 'Achieved 90+ cognitive score', 'psychology', '#3F51B5', 'dimension', 'score_threshold', 90, 75, 'epic'),
    ('Social Butterfly', 'Achieved 90+ social score', 'groups', '#00BCD4', 'dimension', 'score_threshold', 90, 75, 'epic'),
    ('Wellness Warrior', 'Achieved 90+ health score', 'fitness_center', '#4CAF50', 'dimension', 'score_threshold', 90, 75, 'epic'),
    ('Spiritual Guide', 'Achieved 90+ spiritual score', 'self_improvement', '#9C27B0', 'dimension', 'score_threshold', 90, 75, 'epic'),
    
    ('Week Streak', 'Maintained 7-day activity streak', 'local_fire_department', '#FF5722', 'streak', 'streak', 7, 50, 'rare'),
    ('Month Streak', 'Maintained 30-day activity streak', 'whatshot', '#E91E63', 'streak', 'streak', 30, 150, 'epic'),
    ('Consistent Learner', 'Maintained 5-day streak', 'update', '#607D8B', 'streak', 'streak', 5, 25, 'common'),
    
    ('Dean''s List', 'Average score above 85', 'military_tech', '#FFD700', 'achievement', 'score_threshold', 85, 100, 'epic'),
    ('Excellence', 'Average score above 90', 'diamond', '#E91E63', 'achievement', 'score_threshold', 90, 200, 'legendary')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- BAGIAN 10: VIEWS untuk Dashboard
-- =============================================

-- View: User Dashboard Summary
CREATE OR REPLACE VIEW public.user_dashboard AS
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.department,
    p.semester,
    p.total_points,
    p.level,
    p.streak_days,
    ROUND(AVG(ds.score)) as average_score,
    (SELECT COUNT(*) FROM public.activities a WHERE a.user_id = p.id AND a.status = 'completed') as completed_activities,
    (SELECT COUNT(*) FROM public.user_badges ub WHERE ub.user_id = p.id) as badges_count,
    (SELECT COUNT(*) FROM public.enrollments e WHERE e.user_id = p.id AND e.status = 'enrolled') as active_enrollments
FROM public.profiles p
LEFT JOIN public.dimension_scores ds ON ds.user_id = p.id
GROUP BY p.id;

-- View: Leaderboard
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.department,
    p.total_points,
    p.level,
    RANK() OVER (ORDER BY p.total_points DESC) as rank,
    (SELECT COUNT(*) FROM public.user_badges ub WHERE ub.user_id = p.id) as badges_count
FROM public.profiles p
WHERE p.role = 'student'
ORDER BY p.total_points DESC;

-- =============================================
-- SELESAI!
-- =============================================
-- Script ini telah membuat:
-- ✓ 15 Tabel utama
-- ✓ 6 Enum types
-- ✓ 15+ Indexes
-- ✓ Row Level Security untuk semua tabel
-- ✓ 20+ RLS Policies
-- ✓ 6 Functions
-- ✓ 5 Triggers
-- ✓ 15 Badges (seed data)
-- ✓ 2 Dashboard Views
-- ============================================
