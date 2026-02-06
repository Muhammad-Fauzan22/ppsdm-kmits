-- HAPUS TABLE LAMA jika ada
DROP TABLE IF EXISTS processed_books CASCADE;
DROP TABLE IF EXISTS ai_processing_queue CASCADE;

-- 1. TABLE UTAMA: Menyimpan buku dan hasil AI
CREATE TABLE processed_books (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    drive_id TEXT UNIQUE NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size_mb DECIMAL(10,2),
    mime_type TEXT,
    
    -- Metadata yang terekstrak
    title TEXT,
    author TEXT,
    extracted_text TEXT, -- Konten penuh dari PDF
    metadata_json JSONB,
    
    -- 12 OUTPUT UTAMA (Disimpan sebagai JSONB untuk fleksibilitas)
    outputs JSONB DEFAULT '{
        "summary": {"status": "pending", "data": null},
        "mindmap": {"status": "pending", "data": null},
        "flashcards": {"status": "pending", "data": null},
        "quiz": {"status": "pending", "data": null},
        "infographic": {"status": "pending", "data": null},
        "audio_script": {"status": "pending", "data": null},
        "video_script": {"status": "pending", "data": null},
        "presentation": {"status": "pending", "data": null},
        "report": {"status": "pending", "data": null},
        "datatable": {"status": "pending", "data": null},
        "simulation": {"status": "pending", "data": null},
        "gamification": {"status": "pending", "data": null}
    }',
    
    -- Status dan tracking
    processing_status TEXT DEFAULT 'pending',
    processing_progress INTEGER DEFAULT 0,
    error_message TEXT,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processing_time_ms INTEGER
);

-- 2. TABLE ANTRIAN: Untuk mengelola proses AI
CREATE TABLE ai_processing_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    book_id UUID REFERENCES processed_books(id) ON DELETE CASCADE,
    task_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    priority INTEGER DEFAULT 5,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_attempt_at TIMESTAMPTZ,
    next_retry_at TIMESTAMPTZ,
    result JSONB,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEX untuk performa
CREATE INDEX idx_processed_books_drive_id ON processed_books(drive_id);
CREATE INDEX idx_processed_books_status ON processed_books(processing_status);
CREATE INDEX idx_queue_status ON ai_processing_queue(status);
CREATE INDEX idx_queue_retry ON ai_processing_queue(next_retry_at) WHERE status = 'retry';

-- 4. Fungsi untuk update otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_processed_books_updated_at 
    BEFORE UPDATE ON processed_books 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_queue_updated_at 
    BEFORE UPDATE ON ai_processing_queue 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Enable Realtime untuk dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE processed_books;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_processing_queue;
