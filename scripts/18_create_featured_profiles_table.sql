-- Create featured_profiles table to manage carousel profiles
-- Allows admin to select which profiles appear in the premium carousel

CREATE TABLE IF NOT EXISTS featured_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  display_order INT NOT NULL,
  featured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  featured_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT featured_order_unique UNIQUE(display_order),
  CONSTRAINT featured_max_count CHECK (display_order <= 50)
);

-- Create indexes for featured profile queries
CREATE INDEX IF NOT EXISTS idx_featured_profiles_is_active ON featured_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_profiles_display_order ON featured_profiles(display_order);
CREATE INDEX IF NOT EXISTS idx_featured_profiles_profile_id ON featured_profiles(profile_id);

-- Enable RLS
ALTER TABLE featured_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view active featured profiles
CREATE POLICY "Anyone can view featured profiles"
  ON featured_profiles FOR SELECT
  USING (is_active = true);

-- RLS Policy: Only admins can modify featured profiles
CREATE POLICY "Only admins can manage featured profiles"
  ON featured_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update featured profiles"
  ON featured_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete featured profiles"
  ON featured_profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );
