-- =============================================
-- PPSDM KMM - MASTER MIGRATION V3 (THE FINAL INTEGRATION)
-- Includes: LMS, LogicFlow, Assessments, Ecological, & Admin
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
-- 4. ECOLOGICAL SYSTEMS (Condensed)
-- =============================================
-- Stakeholders
CREATE TABLE IF NOT EXISTS public.stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'lecturer', 'advisor', 'counselor', 'org_leader', 'department_head', 'dean', 'vice_rector', 'rector', 'ministry', 'industry_partner', 'researcher', 'admin')),
  system_layer VARCHAR(20) NOT NULL CHECK (system_layer IN ('micro', 'meso', 'exo', 'macro', 'chrono')),
  organization VARCHAR(200),
  department VARCHAR(200),
  access_level INT DEFAULT 1,
  dashboard_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Micro: Academic & Personal
CREATE TABLE IF NOT EXISTS public.micro_academic_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id VARCHAR(50) NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  activity_date DATE NOT NULL,
  student_engagement JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.micro_personal_ecology_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  microsystems JSONB DEFAULT '{}',
  support_network JSONB DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Meso: Projects
CREATE TABLE IF NOT EXISTS public.meso_integrated_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name VARCHAR(200) NOT NULL,
  involved_systems TEXT[] NOT NULL,
  status VARCHAR(50) DEFAULT 'planning',
  lead_coordinator UUID REFERENCES public.stakeholders(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core: Events
CREATE TABLE IF NOT EXISTS public.core_ecological_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  system_layer VARCHAR(20) NOT NULL,
  student_id UUID REFERENCES auth.users(id),
  event_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. ASSESSMENT SYSTEM (Refined)
-- =============================================
-- Instruments
CREATE TABLE IF NOT EXISTS public.assessment_instruments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dimension text NOT NULL, -- cognitive, etc.
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    level_indicator INTEGER DEFAULT 3,
    framework_reference TEXT,
    weight DECIMAL(3,2) DEFAULT 1.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL,
    status TEXT DEFAULT 'in-progress',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    scores_snapshot JSONB DEFAULT '{}',
    total_questions INTEGER DEFAULT 0,
    answered_questions INTEGER DEFAULT 0
);

-- Responses
CREATE TABLE IF NOT EXISTS public.assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
    instrument_id UUID NOT NULL REFERENCES public.assessment_instruments(id) ON DELETE CASCADE,
    response INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- High-Level Summary Table (from V2, kept for compatibility)
create table if not exists public.assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null, 
  score_data jsonb not null, 
  result_summary text,
  created_at timestamptz default now()
);

-- =============================================
-- 6. SECURITY POLICIES (RLS)
-- =============================================
alter table public.books enable row level security;
alter table public.user_progress enable row level security;
alter table public.xp_logs enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_executions enable row level security;
alter table public.admins enable row level security;
alter table public.stakeholders enable row level security;
alter table public.micro_personal_ecology_map enable row level security;
alter table public.assessment_sessions enable row level security;
alter table public.assessment_responses enable row level security;

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

drop policy if exists "User Own Sessions" on public.assessment_sessions;
create policy "User Own Sessions" on public.assessment_sessions for all using (auth.uid() = user_id);

drop policy if exists "User Own Responses" on public.assessment_responses;
create policy "User Own Responses" on public.assessment_responses for all using (auth.uid() = user_id);

-- Admin Access
drop policy if exists "Admins View All" on public.admins;
create policy "Admins View All" on public.admins for select using (true); -- simplified

drop policy if exists "Admins Manage Workflows" on public.workflows;
create policy "Admins Manage Workflows" on public.workflows for all using (exists (select 1 from public.admins where user_id = auth.uid()));

-- =============================================
-- 7. SEED DATA & BOOTSTRAP
-- =============================================
-- Admin Bootstrap
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

-- Assessment Questions Seed (Snippet)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('cognitive', 'Saya mampu mengingat dan menjelaskan konsep-konsep penting.', 1, 'Bloom - Remember', 2),
('cognitive', 'Saya dapat menerapkan teori untuk memecahkan masalah.', 2, 'Bloom - Apply', 3),
('social', 'Saya mampu berkomunikasi secara efektif.', 1, 'Social - Comms', 2),
('social', 'Saya efektif dalam bekerja sama dengan tim.', 2, 'Social - Collab', 3);
