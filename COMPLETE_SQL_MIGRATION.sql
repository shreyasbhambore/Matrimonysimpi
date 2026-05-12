-- =====================================================================
-- ADMIN DASHBOARD - COMPLETE SQL MIGRATION
-- 
-- For your own Supabase instance
-- Paste this entire script into Supabase SQL Editor and run
-- 
-- Safe migration - handles existing tables and constraints
-- =====================================================================

-- PART 1: ADD MISSING COLUMNS TO PROFILES TABLE
-- =====================================================================

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);

-- =====================================================================
-- PART 2: UPDATE USER_MEMBERSHIP_SETTINGS TABLE
-- =====================================================================

-- Drop conflicting constraint if it exists (safe)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_membership_unique'
  ) THEN
    ALTER TABLE user_membership_settings DROP CONSTRAINT user_membership_unique;
  END IF;
END $$;

-- Add missing columns to existing table if they don't exist
ALTER TABLE user_membership_settings
ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS membership_expiry TIMESTAMP WITH TIME ZONE;

-- Add the unique constraint back (safe)
ALTER TABLE user_membership_settings 
ADD CONSTRAINT user_membership_unique UNIQUE(user_id);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_membership_settings_user_id ON user_membership_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_membership_settings_is_active ON user_membership_settings(is_membership_active);

-- Ensure RLS is enabled
ALTER TABLE user_membership_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to update them (safe)
DROP POLICY IF EXISTS "Users can view own membership" ON user_membership_settings;
DROP POLICY IF EXISTS "Admins can view all memberships" ON user_membership_settings;
DROP POLICY IF EXISTS "Admins can insert memberships" ON user_membership_settings;
DROP POLICY IF EXISTS "Admins can update memberships" ON user_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can view memberships" ON user_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can insert memberships" ON user_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can update memberships" ON user_membership_settings;

-- Create new RLS policies
CREATE POLICY "Users can view own membership"
  ON user_membership_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view memberships"
  ON user_membership_settings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert memberships"
  ON user_membership_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update memberships"
  ON user_membership_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- =====================================================================
-- PART 3: CREATE GLOBAL_MEMBERSHIP_SETTINGS TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS global_membership_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  is_membership_enabled BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO global_membership_settings (setting_key, is_membership_enabled, description)
VALUES ('MEMBERSHIP_FEATURE_ENABLED', FALSE, 'Global toggle for membership feature visibility')
ON CONFLICT (setting_key) DO NOTHING;

ALTER TABLE global_membership_settings ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies (safe)
DROP POLICY IF EXISTS "Anyone can view global settings" ON global_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can update global settings" ON global_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can insert global settings" ON global_membership_settings;

CREATE POLICY "Anyone can view global settings"
  ON global_membership_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update global settings"
  ON global_membership_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert global settings"
  ON global_membership_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================================
-- PART 4: UPDATE PROFILES RLS POLICIES
-- =====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop conflicting policies (safe)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profile filters" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can delete profiles" ON profiles;

-- Create permissive policies for authenticated users (needed for admin)
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update profiles"
  ON profiles FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete profiles"
  ON profiles FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================================
-- VERIFICATION - Run these queries to verify setup
-- =====================================================================

-- Check profiles table has new columns
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'profiles' AND column_name IN ('is_verified', 'is_featured')
-- ORDER BY column_name;

-- Check user_membership_settings exists
-- SELECT COUNT(*) FROM user_membership_settings;

-- Check global_membership_settings exists and has default value
-- SELECT * FROM global_membership_settings;

-- Check RLS policies are in place
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('profiles', 'user_membership_settings', 'global_membership_settings');

-- =====================================================================
-- SUCCESS!
-- If no errors appear above, your database is ready for the admin dashboard
-- =====================================================================
