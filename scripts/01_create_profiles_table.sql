-- Create profiles table for PROMPT 3
-- This table stores user profile information

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INT,
  gender TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  profession TEXT,
  education TEXT,
  about_me TEXT,
  religion TEXT,
  caste TEXT,
  mother_tongue TEXT,
  height TEXT,
  body_type TEXT,
  marital_status TEXT,
  children TEXT,
  income_range TEXT,
  family_type TEXT,
  family_values TEXT,
  smoking TEXT,
  drinking TEXT,
  dietary_preference TEXT,
  interests TEXT[], -- Array of interests
  verified_phone BOOLEAN DEFAULT FALSE,
  verified_photo BOOLEAN DEFAULT FALSE,
  verified_admin BOOLEAN DEFAULT FALSE,
  profile_completion_percent INT DEFAULT 0,
  online_status BOOLEAN DEFAULT FALSE,
  last_online_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for common queries
  CONSTRAINT age_check CHECK (age >= 18 AND age <= 100)
);

-- Create indexes for search optimization
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_online_status ON profiles(online_status);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- RLS Policy: Users can update own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policy: Users can insert own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
