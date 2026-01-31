-- Financial Intelligence Assessment (Dimension 3) Tables

-- 1. Assessment Results Table
CREATE TABLE IF NOT EXISTS financial_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Composite Scores
    composite_score NUMERIC(5,2),
    composite_percentile NUMERIC(5,2),
    intelligence_level TEXT, -- 'Advanced', 'Proficient', 'Basic', 'Below Basic'
    
    -- Component Scores (0-100)
    knowledge_score NUMERIC(5,2),
    knowledge_percentile NUMERIC(5,2),
    knowledge_theta NUMERIC(5,3), -- IRT Ability Estimate
    
    behavior_score NUMERIC(5,2),
    behavior_percentile NUMERIC(5,2),
    
    attitude_score NUMERIC(5,2),
    attitude_percentile NUMERIC(5,2),
    
    -- Rich Data
    subdomain_scores JSONB, -- Breakdown by category (budgeting, tracking, etc.)
    recommendations JSONB, -- Personalized recommendations array
    properties JSONB, -- Psychometric metadata
    
    -- Metadata
    completion_time_seconds INTEGER,
    assessment_version TEXT DEFAULT '2.1'
);

-- 2. Response Tables (Normalized for detailed analysis)

-- Knowledge Responses
CREATE TABLE IF NOT EXISTS financial_knowledge_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES financial_assessments(assessment_id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_value TEXT, -- Option selected (a, b, c, d)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Behavior Responses
CREATE TABLE IF NOT EXISTS financial_behavior_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES financial_assessments(assessment_id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    response_value INTEGER NOT NULL, -- 1-5 scale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attitude Responses
CREATE TABLE IF NOT EXISTS financial_attitude_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES financial_assessments(assessment_id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    response_value INTEGER NOT NULL, -- 1-5 scale
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Row Level Security Policies

ALTER TABLE financial_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_knowledge_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_behavior_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_attitude_responses ENABLE ROW LEVEL SECURITY;

-- Assessments Policies
CREATE POLICY "Users can view own financial assessments" 
    ON financial_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own financial assessments" 
    ON financial_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Responses Policies
CREATE POLICY "Users can view own knowledge responses" 
    ON financial_knowledge_responses FOR SELECT 
    USING (EXISTS (SELECT 1 FROM financial_assessments WHERE assessment_id = financial_knowledge_responses.assessment_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own knowledge responses" 
    ON financial_knowledge_responses FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM financial_assessments WHERE assessment_id = financial_knowledge_responses.assessment_id AND user_id = auth.uid()));

CREATE POLICY "Users can view own behavior responses" 
    ON financial_behavior_responses FOR SELECT 
    USING (EXISTS (SELECT 1 FROM financial_assessments WHERE assessment_id = financial_behavior_responses.assessment_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own behavior responses" 
    ON financial_behavior_responses FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM financial_assessments WHERE assessment_id = financial_behavior_responses.assessment_id AND user_id = auth.uid()));

CREATE POLICY "Users can view own attitude responses" 
    ON financial_attitude_responses FOR SELECT 
    USING (EXISTS (SELECT 1 FROM financial_assessments WHERE assessment_id = financial_attitude_responses.assessment_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own attitude responses" 
    ON financial_attitude_responses FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM financial_assessments WHERE assessment_id = financial_attitude_responses.assessment_id AND user_id = auth.uid()));

-- 4. Indexes
CREATE INDEX idx_fin_assessments_user_id ON financial_assessments(user_id);
CREATE INDEX idx_fin_know_resp_assessment_id ON financial_knowledge_responses(assessment_id);
CREATE INDEX idx_fin_beh_resp_assessment_id ON financial_behavior_responses(assessment_id);
CREATE INDEX idx_fin_att_resp_assessment_id ON financial_attitude_responses(assessment_id);
