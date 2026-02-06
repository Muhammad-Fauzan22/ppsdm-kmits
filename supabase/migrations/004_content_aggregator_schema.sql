-- ============================================================================
-- CONTENT AGGREGATOR SYSTEM - Database Migration
-- ============================================================================
-- Netflix-style content aggregation system for PPSDM KMITS
-- Supports: 9 dimensions, AI categorization, recommendations, 24/7 scraping
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- CONTENT SOURCES REGISTRY
-- ============================================================================
CREATE TABLE IF NOT EXISTS content_sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    base_url VARCHAR(500) NOT NULL,
    source_type VARCHAR(50) CHECK (source_type IN (
        'academic', 'career', 'learning', 'campus', 'personal_dev',
        'news', 'social_media', 'video', 'rss', 'api'
    )) NOT NULL,
    scrape_frequency VARCHAR(20) CHECK (scrape_frequency IN (
        'hourly', 'every_6_hours', 'daily', 'weekly', 'monthly'
    )) DEFAULT 'daily',
    is_active BOOLEAN DEFAULT TRUE,
    last_scraped TIMESTAMP WITH TIME ZONE,
    success_rate FLOAT DEFAULT 0.0 CHECK (success_rate BETWEEN 0 AND 100),
    total_scraped INTEGER DEFAULT 0,
    config JSONB DEFAULT '{}', -- API keys, selectors, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for content_sources
CREATE INDEX IF NOT EXISTS idx_content_sources_type ON content_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_content_sources_active ON content_sources(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_content_sources_frequency ON content_sources(scrape_frequency);

-- Comments
COMMENT ON TABLE content_sources IS 'Registry of all content sources for scraping';
COMMENT ON COLUMN content_sources.config IS 'Source-specific configuration (API keys, CSS selectors, etc.)';

-- ============================================================================
-- MAIN SCRAPED CONTENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS scraped_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_id UUID REFERENCES content_sources(id) ON DELETE SET NULL,
    source_url VARCHAR(500) UNIQUE NOT NULL,
    canonical_url VARCHAR(500), -- For duplicate detection
    
    -- Content fields
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content TEXT, -- Full content or summary
    content_type VARCHAR(50) CHECK (content_type IN (
        'article', 'video', 'job', 'event', 'course', 'research',
        'announcement', 'scholarship', 'internship', 'tutorial', 'podcast'
    )) DEFAULT 'article',
    
    -- Media
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    duration VARCHAR(20), -- For videos/podcasts (e.g., "15:30")
    
    -- Metadata
    author VARCHAR(200),
    author_url VARCHAR(500),
    publish_date TIMESTAMP WITH TIME ZONE,
    language VARCHAR(10) DEFAULT 'id', -- id, en, multi
    tags JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb, -- Source-specific data
    
    -- Quality & AI Scoring
    quality_score FLOAT DEFAULT 0.0 CHECK (quality_score BETWEEN 0 AND 100),
    relevance_score FLOAT DEFAULT 0.0 CHECK (relevance_score BETWEEN 0 AND 100),
    engagement_score FLOAT DEFAULT 0.0 CHECK (engagement_score BETWEEN 0 AND 100),
    credibility_score FLOAT DEFAULT 0.0 CHECK (credibility_score BETWEEN 0 AND 100),
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Processing status
    processing_status VARCHAR(20) CHECK (processing_status IN (
        'scraped', 'processing', 'categorized', 'ready', 'failed', 'archived'
    )) DEFAULT 'scraped',
    
    -- Timestamps
    scrape_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for scraped_content
CREATE INDEX IF NOT EXISTS idx_scraped_content_source ON scraped_content(source_id);
CREATE INDEX IF NOT EXISTS idx_scraped_content_type ON scraped_content(content_type);
CREATE INDEX IF NOT EXISTS idx_scraped_content_status ON scraped_content(processing_status);
CREATE INDEX IF NOT EXISTS idx_scraped_content_language ON scraped_content(language);
CREATE INDEX IF NOT EXISTS idx_scraped_content_publish_date ON scraped_content(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_content_quality ON scraped_content(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_scraped_content_scrape_date ON scraped_content(scrape_date DESC);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_scraped_content_title_trgm ON scraped_content USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_scraped_content_description_trgm ON scraped_content USING gin(description gin_trgm_ops);

-- GIN indexes for JSONB
CREATE INDEX IF NOT EXISTS idx_scraped_content_tags ON scraped_content USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_scraped_content_metadata ON scraped_content USING gin(metadata);

-- Comments
COMMENT ON TABLE scraped_content IS 'Main table for all scraped content from various sources';
COMMENT ON COLUMN scraped_content.quality_score IS 'AI-assessed content quality (0-100)';
COMMENT ON COLUMN scraped_content.relevance_score IS 'Relevance to ITS students (0-100)';
COMMENT ON COLUMN scraped_content.credibility_score IS 'Source credibility assessment (0-100)';

-- ============================================================================
-- CONTENT DIMENSION MAPPING (AI Categorization)
-- ============================================================================
CREATE TABLE IF NOT EXISTS content_dimension_mapping (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES scraped_content(id) ON DELETE CASCADE NOT NULL,
    dimension VARCHAR(20) CHECK (dimension IN (
        'cognitive', 'emotional', 'spiritual', 'physical', 'creative',
        'professional', 'leadership', 'financial', 'environmental'
    )) NOT NULL,
    confidence FLOAT DEFAULT 0.0 CHECK (confidence BETWEEN 0 AND 100),
    mapped_by VARCHAR(50) DEFAULT 'ai', -- 'ai', 'manual', 'user', 'hybrid'
    mapping_reason TEXT, -- Why this dimension was assigned
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(content_id, dimension)
);

-- Indexes for content_dimension_mapping
CREATE INDEX IF NOT EXISTS idx_content_dimension_mapping_content ON content_dimension_mapping(content_id);
CREATE INDEX IF NOT EXISTS idx_content_dimension_mapping_dimension ON content_dimension_mapping(dimension);
CREATE INDEX IF NOT EXISTS idx_content_dimension_mapping_confidence ON content_dimension_mapping(confidence DESC);

-- Comments
COMMENT ON TABLE content_dimension_mapping IS 'Maps content to 9 PPSDM dimensions using AI';

-- ============================================================================
-- USER CONTENT INTERACTIONS (For Recommendation Engine)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_content_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content_id UUID REFERENCES scraped_content(id) ON DELETE CASCADE NOT NULL,
    
    interaction_type VARCHAR(20) CHECK (interaction_type IN (
        'view', 'save', 'like', 'share', 'complete', 'dismiss', 'click', 'hover'
    )) NOT NULL,
    
    interaction_data JSONB DEFAULT '{}'::jsonb, -- Duration, scroll depth, etc.
    session_id VARCHAR(100), -- For grouping interactions
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, content_id, interaction_type, created_at)
);

-- Indexes for user_content_interactions
CREATE INDEX IF NOT EXISTS idx_user_content_interactions_user ON user_content_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_interactions_content ON user_content_interactions(content_id);
CREATE INDEX IF NOT EXISTS idx_user_content_interactions_type ON user_content_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_content_interactions_created ON user_content_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_content_interactions_user_content ON user_content_interactions(user_id, content_id);

-- GIN index for interaction data
CREATE INDEX IF NOT EXISTS idx_user_content_interactions_data ON user_content_interactions USING gin(interaction_data);

-- Comments
COMMENT ON TABLE user_content_interactions IS 'Tracks all user interactions with content for recommendations';

-- ============================================================================
-- SCRAPER LOGS (Monitoring & Health Checks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS scraper_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_id UUID REFERENCES content_sources(id) ON DELETE SET NULL,
    scraper_name VARCHAR(100) NOT NULL,
    
    status VARCHAR(20) CHECK (status IN ('started', 'success', 'partial', 'failed')) NOT NULL,
    
    -- Metrics
    items_scraped INTEGER DEFAULT 0,
    items_new INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    items_failed INTEGER DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    
    -- Error tracking
    error_message TEXT,
    error_details JSONB DEFAULT '{}'::jsonb,
    stack_trace TEXT,
    
    -- Metadata
    run_type VARCHAR(20) CHECK (run_type IN ('scheduled', 'manual', 'retry')) DEFAULT 'scheduled',
    trigger_source VARCHAR(50), -- 'github_actions', 'local', 'api'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for scraper_logs
CREATE INDEX IF NOT EXISTS idx_scraper_logs_source ON scraper_logs(source_id);
CREATE INDEX IF NOT EXISTS idx_scraper_logs_status ON scraper_logs(status);
CREATE INDEX IF NOT EXISTS idx_scraper_logs_created ON scraper_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scraper_logs_scraper_name ON scraper_logs(scraper_name);
CREATE INDEX IF NOT EXISTS idx_scraper_logs_date_range ON scraper_logs(created_at, status);

-- Comments
COMMENT ON TABLE scraper_logs IS 'Monitoring and logging for all scraper runs';

-- ============================================================================
-- CONTENT RECOMMENDATIONS (Pre-computed)
-- ============================================================================
CREATE TABLE IF NOT EXISTS content_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content_id UUID REFERENCES scraped_content(id) ON DELETE CASCADE NOT NULL,
    
    recommendation_type VARCHAR(20) CHECK (recommendation_type IN (
        'collaborative', 'content_based', 'context_aware', 'trending', 'new', 'similar'
    )) NOT NULL,
    
    score FLOAT NOT NULL CHECK (score BETWEEN 0 AND 100),
    reason TEXT, -- Why this was recommended (e.g., "Because you watched X")
    
    -- Feedback
    was_clicked BOOLEAN,
    was_helpful BOOLEAN,
    
    expires_at TIMESTAMP WITH TIME ZONE, -- Recommendations can expire
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, content_id, recommendation_type)
);

-- Indexes for content_recommendations
CREATE INDEX IF NOT EXISTS idx_content_recommendations_user ON content_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_content ON content_recommendations(content_id);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_score ON content_recommendations(score DESC);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_type ON content_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_content_recommendations_expires ON content_recommendations(expires_at);

-- Comments
COMMENT ON TABLE content_recommendations IS 'Pre-computed content recommendations per user';

-- ============================================================================
-- CONTENT PLAYLISTS (User-created collections)
-- ============================================================================
CREATE TABLE IF NOT EXISTS content_playlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    title VARCHAR(200) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    
    -- For "Learning Paths" feature
    is_learning_path BOOLEAN DEFAULT FALSE,
    target_dimension VARCHAR(20) CHECK (target_dimension IN (
        'cognitive', 'emotional', 'spiritual', 'physical', 'creative',
        'professional', 'leadership', 'financial', 'environmental'
    )),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_playlist_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    playlist_id UUID REFERENCES content_playlists(id) ON DELETE CASCADE NOT NULL,
    content_id UUID REFERENCES scraped_content(id) ON DELETE CASCADE NOT NULL,
    
    order_index INTEGER DEFAULT 0,
    notes TEXT,
    
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(playlist_id, content_id)
);

-- Indexes for playlists
CREATE INDEX IF NOT EXISTS idx_content_playlists_user ON content_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_content_playlists_public ON content_playlists(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_content_playlist_items_playlist ON content_playlist_items(playlist_id);
CREATE INDEX IF NOT EXISTS idx_content_playlist_items_content ON content_playlist_items(content_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_content_sources_updated_at ON content_sources;
CREATE TRIGGER update_content_sources_updated_at
    BEFORE UPDATE ON content_sources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scraped_content_updated_at ON scraped_content;
CREATE TRIGGER update_scraped_content_updated_at
    BEFORE UPDATE ON scraped_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_playlists_updated_at ON content_playlists;
CREATE TRIGGER update_content_playlists_updated_at
    BEFORE UPDATE ON content_playlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate scraper duration
CREATE OR REPLACE FUNCTION calculate_scraper_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
        NEW.duration_seconds := EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at))::INTEGER;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS calculate_scraper_duration_trigger ON scraper_logs;
CREATE TRIGGER calculate_scraper_duration_trigger
    BEFORE INSERT OR UPDATE ON scraper_logs
    FOR EACH ROW
    EXECUTE FUNCTION calculate_scraper_duration();

-- Function to update source success rate
CREATE OR REPLACE FUNCTION update_source_success_rate()
RETURNS TRIGGER AS $$
DECLARE
    total_runs INTEGER;
    successful_runs INTEGER;
    new_rate FLOAT;
BEGIN
    IF NEW.source_id IS NOT NULL THEN
        SELECT COUNT(*), COUNT(*) FILTER (WHERE status IN ('success', 'partial'))
        INTO total_runs, successful_runs
        FROM scraper_logs
        WHERE source_id = NEW.source_id
        AND created_at > NOW() - INTERVAL '30 days';
        
        IF total_runs > 0 THEN
            new_rate := (successful_runs::FLOAT / total_runs::FLOAT) * 100;
            
            UPDATE content_sources
            SET success_rate = new_rate,
                last_scraped = CASE WHEN NEW.status = 'success' THEN NEW.completed_at ELSE last_scraped END,
                total_scraped = total_scraped + NEW.items_new
            WHERE id = NEW.source_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_source_stats_trigger ON scraper_logs;
CREATE TRIGGER update_source_stats_trigger
    AFTER INSERT ON scraper_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_source_success_rate();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_dimension_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_content_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraper_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_playlist_items ENABLE ROW LEVEL SECURITY;

-- Content Sources (Public read, service role write)
DROP POLICY IF EXISTS "Content sources are viewable by everyone" ON content_sources;
CREATE POLICY "Content sources are viewable by everyone"
    ON content_sources FOR SELECT
    TO authenticated, anon
    USING (true);

DROP POLICY IF EXISTS "Service role can manage content sources" ON content_sources;
CREATE POLICY "Service role can manage content sources"
    ON content_sources FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Scraped Content (Public read for ready content)
DROP POLICY IF EXISTS "Ready content is viewable by authenticated users" ON scraped_content;
CREATE POLICY "Ready content is viewable by authenticated users"
    ON scraped_content FOR SELECT
    TO authenticated
    USING (processing_status = 'ready');

DROP POLICY IF EXISTS "Service role can manage scraped content" ON scraped_content;
CREATE POLICY "Service role can manage scraped content"
    ON scraped_content FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Content Dimension Mapping (Public read for ready content)
DROP POLICY IF EXISTS "Dimension mappings viewable for ready content" ON content_dimension_mapping;
CREATE POLICY "Dimension mappings viewable for ready content"
    ON content_dimension_mapping FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM scraped_content 
        WHERE id = content_dimension_mapping.content_id 
        AND processing_status = 'ready'
    ));

DROP POLICY IF EXISTS "Service role can manage dimension mappings" ON content_dimension_mapping;
CREATE POLICY "Service role can manage dimension mappings"
    ON content_dimension_mapping FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- User Content Interactions (Users manage own)
DROP POLICY IF EXISTS "Users can view own interactions" ON user_content_interactions;
CREATE POLICY "Users can view own interactions"
    ON user_content_interactions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own interactions" ON user_content_interactions;
CREATE POLICY "Users can create own interactions"
    ON user_content_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own interactions" ON user_content_interactions;
CREATE POLICY "Users can update own interactions"
    ON user_content_interactions FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all interactions" ON user_content_interactions;
CREATE POLICY "Service role can manage all interactions"
    ON user_content_interactions FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Scraper Logs (Service role only)
DROP POLICY IF EXISTS "Service role can view scraper logs" ON scraper_logs;
CREATE POLICY "Service role can view scraper logs"
    ON scraper_logs FOR SELECT
    USING (auth.jwt()->>'role' = 'service_role');

DROP POLICY IF EXISTS "Service role can manage scraper logs" ON scraper_logs;
CREATE POLICY "Service role can manage scraper logs"
    ON scraper_logs FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Content Recommendations (Users view own)
DROP POLICY IF EXISTS "Users can view own recommendations" ON content_recommendations;
CREATE POLICY "Users can view own recommendations"
    ON content_recommendations FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recommendation feedback" ON content_recommendations;
CREATE POLICY "Users can update own recommendation feedback"
    ON content_recommendations FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage recommendations" ON content_recommendations;
CREATE POLICY "Service role can manage recommendations"
    ON content_recommendations FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Content Playlists (Users manage own, public can view public)
DROP POLICY IF EXISTS "Users can view own playlists" ON content_playlists;
CREATE POLICY "Users can view own playlists"
    ON content_playlists FOR SELECT
    USING (auth.uid() = user_id OR is_public = TRUE);

DROP POLICY IF EXISTS "Users can manage own playlists" ON content_playlists;
CREATE POLICY "Users can manage own playlists"
    ON content_playlists FOR ALL
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all playlists" ON content_playlists;
CREATE POLICY "Service role can manage all playlists"
    ON content_playlists FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Content Playlist Items
DROP POLICY IF EXISTS "Users can view playlist items" ON content_playlist_items;
CREATE POLICY "Users can view playlist items"
    ON content_playlist_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM content_playlists 
        WHERE id = content_playlist_items.playlist_id 
        AND (user_id = auth.uid() OR is_public = TRUE)
    ));

DROP POLICY IF EXISTS "Users can manage own playlist items" ON content_playlist_items;
CREATE POLICY "Users can manage own playlist items"
    ON content_playlist_items FOR ALL
    USING (EXISTS (
        SELECT 1 FROM content_playlists 
        WHERE id = content_playlist_items.playlist_id 
        AND user_id = auth.uid()
    ));

-- ============================================================================
-- SEED DATA - Default Content Sources
-- ============================================================================

INSERT INTO content_sources (name, base_url, source_type, scrape_frequency, config) VALUES
-- Academic & Research
('ITS Repository', 'https://repository.its.ac.id/', 'academic', 'daily', 
 '{"selectors": {"title": "h1", "content": ".item-view"}}'),
('SINTA Indonesia', 'https://sinta.kemdikbud.go.id/', 'academic', 'weekly',
 '{"api_endpoint": "https://sinta.kemdikbud.go.id/api"}'),

-- Career & Jobs
('Kalibrr Jobs', 'https://www.kalibrr.com/', 'career', 'every_6_hours',
 '{"selectors": {"job_card": ".job-card", "title": "h2", "company": ".company-name"}}'),
('Glints Indonesia', 'https://glints.com/id/', 'career', 'every_6_hours',
 '{"selectors": {"job_card": "[data-testid=\"job-card\"]", "title": "h3"}}'),
('LinkedIn Indonesia', 'https://www.linkedin.com/jobs/', 'career', 'daily',
 '{"api": "linkedin_jobs", "location": "Indonesia"}'),

-- Learning Resources
('YouTube EDU Indonesia', 'https://www.youtube.com/', 'video', 'daily',
 '{"api": "youtube_data_v3", "channels": ["Kok Bisa", "Sains Bro", "Web Programming Unpas"]}'),
('Khan Academy ID', 'https://id.khanacademy.org/', 'learning', 'weekly',
 '{"selectors": {"course": ".course-block", "title": "h3"}}'),

-- Campus & News
('ITS Official News', 'https://www.its.ac.id/news/', 'news', 'daily',
 '{"selectors": {"article": "article", "title": "h2", "date": "time"}}'),
('BEM ITS', 'https://bem.its.ac.id/', 'campus', 'daily',
 '{"selectors": {"post": ".post-item", "title": "h3"}}'),

-- Personal Development
('Hello Sehat', 'https://hellosehat.com/', 'personal_dev', 'daily',
 '{"category": "health", "selectors": {"article": ".article-card"}}'),
('Finansialku', 'https://finansialku.com/', 'personal_dev', 'daily',
 '{"category": "financial", "selectors": {"article": ".post"}}')

ON CONFLICT DO NOTHING;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Ready content with dimensions
CREATE OR REPLACE VIEW v_content_with_dimensions AS
SELECT 
    sc.*,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'dimension', cdm.dimension,
                'confidence', cdm.confidence
            ) ORDER BY cdm.confidence DESC
        ) FILTER (WHERE cdm.id IS NOT NULL),
        '[]'::jsonb
    ) as dimensions
FROM scraped_content sc
LEFT JOIN content_dimension_mapping cdm ON sc.id = cdm.content_id
WHERE sc.processing_status = 'ready'
GROUP BY sc.id;

-- View: Content statistics per source
CREATE OR REPLACE VIEW v_source_statistics AS
SELECT 
    cs.id,
    cs.name,
    cs.source_type,
    cs.is_active,
    cs.success_rate,
    COUNT(sc.id) as total_content,
    COUNT(sc.id) FILTER (WHERE sc.scrape_date > NOW() - INTERVAL '7 days') as content_last_7_days,
    AVG(sc.quality_score) as avg_quality_score,
    MAX(sc.scrape_date) as last_content_date
FROM content_sources cs
LEFT JOIN scraped_content sc ON sc.source_id = cs.id
GROUP BY cs.id, cs.name, cs.source_type, cs.is_active, cs.success_rate;

-- View: User content feed (personalized)
CREATE OR REPLACE VIEW v_user_content_feed AS
SELECT 
    sc.*,
    uci.interaction_type as user_interaction,
    cr.score as recommendation_score,
    cr.recommendation_type,
    cr.reason as recommendation_reason
FROM scraped_content sc
LEFT JOIN user_content_interactions uci ON sc.id = uci.content_id
LEFT JOIN content_recommendations cr ON sc.id = cr.content_id
WHERE sc.processing_status = 'ready'
AND (cr.expires_at IS NULL OR cr.expires_at > NOW());

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON VIEW v_content_with_dimensions IS 'Ready content with mapped dimensions';
COMMENT ON VIEW v_source_statistics IS 'Statistics for each content source';
COMMENT ON VIEW v_user_content_feed IS 'Personalized content feed for users';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
