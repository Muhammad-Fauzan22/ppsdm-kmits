-- PPSDM KMITS LMS: Hybrid CDN Content Columns Migration
-- This migration adds podcast_url and slide_url columns to modules table
-- for storing Google Drive audio and Google Slides links

-- 1. Add podcast_url column (Google Drive audio link)
ALTER TABLE modules ADD COLUMN IF NOT EXISTS podcast_url TEXT;

-- 2. Add slide_url column (Google Slides embed link)
ALTER TABLE modules ADD COLUMN IF NOT EXISTS slide_url TEXT;

-- 3. Add video_url column (YouTube ID) if not exists
ALTER TABLE modules ADD COLUMN IF NOT EXISTS video_url TEXT;

-- 4. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON modules(order_index);

-- Verify the schema
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'modules' ORDER BY ordinal_position;
