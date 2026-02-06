-- TABLES FOR SCRAPER SYSTEM

-- 1. Scraped News (ITS, etc.)
CREATE TABLE IF NOT EXISTS public.scraped_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    content TEXT,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Scraped Opportunities (Jobs, Scholarships, Events)
CREATE TABLE IF NOT EXISTS public.scraped_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    company TEXT, -- Provider/Company
    description TEXT,
    location TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    category TEXT, -- 'Beasiswa', 'Magang', 'Event'
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.scraped_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraped_opportunities ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access" ON public.scraped_news FOR SELECT USING (true);
CREATE POLICY "Allow public read access opportunities" ON public.scraped_opportunities FOR SELECT USING (true);

-- Allow service_role (scraper) to insert/update
-- (Implicitly allowed for service_role, but if using anon key, we need specific policy.
-- Usually scraper uses SERVICE_KEY or handles auth properly. 
-- We'll assume the Python script uses the SERVICE_KEY or has a user with insert rights.)
