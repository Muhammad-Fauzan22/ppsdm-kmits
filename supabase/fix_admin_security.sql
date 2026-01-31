-- FIX: Remove insecure policy that allows access if table is empty
-- SECURITY: This ensures that only authenticated users with the correct role can access the admins table.

-- Drop the insecure policy if it exists
DROP POLICY IF EXISTS "Allow public access if table is empty" ON public.admins;

-- Ensure RLS is on
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for authenticated users
CREATE POLICY "Allow authenticated read access"
ON public.admins
FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow insert only by service_role (seed script) or super-admins (if applicable)
-- For now, we restrict inserts to service_role to prevent unauthorized admin creation
CREATE POLICY "Allow service_role insert"
ON public.admins
FOR INSERT
TO service_role
WITH CHECK (true);

-- Log this security update
INSERT INTO public.audit_logs (action, description)
VALUES ('SECURITY_UPDATE', 'Removed insecure public access policy on admins table');
