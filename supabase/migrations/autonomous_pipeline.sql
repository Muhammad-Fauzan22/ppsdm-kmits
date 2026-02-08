-- Autonomous Pipeline Tracking Schema
-- ====================================
-- Tracks pipeline runs and enables auto-integration

-- Pipeline Runs Table
CREATE TABLE IF NOT EXISTS pipeline_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle',
    message TEXT,
    stats JSONB DEFAULT '{}',
    phases JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick status lookups
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_updated ON pipeline_runs(updated_at DESC);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_pipeline_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS pipeline_runs_updated ON pipeline_runs;
CREATE TRIGGER pipeline_runs_updated
    BEFORE UPDATE ON pipeline_runs
    FOR EACH ROW
    EXECUTE FUNCTION update_pipeline_timestamp();

-- Content Statistics View (for dashboard)
CREATE OR REPLACE VIEW content_statistics AS
SELECT
    (SELECT COUNT(*) FROM raw_materials WHERE status = 'processed') as processed_materials,
    (SELECT COUNT(*) FROM raw_materials WHERE status = 'pending') as pending_materials,
    (SELECT COUNT(*) FROM learning_modules WHERE status = 'published') as published_modules,
    (SELECT COUNT(*) FROM learning_modules WHERE status = 'draft') as draft_modules,
    (SELECT COUNT(*) FROM module_quizzes) as total_quizzes,
    (SELECT COUNT(*) FROM interventions WHERE is_active = true) as active_interventions,
    (SELECT COUNT(*) FROM module_formats WHERE format_type = 'audio') as audio_files,
    (SELECT COUNT(*) FROM module_formats WHERE format_type = 'pdf') as pdf_files;

-- Pipeline Health Check Function
CREATE OR REPLACE FUNCTION pipeline_health_check()
RETURNS TABLE (
    last_run_status TEXT,
    last_run_time TIMESTAMPTZ,
    hours_since_last_run NUMERIC,
    is_healthy BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pr.status::TEXT,
        pr.updated_at,
        EXTRACT(EPOCH FROM (NOW() - pr.updated_at)) / 3600,
        pr.status IN ('completed', 'idle') AND 
        EXTRACT(EPOCH FROM (NOW() - pr.updated_at)) / 3600 < 12
    FROM pipeline_runs pr
    ORDER BY pr.updated_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT ON content_statistics TO authenticated;
GRANT ALL ON pipeline_runs TO service_role;
GRANT EXECUTE ON FUNCTION pipeline_health_check() TO authenticated;
