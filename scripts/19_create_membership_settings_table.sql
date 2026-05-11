-- Create membership_settings table for managing membership visibility
-- Supports both per-user and global membership toggle

CREATE TABLE IF NOT EXISTS membership_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_membership_active BOOLEAN DEFAULT FALSE,
  membership_type TEXT CHECK (membership_type IN ('free', 'premium', 'gold')),
  membership_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT user_membership_unique UNIQUE(user_id)
);

-- Create global membership settings table for site-wide toggle
CREATE TABLE IF NOT EXISTS global_membership_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  is_membership_enabled BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default global membership settings
INSERT INTO global_membership_settings (setting_key, is_membership_enabled, description)
VALUES ('MEMBERSHIP_FEATURE_ENABLED', FALSE, 'Global toggle for membership feature visibility')
ON CONFLICT (setting_key) DO UPDATE SET is_membership_enabled = EXCLUDED.is_membership_enabled;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_membership_settings_user_id ON membership_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_membership_settings_is_active ON membership_settings(is_membership_active);
CREATE INDEX IF NOT EXISTS idx_membership_settings_type ON membership_settings(membership_type);

-- Enable RLS
ALTER TABLE membership_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_membership_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for membership_settings
-- Users can view their own membership settings
CREATE POLICY "Users can view own membership settings"
  ON membership_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all membership settings
CREATE POLICY "Admins can view all membership settings"
  ON membership_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- Admins can update membership settings
CREATE POLICY "Admins can update membership settings"
  ON membership_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can modify membership settings"
  ON membership_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- RLS Policies for global_membership_settings
-- Anyone can view global settings
CREATE POLICY "Anyone can view global membership settings"
  ON global_membership_settings FOR SELECT
  USING (true);

-- Only admins can modify global settings
CREATE POLICY "Only admins can modify global settings"
  ON global_membership_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update global settings"
  ON global_membership_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );
