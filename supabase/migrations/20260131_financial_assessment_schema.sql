-- Financial Intelligence Assessment Tables

-- Main assessment tracking table
CREATE TABLE IF NOT EXISTS financial_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completion_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    total_duration_seconds INTEGER,
    validity_index DECIMAL(5,2),
    assessment_version VARCHAR(10) DEFAULT '2.1'
);

-- Detailed responses
CREATE TABLE IF NOT EXISTS financial_knowledge_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES financial_assessments(assessment_id) ON DELETE CASCADE,
    item_id VARCHAR(10) NOT NULL,
    response VARCHAR(10),
    is_correct BOOLEAN,
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS financial_behavior_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES financial_assessments(assessment_id) ON DELETE CASCADE,
    item_id VARCHAR(10) NOT NULL,
    response_value INTEGER CHECK (response_value BETWEEN 1 AND 5),
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS financial_attitude_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES financial_assessments(assessment_id) ON DELETE CASCADE,
    item_id VARCHAR(10) NOT NULL,
    response_value INTEGER CHECK (response_value BETWEEN 1 AND 5),
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Aggregated scores
CREATE TABLE IF NOT EXISTS financial_assessment_scores (
    score_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES financial_assessments(assessment_id) ON DELETE CASCADE,
    knowledge_score DECIMAL(5,2),
    behavior_score DECIMAL(5,2),
    attitude_score DECIMAL(5,2),
    composite_score DECIMAL(5,2),
    knowledge_percentile DECIMAL(5,2),
    behavior_percentile DECIMAL(5,2),
    attitude_percentile DECIMAL(5,2),
    composite_percentile DECIMAL(5,2),
    intelligence_level VARCHAR(50),
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Recommendations
CREATE TABLE IF NOT EXISTS financial_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES financial_assessments(assessment_id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50),
    priority VARCHAR(20),
    action_text TEXT,
    resources JSONB,
    timeline VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_financial_assessments_user_id ON financial_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_scores_assessment_id ON financial_assessment_scores(assessment_id);
