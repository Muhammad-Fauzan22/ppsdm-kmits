-- =============================================
-- BukaBukumu Integration Migration (Library Automation)
-- Source: BukaBukumu Repository
-- =============================================

-- Create enum for book processing status
DO $$ BEGIN
    CREATE TYPE public.processing_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'review_needed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create enum for module status
DO $$ BEGIN
    CREATE TYPE public.module_status AS ENUM ('draft', 'generating', 'ready', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Books table - stores all book metadata
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    original_filename TEXT NOT NULL,
    renamed_filename TEXT,
    authors TEXT[],
    publisher TEXT,
    published_date TEXT,
    isbn TEXT,
    categories TEXT[],
    description TEXT,
    page_count INTEGER,
    language TEXT DEFAULT 'id',
    google_books_id TEXT,
    drive_file_id TEXT,
    drive_folder_id TEXT,
    drive_url TEXT,
    thumbnail_url TEXT,
    processing_status processing_status DEFAULT 'pending',
    confidence_score DECIMAL(3,2) DEFAULT 0.00,
    ocr_text TEXT,
    error_message TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Book reviews from web intelligence
CREATE TABLE IF NOT EXISTS public.book_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    source TEXT NOT NULL,
    rating DECIMAL(3,2),
    review_text TEXT,
    reviewer_name TEXT,
    review_date TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content chunks for RAG/vector search
CREATE TABLE IF NOT EXISTS public.content_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    page_number INTEGER,
    chapter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Synthesized learning modules
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    topic TEXT NOT NULL,
    status module_status DEFAULT 'draft',
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    key_concepts JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    assessment_items JSONB DEFAULT '[]'::jsonb,
    source_book_ids UUID[] DEFAULT '{}',
    source_references TEXT,
    drive_folder_id TEXT,
    generated_files JSONB DEFAULT '{}'::jsonb,
    ai_model_used TEXT,
    generation_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Processing logs for monitoring
CREATE TABLE IF NOT EXISTS public.processing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    module_id UUID REFERENCES public.modules(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pipeline configuration
CREATE TABLE IF NOT EXISTS public.pipeline_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_config ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (Simplified for integration)
-- Note: In production, you might want to restrict this to authenticated users
CREATE POLICY "Allow public read access to books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Allow public insert to books" ON public.books FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to books" ON public.books FOR UPDATE USING (true);
CREATE POLICY "Allow public delete to books" ON public.books FOR DELETE USING (true);

CREATE POLICY "Allow public read access to reviews" ON public.book_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert to reviews" ON public.book_reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to chunks" ON public.content_chunks FOR SELECT USING (true);
CREATE POLICY "Allow public insert to chunks" ON public.content_chunks FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Allow public insert to modules" ON public.modules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to modules" ON public.modules FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to logs" ON public.processing_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert to logs" ON public.processing_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public access to config" ON public.pipeline_config FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(processing_status);
CREATE INDEX IF NOT EXISTS idx_books_categories ON public.books USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_chunks_book_id ON public.content_chunks(book_id);
CREATE INDEX IF NOT EXISTS idx_modules_status ON public.modules(status);
CREATE INDEX IF NOT EXISTS idx_logs_book_id ON public.processing_logs(book_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON public.processing_logs(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_books_updated_at ON public.books;
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_modules_updated_at ON public.modules;
CREATE TRIGGER update_modules_updated_at
    BEFORE UPDATE ON public.modules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pipeline_config_updated_at ON public.pipeline_config;
CREATE TRIGGER update_pipeline_config_updated_at
    BEFORE UPDATE ON public.pipeline_config
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default pipeline configuration (Idempotent)
INSERT INTO public.pipeline_config (config_key, config_value, description)
VALUES 
('google_drive', '{"inbox_folder_id": "1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf", "processed_folder_id": null}', 'Google Drive folder configuration'),
('google_sheets', '{"spreadsheet_id": "1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM", "log_sheet_name": "Processing Logs"}', 'Google Sheets logging configuration'),
('processing', '{"max_pages_ocr": 50, "chunk_size": 1000, "overlap": 200, "confidence_threshold": 0.7}', 'Processing parameters'),
('ai_synthesis', '{"model": "gemini-3-flash-preview", "max_sources": 5, "min_relevance_score": 0.6}', 'AI synthesis configuration')
ON CONFLICT (config_key) DO NOTHING;
