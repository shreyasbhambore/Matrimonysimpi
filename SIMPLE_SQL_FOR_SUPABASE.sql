-- =====================================================================
-- SIMPLE ADMIN DASHBOARD SQL MIGRATION
-- For Supabase - Safe and straightforward
-- =====================================================================

-- STEP 1: Add missing columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON profiles(verification_status);

-- =====================================================================
-- STEP 2: Create user_membership_settings table (if it doesn't exist)
-- =====================================================================

CREATE TABLE IF NOT EXISTS user_membership_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_membership_active BOOLEAN DEFAULT FALSE,
  membership_type TEXT DEFAULT 'free',
  membership_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_membership_settings_user_id ON user_membership_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_membership_settings_is_active ON user_membership_settings(is_membership_active);

-- Enable RLS
ALTER TABLE user_membership_settings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users can view own membership" ON user_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can view memberships" ON user_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can insert memberships" ON user_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can update memberships" ON user_membership_settings;

-- Create RLS policies
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
-- STEP 3: Create global_membership_settings table (if it doesn't exist)
-- =====================================================================

CREATE TABLE IF NOT EXISTS global_membership_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  is_membership_enabled BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default setting
INSERT INTO global_membership_settings (setting_key, is_membership_enabled, description)
VALUES ('MEMBERSHIP_FEATURE_ENABLED', FALSE, 'Global toggle for membership feature visibility')
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE global_membership_settings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Anyone can view global settings" ON global_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can update global settings" ON global_membership_settings;
DROP POLICY IF EXISTS "Authenticated users can insert global settings" ON global_membership_settings;

-- Create RLS policies
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
-- STEP 4: Update profiles RLS policies
-- =====================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop conflicting policies
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can delete profiles" ON profiles;

-- Create new policies
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
-- VERIFICATION - Run these to check all tables exist:
-- =====================================================================
-- SELECT COUNT(*) as profile_count FROM profiles;
-- SELECT COUNT(*) as membership_settings_count FROM user_membership_settings;
-- SELECT * FROM global_membership_settings;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND column_name IN ('is_verified', 'is_featured');
