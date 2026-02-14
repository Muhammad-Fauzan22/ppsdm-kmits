
-- DAILY WISDOM TABLE
-- Stores AI-generated daily insights based on knowledge items

CREATE TABLE IF NOT EXISTS public.daily_wisdom (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    source_items JSONB, -- Array of source knowledge_item IDs used
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CONSTRAINT daily_wisdom_date_key UNIQUE (date)
);

-- RLS
ALTER TABLE public.daily_wisdom ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Public Read Daily Wisdom" ON public.daily_wisdom
    FOR SELECT USING (true);

-- Only service role can insert/update (Cron jobs)
-- implicitly denied for anon/authenticated unless policy exists, 
-- but we can be explicit or just rely on default deny for write.
