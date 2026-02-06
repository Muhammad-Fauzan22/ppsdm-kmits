-- ZERO-COST PIPELINE MIGRATION
-- Extends the existing system to support offline/local processing queues

-- 1. Extend 'learning_resources' to store raw metadata and granular status
ALTER TABLE public.learning_resources 
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb; -- Raw metadata from source

-- 2. Create a Processing Queue for background workers (Cloudflare/Vercel)
CREATE TABLE IF NOT EXISTS public.processing_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES public.learning_resources(id) ON DELETE CASCADE,
  task_type TEXT DEFAULT 'general_alchemy', -- 'video_transcode', 'audio_transcribe', etc.
  status TEXT DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  error_log TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Output Cache to store expensive generations (Video/Audio)
CREATE TABLE IF NOT EXISTS public.output_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_hash TEXT UNIQUE, -- Hash of the input content/prompt
  output_type TEXT, -- 'mp4', 'mp3', 'pdf'
  output_data JSONB, -- The actual result or download URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Realtime Enabler
-- Allows the Frontend to listen to queue updates without polling
ALTER PUBLICATION supabase_realtime ADD TABLE public.processing_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_resources;

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_processing_queue_status ON public.processing_queue(status);
CREATE INDEX IF NOT EXISTS idx_processing_queue_resource ON public.processing_queue(resource_id);
