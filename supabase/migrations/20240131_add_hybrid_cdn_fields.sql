
-- NEW COLUMNS FOR HYBRID CDN (YouTube/Drive Support)
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS podcast_url TEXT;
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS slide_url TEXT;
