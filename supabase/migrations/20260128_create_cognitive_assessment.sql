-- Cognitive Assessment Tables based on Scientific Validation Study
-- Author: PPSDM KMITS Research Team

create table if not exists cognitive_assessments (
    assessment_id uuid default gen_random_uuid() primary key,
    user_id uuid not null, -- Assumes linking to auth.users or public.users
    completed_at timestamp with time zone default timezone('utc'::text, now()),
    total_duration_seconds integer,
    
    -- Sub-dimension scores (0-100 scale)
    critical_thinking_score decimal(5,2),
    growth_mindset_score decimal(5,2),
    creative_efficacy_score decimal(5,2),
    metacognition_score decimal(5,2),
    
    -- Composite scores
    cognitive_index decimal(5,2),
    overall_percentile decimal(5,2),
    development_level text,
    
    -- Validity indicators
    response_consistency decimal(5,2),
    validity_flag boolean default true,
    
    -- Metadata
    assessment_version text default '1.0.0',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists cognitive_responses (
    response_id uuid default gen_random_uuid() primary key,
    assessment_id uuid references cognitive_assessments(assessment_id) on delete cascade,
    item_id text not null,
    response_value integer check (response_value between 1 and 5),
    response_time_ms integer,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    
    unique(assessment_id, item_id)
);

-- RLS Policies
alter table cognitive_assessments enable row level security;
alter table cognitive_responses enable row level security;

create policy "Users can view their own assessments"
    on cognitive_assessments for select
    using (auth.uid() = user_id);

create policy "Users can insert their own assessments"
    on cognitive_assessments for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own responses"
    on cognitive_responses for select
    using ( exists ( select 1 from cognitive_assessments ca where ca.assessment_id = cognitive_responses.assessment_id and ca.user_id = auth.uid() ) );

create policy "Users can insert their own responses"
    on cognitive_responses for insert
    with check ( exists ( select 1 from cognitive_assessments ca where ca.assessment_id = cognitive_responses.assessment_id and ca.user_id = auth.uid() ) );
