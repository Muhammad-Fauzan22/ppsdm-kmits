
-- ADVANCED GAMIFICATION MIGRATION

-- 1. UTILS
-- Ensure profiles has 'xp' and 'level' (Renaming xp_points if exists, or adding new)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'xp_points') THEN
        ALTER TABLE public.profiles RENAME COLUMN xp_points TO xp;
    ELSE
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
    END IF;
END $$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- 2. BADGES TABLE
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT, -- Emoji or Image URL
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. RLS FOR BADGES
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Badges" ON public.badges FOR SELECT USING (true);
