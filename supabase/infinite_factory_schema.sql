-- ==============================================================================
-- INFINITE LEARNING FACTORY - COMPLETE DATABASE SCHEMA
-- ==============================================================================
-- Purpose: Zero-cost, 24/7 autonomous content generation system
-- Target: 100+ learning modules daily across 9 PPSDM dimensions
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==============================================================================
-- 1. CONTENT SOURCES (RSS, APIs, Scrapers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS content_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'rss', 'api', 'scraper', 'youtube', 'academic'
    category VARCHAR(100), -- dimension mapping hint
    language VARCHAR(10) DEFAULT 'id',
    priority INTEGER DEFAULT 5, -- 1-10, higher = more important
    fetch_interval_minutes INTEGER DEFAULT 60,
    last_fetch_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    fetch_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    config JSONB DEFAULT '{}', -- API keys, selectors, etc.
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial content sources
INSERT INTO content_sources (name, url, type, category, language, priority) VALUES
    -- Indonesian Educational RSS
    ('ITS News', 'https://www.its.ac.id/news/feed/', 'rss', 'academic', 'id', 9),
    ('Kemdikbud', 'https://www.kemdikbud.go.id/rss', 'rss', 'education', 'id', 8),
    ('UGM News', 'https://ugm.ac.id/id/feed/', 'rss', 'academic', 'id', 7),
    ('UI News', 'https://ui.ac.id/feed/', 'rss', 'academic', 'id', 7),
    ('Codepolitan', 'https://www.codepolitan.com/rss', 'rss', 'cognitive', 'id', 6),
    ('Dicoding Blog', 'https://www.dicoding.com/blog/feed/', 'rss', 'cognitive', 'id', 6),
    
    -- Global Tech/Education RSS
    ('FreeCodeCamp', 'https://www.freecodecamp.org/news/rss', 'rss', 'cognitive', 'en', 8),
    ('Dev.to', 'https://dev.to/feed', 'rss', 'cognitive', 'en', 7),
    ('Medium Education', 'https://medium.com/feed/tag/education', 'rss', 'education', 'en', 6),
    ('HackerNoon', 'https://hackernoon.com/feed', 'rss', 'cognitive', 'en', 5),
    
    -- Academic APIs
    ('arXiv CS', 'http://export.arxiv.org/rss/cs', 'rss', 'cognitive', 'en', 7),
    ('arXiv Physics', 'http://export.arxiv.org/rss/physics', 'rss', 'cognitive', 'en', 5),
    ('Semantic Scholar', 'https://api.semanticscholar.org', 'api', 'academic', 'en', 6),
    
    -- YouTube Educational
    ('3Blue1Brown', 'UCYO_jab_esuFRV4b17AJtAw', 'youtube', 'cognitive', 'en', 8),
    ('Kurzgesagt', 'UCsXVk37bltHxD1rDPwtNM8Q', 'youtube', 'cognitive', 'en', 8),
    ('TED-Ed', 'UCsooa4yRKGN_zEE8iknghZA', 'youtube', 'education', 'en', 7),
    ('CrashCourse', 'UCX6b17PVsYBQ0ip5gyeme-Q', 'youtube', 'education', 'en', 7),
    ('MIT OpenCourseWare', 'UCEBb1b_L6zDS3xTUrIALZOw', 'youtube', 'cognitive', 'en', 9),
    
    -- Health & Wellness
    ('Healthline', 'https://www.healthline.com/rss/nutrition', 'rss', 'physical', 'en', 6),
    ('Psychology Today', 'https://www.psychologytoday.com/intl/rss', 'rss', 'emotional', 'en', 7),
    
    -- Financial
    ('Investopedia', 'https://www.investopedia.com/feedbuilder/feed/rss', 'rss', 'financial', 'en', 7),
    ('OJK Indonesia', 'https://ojk.go.id', 'scraper', 'financial', 'id', 8)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 2. RAW MATERIALS (Harvested Content)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS raw_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES content_sources(id) ON DELETE SET NULL,
    external_id VARCHAR(500), -- original ID from source
    title TEXT NOT NULL,
    content TEXT,
    summary TEXT,
    url TEXT,
    author VARCHAR(255),
    published_at TIMESTAMPTZ,
    language VARCHAR(10) DEFAULT 'id',
    content_type VARCHAR(50), -- 'article', 'video', 'paper', 'podcast'
    
    -- Processing status
    is_processed BOOLEAN DEFAULT FALSE,
    is_relevant BOOLEAN,
    quality_score FLOAT,
    
    -- Classification
    detected_dimensions TEXT[], -- array of detected dimensions
    detected_topics TEXT[],
    detected_keywords TEXT[],
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    harvested_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    
    UNIQUE(source_id, external_id)
);

CREATE INDEX idx_raw_materials_processed ON raw_materials(is_processed);
CREATE INDEX idx_raw_materials_harvested ON raw_materials(harvested_at DESC);
CREATE INDEX idx_raw_materials_source ON raw_materials(source_id);
CREATE INDEX idx_raw_materials_dimensions ON raw_materials USING GIN(detected_dimensions);

-- ==============================================================================
-- 3. LEARNING MODULES (Generated Content)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS learning_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_material_id UUID REFERENCES raw_materials(id) ON DELETE SET NULL,
    
    -- Core content
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE,
    description TEXT,
    content JSONB NOT NULL, -- structured lesson content
    summary TEXT,
    
    -- Classification
    dimension VARCHAR(50) NOT NULL, -- 9 PPSDM dimensions
    sub_dimension VARCHAR(100),
    topics TEXT[],
    tags TEXT[],
    
    -- Difficulty & Duration
    difficulty VARCHAR(20) DEFAULT 'beginner', -- beginner, intermediate, advanced
    estimated_minutes INTEGER DEFAULT 15,
    
    -- Generation metadata
    generated_by VARCHAR(50) DEFAULT 'gemini-flash', -- model used
    generation_prompt TEXT,
    generation_version VARCHAR(20) DEFAULT 'v1',
    
    -- Quality metrics
    quality_score FLOAT DEFAULT 0,
    readability_score FLOAT,
    accuracy_score FLOAT,
    
    -- Engagement metrics
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    completions INTEGER DEFAULT 0,
    avg_rating FLOAT,
    
    -- Publishing
    status VARCHAR(20) DEFAULT 'draft', -- draft, review, published, archived
    published_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_learning_modules_dimension ON learning_modules(dimension);
CREATE INDEX idx_learning_modules_status ON learning_modules(status);
CREATE INDEX idx_learning_modules_created ON learning_modules(created_at DESC);
CREATE INDEX idx_learning_modules_quality ON learning_modules(quality_score DESC);
CREATE INDEX idx_learning_modules_topics ON learning_modules USING GIN(topics);

-- ==============================================================================
-- 4. MODULE FORMATS (Multi-format Assets)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS module_formats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
    
    -- Format details
    format_type VARCHAR(30) NOT NULL, -- 'pdf', 'audio', 'video', 'slides', 'interactive'
    file_url TEXT NOT NULL,
    file_path TEXT,
    file_size_bytes INTEGER,
    mime_type VARCHAR(100),
    
    -- For audio/video
    duration_seconds INTEGER,
    
    -- For PDFs
    page_count INTEGER,
    
    -- Generation
    generator VARCHAR(50), -- 'edge-tts', 'reportlab', 'ffmpeg'
    generation_params JSONB,
    
    -- Quality
    quality_score FLOAT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_module_formats_module ON module_formats(module_id);
CREATE INDEX idx_module_formats_type ON module_formats(format_type);

-- ==============================================================================
-- 5. MODULE QUIZZES (Generated Assessments)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS module_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
    
    -- Quiz content
    title VARCHAR(255),
    description TEXT,
    questions JSONB NOT NULL, -- array of question objects
    
    -- Settings
    question_count INTEGER,
    time_limit_seconds INTEGER,
    passing_score INTEGER DEFAULT 70,
    shuffle_questions BOOLEAN DEFAULT TRUE,
    shuffle_answers BOOLEAN DEFAULT TRUE,
    
    -- Generation
    generated_by VARCHAR(50) DEFAULT 'gemini-flash',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_module_quizzes_module ON module_quizzes(module_id);

-- ==============================================================================
-- 6. INTERVENTIONS (Dynamic, AI-Generated)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core content
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    
    -- Classification
    dimension VARCHAR(50) NOT NULL,
    sub_dimension VARCHAR(100),
    difficulty VARCHAR(20) DEFAULT 'easy', -- easy, medium, hard
    type VARCHAR(50) DEFAULT 'challenge', -- exercise, reading, challenge, video, reflection
    
    -- Targeting
    min_score_threshold INTEGER, -- show if user score < this
    max_score_threshold INTEGER, -- show if user score > this
    duration_minutes INTEGER DEFAULT 10,
    
    -- Metadata
    tags JSONB DEFAULT '[]',
    resources JSONB DEFAULT '[]', -- links, materials
    
    -- Quality
    effectiveness_score FLOAT,
    completion_rate FLOAT,
    avg_rating FLOAT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    generated_by VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interventions_dimension ON interventions(dimension);
CREATE INDEX idx_interventions_difficulty ON interventions(difficulty);
CREATE INDEX idx_interventions_active ON interventions(is_active);

-- ==============================================================================
-- 7. GENERATION LOGS (Pipeline Tracking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS generation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- What was generated
    entity_type VARCHAR(50) NOT NULL, -- 'module', 'quiz', 'audio', 'pdf', 'intervention'
    entity_id UUID,
    
    -- Pipeline info
    pipeline_run_id UUID,
    step_name VARCHAR(100),
    
    -- Execution
    status VARCHAR(20) NOT NULL, -- 'started', 'completed', 'failed'
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    
    -- Resources used
    model_used VARCHAR(100),
    tokens_input INTEGER,
    tokens_output INTEGER,
    api_provider VARCHAR(50),
    
    -- Error handling
    error_message TEXT,
    error_stack TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_generation_logs_entity ON generation_logs(entity_type, entity_id);
CREATE INDEX idx_generation_logs_pipeline ON generation_logs(pipeline_run_id);
CREATE INDEX idx_generation_logs_status ON generation_logs(status);
CREATE INDEX idx_generation_logs_started ON generation_logs(started_at DESC);

-- ==============================================================================
-- 8. PERFORMANCE METRICS (System Monitoring)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Metric identification
    metric_name VARCHAR(100) NOT NULL,
    metric_category VARCHAR(50), -- 'content', 'users', 'performance', 'resources'
    
    -- Value
    value FLOAT NOT NULL,
    unit VARCHAR(20),
    
    -- Context
    dimension VARCHAR(50),
    context JSONB DEFAULT '{}',
    
    -- Timestamp
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX idx_performance_metrics_category ON performance_metrics(metric_category);
CREATE INDEX idx_performance_metrics_recorded ON performance_metrics(recorded_at DESC);

-- ==============================================================================
-- 9. USER INTERACTIONS (For Recommendations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- references auth.users
    module_id UUID REFERENCES learning_modules(id) ON DELETE SET NULL,
    
    -- Interaction details
    interaction_type VARCHAR(30) NOT NULL, -- 'view', 'start', 'complete', 'like', 'share', 'bookmark'
    
    -- Engagement metrics
    duration_seconds INTEGER,
    scroll_depth FLOAT, -- 0-100%
    completion_percentage FLOAT,
    
    -- Context
    device_type VARCHAR(20),
    referrer VARCHAR(255),
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_module ON user_interactions(module_id);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_user_interactions_created ON user_interactions(created_at DESC);

-- ==============================================================================
-- 10. AI MODELS REGISTRY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Model identification
    name VARCHAR(100) NOT NULL UNIQUE,
    provider VARCHAR(50) NOT NULL, -- 'gemini', 'huggingface', 'local'
    model_id VARCHAR(255), -- provider-specific ID
    
    -- Capabilities
    capabilities TEXT[], -- 'text-generation', 'classification', 'tts', 'image'
    languages TEXT[] DEFAULT ARRAY['en', 'id'],
    
    -- Configuration
    endpoint_url TEXT,
    config JSONB DEFAULT '{}',
    
    -- Limits
    rate_limit_rpm INTEGER, -- requests per minute
    rate_limit_daily INTEGER,
    max_tokens INTEGER,
    
    -- Usage tracking
    requests_today INTEGER DEFAULT 0,
    requests_month INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 5, -- for fallback ordering
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed AI models
INSERT INTO ai_models (name, provider, model_id, capabilities, rate_limit_rpm, rate_limit_daily, priority) VALUES
    ('gemini-flash', 'gemini', 'gemini-1.5-flash', ARRAY['text-generation', 'classification'], 15, 1000, 10),
    ('gemini-pro', 'gemini', 'gemini-1.5-pro', ARRAY['text-generation', 'classification'], 2, 50, 5),
    ('mistral-7b', 'huggingface', 'mistralai/Mistral-7B-Instruct-v0.2', ARRAY['text-generation'], 30, 10000, 8),
    ('mixtral-8x7b', 'huggingface', 'mistralai/Mixtral-8x7B-Instruct-v0.1', ARRAY['text-generation'], 20, 5000, 7),
    ('edge-tts', 'microsoft', 'edge-tts', ARRAY['tts'], 100, 100000, 10),
    ('gtts', 'google', 'gtts', ARRAY['tts'], 50, 10000, 5)
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 11. MATERIALIZED VIEWS FOR ANALYTICS
-- ==============================================================================

-- Daily content generation stats
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_generation_stats AS
SELECT 
    DATE(created_at) as date,
    dimension,
    COUNT(*) as modules_created,
    AVG(quality_score) as avg_quality,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_count
FROM learning_modules
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at), dimension
ORDER BY date DESC;

-- Content performance summary
CREATE MATERIALIZED VIEW IF NOT EXISTS content_performance AS
SELECT 
    lm.id,
    lm.title,
    lm.dimension,
    lm.difficulty,
    lm.views,
    lm.likes,
    lm.completions,
    lm.avg_rating,
    COALESCE(lm.views, 0) + COALESCE(lm.likes, 0) * 5 + COALESCE(lm.completions, 0) * 10 as engagement_score,
    COUNT(mf.id) as format_count,
    ARRAY_AGG(DISTINCT mf.format_type) as available_formats
FROM learning_modules lm
LEFT JOIN module_formats mf ON lm.id = mf.module_id
GROUP BY lm.id, lm.title, lm.dimension, lm.difficulty, lm.views, lm.likes, lm.completions, lm.avg_rating;

-- ==============================================================================
-- 12. RLS POLICIES
-- ==============================================================================
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published modules" ON learning_modules
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view module formats" ON module_formats
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM learning_modules lm 
        WHERE lm.id = module_formats.module_id AND lm.status = 'published'
    ));

CREATE POLICY "Public can view quizzes" ON module_quizzes
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM learning_modules lm 
        WHERE lm.id = module_quizzes.module_id AND lm.status = 'published'
    ));

CREATE POLICY "Public can view active interventions" ON interventions
    FOR SELECT USING (is_active = TRUE);

-- Service role has full access (for automation)
CREATE POLICY "Service role full access content_sources" ON content_sources
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access raw_materials" ON raw_materials
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access learning_modules" ON learning_modules
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access module_formats" ON module_formats
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access module_quizzes" ON module_quizzes
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access interventions" ON interventions
    FOR ALL USING (auth.role() = 'service_role');

-- ==============================================================================
-- 13. FUNCTIONS
-- ==============================================================================

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW daily_generation_stats;
    REFRESH MATERIALIZED VIEW content_performance;
END;
$$ LANGUAGE plpgsql;

-- Function to get next unprocessed raw material
CREATE OR REPLACE FUNCTION get_next_unprocessed_material()
RETURNS raw_materials AS $$
DECLARE
    result raw_materials;
BEGIN
    SELECT * INTO result
    FROM raw_materials
    WHERE is_processed = FALSE AND is_relevant IS NOT FALSE
    ORDER BY harvested_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update module engagement
CREATE OR REPLACE FUNCTION update_module_engagement()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.interaction_type = 'view' THEN
        UPDATE learning_modules SET views = views + 1 WHERE id = NEW.module_id;
    ELSIF NEW.interaction_type = 'like' THEN
        UPDATE learning_modules SET likes = likes + 1 WHERE id = NEW.module_id;
    ELSIF NEW.interaction_type = 'complete' THEN
        UPDATE learning_modules SET completions = completions + 1 WHERE id = NEW.module_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_engagement
    AFTER INSERT ON user_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_module_engagement();

-- ==============================================================================
-- SCHEMA COMPLETE
-- ==============================================================================
