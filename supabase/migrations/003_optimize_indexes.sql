-- ============================================================================
-- PPSDM KMM Database Optimization - Optimal Indexes Migration
-- ============================================================================
-- Migration ini menambahkan indexes optimal untuk meningkatkan query performance
-- Dibuat: 2026-02-05
-- ============================================================================

-- ============================================================================
-- AUTH.USERS INDEXES (untuk user-related queries)
-- ============================================================================

-- Index untuk email lookup (forgot password, user lookup)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_users_email 
ON auth.users(email);

-- Index untuk created_at sorting (new users, activity sorting)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_users_created_at 
ON auth.users(created_at DESC);

-- ============================================================================
-- USER PROFILES INDEXES (diperlukan untuk dashboard queries)
-- ============================================================================

-- Composite index untuk faculty + level queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_faculty_level 
ON user_profiles(faculty, level DESC);

-- Index untuk streak sorting (leaderboard queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_streak 
ON user_profiles(current_streak DESC) WHERE current_streak > 0;

-- Index untuk XP sorting (leaderboard queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_xp 
ON user_profiles(total_xp DESC) WHERE total_xp > 0;

-- ============================================================================
-- DIMENSION SCORES INDEXES (diperlukan untuk assessment queries)
-- ============================================================================

-- Composite index untuk user + overall_index (leaderboards by dimension)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dimension_scores_user_overall 
ON dimension_scores(user_id, overall_index DESC);

-- Index untuk top scores queries (dimension leaderboards)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dimension_scores_overall_desc 
ON dimension_scores(overall_index DESC) WHERE overall_index > 0;

-- ============================================================================
-- ASSESSMENTS INDEXES (diperlukan untuk assessment dashboard)
-- ============================================================================

-- Index untuk user_id lookup (user assessment queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_user_id 
ON assessments(user_id);

-- Index untuk created_at sorting (assessment history queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_created_at 
ON assessments(created_at DESC);

-- Composite index untuk user + dimension + created_at (history queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_user_dimension_created 
ON assessments(user_id, dimension, created_at DESC);

-- Index untuk status filtering (in-progress assessments)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_completed_at 
ON assessments(completed_at DESC) WHERE completed_at IS NOT NULL;

-- Index untuk duration analysis (performance tracking)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_assessments_duration 
ON assessments(duration_seconds) WHERE duration_seconds IS NOT NULL;

-- ============================================================================
-- GOALS INDEXES (diperlukan untuk goal tracking)
-- ============================================================================

-- Composite index untuk user + status + priority (goal list queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_goals_user_status_priority 
ON goals(user_id, status, priority DESC) 
WHERE status = 'active';

-- Composite index untuk user + category + progress (progress tracking)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_goals_user_category_progress 
ON goals(user_id, category, progress DESC);

-- Index untuk overdue goals (deadline queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_goals_target_date_overdue 
ON goals(target_date) 
WHERE status = 'active' AND target_date < NOW();

-- ============================================================================
-- ACTIVITIES INDEXES (diperlukan untuk activity feed)
-- ============================================================================

-- Composite index untuk user + type + created_at (activity feed)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activities_user_type_created 
ON activities(user_id, type, created_at DESC);

-- Index untuk XP aggregation (stats queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activities_xp 
ON activities(xp_earned DESC) WHERE xp_earned > 0;

-- ============================================================================
-- USER ACHIEVEMENTS INDEXES (diperlukan untuk achievement queries)
-- ============================================================================

-- Composite index untuk user + unlocked_at (achievement timeline)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_achievements_user_unlocked 
ON user_achievements(user_id, unlocked_at DESC);

-- Partial index untuk unread achievements (notification queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_achievements_unread 
ON user_achievements(unlocked_at DESC) 
WHERE viewed = FALSE;

-- ============================================================================
-- PROGRESS INDEXES (diperlukan untuk progress tracking)
-- ============================================================================

-- Composite index untuk user + date (progress history queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_progress_user_id_date 
ON progress(user_id, date);

-- ============================================================================
-- FULL-TEXT SEARCH INDEXES (untuk search functionality)
-- ============================================================================

-- GIN index untuk goal title search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_goals_title_gin 
ON goals USING GIN(to_tsvector('indonesian', title));

-- GIN index untuk activity description search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_activities_description_gin 
ON activities USING GIN(to_tsvector('indonesian', description));

-- ============================================================================
-- PERFORMANCE OPTIMIZATION FUNCTIONS
-- ============================================================================

-- Function untuk analyze tables setelah migration
CREATE OR REPLACE FUNCTION ppsdm_analyze_tables()
RETURNS VOID AS $$
BEGIN
    ANALYZE user_profiles;
    ANALYZE dimension_scores;
    ANALYZE assessments;
    ANALYZE goals;
    ANALYZE activities;
    ANALYZE achievements;
    ANALYZE user_achievements;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INDEX INFORMATION VIEW
-- ============================================================================

CREATE OR REPLACE VIEW ppsdm_indexes_info AS
SELECT 
    t.relname AS table_name,
    i.relname AS index_name,
    pg_get_indexdef(i.oid) AS index_definition,
    idx_scan AS scan_count,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes i
JOIN pg_index ix ON i.indexrelid = ix.indexrelid
JOIN pg_class t ON t.oid = ix.indrelid
WHERE t.relname LIKE 'ppsdm_%' OR t.relname IN (
    'user_profiles', 'dimension_scores', 'assessments', 
    'goals', 'activities', 'achievements', 'user_achievements'
)
ORDER BY t.relname, i.relname;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION ppsdm_analyze_tables IS 'Analyze all PPSDM tables for query optimizer';
COMMENT ON VIEW ppsdm_indexes_info IS 'View all indexes on PPSDM tables with usage statistics';