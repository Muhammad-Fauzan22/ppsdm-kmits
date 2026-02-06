-- ENHANCED DATABASE SCHEMA FOR IMMERSIVE LEARNING LOOP (v8)

-- Core enhanced table for immersive learning outputs
CREATE TABLE IF NOT EXISTS immersive_learning_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id TEXT, -- Link to book processing logs if exists
    
    -- 7 Learning Module Types
    vr_ar_content JSONB,        -- VR/AR experiences
    ai_adaptive_path JSONB,     -- Personalized learning paths
    multimedia_content JSONB,   -- Videos, animations, audio
    gamification_elements JSONB,-- Game mechanics and elements
    collaborative_tools JSONB,  -- Collaboration features
    pbl_projects JSONB,         -- Project-based learning
    blockchain_credentials JSONB, -- Verifiable credentials
    
    -- Compatibility & Requirements
    device_compatibility JSONB DEFAULT '{
        "vr": ["oculus_quest", "htc_vive", "webxr"],
        "ar": ["ios_arkit", "android_arcore", "web_ar"],
        "desktop": ["windows", "macos", "linux"],
        "mobile": ["ios", "android"],
        "browser": ["chrome", "firefox", "safari"]
    }',
    
    technical_requirements JSONB DEFAULT '{
        "minimum_ram": "4GB",
        "gpu_requirements": "integrated",
        "internet_speed": "5Mbps",
        "storage_space": "500MB"
    }',
    
    -- Pedagogical Metadata
    learning_modalities JSONB DEFAULT '[
        "visual", "auditory", "kinesthetic", 
        "reading_writing", "social", "solitary"
    ]',
    
    skill_development JSONB,    -- 4C skills development mapping
    bloom_taxonomy_coverage JSONB,
    estimated_completion_time INTERVAL,
    
    -- Analytics Integration
    engagement_metrics JSONB,
    completion_tracking JSONB,
    assessment_integration JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VR/AR Specific Content
CREATE TABLE IF NOT EXISTS vr_ar_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id TEXT,
    
    -- VR Classroom
    vr_classroom_url TEXT,
    vr_classroom_assets JSONB,
    vr_interactive_elements JSONB,
    
    -- AR Modules
    ar_marker_urls JSONB,
    ar_3d_models JSONB,
    ar_interactive_overlays JSONB,
    
    -- Virtual Tours
    virtual_tour_url TEXT,
    tour_stops JSONB,
    tour_interactivities JSONB,
    
    -- Device Compatibility
    supported_devices JSONB,
    performance_requirements JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Adaptive Learning Paths
CREATE TABLE IF NOT EXISTS adaptive_learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learner_id UUID REFERENCES auth.users(id),
    job_id TEXT,
    
    learning_style VARCHAR(50),
    knowledge_gap_analysis JSONB,
    personalized_path JSONB,
    
    ai_tutor_config JSONB,
    difficulty_adjustment_rules JSONB,
    remediation_modules JSONB,
    
    progress_tracking JSONB,
    performance_predictions JSONB,
    recommendation_engine JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gamification System
CREATE TABLE IF NOT EXISTS gamification_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id TEXT,
    
    game_mechanics JSONB,
    achievement_system JSONB,
    reward_economy JSONB,
    
    leaderboard_config JSONB,
    quest_system JSONB,
    badge_designs JSONB,
    
    engagement_analytics JSONB,
    motivation_factors JSONB,
    social_features JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blockchain Credentials
CREATE TABLE IF NOT EXISTS blockchain_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learner_id UUID REFERENCES auth.users(id),
    job_id TEXT,
    
    credential_type VARCHAR(50),
    blockchain_network VARCHAR(50),
    token_id VARCHAR(100),
    contract_address TEXT,
    
    credential_metadata JSONB,
    verification_url TEXT,
    issuance_date TIMESTAMPTZ,
    expiration_date TIMESTAMPTZ,
    
    skills_verified JSONB,
    issuer_signature TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);
