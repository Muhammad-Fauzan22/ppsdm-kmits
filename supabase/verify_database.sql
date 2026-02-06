-- ============================================
-- PPSDM KMITS - Database Verification Commands
-- ============================================
-- Run these queries in Supabase SQL Editor to verify the setup
-- ============================================

-- 1. Check all tables
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 2. Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Check 9 Dimensions data
SELECT 
    order_index,
    slug,
    name,
    name_en,
    icon,
    color
FROM dimensions 
ORDER BY order_index;

-- 4. Check default badges
SELECT 
    slug,
    name,
    description,
    icon,
    color,
    xp_reward,
    requirement_type,
    requirement_value
FROM badges
ORDER BY xp_reward;

-- 5. Check indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename NOT LIKE 'pg_%'
ORDER BY tablename, indexname;

-- 6. Check triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 7. Check functions
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- 8. Check views
SELECT 
    table_name as view_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;

-- 9. Verify extensions
SELECT 
    extname as extension,
    extversion as version
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pgcrypto');

-- 10. Quick health check - count records in main tables
SELECT 
    'profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'dimensions', COUNT(*) FROM dimensions
UNION ALL
SELECT 'badges', COUNT(*) FROM badges
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'modules', COUNT(*) FROM modules
UNION ALL
SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments
UNION ALL
SELECT 'goals', COUNT(*) FROM goals
UNION ALL
SELECT 'enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'study_groups', COUNT(*) FROM study_groups
ORDER BY table_name;

-- ============================================
-- Test RLS (Run as authenticated user)
-- ============================================

-- Test: Can user see their own profile?
-- SELECT * FROM profiles WHERE id = auth.uid();

-- Test: Can user see all profiles?
-- SELECT * FROM profiles LIMIT 5;

-- Test: Can user update their own profile?
-- UPDATE profiles SET full_name = 'Test Name' WHERE id = auth.uid();

-- ============================================
-- Sample Data for Testing (Optional)
-- ============================================

-- Insert a test course (as admin)
/*
INSERT INTO courses (title, description, category, level, xp_reward, status)
VALUES (
    'Introduction to PPSDM',
    'Learn the basics of holistic student development',
    'Getting Started',
    'beginner',
    100,
    'published'
);
*/

-- Insert test modules
/*
INSERT INTO modules (course_id, title, order_index, xp_reward)
SELECT 
    id,
    'Module 1: Introduction',
    1,
    25
FROM courses WHERE title = 'Introduction to PPSDM';
*/

-- ============================================
-- END OF VERIFICATION
-- ============================================
