-- 09_create_admin_users_table.sql
-- Tracks admin users with roles and permissions

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'moderator', -- superadmin, admin, moderator
  permissions JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- One admin role per user
  CONSTRAINT one_admin_role_per_user UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only superadmins can view admin users
CREATE POLICY "Superadmins can view admin users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- Only superadmins can modify admin roles
CREATE POLICY "Superadmins manage admin roles" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );
