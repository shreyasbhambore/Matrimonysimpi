-- =====================================================================
-- ADMIN DASHBOARD REQUIREMENTS SQL MIGRATION
-- Run this in your Supabase SQL Editor
-- 
-- This script adds all required columns and tables for the Admin Dashboard
-- to work with REAL Supabase data (not mock data).
-- =====================================================================

-- =====================================================================
-- PART 1: ADD MISSING COLUMNS TO PROFILES TABLE
-- =====================================================================

-- Add is_verified and is_featured columns to profiles if they don't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create indexes for these columns
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);

-- =====================================================================
-- PART 2: CREATE USER_MEMBERSHIP_SETTINGS TABLE (if not exists)
-- This is used by the admin dashboard for per-user membership management
-- =====================================================================

CREATE TABLE IF NOT EXISTS user_membership_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_membership_active BOOLEAN DEFAULT FALSE,
  membership_type TEXT DEFAULT 'free' CHECK (membership_type IN ('free', 'premium', 'gold')),
  membership_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT user_membership_unique UNIQUE(user_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_membership_settings_user_id ON user_membership_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_membership_settings_is_active ON user_membership_settings(is_membership_active);

-- Enable RLS
ALTER TABLE user_membership_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own membership" ON user_membership_settings;
DROP POLICY IF EXISTS "Admins can view all memberships" ON user_membership_settings;
DROP POLICY IF EXISTS "Admins can insert memberships" ON user_membership_settings;
DROP POLICY IF EXISTS "Admins can update memberships" ON user_membership_settings;

-- RLS Policies
CREATE POLICY "Users can view own membership"
  ON user_membership_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Allow authenticated users to read all membership settings (for admin dashboard)
CREATE POLICY "Authenticated users can view memberships"
  ON user_membership_settings FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert (for admin)
CREATE POLICY "Authenticated users can insert memberships"
  ON user_membership_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update (for admin)
CREATE POLICY "Authenticated users can update memberships"
  ON user_membership_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- =====================================================================
-- PART 3: CREATE GLOBAL_MEMBERSHIP_SETTINGS TABLE (if not exists)
-- =====================================================================

CREATE TABLE IF NOT EXISTS global_membership_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  is_membership_enabled BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default setting if not exists
INSERT INTO global_membership_settings (setting_key, is_membership_enabled, description)
VALUES ('MEMBERSHIP_FEATURE_ENABLED', FALSE, 'Global toggle for membership feature visibility')
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE global_membership_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view global settings" ON global_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can update global settings" ON global_membership_settings;

-- RLS Policies
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
-- PART 4: UPDATE PROFILES RLS POLICIES FOR ADMIN ACCESS
-- =====================================================================

-- Drop restrictive policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profile filters" ON profiles;

-- Create more permissive policy for authenticated users (needed for admin)
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update any profile
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON profiles;
CREATE POLICY "Authenticated users can update profiles"
  ON profiles FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete profiles
DROP POLICY IF EXISTS "Authenticated users can delete profiles" ON profiles;
CREATE POLICY "Authenticated users can delete profiles"
  ON profiles FOR DELETE
  USING (auth.role() = 'authenticated');

-- =====================================================================
-- PART 5: GRANT SERVICE ROLE ACCESS (IMPORTANT FOR ADMIN)
-- =====================================================================

-- This allows the Supabase service role to bypass RLS for admin operations
-- The admin dashboard uses supabase.auth.admin.* which requires service role

-- No explicit grants needed as service role bypasses RLS by default
-- But ensure your client is using the service role key for admin operations

-- =====================================================================
-- VERIFICATION QUERY - Run this to check all tables exist
-- =====================================================================

-- SELECT 
--   EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') as profiles_exists,
--   EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_membership_settings') as user_membership_exists,
--   EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'global_membership_settings') as global_membership_exists,
--   EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_verified') as is_verified_column_exists,
--   EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_featured') as is_featured_column_exists;

-- =====================================================================
-- END OF MIGRATION
-- =====================================================================
