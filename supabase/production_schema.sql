-- ==============================================
-- BUKA BUKU - SUPABASE DATABASE SCHEMA
-- ==============================================

-- Create processed_books table
CREATE TABLE IF NOT EXISTS processed_books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id TEXT UNIQUE NOT NULL,
  file_name TEXT NOT NULL,
  original_url TEXT,
  spreadsheet_id TEXT,
  webhook_id TEXT,
  
  -- Extracted content
  extracted_text TEXT,
  
  -- 12 Outputs
  summary JSONB,
  mindmap JSONB,
  flashcards JSONB,
  quiz JSONB,
  infographic JSONB,
  audio_script JSONB,
  gamification JSONB,
  video_script JSONB,
  presentation JSONB,
  report JSONB,
  datatable JSONB,
  simulation JSONB,
  
  -- Metadata
  status TEXT DEFAULT 'PENDING',
  processing_time INTEGER,
  ai_providers_used TEXT[],
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE processed_books ENABLE ROW LEVEL SECURITY;

-- Policies for Public Access (Zero Cost / MVP Mode)
CREATE POLICY "Allow public read access" ON processed_books FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON processed_books FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON processed_books FOR UPDATE USING (true);

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('buka-buku-outputs', 'buka-buku-outputs', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'buka-buku-outputs');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'buka-buku-outputs');
