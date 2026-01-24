-- =============================================
-- PPSDM KMM - LMS SCHEMA V1
-- Integrated Library, Progress Tracking & AI
-- =============================================

-- Enable pgvector extension for AI features (Embeddings)
create extension if not exists vector;

-- =============================================
-- 1. BOOKS / CATALOG
-- Mirror of Google Drive Files + Metadata
-- =============================================
create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  
  -- Google Drive Info
  google_drive_id text unique not null,
  drive_url text, -- Kept for legacy
  file_url text,  -- New worker usage
  thumbnail_url text, -- Kept for legacy
  cover_url text, -- New worker usage
  mime_type text default 'application/pdf',
  
  -- Book Metadata
  title text not null,
  author text,
  isbn text,
  publisher text,
  published_year integer,
  category text,
  description text,
  page_count integer,
  language text default 'id',
  
  -- AI / Search
  search_vector tsvector, -- Full text search
  embedding vector(384), -- For RAG (using 384 dim model like all-MiniLM-L6-v2)
  
  -- System
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast search
create index if not exists books_search_idx on public.books using gin(search_vector);

-- Trigger to update search_vector on change
create or replace function books_search_update() returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('indonesian', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('indonesian', coalesce(new.author, '')), 'B') ||
    setweight(to_tsvector('indonesian', coalesce(new.category, '')), 'C') ||
    setweight(to_tsvector('indonesian', coalesce(new.description, '')), 'D');
  return new;
end
$$ language plpgsql;

create trigger books_search_trigger
before insert or update on public.books
for each row execute procedure books_search_update();


-- =============================================
-- 2. USER READING PROGRESS
-- Tracks individual reading status
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
  
  -- Notes/Highlights (JSON for flexibility)
  notes jsonb default '[]'::jsonb,
  
  unique(user_id, book_id)
);


-- =============================================
-- 3. ACTIVITY LOGGING
-- For Analytics Dashboard
-- =============================================
create table if not exists public.lms_activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  activity_type text not null, -- 'read', 'quiz', 'search', 'download'
  details jsonb, -- e.g. {book_title: '...', duration: 120}
  created_at timestamptz default now()
);


-- =============================================
-- RLS POLICIES (Security)
-- =============================================
alter table public.books enable row level security;
alter table public.user_progress enable row level security;
alter table public.lms_activities enable row level security;

-- BOOKS: Readable by all authenticated users
create policy "Books are viewable by everyone" 
on public.books for select 
using ( true );

-- ADMINS can insert/update books (Assuming 'admin' claim or role, explicit check simplified here)
-- (You might want to secure the webhook/API endpoint via service role key instead)

-- PROGRESS: Users manage their own
create policy "Users manage own progress" 
on public.user_progress 
for all 
using ( auth.uid() = user_id );

-- ACTIVITIES: Users insert own, view own
create policy "Users log own activities" 
on public.lms_activities 
for insert 
with check ( auth.uid() = user_id );

create policy "Users view own activities" 
on public.lms_activities 
for select 
using ( auth.uid() = user_id );

-- [TEMPORARY] PERMISSIVE POLICY FOR APPS SCRIPT (ANON KEY)
-- Since the Apps Script is using the 'Anon' (Publishable) Key provided by the user,
-- we must allow INSERTs to the 'books' table from the anon role for this to work.
-- WARNING: In production, switch to Service Role Key and remove this policy.
create policy "Allow Anon to Insert Books"
on public.books
for insert
to anon
with check (true);


-- =============================================
-- 4. LOGICFLOW ENGINE (Visual Automation)
-- Stores node-based workflows like n8n
-- =============================================
create table if not exists public.workflows (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  is_active boolean default false,
  
  -- React Flow Data
  nodes jsonb default '[]'::jsonb,
  edges jsonb default '[]'::jsonb,
  
  -- Execution Config
  trigger_type text default 'webhook', -- 'webhook', 'schedule', 'manual'
  trigger_config jsonb default '{}'::jsonb, -- e.g. { "path": "process-book" }
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.workflow_executions (
  id uuid default gen_random_uuid() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade,
  
  status text check (status in ('pending', 'running', 'completed', 'failed')) default 'pending',
  started_at timestamptz default now(),
  completed_at timestamptz,
  
  -- Execution Logs (Step-by-step results)
  logs jsonb default '[]'::jsonb,
  input_payload jsonb,
  output_result jsonb
);

-- RLS for Workflows
alter table public.workflows enable row level security;
alter table public.workflow_executions enable row level security;

-- Only Authenticated Users (Admins) can manage workflows
create policy "Admins manage workflows" on public.workflows for all using (auth.role() = 'authenticated');
create policy "Admins view executions" on public.workflow_executions for all using (auth.role() = 'authenticated');
-- Allow Anon to insert executions (via Webhook) - secured by service key in real app, but for now open execution creation if needed
-- Actually, executions are created by the API route (server-side), so RLS is bypasses there.
