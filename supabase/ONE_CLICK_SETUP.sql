-- ============================================
-- PPSDM KMITS - ONE CLICK DATABASE SETUP
-- ============================================
-- Eksekusi file ini di Supabase Dashboard SQL Editor
-- URL: https://supabase.com/dashboard/project/xncugiuvaetzjxuyfsko/sql-editor
--
-- Langkah:
-- 1. Copy seluruh isi file ini
-- 2. Paste ke Supabase SQL Editor
-- 3. Klik "Run"
-- ============================================

-- ============================================
-- PART 1: CREATE EXEC_SQL FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result jsonb;
BEGIN
    EXECUTE sql;
    result := jsonb_build_object('success', true, 'message', 'SQL executed successfully');
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    result := jsonb_build_object('success', false, 'error', SQLERRM, 'detail', SQLSTATE);
    RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO anon;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;

-- ============================================
-- PART 2: EXTENSIONS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- PART 3: ENUM TYPES
-- ============================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'supervisor', 'admin', 'content_manager', 'assessor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE assessment_status AS ENUM ('not_started', 'in_progress', 'completed', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('article', 'video', 'podcast', 'course', 'ebook', 'infographic', 'interactive', 'quiz', 'template', 'tool');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE content_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE emotional_state AS ENUM ('very_negative', 'negative', 'neutral', 'positive', 'very_positive');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE stress_level AS ENUM ('low', 'moderate', 'high', 'severe');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE goal_status AS ENUM ('active', 'completed', 'abandoned', 'on_hold');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE activity_type AS ENUM ('login', 'content_view', 'assessment_start', 'assessment_complete', 'goal_create', 'goal_update', 'goal_complete', 'achievement_unlock', 'course_enroll', 'course_complete', 'social_share', 'mentor_session', 'journal_entry', 'mood_log', 'physical_activity', 'sleep_log', 'meditation', 'prayer', 'quran_reading', 'community_post', 'comment', 'like', 'bookmark', 'download', 'search', 'filter_use', 'page_view', 'error', 'feature_use');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('achievement', 'goal_reminder', 'assessment_reminder', 'content_recommendation', 'system', 'social', 'mentor', 'deadline', 'streak', 'milestone', 'course_update', 'new_content', 'weekly_report', 'monthly_report');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE device_type AS ENUM ('mobile', 'tablet', 'desktop', 'smartwatch', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE platform_type AS ENUM ('ios', 'android', 'web', 'desktop_app', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived', 'under_review');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('not_started', 'in_progress', 'completed', 'dropped', 'on_hold');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE content_source_type AS ENUM ('internal', 'external', 'scraped', 'user_generated', 'ai_generated', 'partner', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged', 'under_review');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE report_type AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom', 'assessment', 'progress', 'engagement', 'comprehensive');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE report_format AS ENUM ('pdf', 'html', 'json', 'csv', 'excel');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'generating', 'completed', 'failed', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE gamification_action AS ENUM ('login', 'content_view', 'assessment_complete', 'goal_achieve', 'streak_maintain', 'social_share', 'mentor_session', 'course_complete', 'community_contribute', 'feedback_provide', 'bug_report', 'feature_suggest', 'content_create', 'assessment_create', 'course_create', 'mentor_others', 'help_others', 'daily_checkin', 'weekly_reflection', 'monthly_review');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE badge_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE challenge_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE challenge_type AS ENUM ('daily', 'weekly', 'monthly', 'special', 'seasonal', 'milestone');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE ai_model_type AS ENUM ('recommendation', 'assessment_analysis', 'content_generation', 'sentiment_analysis', 'predictive', 'chatbot', 'summarization', 'translation', 'code_generation');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE ai_task_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE integration_type AS ENUM ('google_calendar', 'apple_health', 'google_fit', 'fitbit', 'notion', 'todoist', 'trello', 'slack', 'discord', 'whatsapp', 'telegram', 'email', 'sms', 'push_notification', 'webhook', 'api', 'lti', 'scorm', 'xapi');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE integration_status AS ENUM ('active', 'inactive', 'error', 'pending_setup', 'revoked');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE data_retention_policy AS ENUM ('minimal', 'standard', 'extended', 'comprehensive', 'indefinite');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE privacy_level AS ENUM ('public', 'friends', 'mentors_only', 'private');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE consent_type AS ENUM ('terms_of_service', 'privacy_policy', 'data_processing', 'marketing', 'analytics', 'third_party', 'research', 'ai_training');
