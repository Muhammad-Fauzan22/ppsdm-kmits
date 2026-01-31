-- Emotional Intelligence Assessment (Dimension 5) Tables

-- 1. Assessment Results Table
CREATE TABLE IF NOT EXISTS emotional_intelligence_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Scores
    raw_score NUMERIC(5,2),        -- 0-100
    theta_score NUMERIC(5,3),      -- IRT Latent Trait (-3 to 3)
    percentile NUMERIC(5,2),       -- 0-100
    intelligence_level TEXT,       -- 'Sangat Unggul', 'Unggul', etc.
    
    -- Subdomain Scores (JSONB for flexibility or columns?)
    -- Using JSONB stores the {score, level} structure easily
    subdomains JSONB, 
    
    -- Detailed Analysis
    recommendations JSONB,
    properties JSONB, -- Confidence Interval, SEM
    
    -- Metadata
    completion_time_seconds INTEGER,
    assessment_version TEXT DEFAULT '1.0'
);

-- 2. Responses Table (Unified for all 3 types)
-- Since we have Likert, Scenario (Option ID), Behavioral (Frequency Value)
-- We can use a flexible schema or specific columns.
CREATE TABLE IF NOT EXISTS emotional_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES emotional_intelligence_assessments(assessment_id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    response_value TEXT, -- For Scenario Option ID (A,B,C,D) or Likert Value (1-5)
    response_score NUMERIC(5,2), -- The actual score value used for calculation
    item_type TEXT, -- 'likert', 'scenario', 'behavioral'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS
ALTER TABLE emotional_intelligence_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own emotional assessments" 
    ON emotional_intelligence_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emotional assessments" 
    ON emotional_intelligence_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own emotional responses" 
    ON emotional_responses FOR SELECT 
    USING (EXISTS (SELECT 1 FROM emotional_intelligence_assessments WHERE assessment_id = emotional_responses.assessment_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own emotional responses" 
    ON emotional_responses FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM emotional_intelligence_assessments WHERE assessment_id = emotional_responses.assessment_id AND user_id = auth.uid()));

-- 4. Indexes
CREATE INDEX idx_emo_assessments_user_id ON emotional_intelligence_assessments(user_id);
CREATE INDEX idx_emo_responses_assessment_id ON emotional_responses(assessment_id);
