-- Add filter columns to profiles table for advanced search
-- This migration adds Gotra, Rashi, Nakshatra, and Horoscope Match fields

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS gotra TEXT,
ADD COLUMN IF NOT EXISTS rashi TEXT,
ADD COLUMN IF NOT EXISTS nakshatra TEXT,
ADD COLUMN IF NOT EXISTS horoscope_match TEXT;

-- Create indexes for filter searches
CREATE INDEX IF NOT EXISTS idx_profiles_gotra ON profiles(gotra);
CREATE INDEX IF NOT EXISTS idx_profiles_rashi ON profiles(rashi);
CREATE INDEX IF NOT EXISTS idx_profiles_nakshatra ON profiles(nakshatra);
CREATE INDEX IF NOT EXISTS idx_profiles_horoscope_match ON profiles(horoscope_match);

-- Update RLS policies to allow users to read filter data from public profiles
CREATE POLICY "Users can view profile filters"
  ON profiles FOR SELECT
  USING (true); -- Allow public viewing of filter data for search
