
-- Dimension 8: Spiritual Development (ISDS)
create table if not exists spiritual_assessments (
    assessment_id uuid default gen_random_uuid() primary key,
    user_id uuid not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()),
    
    -- Sub-dimensions
    purpose_meaning_score decimal(5,2),
    gratitude_mindfulness_score decimal(5,2),
    connectedness_score decimal(5,2),
    altruism_score decimal(5,2),
    
    -- Overall
    raw_total_score integer,
    standardized_score decimal(5,2),
    balance_index decimal(4,3),
    developmental_stage text,
    percentile_rank decimal(5,2),
    
    responses jsonb,
    
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Row Level Security
alter table spiritual_assessments enable row level security;

-- Policies
create policy "Users can view their own spiritual results" on spiritual_assessments for select using (auth.uid() = user_id);
create policy "Users can insert their own spiritual results" on spiritual_assessments for insert with check (auth.uid() = user_id);
