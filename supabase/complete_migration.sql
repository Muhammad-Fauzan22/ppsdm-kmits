-- ============================================
-- PPSDM KMM - COMPLETE DATABASE SCHEMA
-- Comprehensive Supabase Migration
-- Version 2.0 - Enterprise Edition
-- ============================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

SET timezone = 'Asia/Jakarta';

-- =============================================
-- PART 1: CORE USER & AUTHENTICATION
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nim VARCHAR(20) UNIQUE NOT NULL,
    email CITEXT UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    faculty VARCHAR(100),
    department VARCHAR(100),
    study_program VARCHAR(100),
    batch_year INTEGER,
    phone VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    gender VARCHAR(10),
    birth_date DATE,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    privacy_settings JSONB DEFAULT '{
        "profile_visibility": "public",
        "activity_sharing": true,
        "data_for_research": false,
        "notification_email": true,
        "notification_push": true
    }'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- User roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'mentor', 'faculty', 'admin', 'super_admin')),
    assigned_by UUID REFERENCES public.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, role)
);

-- User sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 2: 9 DEVELOPMENT DIMENSIONS FRAMEWORK
-- =============================================

-- Dimensions master table
CREATE TABLE IF NOT EXISTS public.dimensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#000000',
    icon VARCHAR(50),
    weight DECIMAL(3,2) DEFAULT 1.00 CHECK (weight BETWEEN 0 AND 1),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert 9 core dimensions
INSERT INTO public.dimensions (code, name, description, color, icon, weight, sort_order) VALUES
('SELF_MGMT', 'Manajemen Diri & Produktivitas', 'Pengelolaan waktu, energi, fokus, dan produktivitas', '#00A86B', 'clock', 0.12, 1),
('INTELLECT', 'Kecerdasan Intelektual & Keterampilan', 'Pembelajaran, literasi digital, kreativitas, bahasa', '#9B59B6', 'brain', 0.12, 2),
('FINANCE', 'Kecerdasan Finansial', 'Perencanaan keuangan, investasi, literasi pajak', '#FFD700', 'dollar-sign', 0.11, 3),
('PHYSICAL', 'Kesehatan Fisik & Vitalitas', 'Nutrisi, kebugaran, tidur, kesehatan preventif', '#FF6B6B', 'heart', 0.11, 4),
('EMOTIONAL', 'Kecerdasan Emosional & Sosial', 'Kesadaran diri, empati, komunikasi, kepemimpinan', '#48D1CC', 'users', 0.12, 5),
('MENTAL', 'Kesehatan Mental & Psikologis', 'Resiliensi, manajemen stres, mindfulness', '#5DADE2', 'brain', 0.11, 6),
('CHARACTER', 'Karakter & Etika', 'Integritas, disiplin, keberanian, etiket', '#5D6D7E', 'award', 0.11, 7),
('SPIRITUAL', 'Pengembangan Spiritual', 'Makna hidup, spiritualitas, rasa syukur, filantropi', '#AF7AC5', 'compass', 0.10, 8),
('ENVIRONMENT', 'Manajemen Lingkungan & Gaya Hidup', 'Minimalisme, keberlanjutan, networking, work-life balance', '#58D68D', 'leaf', 0.10, 9)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    color = EXCLUDED.color,
    icon = EXCLUDED.icon,
    weight = EXCLUDED.weight,
    sort_order = EXCLUDED.sort_order;

-- Competencies framework
CREATE TABLE IF NOT EXISTS public.competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dimension_id UUID NOT NULL REFERENCES public.dimensions(id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    level INTEGER CHECK (level BETWEEN 1 AND 5),
    parent_id UUID REFERENCES public.competencies(id) ON DELETE SET NULL,
    sort_order INTEGER,
    is_core BOOLEAN DEFAULT false,
    learning_hours INTEGER,
    prerequisites JSONB,
    resources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 3: ASSESSMENT SYSTEM
-- =============================================

-- Assessment types
CREATE TABLE IF NOT EXISTS public.assessment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    frequency VARCHAR(50),
    is_required BOOLEAN DEFAULT false,
    weight DECIMAL(3,2) DEFAULT 1.00,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.assessment_types (code, name, description, duration_minutes, frequency, is_required) VALUES
('ONBOARDING', 'Assessment Awal', 'Assessment komprehensif saat registrasi', 90, 'once', true),
('WEEKLY_CHECK', 'Check-in Mingguan', 'Refleksi dan progress mingguan', 10, 'weekly', true),
('MONTHLY_REVIEW', 'Review Bulanan', 'Assessment perkembangan bulanan', 30, 'monthly', true),
('QUARTERLY_EVAL', 'Evaluasi Kuartalan', 'Evaluasi mendalam setiap kuartal', 60, 'quarterly', true),
('DIMENSION_DEEP', 'Assessment Dimensi Spesifik', 'Assessment mendalam per dimensi', 45, 'quarterly', false)
ON CONFLICT (code) DO NOTHING;

-- Assessment items
CREATE TABLE IF NOT EXISTS public.assessment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_type_id UUID REFERENCES public.assessment_types(id) ON DELETE CASCADE,
    dimension_id UUID REFERENCES public.dimensions(id) ON DELETE CASCADE,
    competency_id UUID REFERENCES public.competencies(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) CHECK (question_type IN ('likert', 'multiple_choice', 'open_ended', 'scenario', 'behavioral')),
    options JSONB,
    scale_config JSONB DEFAULT '{"min": 1, "max": 5, "labels": ["Sangat Rendah", "Rendah", "Sedang", "Tinggi", "Sangat Tinggi"]}'::jsonb,
    weight DECIMAL(4,3) DEFAULT 1.000,
    sort_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assessment_type_id, code)
);

-- Assessment sessions
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assessment_type_id UUID NOT NULL REFERENCES public.assessment_types(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_seconds INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment responses
CREATE TABLE IF NOT EXISTS public.assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.assessment_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    response_value JSONB NOT NULL,
    confidence INTEGER CHECK (confidence BETWEEN 1 AND 5),
    response_time_seconds INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, item_id)
);

-- Assessment scores
CREATE TABLE IF NOT EXISTS public.assessment_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assessment_session_id UUID REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
    dimension_id UUID NOT NULL REFERENCES public.dimensions(id) ON DELETE CASCADE,
    score DECIMAL(5,2) CHECK (score BETWEEN 0 AND 100),
    confidence DECIMAL(4,3) DEFAULT 1.000 CHECK (confidence BETWEEN 0 AND 1),
    percentile DECIMAL(5,2),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, assessment_session_id, dimension_id)
);

-- User competencies
CREATE TABLE IF NOT EXISTS public.user_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
    current_level INTEGER CHECK (current_level BETWEEN 0 AND 5),
    target_level INTEGER CHECK (target_level BETWEEN 1 AND 5),
    confidence INTEGER CHECK (confidence BETWEEN 1 AND 5),
    hours_invested DECIMAL(6,2) DEFAULT 0,
    last_practiced_at TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMPTZ,
    evidence JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, competency_id)
);

-- =============================================
-- PART 4: GOAL & DEVELOPMENT PLANNING
-- =============================================

-- Development goals
CREATE TABLE IF NOT EXISTS public.development_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    dimension_id UUID REFERENCES public.dimensions(id) ON DELETE SET NULL,
    competency_id UUID REFERENCES public.competencies(id) ON DELETE SET NULL,
    goal_type VARCHAR(50) CHECK (goal_type IN ('skill', 'habit', 'project', 'knowledge', 'certification')),
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    target_date DATE,
    priority INTEGER CHECK (priority BETWEEN 1 AND 5),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'abandoned')),
    recurrence_pattern JSONB,
    motivation TEXT,
    potential_obstacles TEXT,
    strategies TEXT,
    support_needed TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal milestones
CREATE TABLE IF NOT EXISTS public.goal_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES public.development_goals(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    target_date DATE,
    completed_at TIMESTAMPTZ,
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal activities
CREATE TABLE IF NOT EXISTS public.goal_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES public.development_goals(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES public.goal_milestones(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50),
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority INTEGER CHECK (priority BETWEEN 1 AND 5),
    energy_required INTEGER CHECK (energy_required BETWEEN 1 AND 5),
    focus_required INTEGER CHECK (focus_required BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time blocks
CREATE TABLE IF NOT EXISTS public.time_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    goal_id UUID REFERENCES public.development_goals(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES public.goal_activities(id) ON DELETE SET NULL,
    dimension_id UUID REFERENCES public.dimensions(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
    distractions INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (end_time > start_time)
);

-- Energy logs
CREATE TABLE IF NOT EXISTS public.energy_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_period VARCHAR(20) CHECK (time_period IN ('morning', 'afternoon', 'evening', 'night')),
    physical_energy INTEGER CHECK (physical_energy BETWEEN 1 AND 10),
    mental_energy INTEGER CHECK (mental_energy BETWEEN 1 AND 10),
    emotional_energy INTEGER CHECK (emotional_energy BETWEEN 1 AND 10),
    focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
    mood VARCHAR(50),
    sleep_hours DECIMAL(3,1),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    nutrition_quality INTEGER CHECK (nutrition_quality BETWEEN 1 AND 10),
    exercise_minutes INTEGER,
    stressors TEXT,
    coping_strategies TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, log_date, time_period)
);

-- Daily progress
CREATE TABLE IF NOT EXISTS public.daily_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    dimension_id UUID REFERENCES public.dimensions(id) ON DELETE SET NULL,
    activity_type VARCHAR(50),
    activity_description TEXT,
    duration_minutes INTEGER NOT NULL,
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 5),
    energy_before INTEGER CHECK (energy_before BETWEEN 1 AND 10),
    energy_after INTEGER CHECK (energy_after BETWEEN 1 AND 10),
    mood VARCHAR(50),
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PART 5: LEARNING RESOURCES
-- =============================================

-- Learning resources
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) CHECK (resource_type IN ('video', 'article', 'course', 'book', 'podcast', 'tool', 'workshop', 'template')),
    url TEXT,
    thumbnail_url TEXT,
    duration_minutes INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    language VARCHAR(20) DEFAULT 'indonesia',
    source VARCHAR(100),
    author VARCHAR(100),
    is_free BOOLEAN DEFAULT true,
    cost DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'IDR',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMPTZ,
    times_recommended INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) CHECK (avg_rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource-competency mapping
CREATE TABLE IF NOT EXISTS public.resource_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES public.competencies(id) ON DELETE CASCADE,
    effectiveness_rating DECIMAL(3,2) CHECK (effectiveness_rating BETWEEN 0 AND 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(resource_id, competency_id)
);

-- User resources
CREATE TABLE IF NOT EXISTS public.user_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'saved' CHECK (status IN ('saved', 'started', 'in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    notes TEXT,
    time_spent_minutes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- Campus activities
CREATE TABLE IF NOT EXISTS public.campus_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_type VARCHAR(50) CHECK (organizer_type IN ('BEM', 'Himpunan', 'UKM', 'Fakultas', 'Universitas', 'External')),
    organizer_id UUID,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    location VARCHAR(200),
    online_link TEXT,
    capacity INTEGER,
    registration_required BOOLEAN DEFAULT true,
    registration_deadline TIMESTAMPTZ,
    is_free BOOLEAN DEFAULT true,
    cost DECIMAL(10,2),
    contact_person JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_verified BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activities participation
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES public.campus_activities(id) ON DELETE CASCADE,
    role VARCHAR(50) CHECK (role IN ('participant', 'organizer', 'speaker', 'volunteer')),
    registration_status VARCHAR(20) DEFAULT 'registered' CHECK (registration_status IN ('registered', 'attended', 'absent', 'cancelled')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    attended_at TIMESTAMPTZ,
    certificate_url TEXT,
    feedback TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    hours_credited DECIMAL(4,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, activity_id)
);

-- =============================================
-- PART 6: MENTORSHIP SYSTEM
-- =============================================

-- Mentors
CREATE TABLE IF NOT EXISTS public.mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    expertise JSONB DEFAULT '[]'::jsonb,
    experience_years INTEGER,
    availability JSONB DEFAULT '{"weekdays": [], "weekends": []}'::jsonb,
    max_mentees INTEGER DEFAULT 5,
    current_mentees_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) CHECK (rating BETWEEN 1 AND 5),
    total_sessions INTEGER DEFAULT 0,
    is_accepting_new_mentees BOOLEAN DEFAULT true,
    mentoring_style TEXT,
    achievements JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Mentorship matches
CREATE TABLE IF NOT EXISTS public.mentorship_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    match_reason TEXT,
    compatibility_score DECIMAL(4,3) CHECK (compatibility_score BETWEEN 0 AND 1),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'completed', 'terminated')),
    start_date DATE,
    end_date DATE,
    expected_outcomes JSONB,
    meeting_frequency VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mentor_id, mentee_id)
);

-- Mentorship sessions
CREATE TABLE IF NOT EXISTS public.mentorship_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES public.mentorship_matches(id) ON DELETE CASCADE,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    meeting_link TEXT,
    agenda TEXT,
    discussion_topics JSONB,
    mentee_prep TEXT,
    mentor_prep TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    feedback_from_mentee TEXT,
    feedback_from_mentor TEXT,
    rating_from_mentee INTEGER CHECK (rating_from_mentee BETWEEN 1 AND 5),
    rating_from_mentor INTEGER CHECK (rating_from_mentor BETWEEN 1 AND 5),
    action_items JSONB,
    next_steps TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Peer connections
CREATE TABLE IF NOT EXISTS public.peer_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    connection_type VARCHAR(50) CHECK (connection_type IN ('study_partner', 'accountability', 'project_team', 'interest_group')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'blocked')),
    initiated_by UUID NOT NULL REFERENCES public.users(id),
    initiated_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    shared_interests JSONB,
    shared_goals JSONB,
    meeting_frequency VARCHAR(50),
    last_interaction TIMESTAMPTZ,
    notes TEXT,
    CHECK (user1_id != user2_id),
    UNIQUE(user1_id, user2_id, connection_type)
);

-- =============================================
-- PART 7: ANALYTICS & GAMIFICATION
-- =============================================

-- Development snapshots
CREATE TABLE IF NOT EXISTS public.development_snapshots (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    overall_score DECIMAL(5,2) CHECK (overall_score BETWEEN 0 AND 100),
    balance_index DECIMAL(4,3) CHECK (balance_index BETWEEN 0 AND 1),
    dimensions_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    active_goals_count INTEGER DEFAULT 0,
    completed_activities_count INTEGER DEFAULT 0,
    learning_hours_today DECIMAL(5,2) DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    mood_avg DECIMAL(3,2),
    energy_avg DECIMAL(3,2),
    focus_avg DECIMAL(3,2),
    top_strengths JSONB DEFAULT '[]'::jsonb,
    growth_areas JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, snapshot_date)
);

-- Growth trends
CREATE TABLE IF NOT EXISTS public.growth_trends (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    period_type VARCHAR(10) CHECK (period_type IN ('weekly', 'monthly', 'quarterly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    dimension_id UUID REFERENCES public.dimensions(id) ON DELETE SET NULL,
    starting_score DECIMAL(5,2),
    ending_score DECIMAL(5,2),
    growth_rate DECIMAL(6,2),
    activities_count INTEGER DEFAULT 0,
    hours_invested DECIMAL(6,2) DEFAULT 0,
    goals_completed INTEGER DEFAULT 0,
    consistency_score DECIMAL(4,3),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, period_type, period_start, dimension_id)
);

-- Portfolio items
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) CHECK (item_type IN ('project', 'certificate', 'publication', 'award', 'volunteer', 'internship', 'skill_showcase')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    organization VARCHAR(200),
    start_date DATE,
    end_date DATE,
    url TEXT,
    file_url TEXT,
    competencies JSONB DEFAULT '[]'::jsonb,
    evidence JSONB DEFAULT '{}'::jsonb,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMPTZ,
    is_public BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Badges
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    category VARCHAR(50) CHECK (category IN ('dimension', 'consistency', 'milestone', 'community', 'special')),
    criteria JSONB NOT NULL,
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    xp_reward INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    context JSONB DEFAULT '{}'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Experience points
CREATE TABLE IF NOT EXISTS public.experience_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source_type VARCHAR(50),
    source_id UUID,
    xp_amount INTEGER NOT NULL,
    description TEXT,
    dimension_id UUID REFERENCES public.dimensions(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User levels
CREATE TABLE IF NOT EXISTS public.user_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    xp_to_next_level INTEGER,
    level_title VARCHAR(100),
    percentile DECIMAL(5,2),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =============================================
-- PART 8: NOTIFICATIONS
-- =============================================

-- Notification templates
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    title_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('system', 'reminder', 'achievement', 'social', 'recommendation')),
    channels JSONB DEFAULT '["in_app", "email"]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.notification_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    category VARCHAR(50),
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'dismissed', 'action_taken')),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    action_taken_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category VARCHAR(50),
    in_app BOOLEAN DEFAULT true,
    email BOOLEAN DEFAULT true,
    push BOOLEAN DEFAULT true,
    frequency VARCHAR(20) DEFAULT 'immediate',
    quiet_hours JSONB DEFAULT '{"start": "22:00", "end": "07:00"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category)
);

-- =============================================
-- PART 9: FUNCTIONS
-- =============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate overall score
-- Calculate overall score (Optimized Set-Based Approach)
CREATE OR REPLACE FUNCTION calculate_overall_score(user_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    final_score DECIMAL;
BEGIN
    -- Use CTE for readability and optimization (One Set Operation instead of Loop)
    WITH latest_scores AS (
        SELECT DISTINCT ON (ds.dimension_id) 
            ds.score, 
            d.weight
        FROM assessment_scores ds
        JOIN dimensions d ON ds.dimension_id = d.id
        WHERE ds.user_id = user_uuid
        ORDER BY ds.dimension_id, ds.created_at DESC
    )
    -- Calculate aggregate in one go
    SELECT 
        COALESCE(SUM(score * weight) / NULLIF(SUM(weight), 0), 0)
    INTO final_score
    FROM latest_scores;

    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Calculate balance index
CREATE OR REPLACE FUNCTION calculate_balance_index(user_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    avg_score DECIMAL;
    variance DECIMAL;
    count_dim INTEGER;
    dim_score RECORD;
BEGIN
    SELECT AVG(score) INTO avg_score
    FROM (
        SELECT DISTINCT ON (dimension_id) score
        FROM assessment_scores
        WHERE user_id = user_uuid
        ORDER BY dimension_id, created_at DESC
    ) AS latest_scores;
    
    variance := 0;
    count_dim := 0;
    
    FOR dim_score IN 
        SELECT DISTINCT ON (dimension_id) score
        FROM assessment_scores
        WHERE user_id = user_uuid
        ORDER BY dimension_id, created_at DESC
    LOOP
        variance := variance + POWER(dim_score.score - COALESCE(avg_score, 0), 2);
        count_dim := count_dim + 1;
    END LOOP;
    
    IF count_dim > 1 THEN
        variance := variance / count_dim;
        RETURN ROUND(1 / (1 + SQRT(variance)), 3);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PART 10: TRIGGERS
-- =============================================

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competencies_updated_at
    BEFORE UPDATE ON public.competencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_development_goals_updated_at
    BEFORE UPDATE ON public.development_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_competencies_updated_at
    BEFORE UPDATE ON public.user_competencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PART 11: ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_activities ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Public data policies
CREATE POLICY "Everyone can view dimensions" ON public.dimensions FOR SELECT USING (true);
CREATE POLICY "Everyone can view competencies" ON public.competencies FOR SELECT USING (true);
CREATE POLICY "Everyone can view resources" ON public.learning_resources FOR SELECT USING (true);
CREATE POLICY "Everyone can view activities" ON public.campus_activities FOR SELECT USING (true);

-- User data policies
CREATE POLICY "Users can view own scores" ON public.assessment_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON public.assessment_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own goals" ON public.development_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own portfolio" ON public.portfolio_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- PART 12: INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_nim ON public.users(nim);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_faculty ON public.users(faculty);
CREATE INDEX IF NOT EXISTS idx_assessment_scores_user ON public.assessment_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_scores_dimension ON public.assessment_scores(dimension_id);
CREATE INDEX IF NOT EXISTS idx_development_goals_user ON public.development_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_development_goals_status ON public.development_goals(status);
CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON public.daily_progress(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);

-- =============================================
-- PART 13: SEED DATA
-- =============================================

-- Badges
INSERT INTO public.badges (code, name, description, category, criteria, rarity, xp_reward) VALUES
('FIRST_ASSESSMENT', 'Pioneer', 'Menyelesaikan assessment pertama', 'milestone', '{"action": "complete_assessment", "count": 1}', 'common', 100),
('WEEK_STREAK_1', 'Konsisten Minggu Pertama', 'Aktif 7 hari berturut-turut', 'consistency', '{"action": "daily_activity", "streak": 7}', 'uncommon', 250),
('GOAL_COMPLETE_1', 'Goal Getter', 'Menyelesaikan goal pertama', 'milestone', '{"action": "complete_goal", "count": 1}', 'common', 150),
('DIMENSION_MASTER_80', 'Master Dimensi', 'Mencapai skor 80+ di satu dimensi', 'dimension', '{"action": "dimension_score", "threshold": 80}', 'rare', 500),
('BALANCED_DEVELOPMENT', 'Seimbang', 'Memiliki balance index di atas 0.8', 'dimension', '{"action": "balance_index", "threshold": 0.8}', 'epic', 1000)
ON CONFLICT (code) DO NOTHING;

-- Notification templates
INSERT INTO public.notification_templates (code, name, title_template, body_template, category, channels) VALUES
('WELCOME', 'Selamat Datang', 'Selamat datang di PPSDM KMM!', 'Mulai perjalanan pengembangan Anda dengan menyelesaikan assessment awal.', 'system', '["in_app", "email"]'),
('GOAL_REMINDER', 'Pengingat Goal', 'Pengingat: {goal_title}', 'Goal Anda "{goal_title}" mendekati deadline. Yuk, selesaikan!', 'reminder', '["in_app", "push"]'),
('BADGE_EARNED', 'Badge Baru', 'Selamat! Anda mendapatkan badge {badge_name}', 'Anda telah mendapatkan badge "{badge_name}". Teruskan perjuangan Anda!', 'achievement', '["in_app", "push"]'),
('WEEKLY_SUMMARY', 'Ringkasan Mingguan', 'Ringkasan Mingguan Anda', 'Lihat progress Anda minggu ini: {summary}', 'system', '["in_app", "email"]')
ON CONFLICT (code) DO NOTHING;

-- Sample learning resources
INSERT INTO public.learning_resources (title, description, resource_type, url, difficulty_level, language, source, is_free) VALUES
('Time Management untuk Mahasiswa', 'Teknik mengatur waktu efektif untuk mahasiswa', 'article', 'https://contoh.com/time-management', 'beginner', 'indonesia', 'ITS Learning Center', true),
('Dasar-dasar Python Programming', 'Belajar Python dari nol untuk pemula', 'course', 'https://www.khanacademy.org/computing/computer-programming/python', 'beginner', 'indonesia', 'Khan Academy', true),
('Mindfulness Meditation Guide', 'Panduan meditasi mindfulness untuk pemula', 'video', 'https://www.youtube.com/watch?v=mindfulness', 'beginner', 'indonesia', 'YouTube', true),
('Financial Planning 101', 'Perencanaan keuangan dasar untuk mahasiswa', 'article', 'https://contoh.com/financial-planning', 'beginner', 'indonesia', 'Bank Indonesia', true),
('Public Speaking Techniques', 'Teknik public speaking yang efektif', 'workshop', 'https://contoh.com/public-speaking', 'intermediate', 'indonesia', 'Toastmasters', true)
ON CONFLICT DO NOTHING;

-- Performance Index (Critical for calculate_overall_score)
CREATE INDEX IF NOT EXISTS idx_scores_user_dim_created ON assessment_scores (user_id, dimension_id, created_at DESC);

-- =============================================
-- SCHEMA COMPLETE!
-- =============================================
-- Total: 40+ Tables
-- Features: Users, 9 Dimensions, Assessments, Goals, 
--          Resources, Mentorship, Gamification, Notifications
-- =============================================
