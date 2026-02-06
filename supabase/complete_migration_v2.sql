-- =============================================
-- PPSDM KMM - MASTER MIGRATION V2 (ALL-IN-ONE)
-- Includes: LMS, LogicFlow, Assessments, & Admin
-- Run this AFTER running 'reset_database.sql'
-- =============================================

-- Enable extensions
create extension if not exists vector;

-- =============================================
-- 1. BOOKS / CATALOG
-- =============================================
create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  google_drive_id text unique, -- Nullable for manually added books
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

-- =============================================
-- 2. USER PROGRESS & GAMIFICATION
-- =============================================
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
-- 3. LOGICFLOW ENGINE (Visual Automation)
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
-- 4. ASSESSMENT SYSTEM (Cognitive & Holistic)
-- =============================================
create table if not exists public.assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null, -- 'cognitive', 'holistic', 'self-management'
  
  score_data jsonb not null, -- Stores detailed results
  result_summary text,
  
  created_at timestamptz default now()
);

-- =============================================
-- 5. ADMIN SYSTEM
-- =============================================
create table if not exists public.admins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null,
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
alter table public.assessments enable row level security;
alter table public.admins enable row level security;

-- Public Read Access
create policy "Public Read Books" on public.books for select using (true);

-- User Own Data Access
create policy "User Own Progress" on public.user_progress for all using (auth.uid() = user_id);
create policy "User Own XP" on public.xp_logs for select using (auth.uid() = user_id);
create policy "User Own Assessments" on public.assessments for all using (auth.uid() = user_id);

-- Admin Access Control
create policy "Admins Manage Workflows" on public.workflows for all using (
  exists (select 1 from public.admins where user_id = auth.uid())
);
create policy "Admins View Executions" on public.workflow_executions for all using (
  exists (select 1 from public.admins where user_id = auth.uid())
);
create policy "Admins View Admins" on public.admins for select using (
  auth.uid() in (select user_id from public.admins) or (select count(*) from public.admins) = 0
);

-- Allow Anon Insert for Webhooks (Secured by Service Role in Prod, but open for Demo/GAS)
create policy "Anon Insert Books" on public.books for insert to anon with check (true);
create policy "Anon Insert Executions" on public.workflow_executions for insert to anon with check (true);

-- =============================================
-- 7. INITIAL ADMIN BOOTSTRAP
-- =============================================
-- Insert admins if users exist
do $$
declare
  u_id uuid;
begin
  -- Admin 1
  select id into u_id from auth.users where email = 'punyofauzan3@gmail.com';
  if u_id is not null then
    insert into public.admins (user_id, email) values (u_id, 'punyofauzan3@gmail.com') on conflict do nothing;
  end if;
  
  -- Admin 2
  select id into u_id from auth.users where email = 'hmmits2025@gmail.com';
  if u_id is not null then
    insert into public.admins (user_id, email) values (u_id, 'hmmits2025@gmail.com') on conflict do nothing;
  end if;
end $$;
