-- Add education status filter support and search indexes
-- Ensure profiles table has education_status column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education_status VARCHAR(100);

-- Create indexes for faster filtering
CREATE INDEX IF NOT EXISTS idx_profiles_age_gender ON profiles(age, gender);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_education_status ON profiles(education_status);
CREATE INDEX IF NOT EXISTS idx_profiles_religion ON profiles(religion);
CREATE INDEX IF NOT EXISTS idx_profiles_caste ON profiles(caste);
CREATE INDEX IF NOT EXISTS idx_profiles_occupation ON profiles(occupation);
CREATE INDEX IF NOT EXISTS idx_profiles_annual_income ON profiles(annual_income);
CREATE INDEX IF NOT EXISTS idx_profiles_looking_for ON profiles(looking_for);

-- Create composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_profiles_search_common 
ON profiles(gender, age, location, education_status);
