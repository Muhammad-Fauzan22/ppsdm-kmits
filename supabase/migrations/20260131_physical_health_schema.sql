-- Migration: 20260131_physical_health_schema.sql
-- Description: Create tables for ISPHVA-8 Assessment

-- 1. Assessment Header Table
CREATE TABLE IF NOT EXISTS public.physical_health_assessments (
    assessment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_score DECIMAL(5,2) CHECK (total_score >= 0 AND total_score <= 100),
    percentile DECIMAL(5,2),
    health_category VARCHAR(50),
    validity_index DECIMAL(5,2) DEFAULT 100.00,
    response_time_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Responses Table (Detail)
CREATE TABLE IF NOT EXISTS public.physical_health_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.physical_health_assessments(assessment_id) ON DELETE CASCADE,
    question_id VARCHAR(10) NOT NULL,
    response_value INTEGER NOT NULL,
    response_time_ms INTEGER,
    confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_id, question_id)
);

-- 3. Subdomains Scores
CREATE TABLE IF NOT EXISTS public.physical_health_subdomains (
    subdomain_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.physical_health_assessments(assessment_id) ON DELETE CASCADE,
    subdomain_name VARCHAR(50) NOT NULL,
    subdomain_score DECIMAL(5,2),
    interpretation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Risk Flags
CREATE TABLE IF NOT EXISTS public.health_risk_flags (
    flag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.physical_health_assessments(assessment_id) ON DELETE CASCADE,
    risk_code VARCHAR(50) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    flag_message TEXT,
    recommendation TEXT,
    acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ph_assessments_user ON public.physical_health_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_ph_assessments_date ON public.physical_health_assessments(completion_date);
CREATE INDEX IF NOT EXISTS idx_ph_responses_assessment ON public.physical_health_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_health_risk_flags_assessment ON public.health_risk_flags(assessment_id);

-- RLS Policies (Enable RLS first)
ALTER TABLE public.physical_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_health_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_health_subdomains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_risk_flags ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see only their own assessments
CREATE POLICY "Users can view own physical assessments" ON public.physical_health_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own physical assessments" ON public.physical_health_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Responses accessible via assessment ownership
CREATE POLICY "Users can view own responses" ON public.physical_health_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.physical_health_assessments a
            WHERE a.assessment_id = physical_health_responses.assessment_id
            AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own responses" ON public.physical_health_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.physical_health_assessments a
            WHERE a.assessment_id = physical_health_responses.assessment_id
            AND a.user_id = auth.uid()
        )
    );

-- Similar policies for subdomains can be added if accessed directly, 
-- usually fetched with assessment so standard join logic applies or explicit policy.
CREATE POLICY "Users can view own subdomains" ON public.physical_health_subdomains
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.physical_health_assessments a
            WHERE a.assessment_id = physical_health_subdomains.assessment_id
            AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own subdomains" ON public.physical_health_subdomains
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.physical_health_assessments a
            WHERE a.assessment_id = physical_health_subdomains.assessment_id
            AND a.user_id = auth.uid()
        )
    );

-- Risk Flags
CREATE POLICY "Users can view own risk flags" ON public.health_risk_flags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.physical_health_assessments a
            WHERE a.assessment_id = health_risk_flags.assessment_id
            AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own risk flags" ON public.health_risk_flags
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.physical_health_assessments a
            WHERE a.assessment_id = health_risk_flags.assessment_id
            AND a.user_id = auth.uid()
        )
    );
