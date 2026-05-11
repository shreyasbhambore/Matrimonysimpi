-- Add security audit logging table
CREATE TABLE IF NOT EXISTS security_audit_logs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  ip_address INET,
  status VARCHAR(50),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON security_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON security_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON security_audit_logs(resource_type, resource_id);

-- Rate limiting tracking table
CREATE TABLE IF NOT EXISTS rate_limit_tracking (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  identifier VARCHAR(255) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  request_count INT DEFAULT 1,
  window_start TIMESTAMP DEFAULT NOW(),
  window_end TIMESTAMP DEFAULT (NOW() + INTERVAL '1 hour'),
  UNIQUE(identifier, endpoint, window_start)
);

-- Create index for rate limit lookups
CREATE INDEX IF NOT EXISTS idx_rate_limit_tracking ON rate_limit_tracking(identifier, endpoint, window_start);
