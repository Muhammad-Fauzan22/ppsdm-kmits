-- =============================================
-- PPSDM KMM - MASTER MIGRATION V3 (THE TRULY COMPLETE EDITION)
-- Includes: LMS, LogicFlow, Assessments (Full), Ecological (Full), & Admin
-- Run this AFTER running 'reset_database.sql'
-- =============================================

-- Enable extensions
create extension if not exists vector;
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. CORE LMS (Books, Progress, XP)
-- =============================================
create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  google_drive_id text unique,
  drive_url text, 
  file_url text,  
  thumbnail_url text, 
  cover_url text, 
  mime_type text default 'application/pdf',
  title text not null,
  author text,
  isbn text,
  publisher text,
  published_year integer,
  category text,
  description text,
  page_count integer,
  language text default 'id',
  search_vector tsvector, 
  embedding vector(384), 
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists books_search_idx on public.books using gin(search_vector);

create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete cascade not null,
  current_page integer default 1,
  total_pages integer,
  progress_percentage integer default 0,
  status text check (status in ('started', 'completed', 'archived')) default 'started',
  last_read_at timestamptz default now(),
  notes jsonb default '[]'::jsonb,
  unique(user_id, book_id)
);

create table if not exists public.xp_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  amount integer not null,
  reason text,
  created_at timestamptz default now()
);

-- =============================================
-- 2. LOGICFLOW ENGINE
-- =============================================
create table if not exists public.workflows (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  is_active boolean default false,
  nodes jsonb default '[]'::jsonb,
  edges jsonb default '[]'::jsonb,
  trigger_type text default 'webhook',
  trigger_config jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.workflow_executions (
  id uuid default gen_random_uuid() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade,
  status text check (status in ('pending', 'running', 'completed', 'failed')) default 'pending',
  started_at timestamptz default now(),
  completed_at timestamptz,
  logs jsonb default '[]'::jsonb,
  input_payload jsonb,
  output_result jsonb
);

-- =============================================
-- 3. ADMIN SYSTEM
-- =============================================
create table if not exists public.admins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null,
  created_at timestamptz default now()
);

-- =============================================
-- 4. ECOLOGICAL SYSTEMS (FULL SCHEMA)
-- =============================================

-- CORE: STAKEHOLDERS
create table if not exists public.stakeholders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  role varchar(50) not null check (role in ('student', 'lecturer', 'advisor', 'counselor', 'org_leader', 'department_head', 'dean', 'vice_rector', 'rector', 'ministry', 'industry_partner', 'researcher', 'admin')),
  system_layer varchar(20) not null check (system_layer in ('micro', 'meso', 'exo', 'macro', 'chrono')),
  organization varchar(200),
  department varchar(200),
  access_level int default 1,
  dashboard_config jsonb default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- LAYER 1: CHRONOSYSTEM (Time & Evolution)
create table if not exists public.chrono_trajectories (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade,
  time_period varchar(50) not null,
  academic_year varchar(20),
  semester int,
  ecological_context jsonb default '{}',
  proximal_processes jsonb default '{}',
  achievements text[] default '{}',
  challenges text[] default '{}',
  growth_indicators jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.chrono_system_changes (
  id uuid primary key default gen_random_uuid(),
  system_layer varchar(50) not null,
  change_type varchar(100) not null,
  title varchar(200) not null,
  description text,
  before_state jsonb default '{}',
  after_state jsonb default '{}',
  impact_metrics jsonb default '{}',
  change_date timestamptz default now(),
  status varchar(50) default 'pending'
);

-- LAYER 2: MACROSYSTEM (National/Global)
create table if not exists public.macro_national_benchmarks (
  id uuid primary key default gen_random_uuid(),
  dimension varchar(50) not null,
  metric_name varchar(100) not null,
  national_average decimal(5,2),
  year int not null,
  source varchar(200),
  created_at timestamptz default now()
);

-- LAYER 3: EXOSYSTEM (Institutional)
create table if not exists public.exo_institutional_policies (
  id uuid primary key default gen_random_uuid(),
  policy_code varchar(50) unique not null,
  title varchar(200) not null,
  description text,
  category varchar(100) not null,
  effective_date date not null,
  compliance_requirements jsonb default '{}',
  status varchar(50) default 'draft',
  created_at timestamptz default now()
);

create table if not exists public.exo_resource_allocations (
  id uuid primary key default gen_random_uuid(),
  resource_type varchar(50) not null,
  amount decimal(15,2) not null,
  allocated_to varchar(200) not null,
  fiscal_year int not null,
  created_at timestamptz default now()
);

-- LAYER 4: MESOSYSTEM (Interactions)
create table if not exists public.meso_coordinations (
  id uuid primary key default gen_random_uuid(),
  from_system varchar(100) not null,
  to_system varchar(100) not null,
  coordination_type varchar(100) not null,
  title varchar(200) not null,
  meeting_frequency varchar(50),
  created_at timestamptz default now()
);

create table if not exists public.meso_integrated_projects (
  id uuid primary key default gen_random_uuid(),
  project_name varchar(200) not null,
  involved_systems text[] not null,
  objectives jsonb not null,
  status varchar(50) default 'planning',
  lead_coordinator uuid references public.stakeholders(id),
  created_at timestamptz default now()
);

-- LAYER 5: MICROSYSTEM (Direct Interaction)
create table if not exists public.micro_academic_activities (
  id uuid primary key default gen_random_uuid(),
  course_id varchar(50) not null,
  course_name varchar(200) not null,
  activity_type varchar(50) not null,
  activity_date date not null,
  student_engagement jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.micro_personal_ecology_map (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade unique,
  microsystems jsonb default '{}',
  mesosystem_connections jsonb default '{}',
  exosystem_influences jsonb default '{}',
  macrosystem_context jsonb default '{}',
  chronosystem_events jsonb default '{}',
  support_network jsonb default '{}',
  last_updated timestamptz default now()
);

create table if not exists public.micro_proximal_processes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade,
  process_type varchar(100) not null,
  interaction_quality int check (interaction_quality between 1 and 5),
  reflection text,
  occurred_at timestamptz default now()
);

-- CORE: UNIFIED ANALYTICS
create table if not exists public.core_ecological_events (
  id uuid primary key default gen_random_uuid(),
  event_type varchar(100) not null,
  system_layer varchar(20) not null,
  source_table varchar(100) not null,
  source_id uuid not null,
  student_id uuid references auth.users(id),
  event_data jsonb not null,
  created_at timestamptz default now()
);

-- =============================================
-- 5. ASSESSMENT SYSTEM (FULL SCHEMA)
-- =============================================
create table if not exists public.assessment_instruments (
    id uuid primary key default gen_random_uuid(),
    dimension text not null, 
    module_number integer default 1,
    question_text text not null,
    question_order integer not null,
    level_indicator integer default 3,
    framework_reference text,
    estimated_seconds integer default 30,
    weight decimal(3,2) default 1.00,
    is_active boolean default true,
    created_at timestamptz default now()
);

create table if not exists public.assessment_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    session_type text not null,
    status text default 'in-progress',
    started_at timestamptz default now(),
    completed_at timestamptz,
    scores_snapshot jsonb default '{}',
    total_questions integer default 0,
    answered_questions integer default 0
);

create table if not exists public.assessment_responses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    session_id uuid not null references public.assessment_sessions(id) on delete cascade,
    instrument_id uuid not null references public.assessment_instruments(id) on delete cascade,
    response integer not null,
    created_at timestamptz default now()
);

create table if not exists public.gap_analysis_results (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    session_id uuid references public.assessment_sessions(id) on delete set null,
    dimension text not null,
    current_score integer default 0,
    ideal_score integer default 100,
    gap_score integer generated always as (ideal_score - current_score) stored,
    recommendations jsonb default '[]',
    created_at timestamptz default now(),
    unique(session_id, dimension)
);

-- High-Level Summary Table (for Dashboard speed)
create table if not exists public.dimension_scores (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    dimension text not null,
    score int default 0,
    previous_score int default 0,
    updated_at timestamptz default now(),
    unique(user_id, dimension)
);

-- =============================================
-- 6. AUTOMATED LOGGING TRIGGERS
-- =============================================
create or replace function log_ecological_event()
returns trigger as $$
begin
  insert into public.core_ecological_events (
    event_type, system_layer, source_table, source_id, student_id, event_data
  ) values (
    TG_OP, 
    'micro', 
    TG_TABLE_NAME, 
    NEW.id, 
    coalesce((to_jsonb(NEW)->>'user_id')::uuid, (to_jsonb(NEW)->>'student_id')::uuid), 
    to_jsonb(NEW)
  );
  return NEW;
end;
$$ language plpgsql;

-- Apply triggers
drop trigger if exists log_progress on public.user_progress;
create trigger log_progress after insert or update on public.user_progress for each row execute function log_ecological_event();

drop trigger if exists log_assessment on public.assessment_sessions;
create trigger log_assessment after insert or update on public.assessment_sessions for each row execute function log_ecological_event();

drop trigger if exists log_books on public.books;
create trigger log_books after insert or update on public.books for each row execute function log_ecological_event();

drop trigger if exists log_responses on public.assessment_responses;
create trigger log_responses after insert on public.assessment_responses for each row execute function log_ecological_event();

-- =============================================
-- 7. SECURITY & ACCESS CONTROL
-- =============================================
-- Enable RLS
alter table public.books enable row level security;
alter table public.user_progress enable row level security;
alter table public.xp_logs enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_executions enable row level security;
alter table public.admins enable row level security;
alter table public.stakeholders enable row level security;
alter table public.chrono_trajectories enable row level security;
alter table public.micro_personal_ecology_map enable row level security;
alter table public.assessment_sessions enable row level security;
alter table public.assessment_responses enable row level security;
alter table public.gap_analysis_results enable row level security;

-- Policies (Idempotent)
-- Public Read
drop policy if exists "Public Read Books" on public.books;
create policy "Public Read Books" on public.books for select using (true);

-- User Own Data
drop policy if exists "User Own Progress" on public.user_progress;
create policy "User Own Progress" on public.user_progress for all using (auth.uid() = user_id);

drop policy if exists "User Own XP" on public.xp_logs;
create policy "User Own XP" on public.xp_logs for select using (auth.uid() = user_id);

drop policy if exists "User Own Ecology" on public.micro_personal_ecology_map;
create policy "User Own Ecology" on public.micro_personal_ecology_map for all using (auth.uid() = student_id);

drop policy if exists "User Own Trajectories" on public.chrono_trajectories;
create policy "User Own Trajectories" on public.chrono_trajectories for all using (auth.uid() = student_id);

drop policy if exists "User Own Sessions" on public.assessment_sessions;
create policy "User Own Sessions" on public.assessment_sessions for all using (auth.uid() = user_id);

drop policy if exists "User Own Responses" on public.assessment_responses;
create policy "User Own Responses" on public.assessment_responses for all using (auth.uid() = user_id);

drop policy if exists "User Own Gaps" on public.gap_analysis_results;
create policy "User Own Gaps" on public.gap_analysis_results for select using (auth.uid() = user_id);

-- Admin Access
drop policy if exists "Admins View All" on public.admins;
create policy "Admins View All" on public.admins for select using (true);

drop policy if exists "Admins Manage Workflows" on public.workflows;
create policy "Admins Manage Workflows" on public.workflows for all using (exists (select 1 from public.admins where user_id = auth.uid()));

-- =============================================
-- 8. INITIAL DATA BOOTSTRAP
-- =============================================
-- Admins
do $$
declare
  u_id uuid;
begin
  select id into u_id from auth.users where email = 'punyofauzan3@gmail.com';
  if u_id is not null then
    insert into public.admins (user_id, email) values (u_id, 'punyofauzan3@gmail.com') on conflict do nothing;
  end if;
  
  select id into u_id from auth.users where email = 'hmmits2025@gmail.com';
  if u_id is not null then
    insert into public.admins (user_id, email) values (u_id, 'hmmits2025@gmail.com') on conflict do nothing;
  end if;
end $$;

-- Assessment Questions
insert into public.assessment_instruments (dimension, module_number, question_text, question_order, level_indicator) values
-- Module 1: Cognitive
('cognitive', 1, 'Saya mampu mengingat dan menjelaskan konsep-konsep penting.', 1, 2),
('cognitive', 1, 'Saya dapat menerapkan teori untuk memecahkan masalah praktis.', 2, 3),
('cognitive', 1, 'Saya mampu menganalisis informasi kompleks.', 3, 4),
-- Module 2: Emotional & Social
('social', 2, 'Saya mampu berkomunikasi secara efektif.', 1, 2),
('social', 2, 'Saya dapat bekerja sama dalam tim.', 2, 3),
('affective', 2, 'Saya mampu mengelola emosi diri sendiri.', 3, 3),
-- Module 5: Character
('character', 5, 'Saya bertindak dengan integritas.', 1, 3),
('character', 5, 'Saya bertanggung jawab atas keputusan saya.', 2, 3);
