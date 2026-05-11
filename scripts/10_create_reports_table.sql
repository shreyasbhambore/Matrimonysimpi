-- 10_create_reports_table.sql
-- User reports for moderation

CREATE TABLE IF NOT EXISTS reports (
  id BIGSERIAL PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type VARCHAR(50) NOT NULL, -- inappropriate, fake_profile, harassment, scam, etc
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, investigating, resolved, dismissed
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Prevent self-reports
  CONSTRAINT no_self_report CHECK(reporter_id != reported_user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);

-- Row Level Security
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users can see their own reports and submitted reports (if moderator)
CREATE POLICY "Reports access control" ON reports
  FOR SELECT USING (
    auth.uid() = reporter_id OR auth.uid() = reported_user_id OR
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND role IN ('moderator', 'admin', 'superadmin')
    )
  );

-- Users can submit reports
CREATE POLICY "Users can submit reports" ON reports
  FOR INSERT WITH CHECK (
    auth.uid() = reporter_id
  );

-- Only admins can update reports
CREATE POLICY "Admins can update reports" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );
