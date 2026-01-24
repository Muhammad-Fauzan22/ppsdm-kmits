-- ============================================
-- COMPLETE DATABASE MIGRATION SCRIPT v6.0
-- PPSDM KMM - Holistic Student Development Engine
-- PostgreSQL 15+ with Supabase Extensions
-- Idempotent Migration for Production
-- ============================================

BEGIN;

-- ============================================
-- 1. CREATE EXTENSIONS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
-- Note: TimescaleDB and vector extensions require separate installation
-- CREATE EXTENSION IF NOT EXISTS "timescaledb";
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- 2. SYSTEM CONFIGURATION TABLES
-- ============================================

-- Global system configuration
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    config_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_json CHECK (
        (config_type = 'string' AND jsonb_typeof(config_value) = 'string') OR
        (config_type = 'number' AND jsonb_typeof(config_value) = 'number') OR
        (config_type = 'boolean' AND jsonb_typeof(config_value) = 'boolean') OR
        (config_type = 'array' AND jsonb_typeof(config_value) = 'array') OR
        (config_type = 'object' AND jsonb_typeof(config_value) = 'object')
    )
);

-- Version tracking for schema migrations
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    checksum VARCHAR(64)
);

-- ============================================
-- 3. USER MANAGEMENT SYSTEM (6 Tables)
-- ============================================

-- Extended user profiles (1:1 with Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Academic Information
    nim VARCHAR(20) UNIQUE,
    faculty VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    study_program VARCHAR(100),
    year_of_study INTEGER CHECK (year_of_study BETWEEN 1 AND 8),
    admission_year INTEGER,
    current_gpa DECIMAL(3,2) CHECK (current_gpa BETWEEN 0.00 AND 4.00),
    total_credits INTEGER DEFAULT 0,
    
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    phone_number VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    
    -- Contact Information
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    
    -- Preferences
    notification_preferences JSONB DEFAULT '{
        "email": true,
        "push": true,
        "sms": false,
        "newsletter": true
    }'::jsonb,
    
    privacy_settings JSONB DEFAULT '{
        "profile_visibility": "private",
        "share_scores": false,
        "share_activities": false
    }'::jsonb,
    
    language_preference VARCHAR(10) DEFAULT 'id',
    theme_preference VARCHAR(20) DEFAULT 'light',
    
    -- Status and Metadata
    account_status VARCHAR(20) DEFAULT 'active' 
        CHECK (account_status IN ('active', 'inactive', 'suspended', 'graduated')),
    last_login_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ,
    total_login_count INTEGER DEFAULT 0,
    
    -- Timestamps with versioning
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Indexes
    CONSTRAINT valid_nim_format CHECK (nim ~ '^[A-Z0-9]+$')
);

-- Create indexes for user queries
CREATE INDEX IF NOT EXISTS idx_users_faculty ON users(faculty);
CREATE INDEX IF NOT EXISTS idx_users_year ON users(year_of_study);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_gpa ON users(current_gpa DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);

-- User roles for RBAC
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT,
    permission_level INTEGER NOT NULL DEFAULT 0,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for user roles (many-to-many)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT valid_expiry CHECK (expires_at IS NULL OR expires_at > assigned_at)
);

-- Login attempts tracking for security
CREATE TABLE IF NOT EXISTS login_attempts (
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT,
    attempt_type VARCHAR(20) DEFAULT 'password' 
        CHECK (attempt_type IN ('password', 'otp', 'mfa', 'social')),
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Partition login_attempts by month for performance
-- NOTE: We will use basic table temporarily if partitions fail or standard partition if supported
CREATE TABLE IF NOT EXISTS login_attempts_2024 PARTITION OF login_attempts
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- MFA devices for two-factor authentication
CREATE TABLE IF NOT EXISTS mfa_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_type VARCHAR(20) NOT NULL 
        CHECK (device_type IN ('totp', 'sms', 'email', 'biometric', 'hardware')),
    device_name VARCHAR(100) NOT NULL,
    secret_key TEXT,
    backup_codes TEXT[],
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, device_type, device_name)
);

-- Comprehensive audit logs for security monitoring
CREATE TABLE IF NOT EXISTS auth_audit_logs (
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    severity VARCHAR(20) DEFAULT 'info' 
        CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions for audit logs
CREATE TABLE IF NOT EXISTS auth_audit_logs_2024 PARTITION OF auth_audit_logs
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE IF NOT EXISTS auth_audit_logs_2025 PARTITION OF auth_audit_logs
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS auth_audit_logs_default PARTITION OF auth_audit_logs
DEFAULT;

-- ============================================
-- 4. COMPREHENSIVE ASSESSMENT SYSTEM (8 Tables)
-- ============================================

-- Assessment domains (9 fixed dimensions)
CREATE TABLE IF NOT EXISTS assessment_domains (
    id SERIAL PRIMARY KEY,
    domain_code VARCHAR(10) UNIQUE NOT NULL,
    domain_name VARCHAR(100) NOT NULL,
    domain_name_en VARCHAR(100),
    description TEXT,
    description_en TEXT,
    color_hex VARCHAR(7) DEFAULT '#3B82F6',
    icon_name VARCHAR(50),
    
    -- Configuration
    total_items INTEGER NOT NULL DEFAULT 0,
    item_per_subdomain INTEGER NOT NULL DEFAULT 2,
    assessment_time_minutes INTEGER DEFAULT 10,
    weight DECIMAL(3,2) DEFAULT 1.00 CHECK (weight BETWEEN 0.00 AND 2.00),
    
    -- Psychometric Properties
    reliability_alpha DECIMAL(4,3),
    validity_coefficient DECIMAL(4,3),
    normative_mean DECIMAL(5,2),
    normative_sd DECIMAL(5,2),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment items (96 validated items)
CREATE TABLE IF NOT EXISTS assessment_items (
    id VARCHAR(20) PRIMARY KEY, -- Format: D1_CT1, D3_FK1, etc.
    domain_id INTEGER NOT NULL REFERENCES assessment_domains(id) ON DELETE CASCADE,
    
    -- Item Content
    item_type VARCHAR(30) NOT NULL 
        CHECK (item_type IN ('likert', 'multiple_choice', 'true_false', 'scenario', 'calculation')),
    item_text TEXT NOT NULL,
    item_text_en TEXT,
    
    -- Response Configuration
    options JSONB, -- For multiple choice: [{id: "a", text: "...", correct: false}, ...]
    likert_config JSONB DEFAULT '{
        "min": 1,
        "max": 5,
        "labels": ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"],
        "labels_en": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    }'::jsonb,
    
    -- Scoring
    correct_answer VARCHAR(10), -- For objective items
    points INTEGER DEFAULT 1,
    reverse_scored BOOLEAN DEFAULT FALSE,
    
    -- Psychometric Properties
    difficulty DECIMAL(3,2) CHECK (difficulty BETWEEN 0.00 AND 1.00),
    discrimination DECIMAL(3,2),
    factor_loading DECIMAL(3,2),
    item_total_correlation DECIMAL(3,2),
    reliability_alpha DECIMAL(4,3),
    
    -- Metadata
    source_reference TEXT,
    cultural_adaptation_notes TEXT,
    validation_sample_size INTEGER,
    validation_date DATE,
    
    -- Administration
    estimated_time_seconds INTEGER DEFAULT 30,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- Assessment sessions tracking
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain_id INTEGER REFERENCES assessment_domains(id),
    
    -- Session Details
    session_type VARCHAR(20) DEFAULT 'full' 
        CHECK (session_type IN ('full', 'partial', 'practice', 'retest')),
    assessment_version INTEGER DEFAULT 1,
    language VARCHAR(2) DEFAULT 'id',
    
    -- Progress Tracking
    current_item_index INTEGER DEFAULT 0,
    total_items INTEGER NOT NULL,
    completed_items INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Timing
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    total_duration_seconds INTEGER,
    average_item_time_seconds DECIMAL(6,2),
    
    -- Status
    status VARCHAR(20) DEFAULT 'in_progress' 
        CHECK (status IN ('in_progress', 'completed', 'abandoned', 'timed_out')),
    
    -- Flags
    is_proctored BOOLEAN DEFAULT FALSE,
    is_timed BOOLEAN DEFAULT TRUE,
    allow_backtracking BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions for assessment sessions
CREATE TABLE IF NOT EXISTS assessment_sessions_2024 PARTITION OF assessment_sessions
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE IF NOT EXISTS assessment_sessions_2025 PARTITION OF assessment_sessions
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS assessment_sessions_default PARTITION OF assessment_sessions
DEFAULT;

-- Individual assessment responses
CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(20) NOT NULL REFERENCES assessment_items(id),
    
    -- Response Data
    response_value JSONB NOT NULL, -- Can be integer, string, or object
    response_time_ms INTEGER NOT NULL,
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
    
    -- Scoring
    is_correct BOOLEAN,
    points_earned DECIMAL(5,2) DEFAULT 0.00,
    auto_scored BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    sequence_number INTEGER NOT NULL,
    displayed_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key with partition reference
    FOREIGN KEY (session_id, user_id) REFERENCES assessment_sessions(id, user_id),
    
    -- Ensure session_id matches partition
    CONSTRAINT check_session_partition CHECK (
        EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM (
            SELECT created_at FROM assessment_sessions WHERE id = session_id
        ))
    ),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create matching partitions for responses
CREATE TABLE IF NOT EXISTS assessment_responses_2024 PARTITION OF assessment_responses
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE IF NOT EXISTS assessment_responses_2025 PARTITION OF assessment_responses
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS assessment_responses_default PARTITION OF assessment_responses
DEFAULT;

-- Dimension scores (composite scores per domain)
CREATE TABLE IF NOT EXISTS dimension_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain_id INTEGER NOT NULL REFERENCES assessment_domains(id),
    assessment_session_id UUID REFERENCES assessment_sessions(id),
    
    -- Scores
    raw_score DECIMAL(8,4) NOT NULL,
    scaled_score DECIMAL(5,2) NOT NULL CHECK (scaled_score BETWEEN 0.00 AND 100.00),
    percentile DECIMAL(5,2) CHECK (percentile BETWEEN 0.00 AND 100.00),
    stanine INTEGER CHECK (stanine BETWEEN 1 AND 9),
    
    -- Interpretation
    category VARCHAR(50),
    description TEXT,
    recommendation TEXT,
    
    -- Confidence Intervals
    confidence_interval_lower DECIMAL(5,2),
    confidence_interval_upper DECIMAL(5,2),
    standard_error DECIMAL(5,2),
    
    -- Psychometric Properties
    reliability_estimate DECIMAL(4,3),
    validity_index DECIMAL(4,3),
    measurement_error DECIMAL(5,2),
    
    -- Comparison Data
    norm_group VARCHAR(50),
    faculty_comparison VARCHAR(50),
    year_comparison VARCHAR(50),
    
    -- Metadata
    assessment_version INTEGER DEFAULT 1,
    is_latest BOOLEAN DEFAULT TRUE,
    
    -- Timestamps with versioning
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_to TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, domain_id, assessment_session_id)
);

-- Historical dimension scores for longitudinal tracking
CREATE TABLE IF NOT EXISTS dimension_scores_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dimension_score_id UUID REFERENCES dimension_scores(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    domain_id INTEGER NOT NULL REFERENCES assessment_domains(id),
    
    -- Scores at historical point
    scaled_score DECIMAL(5,2) NOT NULL,
    percentile DECIMAL(5,2),
    category VARCHAR(50),
    
    -- Versioning
    version INTEGER NOT NULL,
    change_reason VARCHAR(100),
    changed_by UUID REFERENCES users(id),
    
    -- Validity period
    valid_from TIMESTAMPTZ NOT NULL,
    valid_to TIMESTAMPTZ NOT NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_date_range CHECK (valid_to > valid_from)
);

-- Normative data for benchmarking
CREATE TABLE IF NOT EXISTS normative_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id INTEGER NOT NULL REFERENCES assessment_domains(id),
    
    -- Norm Group Definition
    norm_group_name VARCHAR(100) NOT NULL,
    sample_size INTEGER NOT NULL,
    faculty_filter VARCHAR(100),
    year_filter VARCHAR(50),
    gender_filter VARCHAR(20),
    
    -- Statistical Properties
    mean DECIMAL(8,4) NOT NULL,
    standard_deviation DECIMAL(8,4) NOT NULL,
    min_score DECIMAL(8,4),
    max_score DECIMAL(8,4),
    skewness DECIMAL(8,4),
    kurtosis DECIMAL(8,4),
    
    -- Percentile Cutoffs
    percentile_99 DECIMAL(8,4),
    percentile_95 DECIMAL(8,4),
    percentile_90 DECIMAL(8,4),
    percentile_75 DECIMAL(8,4),
    percentile_50 DECIMAL(8,4),
    percentile_25 DECIMAL(8,4),
    percentile_10 DECIMAL(8,4),
    percentile_5 DECIMAL(8,4),
    percentile_1 DECIMAL(8,4),
    
    -- Category Cutoffs
    excellent_cutoff DECIMAL(8,4),
    good_cutoff DECIMAL(8,4),
    average_cutoff DECIMAL(8,4),
    needs_improvement_cutoff DECIMAL(8,4),
    
    -- Validity
    collection_start_date DATE NOT NULL,
    collection_end_date DATE NOT NULL,
    reliability_coefficient DECIMAL(4,3),
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(domain_id, norm_group_name, faculty_filter, year_filter, gender_filter),
    CONSTRAINT valid_date_range CHECK (collection_end_date > collection_start_date)
);

-- ============================================
-- 5. ECOLOGICAL TRACKING SYSTEM (3 Tables)
-- ============================================

-- Master ecological events table (the "black box")
CREATE TABLE IF NOT EXISTS ecological_events (
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Event Classification
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50) 
        CHECK (event_category IN ('academic', 'social', 'developmental', 'technical', 'system')),
    ecosystem_layer VARCHAR(50) NOT NULL 
        CHECK (ecosystem_layer IN ('microsystem', 'mesosystem', 'exosystem', 'macrosystem', 'chronosystem')),
    
    -- Entity Reference
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    
    -- Event Data
    event_data JSONB NOT NULL,
    metadata JSONB,
    
    -- Technical Context
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50),
    browser_version VARCHAR(50),
    os_version VARCHAR(50),
    screen_resolution VARCHAR(20),
    
    -- Geographical Context
    country_code VARCHAR(2),
    region VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Performance Metrics
    duration_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_code VARCHAR(50),
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    event_timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Session Tracking
    session_id VARCHAR(100),
    page_url TEXT,
    referrer_url TEXT,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions for ecological events
CREATE TABLE IF NOT EXISTS ecological_events_2024 PARTITION OF ecological_events
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE IF NOT EXISTS ecological_events_2025 PARTITION OF ecological_events
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS ecological_events_default PARTITION OF ecological_events
DEFAULT;

-- Event types taxonomy
CREATE TABLE IF NOT EXISTS event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    ecosystem_layer VARCHAR(50),
    
    -- Tracking Configuration
    is_trackable BOOLEAN DEFAULT TRUE,
    retention_days INTEGER DEFAULT 365,
    privacy_level VARCHAR(20) DEFAULT 'standard' 
        CHECK (privacy_level IN ('standard', 'sensitive', 'anonymous')),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Engagement metrics (pre-calculated for performance)
CREATE TABLE IF NOT EXISTS engagement_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Time Period
    metric_date DATE NOT NULL,
    time_period VARCHAR(20) NOT NULL 
        CHECK (time_period IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    
    -- Activity Metrics
    total_events INTEGER DEFAULT 0,
    unique_event_types INTEGER DEFAULT 0,
    total_duration_seconds INTEGER DEFAULT 0,
    
    -- Ecosystem Engagement
    microsystem_events INTEGER DEFAULT 0,
    mesosystem_events INTEGER DEFAULT 0,
    exosystem_events INTEGER DEFAULT 0,
    macrosystem_events INTEGER DEFAULT 0,
    chronosystem_events INTEGER DEFAULT 0,
    
    -- Category Breakdown
    academic_events INTEGER DEFAULT 0,
    social_events INTEGER DEFAULT 0,
    developmental_events INTEGER DEFAULT 0,
    
    -- Platform Usage
    mobile_events INTEGER DEFAULT 0,
    desktop_events INTEGER DEFAULT 0,
    tablet_events INTEGER DEFAULT 0,
    
    -- Performance Metrics
    avg_event_duration_ms DECIMAL(8,2),
    peak_activity_hour INTEGER,
    session_count INTEGER DEFAULT 0,
    
    -- Derived Metrics
    engagement_score DECIMAL(5,2) DEFAULT 0.00,
    consistency_score DECIMAL(5,2) DEFAULT 0.00,
    diversity_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Timestamps
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, metric_date, time_period)
);

-- ============================================
-- 6. LEARNING & LIBRARY SYSTEM (4 Tables)
-- ============================================

-- Books and learning resources
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn VARCHAR(20) UNIQUE,
    
    -- Book Metadata
    title VARCHAR(500) NOT NULL,
    title_en VARCHAR(500),
    author VARCHAR(500) NOT NULL,
    publisher VARCHAR(200),
    publication_year INTEGER,
    
    -- Content Information
    category VARCHAR(100),
    subcategory VARCHAR(100),
    tags VARCHAR(100)[],
    language VARCHAR(10) DEFAULT 'id',
    page_count INTEGER,
    word_count INTEGER,
    
    -- Educational Alignment
    target_domains INTEGER[],
    difficulty_level VARCHAR(20) 
        CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_reading_hours INTEGER,
    
    -- Digital Assets
    cover_image_url TEXT,
    pdf_url TEXT,
    epub_url TEXT,
    audio_url TEXT,
    
    -- Content Details
    description TEXT,
    description_en TEXT,
    table_of_contents JSONB,
    key_concepts TEXT[],
    
    -- Metrics
    total_reads INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) CHECK (average_rating BETWEEN 0.00 AND 5.00),
    average_completion_percentage DECIMAL(5,2),
    
    -- Status
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading progress tracking
CREATE TABLE IF NOT EXISTS reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    
    -- Progress Tracking
    current_page INTEGER DEFAULT 0,
    total_pages INTEGER NOT NULL,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Reading Metrics
    start_date DATE,
    last_read_date DATE,
    total_reading_time_minutes INTEGER DEFAULT 0,
    average_reading_speed_wpm INTEGER,
    
    -- Annotations
    bookmarks JSONB, -- {page: number, note: string, timestamp}
    highlights JSONB, -- {page: number, text: string, color: string}
    notes JSONB, -- {page: number, note: string, created_at}
    
    -- Engagement
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    would_recommend BOOLEAN,
    
    -- Status
    status VARCHAR(20) DEFAULT 'reading' 
        CHECK (status IN ('reading', 'completed', 'paused', 'abandoned')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, book_id)
);

-- Learning paths (structured learning sequences)
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path_code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Path Information
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_audience VARCHAR(100),
    
    -- Structure
    total_modules INTEGER DEFAULT 0,
    total_hours INTEGER DEFAULT 0,
    difficulty_level VARCHAR(20),
    
    -- Learning Outcomes
    learning_objectives TEXT[],
    target_domains INTEGER[],
    prerequisites TEXT[],
    
    -- Progression
    recommended_order INTEGER,
    unlock_conditions JSONB,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Metrics
    total_enrollments INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual development plans
CREATE TABLE IF NOT EXISTS development_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Plan Information
    plan_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Goals
    development_goals JSONB, -- Array of goals with metrics
    target_domains INTEGER[],
    
    -- Progress Tracking
    current_progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed_goals INTEGER DEFAULT 0,
    total_goals INTEGER DEFAULT 0,
    
    -- Resources
    assigned_books UUID[] REFERENCES books(id),
    assigned_paths UUID[] REFERENCES learning_paths(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' 
        CHECK (status IN ('draft', 'active', 'paused', 'completed', 'abandoned')),
    
    -- Review Information
    last_reviewed_at TIMESTAMPTZ,
    next_review_date DATE,
    review_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- ============================================
-- 7. PORTFOLIO SYSTEM (4 Tables)
-- ============================================

-- Student portfolios
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Portfolio Configuration
    portfolio_title VARCHAR(200) DEFAULT 'My Development Portfolio',
    about_me TEXT,
    career_objectives TEXT,
    
    -- Design & Layout
    template_id UUID,
    theme_color VARCHAR(7) DEFAULT '#3B82F6',
    layout_config JSONB,
    
    -- Visibility
    visibility VARCHAR(20) DEFAULT 'private' 
        CHECK (visibility IN ('private', 'shared', 'public')),
    share_token VARCHAR(100) UNIQUE,
    share_expires_at TIMESTAMPTZ,
    
    -- Metrics
    total_views INTEGER DEFAULT 0,
    unique_viewers INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    
    -- Status
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio sections (e.g., Education, Skills, Projects)
CREATE TABLE IF NOT EXISTS portfolio_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    
    -- Section Configuration
    section_type VARCHAR(50) NOT NULL 
        CHECK (section_type IN ('education', 'skills', 'projects', 'achievements', 'assessments', 'development')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Layout
    display_order INTEGER NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    layout_config JSONB,
    
    -- Content
    content_summary TEXT,
    item_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(portfolio_id, section_type)
);

-- Individual portfolio items
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES portfolio_sections(id) ON DELETE CASCADE,
    
    -- Item Content
    item_type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    
    -- Dates
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    institution VARCHAR(200),
    location VARCHAR(200),
    skills TEXT[],
    tags VARCHAR(50)[],
    
    -- Evidence/Proof
    evidence_url TEXT,
    evidence_type VARCHAR(50),
    verification_status VARCHAR(20) DEFAULT 'unverified' 
        CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
    
    -- Metrics
    impact_description TEXT,
    metrics JSONB,
    
    -- Display
    display_order INTEGER NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_date_range CHECK (
        end_date IS NULL OR 
        start_date IS NULL OR 
        end_date >= start_date
    )
);

-- Portfolio templates
CREATE TABLE IF NOT EXISTS portfolio_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Template Information
    template_name VARCHAR(100) NOT NULL,
    description TEXT,
    target_audience VARCHAR(100),
    
    -- Design
    theme_colors JSONB,
    layout_structure JSONB NOT NULL,
    default_sections JSONB NOT NULL,
    
    -- Assets
    preview_image_url TEXT,
    css_styles TEXT,
    
    -- Configuration
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    
    -- Usage Statistics
    total_uses INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. ANALYTICS & REPORTING SYSTEM (4 Tables)
-- ============================================

-- Analytics dashboards
CREATE TABLE IF NOT EXISTS analytics_dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dashboard Configuration
    dashboard_name VARCHAR(200) NOT NULL,
    description TEXT,
    dashboard_type VARCHAR(50) DEFAULT 'personal' 
        CHECK (dashboard_type IN ('personal', 'faculty', 'institutional', 'system')),
    
    -- Layout
    layout_config JSONB NOT NULL,
    widget_configs JSONB,
    
    -- Filters
    default_filters JSONB,
    time_range VARCHAR(50) DEFAULT 'last_30_days',
    
    -- Access Control
    is_shared BOOLEAN DEFAULT FALSE,
    shared_with UUID[],
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_accessed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data exports management
CREATE TABLE IF NOT EXISTS data_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Export Configuration
    export_type VARCHAR(50) NOT NULL 
        CHECK (export_type IN ('assessment', 'engagement', 'portfolio', 'comprehensive')),
    format VARCHAR(20) DEFAULT 'json' 
        CHECK (format IN ('json', 'csv', 'pdf', 'excel')),
    
    -- Filters
    date_range_start DATE,
    date_range_end DATE,
    filters JSONB,
    
    -- Content
    included_data_types TEXT[],
    custom_fields JSONB,
    
    -- Status Tracking
    status VARCHAR(20) DEFAULT 'pending' 
        CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'expired')),
    progress_percentage INTEGER DEFAULT 0,
    
    -- File Information
    file_size_bytes INTEGER,
    file_url TEXT,
    checksum VARCHAR(64),
    
    -- Security
    access_token VARCHAR(100) UNIQUE,
    expires_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    CONSTRAINT valid_date_range CHECK (
        date_range_end IS NULL OR 
        date_range_start IS NULL OR 
        date_range_end >= date_range_start
    )
);

-- Scheduled reports
CREATE TABLE IF NOT EXISTS scheduled_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Schedule Configuration
    report_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    schedule_frequency VARCHAR(20) NOT NULL 
        CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    
    -- Timing
    schedule_time TIME,
    schedule_day_of_week INTEGER CHECK (schedule_day_of_week BETWEEN 1 AND 7),
    schedule_day_of_month INTEGER CHECK (schedule_day_of_month BETWEEN 1 AND 31),
    
    -- Delivery
    delivery_method VARCHAR(20) DEFAULT 'email' 
        CHECK (delivery_method IN ('email', 'dashboard', 'webhook')),
    recipients TEXT[],
    email_template_id UUID,
    
    -- Content
    report_config JSONB NOT NULL,
    filters JSONB,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    total_runs INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Universal audit logs for data changes
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid(),
    
    -- Context
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_role VARCHAR(50),
    
    -- Action Details
    action_type VARCHAR(50) NOT NULL 
        CHECK (action_type IN ('create', 'update', 'delete', 'read', 'export')),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    
    -- Change Data
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Technical Context
    ip_address INET,
    user_agent TEXT,
    
    -- Location
    country_code VARCHAR(2),
    city VARCHAR(100),
    
    -- Metadata
    transaction_id VARCHAR(100),
    operation_duration_ms INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partitions for audit logs
CREATE TABLE IF NOT EXISTS audit_logs_2024 PARTITION OF audit_logs
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE IF NOT EXISTS audit_logs_2025 PARTITION OF audit_logs
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE IF NOT EXISTS audit_logs_default PARTITION OF audit_logs
DEFAULT;

-- ============================================
-- 10. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecological_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_self_select ON users
    FOR SELECT USING (auth.uid() = id);

-- ============================================
-- 11. AUDIT TRAIL TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION trigger_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    old_json JSONB;
    new_json JSONB;
    changed_fields TEXT[];
    field_name TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        new_json := to_jsonb(NEW);
        changed_fields := ARRAY(SELECT jsonb_object_keys(new_json));
    ELSIF TG_OP = 'UPDATE' THEN
        old_json := to_jsonb(OLD);
        new_json := to_jsonb(NEW);
        
        -- Find changed fields
        changed_fields := ARRAY[]::TEXT[];
        FOR field_name IN SELECT jsonb_object_keys(old_json) LOOP
            IF (old_json->>field_name) IS DISTINCT FROM (new_json->>field_name) THEN
                changed_fields := array_append(changed_fields, field_name);
            END IF;
        END LOOP;
        
        -- Also check for fields added in NEW
        FOR field_name IN SELECT jsonb_object_keys(new_json) LOOP
            IF NOT (field_name = ANY(changed_fields)) AND 
               (old_json->>field_name) IS DISTINCT FROM (new_json->>field_name) THEN
                changed_fields := array_append(changed_fields, field_name);
            END IF;
        END LOOP;
    ELSIF TG_OP = 'DELETE' THEN
        old_json := to_jsonb(OLD);
    END IF;
    
    -- Insert into audit_logs
    INSERT INTO audit_logs (
        user_id,
        user_role,
        action_type,
        table_name,
        record_id,
        old_values,
        new_values,
        changed_fields,
        ip_address,
        user_agent
    ) VALUES (
        auth.uid(),
        'user', -- Simplified for now
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        old_json,
        new_json,
        changed_fields,
        inet_client_addr(),
        current_setting('request.headers', TRUE)::JSONB->>'user-agent'
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 13. SEED DATA: SYSTEM ROLES
-- ============================================

INSERT INTO roles (role_name, role_description, permission_level, is_system_role) VALUES
    ('student', 'Mahasiswa - Akses data pribadi dan pengembangan diri', 100, TRUE),
    ('counselor', 'Konselor - Akses data mahasiswa yang ditugaskan', 200, TRUE),
    ('faculty_admin', 'Admin Fakultas - Akses data fakultas', 300, TRUE),
    ('admin', 'Administrator Sistem - Akses penuh sistem', 400, TRUE),
    ('super_admin', 'Super Admin - Akses dan kontrol penuh', 500, TRUE)
ON CONFLICT (role_name) DO NOTHING;

COMMIT;
