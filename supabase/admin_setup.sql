-- =============================================
-- ADMIN SETUP SCRIPT
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Create a secure function to check if a user is an admin
-- This avoids storing roles in public metadata if you want strict security,
-- but for simplicity we will use a table or metadata.
-- Let's use a dedicated admins table for explicit control.

create table if not exists public.admins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null,
  created_at timestamptz default now()
);

alter table public.admins enable row level security;

-- Only admins can see the admins table (chicken and egg, so we bootstrap first)
create policy "Admins can view admins" on public.admins for select using (
  auth.uid() in (select user_id from public.admins) 
  or 
  -- Allow initial setup check (optional/temporary)
  (select count(*) from public.admins) = 0
);

-- 2. Insert your specific admin emails
-- We need to find the UUIDs for these emails from auth.users.
-- Since we can't select from auth.users easily in some contexts, we use an insert block.

do $$
declare
  target_email text;
  target_user_id uuid;
begin
  -- Admin 1: punyofauzan3@gmail.com
  target_email := 'punyofauzan3@gmail.com';
  select id into target_user_id from auth.users where email = target_email;
  
  if target_user_id is not null then
    insert into public.admins (user_id, email)
    values (target_user_id, target_email)
    on conflict (user_id) do nothing;
    raise notice 'Admin added: %', target_email;
  else
    raise notice 'User not found (must sign up first): %', target_email;
  end if;

  -- Admin 2: hmmits2025@gmail.com
  target_email := 'hmmits2025@gmail.com';
  select id into target_user_id from auth.users where email = target_email;
  
  if target_user_id is not null then
    insert into public.admins (user_id, email)
    values (target_user_id, target_email)
    on conflict (user_id) do nothing;
    raise notice 'Admin added: %', target_email;
  else
    raise notice 'User not found (must sign up first): %', target_email;
  end if;
end $$;

-- 3. Update RLS policies for critical tables to allow Admins
-- Example for 'books' table
create policy "Admins can manage books" on public.books
for all using (
  auth.uid() in (select user_id from public.admins)
);

-- Example for 'workflows' table
create policy "Admins can manage workflows" on public.workflows
for all using (
  auth.uid() in (select user_id from public.admins)
);
