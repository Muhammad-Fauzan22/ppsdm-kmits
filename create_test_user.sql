-- Use this SQL script in the Supabase SQL Editor to create a test user
-- IF YOU ARE UNABLE TO REGISTER DUE TO RESTRICTIONS

-- 1. Create a test user in auth.users
-- This function mimics what happens when a user signs up.
-- You can change the email and password below.

-- Enable pgcrypto for UUID and hashing
create extension if not exists pgcrypto;

DO $$
DECLARE
  test_email text := 'mahasiswa@student.its.ac.id';
  test_password text := 'mahasiswa123'; -- Password for the user
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- Insert into auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = test_email) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      test_email,
      crypt(test_password, gen_salt('bf')), -- Hash the password
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Test Mahasiswa","nrp":"5025201000"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    RAISE NOTICE 'User created: Email=%, Password=%', test_email, test_password;
    
    -- OPTIONAL: Insert into your public.profiles table if you have one
    -- INSERT INTO public.profiles (id, full_name, role)
    -- VALUES (new_user_id, 'Test Mahasiswa', 'student');
    
  ELSE
    RAISE NOTICE 'User % already exists.', test_email;
  END IF;
END $$;
