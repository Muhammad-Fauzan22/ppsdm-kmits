-- Self-Management & Productivity Assessment Tables
-- Based on Validation Study (N=1,200)

create table if not exists self_management_assessments (
    assessment_id uuid default gen_random_uuid() primary key,
    user_id uuid not null, -- Stores user_id for registered users
    completed_at timestamp with time zone default timezone('utc'::text, now()),
    
    -- Sub-dimension scores (Normalized 0-100)
    time_management_score decimal(5,2),
    procrastination_score decimal(5,2), -- Reverse scored and normalized
    self_control_score decimal(5,2),
    goal_setting_score decimal(5,2),
    
    -- Composite
    total_raw_score decimal(5,2),
    normalized_score decimal(5,2), -- 0-100 Scale
    productivity_level text, -- Beginning, Developing, Competent, Advanced, Excellent
    percentile_rank decimal(5,2),
    
    -- Metadata
    assessment_version text default '1.0.0',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies
alter table self_management_assessments enable row level security;

create policy "Users can view their own self-management results"
    on self_management_assessments for select
    using (auth.uid() = user_id);

create policy "Users can insert their own self-management results"
    on self_management_assessments for insert
    with check (auth.uid() = user_id);
