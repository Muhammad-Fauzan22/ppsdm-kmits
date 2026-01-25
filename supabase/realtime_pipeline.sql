-- Real-Time Pipeline Migration
-- Sets up the 'processed_books' table and storage for the new architecture

-- 1. Table for processed books (Matches User Request)
CREATE TABLE IF NOT EXISTS public.processed_books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id TEXT UNIQUE NOT NULL,
  file_name TEXT,
  original_url TEXT,
  summary TEXT,
  mindmap JSONB,
  flashcards JSONB,
  quiz JSONB,
  infographic JSONB,
  audio_script TEXT,
  gamification JSONB,
  video_url TEXT,
  presentation_url TEXT,
  report_url TEXT,
  datatable JSONB,
  simulation JSONB,
  status TEXT DEFAULT 'pending',
  processing_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.processed_books ENABLE ROW LEVEL SECURITY;

-- 3. Create policy for public access (As per Zero-Cost/MVP requirement)
DROP POLICY IF EXISTS "Allow public read access" ON public.processed_books;
CREATE POLICY "Allow public read access" ON public.processed_books
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert" ON public.processed_books;
CREATE POLICY "Allow public insert" ON public.processed_books
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update" ON public.processed_books;
CREATE POLICY "Allow public update" ON public.processed_books
  FOR UPDATE USING (true);

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.processed_books;

-- 5. Storage Bucket (Idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('outputs', 'outputs', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'outputs');

DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
CREATE POLICY "Public Insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'outputs');
