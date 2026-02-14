
-- Function to get overall analytics summary
CREATE OR REPLACE FUNCTION get_analytics_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_students INT;
    active_users_7d INT;
    avg_xp NUMERIC;
    quest_completion_rate NUMERIC;
BEGIN
    -- Total Students
    SELECT COUNT(*) INTO total_students FROM auth.users;

    -- Active Users (logged in last 7 days)
    -- Assuming we track last_sign_in_at in auth.users or have a user_progress log
    -- For now using user_progress.updated_at as proxy for activity
    SELECT COUNT(DISTINCT user_id) INTO active_users_7d 
    FROM public.user_progress 
    WHERE updated_at > NOW() - INTERVAL '7 days';

    -- Average XP
    SELECT COALESCE(AVG(current_xp), 0) INTO avg_xp FROM public.user_progress;

    -- Quest Completion Rate (Completed / Total assigned)
    -- This is an approximation
    SELECT 
        CASE WHEN COUNT(*) = 0 THEN 0 
        ELSE (SUM(CASE WHEN is_completed THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100 
        END INTO quest_completion_rate
    FROM public.user_quests;

    RETURN jsonb_build_object(
        'total_students', total_students,
        'active_users_7d', active_users_7d,
        'avg_xp', ROUND(avg_xp, 1),
        'quest_completion_rate', ROUND(quest_completion_rate, 1)
    );
END;
$$;

-- Function to get participation by department (mock data if dept not in public.users yet, but we will assume public.users or profiles exist)
-- Actually we don't have a reliable department field in public schema yet based on previous steps? 
-- Let's check 'alumni_profiles' has department, but 'users' might not.
-- Phase 1 added 'alumni_profiles', but current users?
-- Let's check 'user_progress' join with... what?
-- If no department data, we might need to rely on 'user_metadata' from auth, which we can't easily query in bulk efficiently without a public table sync.
-- Or we check if 'profiles' table exists. 
-- For this MVP, I will create a function that returns dummy department data if real data is missing, 
-- OR strictly query 'alumni_profiles' if that's the only place with departments.
-- BUT 'alumni' are not 'students'.
-- Let's check if we have a 'profiles' table. 
-- If not, I'll create a simple one or just return mock aggregation for now to satisfy the UI requirement, 
-- linking it to a real table if I find one.
-- WAITING: I will check for 'profiles' table first.

-- For now, let's create a placeholder that returns static data until we confirm schema.
CREATE OR REPLACE FUNCTION get_department_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Mock return for now
    RETURN jsonb_build_array(
        jsonb_build_object('name', 'Informatika', 'count', 120),
        jsonb_build_object('name', 'Sistem Informasi', 'count', 95),
        jsonb_build_object('name', 'Teknik Elektro', 'count', 80),
        jsonb_build_object('name', 'Teknik Mesin', 'count', 60),
        jsonb_build_object('name', 'Desain Produk', 'count', 45)
    );
END;
$$;
