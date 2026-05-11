-- Add education status filter support and search indexes
-- Ensure profiles table has education_status column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education_status VARCHAR(100);

-- Create indexes for faster filtering
CREATE INDEX IF NOT EXISTS idx_profiles_age_gender ON profiles(age, gender);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_state ON profiles(state);
CREATE INDEX IF NOT EXISTS idx_profiles_education_status ON profiles(education_status);
CREATE INDEX IF NOT EXISTS idx_profiles_religion ON profiles(religion);
CREATE INDEX IF NOT EXISTS idx_profiles_caste ON profiles(caste);
CREATE INDEX IF NOT EXISTS idx_profiles_profession ON profiles(profession);
CREATE INDEX IF NOT EXISTS idx_profiles_income_range ON profiles(income_range);
CREATE INDEX IF NOT EXISTS idx_profiles_marital_status ON profiles(marital_status);

-- Create composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_profiles_search_common 
ON profiles(gender, age, city, education_status);
