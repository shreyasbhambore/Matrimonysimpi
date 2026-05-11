-- Create profile_photos table for PROMPT 3
-- This table stores profile photo metadata and privacy settings

CREATE TABLE IF NOT EXISTS profile_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  position INT DEFAULT 0, -- Order of photos
  is_primary BOOLEAN DEFAULT FALSE, -- Main profile photo
  privacy_level TEXT DEFAULT 'private', -- 'public', 'private', 'friends-only'
  verified BOOLEAN DEFAULT FALSE,
  blur_level INT DEFAULT 0, -- 0-100 for blur percentage
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT privacy_check CHECK (privacy_level IN ('public', 'private', 'friends-only'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profile_photos_user_id ON profile_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_photos_primary ON profile_photos(user_id, is_primary);
CREATE INDEX IF NOT EXISTS idx_profile_photos_privacy ON profile_photos(privacy_level);

-- Enable RLS
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view own photos
CREATE POLICY "Users can view own photos"
  ON profile_photos FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert own photos
CREATE POLICY "Users can insert own photos"
  ON profile_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update own photos
CREATE POLICY "Users can update own photos"
  ON profile_photos FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: Users can delete own photos
CREATE POLICY "Users can delete own photos"
  ON profile_photos FOR DELETE
  USING (auth.uid() = user_id);
