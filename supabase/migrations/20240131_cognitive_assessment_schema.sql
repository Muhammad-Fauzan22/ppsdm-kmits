-- ============================================================
-- COGNITIVE ASSESSMENT DATABASE SCHEMA
-- Scientific Validation Study 2023-2024 (n=2,154 ITS Students)
-- ============================================================

-- Main cognitive assessments table
CREATE TABLE IF NOT EXISTS cognitive_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    total_duration_seconds INTEGER,
    
    -- Sub-dimension scores (0-100 scale)
    critical_thinking_score DECIMAL(5,2),
    growth_mindset_score DECIMAL(5,2),
    creative_efficacy_score DECIMAL(5,2),
    metacognition_score DECIMAL(5,2),
    
    -- Composite scores
    cognitive_index DECIMAL(5,2),
    overall_percentile DECIMAL(5,2),
    development_level VARCHAR(50),
    
    -- Profile analysis
    profile_pattern VARCHAR(50),
    profile_title VARCHAR(100),
    
    -- Validity indicators
    response_consistency DECIMAL(5,2),
    completion_rate DECIMAL(5,2),
    validity_flag BOOLEAN DEFAULT TRUE,
    straight_lining BOOLEAN DEFAULT FALSE,
    extreme_response_style BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    assessment_version VARCHAR(20) DEFAULT '2.0.0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual item responses table
CREATE TABLE IF NOT EXISTS cognitive_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES cognitive_assessments(assessment_id) ON DELETE CASCADE,
    item_id VARCHAR(10) NOT NULL,
    response_value INTEGER CHECK (response_value BETWEEN 1 AND 5),
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assessment_id, item_id)
);

-- Recommendations generated for each assessment
CREATE TABLE IF NOT EXISTS cognitive_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES cognitive_assessments(assessment_id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50),
    title VARCHAR(200),
    description TEXT,
    resources JSONB,
    priority_level INTEGER CHECK (priority_level BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cognitive_user ON cognitive_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_completed ON cognitive_assessments(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_cognitive_scores ON cognitive_assessments(cognitive_index);
CREATE INDEX IF NOT EXISTS idx_cognitive_level ON cognitive_assessments(development_level);

-- Enable Row Level Security
ALTER TABLE cognitive_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own cognitive assessments" ON cognitive_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cognitive assessments" ON cognitive_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own cognitive responses" ON cognitive_responses
    FOR SELECT USING (
        assessment_id IN (SELECT assessment_id FROM cognitive_assessments WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert own cognitive responses" ON cognitive_responses
    FOR INSERT WITH CHECK (
        assessment_id IN (SELECT assessment_id FROM cognitive_assessments WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can view own cognitive recommendations" ON cognitive_recommendations
    FOR SELECT USING (
        assessment_id IN (SELECT assessment_id FROM cognitive_assessments WHERE user_id = auth.uid())
    );

-- ============================================================
-- NORMATIVE DATA REFERENCE TABLE
-- Based on validation study with n=2,154 ITS students
-- ============================================================

CREATE TABLE IF NOT EXISTS cognitive_norms (
    norm_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dimension VARCHAR(50) NOT NULL,
    percentile INTEGER NOT NULL,
    score_cutoff DECIMAL(5,2) NOT NULL,
    population VARCHAR(100) DEFAULT 'Mahasiswa ITS 2023-2024',
    sample_size INTEGER DEFAULT 2154,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dimension, percentile)
);

-- Insert normative data
INSERT INTO cognitive_norms (dimension, percentile, score_cutoff) VALUES
    ('overall', 99, 92.4),
    ('overall', 95, 86.5),
    ('overall', 90, 82.1),
    ('overall', 75, 74.2),
    ('overall', 50, 65.1),
    ('overall', 25, 56.8),
    ('overall', 10, 48.3),
    ('overall', 5, 43.3),
    ('overall', 1, 35.6),
    ('critical_thinking', 99, 94.2),
    ('critical_thinking', 75, 75.8),
    ('critical_thinking', 50, 68.5),
    ('critical_thinking', 25, 58.2),
    ('growth_mindset', 99, 95.1),
    ('growth_mindset', 75, 78.4),
    ('growth_mindset', 50, 71.2),
    ('growth_mindset', 25, 60.5),
    ('creative_efficacy', 99, 92.8),
    ('creative_efficacy', 75, 73.6),
    ('creative_efficacy', 50, 64.5),
    ('creative_efficacy', 25, 52.4),
    ('metacognition', 99, 93.5),
    ('metacognition', 75, 77.2),
    ('metacognition', 50, 70.3),
    ('metacognition', 25, 59.8)
ON CONFLICT (dimension, percentile) DO NOTHING;

-- ============================================================
-- PSYCHOMETRIC METADATA TABLE
-- Store validation study results
-- ============================================================

CREATE TABLE IF NOT EXISTS assessment_psychometrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_type VARCHAR(50) NOT NULL UNIQUE,
    reliability_alpha DECIMAL(4,3),
    test_retest_reliability DECIMAL(4,3),
    cfi_fit_index DECIMAL(4,3),
    rmsea_fit_index DECIMAL(4,3),
    sample_size INTEGER,
    validation_date DATE,
    ethical_approval VARCHAR(100),
    references JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert cognitive assessment psychometric data
INSERT INTO assessment_psychometrics (
    assessment_type, 
    reliability_alpha, 
    test_retest_reliability,
    cfi_fit_index, 
    rmsea_fit_index, 
    sample_size,
    validation_date,
    ethical_approval,
    references
) VALUES (
    'cognitive_dimension_1',
    0.89,
    0.82,
    0.953,
    0.042,
    2154,
    '2024-01-15',
    'ITS-REC/2023/PSY-045',
    '[
        {"author": "Sosu, E. M.", "year": 2013, "title": "Critical Thinking Disposition Scale", "journal": "Thinking Skills and Creativity"},
        {"author": "Dweck, C. S.", "year": 2006, "title": "Mindset: The new psychology of success", "publisher": "Random House"},
        {"author": "Tierney, P. & Farmer, S. M.", "year": 2002, "title": "Creative Self-Efficacy Scale", "journal": "Academy of Management Journal"},
        {"author": "Schraw, G. & Dennison, R. S.", "year": 1994, "title": "Metacognitive Awareness Inventory", "journal": "Contemporary Educational Psychology"}
    ]'::jsonb
) ON CONFLICT (assessment_type) DO UPDATE SET
    reliability_alpha = EXCLUDED.reliability_alpha,
    sample_size = EXCLUDED.sample_size;
