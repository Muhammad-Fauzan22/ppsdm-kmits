-- Dimension 4: Physical Health & Vitality
create table if not exists health_assessments (
    assessment_id uuid default gen_random_uuid() primary key,
    user_id uuid not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()),
    
    physical_activity_score decimal(5,2),
    sleep_quality_score decimal(5,2),
    nutrition_score decimal(5,2),
    vitality_score decimal(5,2),
    preventive_score decimal(5,2),
    
    composite_score decimal(5,2),
    health_category text,
    risk_factors jsonb,
    
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Dimension 5: Emotional & Social Intelligence
create table if not exists social_assessments (
    assessment_id uuid default gen_random_uuid() primary key,
    user_id uuid not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()),
    
    awareness_score decimal(5,2),
    regulation_score decimal(5,2),
    empathy_score decimal(5,2),
    social_skills_score decimal(5,2),
    
    composite_score decimal(5,2),
    profile_type text,
    leadership_potential decimal(5,2),
    
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Dimension 6: Mental Health (ISMHA)
create table if not exists mental_health_assessments (
    assessment_id uuid default gen_random_uuid() primary key,
    user_id uuid not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()),
    
    emotional_score decimal(5,2),
    resilience_score decimal(5,2),
    stress_score decimal(5,2),
    social_support_score decimal(5,2),
    
    total_score decimal(5,2),
    percentile_rank decimal(5,2),
    risk_level text,
    validity_index decimal(5,2),
    red_flags jsonb,
    
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Dimension 7: Character & Ethics (CAS-8)
create table if not exists character_assessments (
    assessment_id uuid default gen_random_uuid() primary key,
    user_id uuid not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()),
    
    -- Sub-scores
    integrity_score decimal(5,2),
    moral_courage_score decimal(5,2),
    responsibility_score decimal(5,2),
    fairness_score decimal(5,2),
    humility_score decimal(5,2),
    
    composite_score decimal(5,2), -- IRT-based Theta transformed
    percentile_rank decimal(5,2), -- Normative percentile
    character_level text, -- 'Exceptional', 'Strong', 'Developing', 'Basic', 'Needs Improvement'
    
    responses jsonb, -- Store raw answers for research
    
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Row Level Security
alter table health_assessments enable row level security;
alter table social_assessments enable row level security;
alter table mental_health_assessments enable row level security;
alter table character_assessments enable row level security;

-- Policies
create policy "Users can view their own health results" on health_assessments for select using (auth.uid() = user_id);
create policy "Users can insert their own health results" on health_assessments for insert with check (auth.uid() = user_id);

create policy "Users can view their own social results" on social_assessments for select using (auth.uid() = user_id);
create policy "Users can insert their own social results" on social_assessments for insert with check (auth.uid() = user_id);

create policy "Users can view their own mental results" on mental_health_assessments for select using (auth.uid() = user_id);
create policy "Users can insert their own mental results" on mental_health_assessments for insert with check (auth.uid() = user_id);

create policy "Users can view their own character results" on character_assessments for select using (auth.uid() = user_id);
create policy "Users can insert their own character results" on character_assessments for insert with check (auth.uid() = user_id);
