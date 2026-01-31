-- Mental Health Assessment (Dimension 6) Tables

-- 1. Assessment Results Table
CREATE TABLE IF NOT EXISTS mental_health_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Scores
    raw_score NUMERIC(5,2),
    normalized_score NUMERIC(5,2), -- 0-100
    percentile NUMERIC(5,2),
    
    -- Classification
    risk_level TEXT, -- 'low_risk', 'moderate_risk', 'high_risk', 'critical_risk'
    
    -- Subscales (JSONB)
    -- { emotional_wellbeing: {score, level}, ... }
    subscales JSONB, 
    
    -- Validity & Risk Data
    validity_score NUMERIC(5,2), 
    validity_flags JSONB, -- ['too_fast', 'straight_lining']
    red_flags JSONB,      -- ['very_low_mood', 'suicidal_ideation_proxy']
    
    -- Responses Snapshot (or separate table, keeping JSONB here for simplicity if separate not strictly needed)
    responses JSONB, 
    
    -- Recommendations
    recommendations JSONB,
    interpretation TEXT,

    assessment_version TEXT DEFAULT '1.0'
);

-- 2. Risk Tracking (Longitudinal)
-- To quickly query students who are consistently at risk
CREATE TABLE IF NOT EXISTS mental_health_risk_tracking (
    tracking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_assessment_id UUID REFERENCES mental_health_assessments(assessment_id),
    current_risk_level TEXT,
    risk_factors JSONB, -- Aggregated flags
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active', -- active, resolved, monitoring
    notes TEXT
);

-- 3. RLS
ALTER TABLE mental_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_risk_tracking ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own mental health assessments" 
    ON mental_health_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mental health assessments" 
    ON mental_health_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own risk tracking" 
    ON mental_health_risk_tracking FOR SELECT USING (auth.uid() = user_id);
-- (Insert usually managed by system/triggers, but for client-side app logic we allow insert if matched user)
CREATE POLICY "Users can insert own risk tracking" 
    ON mental_health_risk_tracking FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Indexes
CREATE INDEX idx_mh_assessments_user_id ON mental_health_assessments(user_id);
CREATE INDEX idx_mh_risk_tracking_user_id ON mental_health_risk_tracking(user_id);
CREATE INDEX idx_mh_risk_level ON mental_health_assessments(risk_level);
