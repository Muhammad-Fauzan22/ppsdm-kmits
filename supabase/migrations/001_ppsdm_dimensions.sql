-- ============================================================================
-- PPSDM KMM 9 Dimensions System - Database Migration
-- ============================================================================
-- This migration creates the core tables for the 9 Dimensions assessment system:
-- - user_profiles: Extended user information
-- - dimension_scores: 9 dimensions scores per user
-- - assessments: Assessment sessions tracking
-- - goals: User goals with JSONB milestones
-- - activities: User activity log
-- - achievements: Badge/achievement definitions
-- - user_achievements: User-earned achievements
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    nim TEXT UNIQUE,
    faculty TEXT,
    study_program TEXT,
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on NIM for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_nim ON user_profiles(nim);
CREATE INDEX IF NOT EXISTS idx_user_profiles_faculty ON user_profiles(faculty);

-- ============================================================================
-- DIMENSION SCORES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS dimension_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    cognitive INTEGER CHECK (cognitive BETWEEN 0 AND 100) DEFAULT 0,
    emotional INTEGER CHECK (emotional BETWEEN 0 AND 100) DEFAULT 0,
    spiritual INTEGER CHECK (spiritual BETWEEN 0 AND 100) DEFAULT 0,
    physical INTEGER CHECK (physical BETWEEN 0 AND 100) DEFAULT 0,
    creative INTEGER CHECK (creative BETWEEN 0 AND 100) DEFAULT 0,
    professional INTEGER CHECK (professional BETWEEN 0 AND 100) DEFAULT 0,
    leadership INTEGER CHECK (leadership BETWEEN 0 AND 100) DEFAULT 0,
    financial INTEGER CHECK (financial BETWEEN 0 AND 100) DEFAULT 0,
    environmental INTEGER CHECK (environmental BETWEEN 0 AND 100) DEFAULT 0,
    overall_index INTEGER GENERATED ALWAYS AS (
        (cognitive + emotional + spiritual + physical + creative + professional + leadership + financial + environmental) / 9
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for dimension scores
CREATE INDEX IF NOT EXISTS idx_dimension_scores_user_id ON dimension_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_dimension_scores_overall ON dimension_scores(overall_index);

-- ============================================================================
-- ASSESSMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dimension VARCHAR(20) CHECK (dimension IN ('cognitive', 'emotional', 'spiritual', 'physical', 'creative', 'professional', 'leadership', 'financial', 'environmental')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    max_score INTEGER DEFAULT 100,
    responses JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER CHECK (duration_seconds >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for assessments
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_dimension ON assessments(dimension);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_user_dimension ON assessments(user_id, dimension);

-- ============================================================================
-- GOALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category VARCHAR(20) CHECK (category IN ('cognitive', 'emotional', 'spiritual', 'physical', 'creative', 'professional', 'leadership', 'financial', 'environmental', 'holistic')) NOT NULL,
    target_dimension VARCHAR(20) CHECK (target_dimension IN ('cognitive', 'emotional', 'spiritual', 'physical', 'creative', 'professional', 'leadership', 'financial', 'environmental')),
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'archived', 'cancelled')) DEFAULT 'active',
    progress INTEGER CHECK (progress BETWEEN 0 AND 100) DEFAULT 0,
    priority INTEGER CHECK (priority BETWEEN 1 AND 5) DEFAULT 3,
    target_date TIMESTAMP WITH TIME ZONE,
    milestones JSONB DEFAULT '[]'::jsonb,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for goals
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON goals(target_date);

-- Create GIN index for milestones JSONB
CREATE INDEX IF NOT EXISTS idx_goals_milestones ON goals USING GIN(milestones);

-- ============================================================================
-- ACTIVITIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(30) CHECK (type IN ('assessment_completed', 'goal_created', 'goal_updated', 'goal_completed', 'milestone_reached', 'achievement_unlocked', 'level_up', 'streak_updated', 'resource_accessed', 'course_completed', 'login')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    xp_earned INTEGER DEFAULT 0 CHECK (xp_earned >= 0),
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for activities
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user_type ON activities(user_id, type);
CREATE INDEX IF NOT EXISTS idx_activities_related ON activities(related_entity_type, related_entity_id);

-- Create GIN index for metadata JSONB
CREATE INDEX IF NOT EXISTS idx_activities_metadata ON activities USING GIN(metadata);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    rarity VARCHAR(20) CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
    xp_reward INTEGER DEFAULT 0 CHECK (xp_reward >= 0),
    criteria JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_code ON achievements(code);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);

-- ============================================================================
-- USER ACHIEVEMENTS TABLE (Junction table)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    viewed BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, achievement_id)
);

-- Create indexes for user achievements
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_viewed ON user_achievements(user_id, viewed) WHERE viewed = FALSE;

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dimension_scores_updated_at ON dimension_scores;
CREATE TRIGGER update_dimension_scores_updated_at
    BEFORE UPDATE ON dimension_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create default dimension scores for new users
CREATE OR REPLACE FUNCTION create_default_dimension_scores()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO dimension_scores (user_id, cognitive, emotional, spiritual, physical, creative, professional, leadership, financial, environmental)
    VALUES (NEW.id, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default dimension scores on profile creation
DROP TRIGGER IF EXISTS on_profile_created ON user_profiles;
CREATE TRIGGER on_profile_created
    AFTER INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_default_dimension_scores();

-- Function to update goal progress when milestones change
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_milestones INTEGER;
    completed_milestones INTEGER;
    new_progress INTEGER;
BEGIN
    -- Calculate progress based on milestones
    SELECT 
        COALESCE(jsonb_array_length(NEW.milestones), 0),
        COALESCE((
            SELECT COUNT(*)
            FROM jsonb_array_elements(NEW.milestones) AS m
            WHERE (m->>'completed')::boolean = true
        ), 0)
    INTO total_milestones, completed_milestones;
    
    IF total_milestones > 0 THEN
        new_progress := (completed_milestones * 100) / total_milestones;
        NEW.progress := new_progress;
        
        -- Auto-complete goal if all milestones are done
        IF new_progress = 100 AND NEW.status = 'active' THEN
            NEW.status := 'completed';
            NEW.completed_at := NOW();
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update goal progress
DROP TRIGGER IF EXISTS on_goal_milestones_updated ON goals;
CREATE TRIGGER on_goal_milestones_updated
    BEFORE UPDATE OF milestones ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_goal_progress();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dimension_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can manage all profiles" ON user_profiles;
CREATE POLICY "Service role can manage all profiles"
    ON user_profiles FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Dimension Scores Policies
DROP POLICY IF EXISTS "Users can view own dimension scores" ON dimension_scores;
CREATE POLICY "Users can view own dimension scores"
    ON dimension_scores FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own dimension scores" ON dimension_scores;
CREATE POLICY "Users can insert own dimension scores"
    ON dimension_scores FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own dimension scores" ON dimension_scores;
CREATE POLICY "Users can update own dimension scores"
    ON dimension_scores FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all dimension scores" ON dimension_scores;
CREATE POLICY "Service role can manage all dimension scores"
    ON dimension_scores FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Assessments Policies
DROP POLICY IF EXISTS "Users can view own assessments" ON assessments;
CREATE POLICY "Users can view own assessments"
    ON assessments FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own assessments" ON assessments;
CREATE POLICY "Users can create own assessments"
    ON assessments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own assessments" ON assessments;
CREATE POLICY "Users can update own assessments"
    ON assessments FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own assessments" ON assessments;
CREATE POLICY "Users can delete own assessments"
    ON assessments FOR DELETE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all assessments" ON assessments;
CREATE POLICY "Service role can manage all assessments"
    ON assessments FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Goals Policies
DROP POLICY IF EXISTS "Users can view own goals" ON goals;
CREATE POLICY "Users can view own goals"
    ON goals FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own goals" ON goals;
CREATE POLICY "Users can create own goals"
    ON goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own goals" ON goals;
CREATE POLICY "Users can update own goals"
    ON goals FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own goals" ON goals;
CREATE POLICY "Users can delete own goals"
    ON goals FOR DELETE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all goals" ON goals;
CREATE POLICY "Service role can manage all goals"
    ON goals FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Activities Policies
DROP POLICY IF EXISTS "Users can view own activities" ON activities;
CREATE POLICY "Users can view own activities"
    ON activities FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own activities" ON activities;
CREATE POLICY "Users can create own activities"
    ON activities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all activities" ON activities;
CREATE POLICY "Service role can manage all activities"
    ON activities FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Achievements Policies (Public read, service role write)
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON achievements;
CREATE POLICY "Achievements are viewable by everyone"
    ON achievements FOR SELECT
    TO authenticated, anon
    USING (true);

DROP POLICY IF EXISTS "Service role can manage achievements" ON achievements;
CREATE POLICY "Service role can manage achievements"
    ON achievements FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- User Achievements Policies
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
CREATE POLICY "Users can view own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage user achievements" ON user_achievements;
CREATE POLICY "Service role can manage user achievements"
    ON user_achievements FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default achievements
INSERT INTO achievements (code, name, description, rarity, xp_reward, criteria) VALUES
('first_assessment', 'First Assessment', 'Complete your first assessment', 'common', 50, '{"assessments_completed": 1}'),
('dimension_master', 'Dimension Master', 'Achieve 80+ in all 9 dimensions', 'legendary', 1000, '{"min_score_all_dimensions": 80}'),
('goal_setter', 'Goal Setter', 'Create your first goal', 'common', 25, '{"goals_created": 1}'),
('goal_achiever', 'Goal Achiever', 'Complete 5 goals', 'rare', 150, '{"goals_completed": 5}'),
('streak_keeper', 'Streak Keeper', 'Maintain a 7-day streak', 'rare', 100, '{"streak_days": 7}'),
('level_up_1', 'Level Up', 'Reach level 5', 'common', 75, '{"level": 5}'),
('level_up_2', 'Rising Star', 'Reach level 10', 'rare', 200, '{"level": 10}'),
('level_up_3', 'Master Achiever', 'Reach level 25', 'epic', 500, '{"level": 25}'),
('cognitive_explorer', 'Cognitive Explorer', 'Score 70+ on cognitive assessment', 'common', 50, '{"dimension": "cognitive", "min_score": 70}'),
('emotional_aware', 'Emotionally Aware', 'Score 70+ on emotional assessment', 'common', 50, '{"dimension": "emotional", "min_score": 70}'),
('spiritual_seeker', 'Spiritual Seeker', 'Score 70+ on spiritual assessment', 'common', 50, '{"dimension": "spiritual", "min_score": 70}'),
('physical_fit', 'Physically Fit', 'Score 70+ on physical assessment', 'common', 50, '{"dimension": "physical", "min_score": 70}'),
('creative_mind', 'Creative Mind', 'Score 70+ on creative assessment', 'common', 50, '{"dimension": "creative", "min_score": 70}'),
('professional_ready', 'Professional Ready', 'Score 70+ on professional assessment', 'common', 50, '{"dimension": "professional", "min_score": 70}'),
('leadership_emerging', 'Emerging Leader', 'Score 70+ on leadership assessment', 'common', 50, '{"dimension": "leadership", "min_score": 70}'),
('financial_literate', 'Financially Literate', 'Score 70+ on financial assessment', 'common', 50, '{"dimension": "financial", "min_score": 70}'),
('environmental_guardian', 'Environmental Guardian', 'Score 70+ on environmental assessment', 'common', 50, '{"dimension": "environmental", "min_score": 70}')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_profiles IS 'Extended user profile information for PPSDM KMM students';
COMMENT ON TABLE dimension_scores IS '9-dimensional assessment scores for holistic development tracking';
COMMENT ON TABLE assessments IS 'Individual assessment sessions with detailed responses';
COMMENT ON TABLE goals IS 'User goals with milestone tracking using JSONB';
COMMENT ON TABLE activities IS 'Activity log for gamification and analytics';
COMMENT ON TABLE achievements IS 'Achievement/badge definitions';
COMMENT ON TABLE user_achievements IS 'Junction table linking users to earned achievements';
