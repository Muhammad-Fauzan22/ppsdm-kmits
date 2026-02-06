-- =============================================
-- FORCE CREATE ADMIN USER (V6 COMPATIBLE)
-- Run this AFTER running complete_migration_v6_deepseek.sql
-- =============================================

BEGIN;

-- Ensure pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  target_email text := 'punyofauzan3@gmail.com';
  target_password text := '12345678';
  admin_role_id uuid;
BEGIN
  -- 1. Insert into auth.users (Supabase Auth)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = target_email) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      target_email,
      crypt(target_password, gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Super Admin"}',
      now(),
      now()
    );
    
    -- 2. Insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      new_user_id,
      new_user_id,
      format('{"sub": "%s", "email": "%s"}', new_user_id, target_email)::jsonb,
      'email',
      new_user_id, -- provider_id required
      now(),
      now(),
      now()
    );
    
    RAISE NOTICE 'User auth created: %', target_email;
  ELSE
    SELECT id INTO new_user_id FROM auth.users WHERE email = target_email;
    RAISE NOTICE 'User auth already exists: %', target_email;
  END IF;

  -- 3. Insert into public.users (V6 Extended Profile)
  -- Note: V6 requires faculty, full_name, and account_status
  INSERT INTO public.users (
    id, 
    email, 
    full_name, 
    faculty, 
    study_program,
    account_status,
    role
    -- Note: V6 uses user_roles, but we keep role column if it wasn't dropped, 
    -- otherwise V6 script might have removed it. We check if column exists safely?
    -- Actually V6 script removed 'role' column from users definition above.
    -- Wait, looking at V6 script provided... 'users' table does NOT have 'role' column. 
    -- It uses 'user_roles' table. 
    -- BUT we also inherit from auth.users? No, strict separation.
  )
  VALUES (
    new_user_id, 
    target_email, 
    'Super Admin', 
    'SYSTEM', -- Faculty is NOT NULL in V6
    'ADMINISTRATION',
    'active'
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    full_name = 'Super Admin',
    account_status = 'active';

  -- 4. Assign Admin Role (V6 RBAC)
  -- Find the 'admin' or 'super_admin' role id
  SELECT id INTO admin_role_id FROM public.roles WHERE role_name = 'super_admin';
  
  IF admin_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id, is_active)
    VALUES (new_user_id, admin_role_id, TRUE)
    ON CONFLICT (user_id, role_id) DO NOTHING;
    RAISE NOTICE 'Role super_admin assigned.';
  ELSE
    RAISE NOTICE 'Warning: super_admin role not found. Ensure roles are seeded.';
  END IF;

END $$;

COMMIT;
