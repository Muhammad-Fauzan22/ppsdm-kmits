-- Environmental Assessment Tables

CREATE TABLE IF NOT EXISTS public.environmental_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_score DECIMAL(5,2) NOT NULL,
    
    -- Subscores
    awareness_score DECIMAL(5,2),
    sustainable_behavior_score DECIMAL(5,2),
    work_life_balance_score DECIMAL(5,2),
    digital_wellbeing_score DECIMAL(5,2),
    minimalism_score DECIMAL(5,2),
    energy_conservation_score DECIMAL(5,2),
    community_engagement_score DECIMAL(5,2),
    advocacy_score DECIMAL(5,2),
    
    faculty_mean_comparison DECIMAL(5,2),
    percentile_rank DECIMAL(5,2),
    
    analysis_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.environmental_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.environmental_assessments(id) ON DELETE CASCADE,
    question_id VARCHAR(10) NOT NULL,
    response_value INTEGER NOT NULL,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.environmental_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own environmental assessments" 
ON public.environmental_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own environmental assessments" 
ON public.environmental_assessments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own environmental responses" 
ON public.environmental_responses FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.environmental_assessments 
        WHERE id = environmental_responses.assessment_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own environmental responses" 
ON public.environmental_responses FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.environmental_assessments 
        WHERE id = environmental_responses.assessment_id 
        AND user_id = auth.uid()
    )
);
