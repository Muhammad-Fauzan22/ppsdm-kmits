-- 1. Fungsi Penghitung Skor Otomatis (9 Dimensi)
create or replace function public.recalculate_holistic_score()
returns trigger as $$
declare
  -- Variabel untuk menyimpan total poin per kategori
  v_intellectual int;
  v_self_management int;
  v_financial int;
  v_physical int;
  v_mental int;
  v_psychological int;
  v_character int;
  v_spiritual int;
  v_environmental int;
begin
  -- Hitung poin berdasarkan kategori (Asumsi: 1 Aktivitas Approved = 5 Poin)
  -- Kita gunakan COALESCE agar jika tidak ada aktivitas, nilai kembali ke 0 (bukan NULL)
  
  select 
    COALESCE(SUM(case when category = 'Intellectual' then 5 else 0 end), 0),
    COALESCE(SUM(case when category = 'Self Management' then 5 else 0 end), 0),
    COALESCE(SUM(case when category = 'Financial' then 5 else 0 end), 0),
    COALESCE(SUM(case when category = 'Physical' then 5 else 0 end), 0),
    COALESCE(SUM(case when category = 'Mental' then 5 else 0 end), 0),
    COALESCE(SUM(case when category = 'Psychological' then 5 else 0 end), 0),
    COALESCE(SUM(case when category = 'Character' then 5 else 0 end), 0),
    COALESCE(SUM(case when category = 'Spiritual' then 5 else 0 end), 0),
    COALESCE(SUM(case when category = 'Environmental' then 5 else 0 end), 0)
  into 
    v_intellectual, v_self_management, v_financial, v_physical, 
    v_mental, v_psychological, v_character, v_spiritual, v_environmental
  from public.activities 
  where user_id = NEW.user_id 
  and status = 'approved';

  -- Update tabel scores (Capped at 100)
  -- Menggunakan LEAST(nilai, 100) agar skor tidak tembus di atas 100
  insert into public.holistic_scores (user_id, intellectual, self_management, financial, physical, mental, psychological, character, spiritual, environmental, updated_at)
  values (
    NEW.user_id,
    LEAST(v_intellectual, 100),
    LEAST(v_self_management, 100),
    LEAST(v_financial, 100),
    LEAST(v_physical, 100),
    LEAST(v_mental, 100),
    LEAST(v_psychological, 100),
    LEAST(v_character, 100),
    LEAST(v_spiritual, 100),
    LEAST(v_environmental, 100),
    now()
  )
  on conflict (user_id) do update set
    intellectual = EXCLUDED.intellectual,
    self_management = EXCLUDED.self_management,
    financial = EXCLUDED.financial,
    physical = EXCLUDED.physical,
    mental = EXCLUDED.mental,
    psychological = EXCLUDED.psychological,
    character = EXCLUDED.character,
    spiritual = EXCLUDED.spiritual,
    environmental = EXCLUDED.environmental,
    updated_at = now();

  return NEW;
end;
$$ language plpgsql security definer;

-- 2. Trigger (Jika belum ada)
drop trigger if exists on_activity_change on public.activities;
create trigger on_activity_change
  after insert or update or delete on public.activities
  for each row execute procedure public.recalculate_holistic_score();
