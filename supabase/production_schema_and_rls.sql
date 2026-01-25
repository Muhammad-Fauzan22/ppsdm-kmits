-- 1. Tabel PROFILES (Menyimpan data publik user)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  nrp text unique, -- Validasi NRP unik
  role text default 'student' check (role in ('student', 'admin', 'superadmin')),
  avatar_url text,
  cohort_year integer, -- Angkatan (misal: 2023)
  department text,     -- Departemen
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabel HOLISTIC_SCORES (Untuk Radar Chart 9 Dimensi)
create table public.holistic_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- 9 Dimensi (Skala 0-100)
  intellectual integer default 0,
  self_management integer default 0,
  financial integer default 0,
  physical integer default 0,
  mental integer default 0,
  psychological integer default 0,
  character integer default 0,
  spiritual integer default 0,
  environmental integer default 0,
  
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id) -- Satu user hanya punya satu record nilai aktif
);

-- 3. Tabel ACTIVITIES (Portofolio Kegiatan)
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  activity_date date,
  category text, -- Misal: 'Organisasi', 'Lomba', 'Pelatihan'
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  evidence_url text, -- Link bukti sertifikat
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. OTOMATISASI (TRIGGERS)
-- Fungsi untuk meng-copy data dari auth.users ke public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Opsional: Langsung buatkan row nilai 0 untuk radar chart
  insert into public.holistic_scores (user_id) values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger yang berjalan setiap kali ada user Sign Up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. ROW LEVEL SECURITY (RLS)
-- Aktifkan RLS di semua tabel
alter table public.profiles enable row level security;
alter table public.holistic_scores enable row level security;
alter table public.activities enable row level security;

-- --- POLICIES UNTUK PROFILES ---
-- Semua orang bisa melihat profil dasar (Read Public)
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- User hanya bisa update profilnya sendiri
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- --- POLICIES UNTUK HOLISTIC_SCORES ---
-- User hanya bisa lihat nilai sendiri
create policy "Users can view own scores"
  on holistic_scores for select
  using ( auth.uid() = user_id );

-- Admin bisa lihat nilai semua orang (Asumsi admin punya email khusus atau role di metadata)
create policy "Admins can view all scores"
  on holistic_scores for select
  using ( 
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    ) 
  );

-- --- POLICIES UNTUK ACTIVITIES ---
-- User bisa CRUD aktivitas sendiri
create policy "Users can crud own activities"
  on activities for all
  using ( auth.uid() = user_id );
