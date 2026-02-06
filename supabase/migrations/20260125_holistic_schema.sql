-- Holistic Learning Platform Schema Migration
-- 2026-01-25

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Assessments Table
-- Stores comprehensive assessment results across 9 domains with JSONB for flexibility
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    domain VARCHAR(50) NOT NULL, -- 'cognitive', 'emotional', 'social', etc.
    version VARCHAR(10) DEFAULT '1.0',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    scores JSONB NOT NULL DEFAULT '{}'::jsonb, -- Detailed scores breakdown
    profile_analysis JSONB DEFAULT '{}'::jsonb, -- Generated analysis
    recommendations JSONB DEFAULT '{}'::jsonb, -- Specific recommendations
    validity_checks JSONB DEFAULT '{}'::jsonb, -- Integrity/consistency checks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups by user and domain
CREATE INDEX IF NOT EXISTS idx_assessments_user_domain ON assessments(user_id, domain);

-- 2. Individual Development Plans (IDPs)
-- Stores the generated development plans and their status
CREATE TABLE IF NOT EXISTS idps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vision_statement TEXT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'archived'
    timeframe VARCHAR(20), -- '1_year', '3_year', etc.
    goals JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of SMART goals
    resources JSONB DEFAULT '[]'::jsonb, -- Matched resources
    timeline JSONB DEFAULT '[]'::jsonb, -- Planned timeline
    progress JSONB DEFAULT '{}'::jsonb, -- Overall progress stats
    last_reviewed TIMESTAMP WITH TIME ZONE,
    next_review TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_idps_user_status ON idps(user_id, status);

-- 3. Learning Resources Catalog
-- Global resource library (MOOCs, local content, mentors, etc.)
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- 'course', 'book', 'video', 'mentor', 'project', 'community'
    source VARCHAR(100), -- 'coursera', 'linkedin', 'campus_internal', etc.
    url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb, -- duration, difficulty, language, cost
    quality_score DECIMAL(3,2), -- 0.00 to 5.00 or 0.0-1.0 depending on scale
    tags TEXT[],
    skill_mappings JSONB DEFAULT '{}'::jsonb, -- Skills this resource improves
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Search index for resources
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_tags ON resources USING GIN(tags);

-- 4. User Progress Tracking
-- Detailed logs of user activities moving them towards their goals
CREATE TABLE IF NOT EXISTS progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    idp_id UUID REFERENCES idps(id) ON DELETE SET NULL,
    goal_id VARCHAR(100), -- Reference to ID inside IDP JSON
    activity_type VARCHAR(50), -- 'course_completion', 'mentor_session', 'reflection'
    activity_data JSONB DEFAULT '{}'::jsonb,
    progress_metric DECIMAL(5,2), -- Percentage or value added
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_progress_logs_user_idp ON progress_logs(user_id, idp_id);

-- RLS Policies (Row Level Security)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE idps ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

-- Assessments: Users can view their own, insert their own
CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- IDPs: Users can view/edit their own
CREATE POLICY "Users can view own idps" ON idps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own idps" ON idps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own idps" ON idps FOR UPDATE USING (auth.uid() = user_id);

-- Resources: Publicly readable, admin writable (assuming admin role check for write, simple read for now)
CREATE POLICY "Resources are viewable by everyone" ON resources FOR SELECT USING (true);

-- Progress Logs: Users can view/create own
CREATE POLICY "Users can view own logs" ON progress_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON progress_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
