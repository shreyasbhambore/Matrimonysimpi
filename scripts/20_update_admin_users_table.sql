-- Update admin_users table with additional permissions and dashboard access

ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS can_manage_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS can_manage_membership BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS can_manage_filters BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- Update RLS policies to support new admin functions
DROP POLICY IF EXISTS "Only admins can manage featured profiles" ON featured_profiles;

CREATE POLICY "Only admins can manage featured profiles"
  ON featured_profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND (admin_users.role = 'admin' OR admin_users.is_super_admin = true)
      AND admin_users.can_manage_featured = true
    )
  );

-- Create audit log for admin actions on dashboard
CREATE TABLE IF NOT EXISTS admin_actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_admin_actions_log_admin_id ON admin_actions_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_log_action_type ON admin_actions_log(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_log_created_at ON admin_actions_log(created_at DESC);

-- Enable RLS
ALTER TABLE admin_actions_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
  ON admin_actions_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND (admin_users.role = 'admin' OR admin_users.is_super_admin = true)
    )
  );

-- RLS Policy: Only admins can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON admin_actions_log FOR INSERT
  WITH CHECK (true);
