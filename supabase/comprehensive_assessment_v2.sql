-- ============================================
-- PPSDM KMM - HOLISTIC ASSESSMENT V2 SCHEMA
-- Supports Integrated 9-Dimension Matrix & Archetypes
-- ============================================

-- =============================================
-- HOLISTIC PROFILES
-- Stores the high-level result of the 9-dim assessment
-- =============================================

CREATE TABLE IF NOT EXISTS public.holistic_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.comprehensive_sessions(id), -- Link to raw session
    
    -- Context Snapshot
    academic_year VARCHAR(20), -- freshman, sophomore...
    faculty VARCHAR(50),      -- engineering, business...
    career_path VARCHAR(50),  -- entrepreneur, research...
    
    -- Archetype Analysis
    primary_archetype VARCHAR(50),
    archetype_confidence DECIMAL(4,3),
    secondary_archetypes TEXT[], -- Array of strings
    
    -- Aggregate Metrics
    overall_score DECIMAL(5,2),
    balance_index DECIMAL(4,3), -- 0.0 to 1.0
    profile_variance DECIMAL(10,2),
    
    -- JSON Data for Complex Objects
    interaction_matrix JSONB, -- The calculated 9x9 matrix effects
    growth_projection JSONB,  -- The 12-month projection array
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- HOLISTIC DIMENSION SCORES
-- Detailed breakdown per dimension
-- =============================================

CREATE TABLE IF NOT EXISTS public.holistic_dimension_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.holistic_assessments(id) ON DELETE CASCADE,
    dimension VARCHAR(50) NOT NULL,
    
    raw_score DECIMAL(5,2) NOT NULL,
    contextual_score DECIMAL(5,2), -- Adjusted for year/major
    percentile_rank DECIMAL(5,2),
    
    status VARCHAR(20), -- strength, gap, neutral
    
    -- Interaction Effects
    net_influence_on_others DECIMAL(5,2), -- How much this dim helps others
    net_impact_from_others DECIMAL(5,2),  -- How much others help this dim
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assessment_id, dimension)
);

-- =============================================
-- HOLISTIC RECOMMENDATIONS
-- Matrix-driven action items
-- =============================================

CREATE TABLE IF NOT EXISTS public.holistic_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.holistic_assessments(id) ON DELETE CASCADE,
    dimension VARCHAR(50) NOT NULL,
    
    action_title VARCHAR(255) NOT NULL,
    action_type VARCHAR(20) CHECK (action_type IN ('immediate', 'strategic', 'compensatory')),
    impact_score DECIMAL(4,2), -- Calculated ROI
    
    resource_link VARCHAR(500),
    is_completed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.holistic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holistic_dimension_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holistic_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own holistic assessments" ON public.holistic_assessments 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users view own dimension scores" ON public.holistic_dimension_scores 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.holistic_assessments WHERE id = assessment_id AND user_id = auth.uid())
    );

CREATE POLICY "Users view own recommendations" ON public.holistic_recommendations 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.holistic_assessments WHERE id = assessment_id AND user_id = auth.uid())
    );

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_holistic_assessments_user ON public.holistic_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_holistic_scores_assessment ON public.holistic_dimension_scores(assessment_id);
