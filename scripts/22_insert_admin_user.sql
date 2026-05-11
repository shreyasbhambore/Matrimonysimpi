-- Create admin user in Supabase
-- Email: admin@matrimonysimpi.com
-- Password: Supariking (will be hashed by Supabase)

-- Step 1: Create the user in auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@matrimonysimpi.com',
  crypt('Supariking', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  true
) RETURNING id INTO admin_user_id;

-- Step 2: Insert into profiles table
INSERT INTO profiles (
  user_id,
  email,
  full_name,
  gender,
  date_of_birth,
  phone,
  city,
  profession,
  bio,
  is_verified,
  verification_status,
  created_at,
  updated_at
) SELECT
  id,
  'admin@matrimonysimpi.com',
  'Admin User',
  'Male',
  '1990-01-01'::date,
  '+91-9999999999',
  'Bangalore',
  'Administrator',
  'Platform Administrator',
  true,
  'verified',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@matrimonysimpi.com'
LIMIT 1;

-- Step 3: Insert into admin_users table
INSERT INTO admin_users (
  user_id,
  role,
  is_super_admin,
  can_manage_users,
  can_manage_profiles,
  can_manage_featured,
  can_manage_membership,
  can_manage_filters,
  created_at,
  updated_at
) SELECT
  id,
  'superadmin',
  true,
  true,
  true,
  true,
  true,
  true,
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@matrimonysimpi.com'
LIMIT 1;
