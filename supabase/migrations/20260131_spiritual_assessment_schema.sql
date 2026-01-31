-- Spiritual Assessment Tables

CREATE TABLE IF NOT EXISTS public.spiritual_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    raw_score INTEGER NOT NULL,
    normalized_score DECIMAL(5,2) NOT NULL,
    t_score DECIMAL(5,2),
    percentile_rank DECIMAL(5,2),
    
    -- Subscores
    purpose_meaning_score DECIMAL(5,2),
    gratitude_mindfulness_score DECIMAL(5,2),
    connectedness_transcendence_score DECIMAL(5,2),
    altruism_contribution_score DECIMAL(5,2),
    
    balance_index DECIMAL(4,3),
    developmental_stage VARCHAR(50), -- Awakening, Exploring, Integrating, Expressing, Transcending
    
    analysis_json JSONB DEFAULT '{}'::jsonb, -- Store raw recommendations/metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.spiritual_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.spiritual_assessments(id) ON DELETE CASCADE,
    question_id VARCHAR(10) NOT NULL,
    response_value INTEGER NOT NULL,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.spiritual_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own spiritual assessments" 
ON public.spiritual_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own spiritual assessments" 
ON public.spiritual_assessments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own spiritual responses" 
ON public.spiritual_responses FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.spiritual_assessments 
        WHERE id = spiritual_responses.assessment_id 
        AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can view their own spiritual responses" 
ON public.spiritual_responses FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.spiritual_assessments 
        WHERE id = spiritual_responses.assessment_id 
        AND user_id = auth.uid()
    )
);
