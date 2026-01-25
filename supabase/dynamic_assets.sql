-- 1. Buat Tabel Konfigurasi
create table if not exists public.app_config (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Aktifkan RLS (Read-Only untuk Publik, Write hanya Admin)
alter table public.app_config enable row level security;

-- Drop policy if exists to allow re-running
drop policy if exists "Public can read config" on public.app_config;
create policy "Public can read config"
  on public.app_config for select
  using ( true );

drop policy if exists "Admin can update config" on public.app_config;
create policy "Admin can update config"
  on public.app_config for update
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    ) 
  );

-- 3. Masukkan Data Link GDrive Anda (Seeding)
-- Menggunakan ON CONFLICT DO UPDATE untuk memastikan data terupdate
insert into public.app_config (key, value, description) values
  ('its_lambang', 'https://drive.google.com/file/d/1JY9jpTGLz6CyvOyg1NIM6BciVIAsxran/view?usp=drive_link', 'Lambang Bundar ITS'),
  ('its_wordmark_1', 'https://drive.google.com/file/d/1p0Gix3NDeKpRLEZx89R7tlxBA9m2itnm/view?usp=drive_link', 'Wordmark ITS Variasi 1'),
  ('its_wordmark_2', 'https://drive.google.com/file/d/1UKUxz6xZEmuViB_URDiDPQ9ACpVzElNE/view?usp=drive_link', 'Wordmark ITS Variasi 2'),
  ('its_wordmark_3', 'https://drive.google.com/file/d/1dOSjdcNOTx7XSUhwsALK8VNQc0IU2mHJ/view?usp=drive_link', 'Wordmark ITS Variasi 3'),
  ('its_logo_blue', 'https://drive.google.com/file/d/1cJAFXk0jpx7L-WOGD7jE4e3uRPerzmfQ/view?usp=drive_link', 'Logo ITS Perisai Biru'),
  ('its_logo_white', 'https://drive.google.com/file/d/1KkdnOc_F8dCkP7CMGZW476KemKyT_vyP/view?usp=drive_link', 'Logo ITS Perisai Putih'),
  ('its_logo_black', 'https://drive.google.com/file/d/1z8uzFBbPq2j0E0hoO3X0wUCWsFg4agGJ/view?usp=drive_link', 'Logo ITS Perisai Hitam'),
  ('dikti_logo_black', 'https://drive.google.com/file/d/10SNMXwLftlnEmaZqfYzbVhw3y-d9jxlg/view?usp=drive_link', 'Logo Diktisaintek Hitam'),
  ('dikti_logo_color', 'https://drive.google.com/file/d/1uMUCLcbvymaCiLy1lZ6YBmJq-pWUa9NP/view?usp=drive_link', 'Logo Diktisaintek Warna'),
  ('dikti_logo_white', 'https://drive.google.com/file/d/1NaPWYRv0Lv5ymCQJBxziY7evUVj1_TTB/view?usp=drive_link', 'Logo Diktisaintek Putih'),
  ('mascot_seno', 'https://drive.google.com/file/d/1vj3fvkqGjIVDV1IufgYieVWlorvp-ew-/view?usp=drive_link', 'Maskot Seno Gaya Studio')
on conflict (key) do update set value = excluded.value;
