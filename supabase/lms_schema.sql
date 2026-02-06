-- MODUL 1: Table for Learning Resources (Books/PDFs from Drive)
create table if not exists public.learning_resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text,
  category text,
  description text, -- AI Generated Summary
  input_summary text, -- Raw content/snippet if available
  key_takeaways text[], -- Array of strings from AI
  target_audience text,
  file_url text, -- Google Drive Download Link
  preview_url text, -- Google Drive Preview Link
  format text, -- PDF, EPUB, etc.
  source text default 'gdrive_orchestrator',
  external_id text unique, -- Google Drive File ID (Prevent Duplicates)
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.learning_resources enable row level security;

-- Policies
-- 1. Public (Students) can VIEW resources
create policy "Students can view resources"
  on public.learning_resources for select
  using ( true );

-- 2. Admin (Mechanism via Service Role or Admin User) can INSERT/UPDATE
-- Note: The webhook uses Service Role Key which bypasses RLS, so this policy is for Dashboard UI usage (if any)
create policy "Admins can manage resources"
  on public.learning_resources for all
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    ) 
  );
