-- =============================================
-- PPSDM KMM - MASTER MIGRATION V4 (THE HOLISTIC ARCHITECTURE)
-- Based on Detailed User Analysis (15 Tables, 9 Domains, Partitioning)
-- =============================================

-- 0. EXTENSIONS & SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- For monitoring (if allowed)
CREATE EXTENSION IF NOT EXISTS "vector"; -- Keep for AI features

-- =============================================
-- I. USER MANAGEMENT
-- =============================================

-- Tabel 1: USERS (Profiles linked to Auth)
-- Note: 'password_hash' omitted as Supabase Auth handles security credentials.
-- 'user_id' references auth.users to link with Supabase login.
CREATE TABLE IF NOT EXISTS public.users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nim VARCHAR(20) UNIQUE, -- Nullable initially if using Google Auth
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    faculty VARCHAR(50),           
    department VARCHAR(100),
    year_of_entry INTEGER,
    current_year INTEGER DEFAULT 1,
    gender VARCHAR(10),
    date_of_birth DATE,
    phone_number VARCHAR(20),
    
    -- Academic Information
    gpa DECIMAL(3,2),
    academic_status VARCHAR(20) DEFAULT 'active',
    
    -- System
    last_login TIMESTAMP,
    account_status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_nim ON public.users(nim);
CREATE INDEX IF NOT EXISTS idx_users_faculty ON public.users(faculty);
CREATE INDEX IF NOT EXISTS idx_users_year ON public.users(current_year);

-- Tabel 2: USER_PROFILES (Psychographics & History)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    
    -- Psychographic Data
    learning_style VARCHAR(50),
    personality_type VARCHAR(50),
    career_interests JSONB,
    
    -- Development History
    total_assessments_completed INTEGER DEFAULT 0,
    last_assessment_date DATE,
    holistic_score DECIMAL(5,2),
    
    -- Preferences
    notification_preferences JSONB,
    language_preference VARCHAR(10) DEFAULT 'id',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id)
);

-- =============================================
-- II. ASSESSMENT MANAGEMENT
-- =============================================

-- Tabel 3: ASSESSMENT_DOMAINS (9 Core Domains)
CREATE TABLE IF NOT EXISTS public.assessment_domains (
    domain_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_number INTEGER NOT NULL UNIQUE,
    domain_name VARCHAR(100) NOT NULL,
    domain_code VARCHAR(10) NOT NULL UNIQUE,  -- DIM1, DIM2, etc
    description TEXT,
    
    -- Assessment Configuration
    total_items INTEGER NOT NULL,
    estimated_time_minutes INTEGER NOT NULL,
    recommended_frequency VARCHAR(50),  -- once, monthly
    
    -- Subdimensions
    subdimensions JSONB NOT NULL,
    
    -- Psychometrics
    reliability_alpha DECIMAL(4,3),
    validity_coefficient DECIMAL(4,3),
    standard_error DECIMAL(5,2),
    norm_sample_size INTEGER,
    
    -- Versioning
    current_version VARCHAR(10) DEFAULT '1.0',
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel 4: ASSESSMENT_ITEMS
CREATE TABLE IF NOT EXISTS public.assessment_items (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID NOT NULL REFERENCES public.assessment_domains(domain_id) ON DELETE CASCADE,
    
    -- Item Identification
    item_code VARCHAR(10) NOT NULL,
    item_order INTEGER NOT NULL,
    subdimension VARCHAR(50) NOT NULL,
    
    -- Item Content
    item_text TEXT NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    response_options JSONB,
    scale_anchor JSONB,
    
    -- Validation
    difficulty DECIMAL(4,3),
    discrimination DECIMAL(4,3),
    
    -- Technical
    is_reverse_scored BOOLEAN DEFAULT FALSE,
    weight DECIMAL(4,3) DEFAULT 1.0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(domain_id, item_code)
);

CREATE INDEX IF NOT EXISTS idx_item_domain ON public.assessment_items(domain_id);

-- =============================================
-- III. RESPONSE & SCORING SYSTEM (Partitioned)
-- =============================================

-- FORCE DROP to ensure table is created as PARTITIONED (standard conversion not possible)
DROP TABLE IF EXISTS public.user_responses CASCADE;
DROP TABLE IF EXISTS public.assessment_sessions CASCADE;

-- Tabel 5: ASSESSMENT_SESSIONS
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    domain_id UUID NOT NULL REFERENCES public.assessment_domains(domain_id),
    
    start_time TIMESTAMP NOT NULL DEFAULT NOW(),
    completion_time TIMESTAMP,
    total_duration_seconds INTEGER,
    completion_status VARCHAR(20) DEFAULT 'in_progress',
    
    device_type VARCHAR(50),
    browser_info VARCHAR(100),
    ip_address INET,
    
    is_valid BOOLEAN DEFAULT TRUE,
    validity_issues JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Partitions for Sessions (Example for 2024-2026)
CREATE TABLE IF NOT EXISTS assessment_sessions_y2024 PARTITION OF public.assessment_sessions FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE IF NOT EXISTS assessment_sessions_y2025 PARTITION OF public.assessment_sessions FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE IF NOT EXISTS assessment_sessions_default PARTITION OF public.assessment_sessions DEFAULT;

-- Tabel 6: USER_RESPONSES
CREATE TABLE IF NOT EXISTS public.user_responses (
    response_id UUID DEFAULT gen_random_uuid(), -- Removed PK constraint for strict partitioning usually, but UUID helps.
    -- Better to make (session_id, item_id) PK in partitioning schemes or rely on composite
    session_id UUID NOT NULL, -- FK constraints can be tricky on partitions, keeping logical link
    item_id UUID NOT NULL REFERENCES public.assessment_items(item_id),
    
    response_value JSONB NOT NULL,
    response_time_ms INTEGER,
    
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
    skipped BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Partitions for Responses
CREATE TABLE IF NOT EXISTS user_responses_y2024 PARTITION OF public.user_responses FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
CREATE TABLE IF NOT EXISTS user_responses_y2025 PARTITION OF public.user_responses FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
CREATE TABLE IF NOT EXISTS user_responses_default PARTITION OF public.user_responses DEFAULT;

-- Tabel 7: ASSESSMENT_RESULTS
CREATE TABLE IF NOT EXISTS public.assessment_results (
    result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL, -- Logical link to partitioned session
    user_id UUID NOT NULL REFERENCES public.users(user_id),
    domain_id UUID NOT NULL REFERENCES public.assessment_domains(domain_id),
    
    composite_score DECIMAL(5,2) CHECK (composite_score BETWEEN 0 AND 100),
    percentile_rank DECIMAL(5,2) CHECK (percentile_rank BETWEEN 0 AND 100),
    
    subdimension_scores JSONB NOT NULL,
    
    development_category VARCHAR(50),
    development_level VARCHAR(30),
    color_code VARCHAR(7),
    
    reliability_estimate DECIMAL(4,3),
    confidence_interval JSONB,
    standard_error DECIMAL(5,2),
    
    norm_group VARCHAR(50),
    comparison_percentile DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dashboard_performance ON public.assessment_results(user_id, domain_id, created_at DESC);

-- Tabel 8: HOLISTIC_PROFILES
CREATE TABLE IF NOT EXISTS public.holistic_profiles (
    profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    
    holistic_score DECIMAL(5,2),
    holistic_percentile DECIMAL(5,2),
    last_calculated_date DATE NOT NULL,
    
    domain_scores JSONB NOT NULL,
    strengths JSONB,
    development_areas JSONB,
    profile_pattern VARCHAR(50),
    radar_chart_data JSONB,
    
    previous_score DECIMAL(5,2),
    progress_percentage DECIMAL(5,2),
    trend_direction VARCHAR(10),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- IV. NORMATIVE & RECOMMENDATION SYSTEM
-- =============================================

-- Tabel 9: NORMATIVE_DATA
CREATE TABLE IF NOT EXISTS public.normative_data (
    norm_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES public.assessment_domains(domain_id),
    
    norm_group VARCHAR(50) NOT NULL,
    faculty VARCHAR(50),
    year_level INTEGER,
    gender VARCHAR(10),
    sample_size INTEGER NOT NULL,
    
    mean_score DECIMAL(5,2) NOT NULL,
    standard_deviation DECIMAL(5,2) NOT NULL,
    
    percentile_cutoffs JSONB NOT NULL,
    
    valid_from DATE NOT NULL,
    valid_to DATE,
    is_current BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel 10: DEVELOPMENT_RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.development_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID REFERENCES public.assessment_domains(domain_id),
    
    score_range_low DECIMAL(5,2),
    score_range_high DECIMAL(5,2),
    subdimension VARCHAR(50),
    development_level VARCHAR(30),
    
    priority_level VARCHAR(20),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    action_items JSONB NOT NULL,
    resources JSONB,
    timeline VARCHAR(50),
    
    estimated_time_hours INTEGER,
    difficulty_level VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel 11: USER_RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.user_recommendations (
    user_recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    recommendation_id UUID REFERENCES public.development_recommendations(recommendation_id),
    result_id UUID REFERENCES public.assessment_results(result_id),
    
    status VARCHAR(20) DEFAULT 'pending',
    priority_level VARCHAR(20),
    
    assigned_date DATE NOT NULL,
    start_date DATE,
    completion_date DATE,
    progress_percentage INTEGER DEFAULT 0,
    
    user_rating INTEGER,
    user_feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- V. ETHICAL & ADMINISTRATIVE
-- =============================================

-- Tabel 12: INFORMED_CONSENTS
CREATE TABLE IF NOT EXISTS public.informed_consents (
    consent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(user_id),
    domain_id UUID REFERENCES public.assessment_domains(domain_id),
    
    consent_version VARCHAR(10) NOT NULL,
    consent_text TEXT NOT NULL,
    agreed BOOLEAN NOT NULL,
    agreed_at TIMESTAMP NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel 13: DATA_ACCESS_LOGS
CREATE TABLE IF NOT EXISTS public.data_access_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(user_id),
    
    action_type VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    
    old_values JSONB,
    new_values JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel 14: SYSTEM_CONFIGURATIONS
CREATE TABLE IF NOT EXISTS public.system_configurations (
    config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    config_type VARCHAR(50),
    description TEXT,
    scope VARCHAR(50) DEFAULT 'global',
    is_editable BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel 15: ANALYTICS_AGGREGATES
CREATE TABLE IF NOT EXISTS public.analytics_aggregates (
    aggregate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    aggregation_date DATE NOT NULL,
    aggregation_period VARCHAR(20) DEFAULT 'daily',
    faculty VARCHAR(50),
    year_level INTEGER,
    domain_id UUID REFERENCES public.assessment_domains(domain_id),
    
    total_users INTEGER DEFAULT 0,
    total_assessments INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2),
    average_score DECIMAL(5,2),
    score_distribution JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(aggregation_date, aggregation_period, faculty, year_level, domain_id)
);

-- =============================================
-- VI. SECURITY (RLS)
-- =============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holistic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users view own profile" ON public.users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users view own assessment data" ON public.assessment_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own sessions" ON public.assessment_sessions FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- VII. SEED DATA (9 DOMAINS)
-- =============================================
INSERT INTO public.assessment_domains (domain_number, domain_name, domain_code, total_items, estimated_time_minutes, subdimensions) VALUES
(1, 'Perkembangan Kognitif & Intelektual', 'DIM1', 8, 7, '["Critical Thinking", "Growth Mindset", "Creative Self-Efficacy", "Metacognitive Awareness"]'),
(2, 'Kecerdasan Emosional & Regulasi Diri', 'DIM2', 8, 7, '["Self-Emotional Awareness", "Emotion Regulation", "Empathy", "Intrinsic Motivation"]'),
(3, 'Kecerdasan Finansial', 'DIM3', 15, 20, '["Financial Knowledge", "Financial Behavior", "Financial Attitudes", "Engineering Finance"]'),
(4, 'Keterampilan Sosial & Kolaborasi', 'DIM4', 8, 7, '["Teamwork", "Communication", "Conflict Resolution"]'),
(5, 'Kepemimpinan & Pengaruh Sosial', 'DIM5', 8, 7, '["Leadership Styles", "Influence Strategies", "Ethical Leadership"]'),
(6, 'Adaptabilitas & Ketahanan', 'DIM6', 8, 7, '["Resilience", "Flexibility", "Stress Management"]'),
(7, 'Etika & Integritas Profesional', 'DIM7', 8, 7, '["Ethical Reasoning", "Professional Integrity", "Social Responsibility"]'),
(8, 'Orientasi Masa Depan & Karir', 'DIM8', 25, 18, '["Career Adaptability", "Future Time Perspective", "Career Planning", "Digital Literacy"]'),
(9, 'Kesejahteraan & Kesehatan Mental', 'DIM9', 8, 7, '["Psychological Wellbeing", "Stress Management", "Work-Life Balance"]')
ON CONFLICT (domain_code) DO UPDATE SET 
domain_name = EXCLUDED.domain_name,
subdimensions = EXCLUDED.subdimensions;

-- =============================================
-- VIII. TRIGGER FOR AUTH SYNC (Optional but Recommended)
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (user_id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: In Supabase, you must manually create the trigger in the dashboard or via API on auth.users
-- This script focuses on the 'public' schema structure.
