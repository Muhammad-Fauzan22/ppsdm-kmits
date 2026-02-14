-- GAMIFICATION ENGINE SCHEMA (Phase 9)
-- Created: 2026-02-14

-- 1. LEVELS
-- Defines the XP thresholds and titles
CREATE TABLE IF NOT EXISTS public.levels (
    level INTEGER PRIMARY KEY,
    xp_required INTEGER NOT NULL,
    title TEXT NOT NULL,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Levels Data
INSERT INTO public.levels (level, xp_required, title) VALUES
(1, 0, 'Novice'),
(2, 500, 'Apprentice'),
(3, 1500, 'Explorer'),
(4, 3000, 'Scholar'),
(5, 5000, 'Expert'),
(6, 10000, 'Master'),
(7, 20000, 'Grandmaster'),
(8, 50000, 'Legend'),
(9, 100000, 'Mythic')
ON CONFLICT (level) DO UPDATE SET xp_required = EXCLUDED.xp_required, title = EXCLUDED.title;

-- 2. USER PROGRESS
-- Tracks current state of gamification for each user
CREATE TABLE IF NOT EXISTS public.user_progress (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    current_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1 REFERENCES public.levels(level),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BADGES
-- Definitions of achievements
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'early_bird', 'perfect_score'
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    category VARCHAR(50) DEFAULT 'general', -- 'academic', 'community', 'hidden'
    xp_bonus INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. USER BADGES
-- Badges earned by users
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB, -- For storing specific details (e.g., "Score: 100")
    UNIQUE(user_id, badge_id)
);

-- 5. QUESTS
-- Daily/Weekly tasks
CREATE TABLE IF NOT EXISTS public.quests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    xp_reward INTEGER DEFAULT 100,
    frequency VARCHAR(50) CHECK (frequency IN ('daily', 'weekly', 'one_time', 'milestone')),
    action_type VARCHAR(50) NOT NULL, -- 'login', 'assessment', 'complete_profile', etc.
    target_count INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Basic Quests
INSERT INTO public.quests (title, description, xp_reward, frequency, action_type, target_count) VALUES
('Login Harian', 'Login ke aplikasi setiap hari', 50, 'daily', 'login', 1),
('Selesaikan Asesmen', 'Selesaikan satu asesmen dimensi apa saja', 200, 'daily', 'assessment_complete', 1),
('Lengkapi Profil', 'Lengkapi data profil Anda', 500, 'one_time', 'profile_complete', 1)
ON CONFLICT DO NOTHING; -- Note: UUIDs will generate, so this insert might duplicate if run multiple times without IDs. 
-- In production, we'd specify UUIDs for seed data or check by title.
-- For now, relying on fresh deploy or manual cleanup.

-- 6. USER QUESTS
-- Tracks progress on active quests
CREATE TABLE IF NOT EXISTS public.user_quests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    is_claimed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    reset_at TIMESTAMP WITH TIME ZONE, -- When this specific instance expires/resets
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, quest_id, reset_at) -- Approximation for unique active quest period
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Levels: Public read
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read levels" ON public.levels FOR SELECT USING (true);

-- User Progress: Self read/update (via server functions usually, but readable by user)
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
-- Updates should ideally happen via trusted functions/triggers, but for MVP allowing user update if logic is client-side (NOT SECURE)
-- Secure approach: only service_role updates progress.
-- We will enable read for users.

-- Badges: Public read
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read badges" ON public.badges FOR SELECT USING (true);

-- User Badges: Public read (for profiles) or Self read?
-- Let's allow public read for leaderboards/profiles later.
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read user badges" ON public.user_badges FOR SELECT USING (true);

-- Quests: Public read
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read quests" ON public.quests FOR SELECT USING (true);

-- User Quests: Self read/update
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own quests" ON public.user_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own quests" ON public.user_quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own quests" ON public.user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ==========================================
-- TRIGGERS
-- ==========================================

-- Auto-create user_progress on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user_gamification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_progress (user_id, current_xp, current_level)
    VALUES (NEW.id, 0, 1);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
-- Note: Assuming 'users' table is the one in public. 
-- If using Supabase Auth, we might need a trigger on auth.users too, but our schema uses public.users as the main logic table.
DROP TRIGGER IF EXISTS on_auth_user_created_gamification ON public.users;
CREATE TRIGGER on_auth_user_created_gamification
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_gamification();
