-- ============================================================
-- Ebook Batch Processing Database Schema
-- Tables for ebook management, course generation, and batch jobs
-- ============================================================

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS batch_processing_logs CASCADE;
DROP TABLE IF EXISTS book_cover_cache CASCADE;
DROP TABLE IF EXISTS learning_modules CASCADE;
DROP TABLE IF EXISTS course_lessons CASCADE;
DROP TABLE IF EXISTS courses_from_ebooks CASCADE;
DROP TABLE IF EXISTS ebook_processing_queue CASCADE;
DROP TABLE IF EXISTS ebooks CASCADE;
DROP TABLE IF EXISTS batch_processing_jobs CASCADE;

-- ============================================================
-- 1. BATCH PROCESSING JOBS
-- Track overall batch processing operations
-- ============================================================
CREATE TABLE batch_processing_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_name TEXT NOT NULL,
    job_type TEXT NOT NULL DEFAULT 'full_batch', -- full_batch, priority_only, single_book
    status TEXT NOT NULL DEFAULT 'pending', -- pending, running, paused, completed, failed
    
    -- Job parameters
    target_quality REAL DEFAULT 90.0,
    max_books INTEGER,
    priority_only BOOLEAN DEFAULT FALSE,
    filters JSONB DEFAULT '{}',
    
    -- Progress tracking
    total_books INTEGER DEFAULT 0,
    processed_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    progress_percent REAL DEFAULT 0.0,
    current_book_id UUID,
    
    -- Quality metrics
    average_quality_score REAL,
    grade_a_count INTEGER DEFAULT 0,
    grade_b_count INTEGER DEFAULT 0,
    grade_c_count INTEGER DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    estimated_completion_at TIMESTAMPTZ,
    total_processing_time_ms INTEGER,
    
    -- Results
    results_summary JSONB,
    error_message TEXT,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- ============================================================
-- 2. EBOOKS
-- Store ebook metadata and processing status
-- ============================================================
CREATE TABLE ebooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Source identification
    drive_id TEXT UNIQUE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT,
    drive_url TEXT,
    download_url TEXT,
    preview_url TEXT,
    
    -- File metadata
    file_size_kb INTEGER,
    extension TEXT,
    mime_type TEXT,
    checksum TEXT,
    
    -- Book metadata
    title TEXT NOT NULL,
    title_en TEXT,
    author TEXT DEFAULT 'Unknown',
    author_en TEXT,
    year TEXT,
    isbn TEXT,
    publisher TEXT,
    language TEXT DEFAULT 'id',
    pages INTEGER,
    edition TEXT,
    
    -- Categorization
    category TEXT DEFAULT 'General',
    subcategory TEXT,
    tags TEXT[],
    keywords TEXT[],
    
    -- Processing status
    processing_status TEXT DEFAULT 'pending', -- pending, queued, processing, completed, failed, skipped
    processing_priority INTEGER DEFAULT 5, -- 1 (highest) to 10 (lowest)
    processing_progress INTEGER DEFAULT 0, -- 0-100
    quality_score REAL,
    quality_grade TEXT,
    
    -- Grade A pipeline results
    pipeline_results JSONB DEFAULT '{}',
    extracted_text TEXT,
    summary TEXT,
    learning_objectives JSONB,
    
    -- Content output paths
    output_dir TEXT,
    local_file_path TEXT,
    
    -- Related course
    generated_course_id UUID,
    
    -- Reading tracking
    read_status TEXT DEFAULT 'not_read', -- not_read, reading, completed
    reading_progress INTEGER DEFAULT 0,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_favorite BOOLEAN DEFAULT FALSE,
    
    -- Access tracking
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    
    -- Error tracking
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    last_error_at TIMESTAMPTZ,
    
    -- Notes
    notes TEXT,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    metadata_extracted_at TIMESTAMPTZ,
    
    -- Source
    source TEXT DEFAULT 'google_drive',
    license TEXT
);

-- ============================================================
-- 3. EBOOK PROCESSING QUEUE
-- Manage ebook processing queue with priorities
-- ============================================================
CREATE TABLE ebook_processing_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
    batch_job_id UUID REFERENCES batch_processing_jobs(id) ON DELETE SET NULL,
    
    -- Queue management
    status TEXT DEFAULT 'pending', -- pending, processing, retry, completed, failed
    priority INTEGER DEFAULT 5,
    queue_position INTEGER,
    
    -- Processing config
    target_quality REAL DEFAULT 90.0,
    processing_options JSONB DEFAULT '{}',
    
    -- Retry logic
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_attempt_at TIMESTAMPTZ,
    next_retry_at TIMESTAMPTZ,
    
    -- Results
    result JSONB,
    error TEXT,
    
    -- Timing
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    processing_time_ms INTEGER,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. COURSES FROM EBOOKS
-- Generated courses from processed ebooks
-- ============================================================
CREATE TABLE courses_from_ebooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
    
    -- Course identification
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    title_en TEXT,
    description TEXT,
    description_en TEXT,
    short_description TEXT,
    
    -- Course metadata
    category TEXT,
    subcategory TEXT,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
    language TEXT DEFAULT 'id',
    
    -- Content
    learning_outcomes TEXT[],
    learning_outcomes_en TEXT[],
    prerequisites TEXT[],
    tags TEXT[],
    
    -- Structure
    modules_count INTEGER DEFAULT 0,
    lessons_count INTEGER DEFAULT 0,
    quizzes_count INTEGER DEFAULT 0,
    assignments_count INTEGER DEFAULT 0,
    
    -- Gamification
    xp_total INTEGER DEFAULT 0,
    xp_completion_bonus INTEGER DEFAULT 100,
    estimated_hours REAL,
    
    -- Badge
    badge_name TEXT,
    badge_name_en TEXT,
    badge_icon TEXT,
    badge_image_url TEXT,
    
    -- Media
    cover_image_url TEXT,
    thumbnail_url TEXT,
    promo_video_url TEXT,
    
    -- Status
    status TEXT DEFAULT 'draft', -- draft, published, archived, under_review
    is_featured BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    
    -- Quality
    quality_score REAL,
    review_count INTEGER DEFAULT 0,
    average_rating REAL,
    
    -- Enrollment
    enrollment_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    
    -- Paths to generated files
    course_json_path TEXT,
    modules_json_path TEXT,
    lessons_json_path TEXT,
    quiz_questions_json_path TEXT,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    generated_by UUID REFERENCES auth.users(id)
);

-- ============================================================
-- 5. LEARNING MODULES
-- Individual modules within courses
-- ============================================================
CREATE TABLE learning_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses_from_ebooks(id) ON DELETE CASCADE,
    
    -- Module info
    module_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_en TEXT,
    description TEXT,
    description_en TEXT,
    
    -- Content
    learning_objectives TEXT[],
    learning_objectives_en TEXT[],
    key_concepts TEXT[],
    
    -- Structure
    lessons_count INTEGER DEFAULT 0,
    has_quiz BOOLEAN DEFAULT FALSE,
    has_assignment BOOLEAN DEFAULT FALSE,
    
    -- Gamification
    xp_reward INTEGER DEFAULT 50,
    estimated_hours REAL,
    
    -- Progress tracking
    completion_criteria JSONB DEFAULT '{"all_lessons": true, "quiz_pass": false}',
    
    -- Ordering
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. COURSE LESSONS
-- Individual lessons within modules
-- ============================================================
CREATE TABLE course_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses_from_ebooks(id) ON DELETE CASCADE,
    
    -- Lesson info
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_en TEXT,
    description TEXT,
    description_en TEXT,
    
    -- Content
    content TEXT,
    content_en TEXT,
    content_format TEXT DEFAULT 'markdown', -- markdown, html, video, interactive
    
    -- Media
    video_url TEXT,
    audio_url TEXT,
    presentation_url TEXT,
    resources JSONB DEFAULT '[]',
    
    -- Metadata
    lesson_type TEXT DEFAULT 'reading', -- reading, video, interactive, quiz, assignment, discussion
    duration_minutes INTEGER,
    difficulty TEXT DEFAULT 'medium', -- easy, medium, hard
    
    -- Bloom's taxonomy
    bloom_level INTEGER CHECK (bloom_level BETWEEN 1 AND 6),
    
    -- Gamification
    xp_reward INTEGER DEFAULT 10,
    is_required BOOLEAN DEFAULT TRUE,
    
    -- Ordering
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. BOOK COVER CACHE
-- Cache for book cover images
-- ============================================================
CREATE TABLE book_cover_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
    
    -- Cover sources
    source TEXT NOT NULL, -- google_books, open_library, amazon, placeholder, upload
    source_url TEXT,
    
    -- Image paths/URLs
    cover_url TEXT,
    thumbnail_url TEXT,
    small_url TEXT,
    medium_url TEXT,
    large_url TEXT,
    local_path TEXT,
    
    -- Metadata
    width INTEGER,
    height INTEGER,
    format TEXT, -- jpg, png, svg, webp
    file_size_kb INTEGER,
    
    -- Google Books specific
    google_books_id TEXT,
    open_library_key TEXT,
    
    -- Status
    is_placeholder BOOLEAN DEFAULT FALSE,
    is_downloaded BOOLEAN DEFAULT FALSE,
    
    -- Audit
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    fetched_at TIMESTAMPTZ
);

-- ============================================================
-- 8. BATCH PROCESSING LOGS
-- Detailed logs for batch processing
-- ============================================================
CREATE TABLE batch_processing_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES batch_processing_jobs(id) ON DELETE CASCADE,
    ebook_id UUID REFERENCES ebooks(id) ON DELETE SET NULL,
    
    -- Log info
    log_level TEXT NOT NULL, -- info, warning, error, debug
    message TEXT NOT NULL,
    details JSONB,
    
    -- Context
    layer_number INTEGER,
    layer_name TEXT,
    processing_stage TEXT,
    
    -- Timing
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    elapsed_ms INTEGER
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Ebooks indexes
CREATE INDEX idx_ebooks_drive_id ON ebooks(drive_id);
CREATE INDEX idx_ebooks_status ON ebooks(processing_status);
CREATE INDEX idx_ebooks_category ON ebooks(category);
CREATE INDEX idx_ebooks_priority ON ebooks(processing_priority);
CREATE INDEX idx_ebooks_quality ON ebooks(quality_score);
CREATE INDEX idx_ebooks_created_at ON ebooks(created_at);
CREATE INDEX idx_ebooks_is_favorite ON ebooks(is_favorite) WHERE is_favorite = TRUE;

-- Processing queue indexes
CREATE INDEX idx_queue_status ON ebook_processing_queue(status);
CREATE INDEX idx_queue_priority ON ebook_processing_queue(priority, created_at);
CREATE INDEX idx_queue_retry ON ebook_processing_queue(next_retry_at) WHERE status = 'retry';
CREATE INDEX idx_queue_batch_job ON ebook_processing_queue(batch_job_id);

-- Course indexes
CREATE INDEX idx_courses_ebook ON courses_from_ebooks(ebook_id);
CREATE INDEX idx_courses_slug ON courses_from_ebooks(slug);
CREATE INDEX idx_courses_status ON courses_from_ebooks(status);
CREATE INDEX idx_courses_category ON courses_from_ebooks(category);
CREATE INDEX idx_courses_featured ON courses_from_ebooks(is_featured) WHERE is_featured = TRUE;

-- Module and lesson indexes
CREATE INDEX idx_modules_course ON learning_modules(course_id);
CREATE INDEX idx_modules_order ON learning_modules(course_id, display_order);
CREATE INDEX idx_lessons_module ON course_lessons(module_id);
CREATE INDEX idx_lessons_course ON course_lessons(course_id);
CREATE INDEX idx_lessons_order ON course_lessons(module_id, display_order);

-- Cover cache indexes
CREATE INDEX idx_covers_ebook ON book_cover_cache(ebook_id);
CREATE INDEX idx_covers_source ON book_cover_cache(source);

-- Job indexes
CREATE INDEX idx_jobs_status ON batch_processing_jobs(status);
CREATE INDEX idx_jobs_created_at ON batch_processing_jobs(created_at);

-- Log indexes
CREATE INDEX idx_logs_job ON batch_processing_logs(job_id);
CREATE INDEX idx_logs_level ON batch_processing_logs(log_level);
CREATE INDEX idx_logs_time ON batch_processing_logs(logged_at);

-- ============================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_ebooks_updated_at BEFORE UPDATE ON ebooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_queue_updated_at BEFORE UPDATE ON ebook_processing_queue
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses_from_ebooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON learning_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON course_lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_covers_updated_at BEFORE UPDATE ON book_cover_cache
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON batch_processing_jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE ebooks;
ALTER PUBLICATION supabase_realtime ADD TABLE ebook_processing_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE batch_processing_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE courses_from_ebooks;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses_from_ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

-- Public can read published courses
CREATE POLICY "Public can read published courses" ON courses_from_ebooks
    FOR SELECT USING (status = 'published');

-- Authenticated users can read all ebooks
CREATE POLICY "Authenticated users can read ebooks" ON ebooks
    FOR SELECT TO authenticated USING (true);

-- Admin can do everything
CREATE POLICY "Admin full access on ebooks" ON ebooks
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access on courses" ON courses_from_ebooks
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================

-- View: Ebooks with cover info
CREATE VIEW ebooks_with_covers AS
SELECT 
    e.*,
    bc.cover_url,
    bc.thumbnail_url,
    bc.is_placeholder as cover_is_placeholder
FROM ebooks e
LEFT JOIN book_cover_cache bc ON e.id = bc.ebook_id;

-- View: Courses with ebook info
CREATE VIEW courses_with_ebooks AS
SELECT 
    c.*,
    e.title as ebook_title,
    e.author as ebook_author,
    e.quality_score as ebook_quality_score,
    e.cover_image_url as ebook_cover
FROM courses_from_ebooks c
JOIN ebooks e ON c.ebook_id = e.id;

-- View: Processing queue status
CREATE VIEW queue_status AS
SELECT 
    status,
    COUNT(*) as count,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM ebook_processing_queue
GROUP BY status;

-- View: Batch job summary
CREATE VIEW batch_job_summary AS
SELECT 
    id,
    job_name,
    status,
    total_books,
    processed_count,
    failed_count,
    progress_percent,
    average_quality_score,
    started_at,
    completed_at,
    CASE 
        WHEN completed_at IS NOT NULL THEN EXTRACT(EPOCH FROM (completed_at - started_at))/60
        ELSE NULL
    END as duration_minutes
FROM batch_processing_jobs;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Function: Get next book to process
CREATE OR REPLACE FUNCTION get_next_book_to_process()
RETURNS TABLE (
    id UUID,
    drive_id TEXT,
    title TEXT,
    priority INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.drive_id,
        e.title,
        e.processing_priority
    FROM ebooks e
    LEFT JOIN ebook_processing_queue q ON e.id = q.ebook_id
    WHERE e.processing_status IN ('pending', 'failed')
    AND (q.id IS NULL OR q.status = 'retry')
    ORDER BY e.processing_priority ASC, e.created_at ASC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function: Update job progress
CREATE OR REPLACE FUNCTION update_job_progress(p_job_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total INTEGER;
    v_processed INTEGER;
    v_failed INTEGER;
    v_avg_quality REAL;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'completed'),
        COUNT(*) FILTER (WHERE status = 'failed'),
        AVG((result->>'quality_score')::REAL)
    INTO v_total, v_processed, v_failed, v_avg_quality
    FROM ebook_processing_queue
    WHERE batch_job_id = p_job_id;
    
    UPDATE batch_processing_jobs
    SET 
        total_books = v_total,
        processed_count = v_processed,
        failed_count = v_failed,
        progress_percent = CASE 
            WHEN v_total > 0 THEN (v_processed::REAL / v_total::REAL) * 100 
            ELSE 0 
        END,
        average_quality_score = v_avg_quality,
        updated_at = NOW()
    WHERE id = p_job_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Search ebooks
CREATE OR REPLACE FUNCTION search_ebooks(search_query TEXT)
RETURNS TABLE (
    id UUID,
    title TEXT,
    author TEXT,
    category TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        e.author,
        e.category,
        ts_rank(
            to_tsvector('indonesian', COALESCE(e.title, '') || ' ' || COALESCE(e.author, '') || ' ' || COALESCE(e.description, '')),
            plainto_tsquery('indonesian', search_query)
        ) as rank
    FROM ebooks e
    WHERE 
        e.title ILIKE '%' || search_query || '%'
        OR e.author ILIKE '%' || search_query || '%'
        OR e.tags::text ILIKE '%' || search_query || '%'
    ORDER BY rank DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- INITIAL DATA (Optional)
-- ============================================================

-- Insert priority books metadata
INSERT INTO ebooks (drive_id, file_name, title, author, category, processing_priority, processing_status)
VALUES 
    ('1RtJBQ_Hd-ULaOH5l_7PDU4ruiTpWUta3', 'Buku 1 KDKM dan HDPSDM MUBES V ITS.pdf', 'Buku 1 KDKM dan HDPSDM MUBES V ITS', 'PPSDM KMM', 'Keorganisasian', 1, 'pending'),
    ('1dG88UW61wugYxeZ5_hjAagdXgfjQ5eo7', 'Naskah Akademik dan Penyusunan PPSDM KMM ITS.pdf', 'Naskah Akademik dan Penyusunan PPSDM KMM ITS', 'PPSDM KMM', 'Akademik', 1, 'pending'),
    ('1_UsKJ9KAwMMVNjGNtwNawIA3Z62UppVg', 'Pendidikan Kaum Tertindas Paulo Freire.pdf', 'Pendidikan Kaum Tertindas', 'Paulo Freire', 'Filsafat Pendidikan', 2, 'pending'),
    ('1Pty83dBRR4fxTU_-TMwAYDtD2ogsV1jo', 'Catatan Seorang Demonstran Soe Hok Gie.pdf', 'Catatan Seorang Demonstran', 'Soe Hok Gie', 'Sejarah', 2, 'pending'),
    ('1rq4SJGRQZN9wzONoJb1ui7zuk3RP95tO', 'Sejarah Pergerakan Nasional Indonesia.pdf', 'Sejarah Pergerakan Nasional Indonesia', 'Unknown', 'Sejarah', 2, 'pending')
ON CONFLICT (drive_id) DO NOTHING;
