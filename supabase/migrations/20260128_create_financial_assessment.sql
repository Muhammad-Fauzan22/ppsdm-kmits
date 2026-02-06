-- Financial Intelligence Assessment Tables (Dimension 3)

create table if not exists financial_assessments (
    assessment_id uuid default gen_random_uuid() primary key,
    user_id uuid not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()),
    
    -- Subscores (Normalized 0-100)
    knowledge_score decimal(5,2),
    behavior_score decimal(5,2),
    attitude_score decimal(5,2),
    
    -- Composite
    composite_score decimal(5,2), -- (0.3*K + 0.4*B + 0.3*A)
    percentile_rank decimal(5,2),
    financial_level text, -- 'Financially Savvy', 'Competent', 'Developing', 'Basic'
    
    -- Metadata table
    validity_index decimal(5,2) default 100.0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Store responses (Unified 3 types: 'knowledge', 'behavior', 'attitude')
create table if not exists financial_responses (
    response_id uuid default gen_random_uuid() primary key,
    assessment_id uuid references financial_assessments(assessment_id) on delete cascade,
    item_id text not null,
    section text not null, -- 'knowledge', 'behavior', 'attitude'
    response_value text, -- 'a','b','c','d' for knowledge OR '1'-'5' for likert
    is_correct boolean, -- Only for knowledge
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS
alter table financial_assessments enable row level security;
alter table financial_responses enable row level security;

create policy "Users can view their own financial results"
    on financial_assessments for select using (auth.uid() = user_id);

create policy "Users can insert their own financial results"
    on financial_assessments for insert with check (auth.uid() = user_id);

create policy "Users can view their own financial responses"
    on financial_responses for select using (
        exists (select 1 from financial_assessments a where a.assessment_id = financial_responses.assessment_id and a.user_id = auth.uid())
    );

create policy "Users can insert their own financial responses"
    on financial_responses for insert with check (
        exists (select 1 from financial_assessments a where a.assessment_id = financial_responses.assessment_id and a.user_id = auth.uid())
    );
