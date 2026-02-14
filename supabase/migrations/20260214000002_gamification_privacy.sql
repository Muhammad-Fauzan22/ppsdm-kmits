
-- Add is_public column to user_progress
ALTER TABLE public.user_progress 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE;

-- Allow users to update their own progress (needed for privacy toggle)
-- Check if policy exists first to avoid error, or just drop and recreate
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'user_progress'
        AND policyname = 'Users update own progress'
    ) THEN
        CREATE POLICY "Users update own progress" ON public.user_progress
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END
$$;
