-- Create user_settings table for PROMPT 3
-- This table stores user preferences and privacy settings

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Privacy settings
  profile_visibility TEXT DEFAULT 'public', -- 'public', 'prem-only', 'hidden'
  who_sees_photos TEXT DEFAULT 'premium', -- 'everyone', 'verified', 'premium', 'none'
  who_sees_contact TEXT DEFAULT 'premium', -- 'everyone', 'verified', 'premium', 'none'
  allow_profile_views BOOLEAN DEFAULT TRUE,
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  new_interest_notifications BOOLEAN DEFAULT TRUE,
  profile_view_notifications BOOLEAN DEFAULT TRUE,
  shortlist_notifications BOOLEAN DEFAULT TRUE,
  match_suggestions_notifications BOOLEAN DEFAULT TRUE,
  
  -- Security settings
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  blocked_users UUID[] DEFAULT '{}', -- Array of blocked user IDs
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT visibility_check CHECK (profile_visibility IN ('public', 'premium-only', 'hidden')),
  CONSTRAINT photo_check CHECK (who_sees_photos IN ('everyone', 'verified', 'premium', 'none')),
  CONSTRAINT contact_check CHECK (who_sees_contact IN ('everyone', 'verified', 'premium', 'none'))
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view own settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = id);

-- RLS Policy: Users can update own settings
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policy: Users can insert own settings
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = id);
