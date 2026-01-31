-- Create character_assessments table
CREATE TABLE IF NOT EXISTS public.character_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Scores
    overall_score DECIMAL(5,2) NOT NULL,
    integrity_score DECIMAL(5,2),
    courage_score DECIMAL(5,2),
    fairness_score DECIMAL(5,2),
    responsibility_score DECIMAL(5,2),
    humility_score DECIMAL(5,2),
    compassion_score DECIMAL(5,2),
    self_discipline_score DECIMAL(5,2),
    ethical_decision_score DECIMAL(5,2),
    
    -- Metadata
    risk_level VARCHAR(50), -- "Exceptional", "Strong", "Developing", "Basic", "Needs Attention"
    percentile_rank DECIMAL(5,2),
    validity_index INTEGER DEFAULT 100,
    
    recommendations JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create character_responses table for detailed item logging & validity audits
CREATE TABLE IF NOT EXISTS public.character_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.character_assessments(id) ON DELETE CASCADE,
    question_id VARCHAR(20) NOT NULL,
    response_value INTEGER NOT NULL, -- 1-5 for Likert, or Option Index
    response_time_ms INTEGER, -- For validity tracking
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.character_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_responses ENABLE ROW LEVEL SECURITY;

-- Policies for character_assessments
CREATE POLICY "Users can insert their own character assessments"
    ON public.character_assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own character assessments"
    ON public.character_assessments FOR SELECT
    USING (auth.uid() = user_id);

-- Policies for character_responses
CREATE POLICY "Users can insert their own character responses"
    ON public.character_responses FOR INSERT
    WITH CHECK (
        assessment_id IN (
            SELECT id FROM public.character_assessments WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their own character responses"
    ON public.character_responses FOR SELECT
    USING (
        assessment_id IN (
            SELECT id FROM public.character_assessments WHERE user_id = auth.uid()
        )
    );
