-- Create shortlists table for PROMPT 3
-- This table stores users' shortlisted profiles

CREATE TABLE IF NOT EXISTS shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shortlisted_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  
  -- Prevent duplicate shortlists
  UNIQUE(user_id, shortlisted_user_id),
  -- Prevent self-shortlist
  CONSTRAINT no_self_shortlist CHECK (user_id != shortlisted_user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shortlists_user_id ON shortlists(user_id);
CREATE INDEX IF NOT EXISTS idx_shortlists_shortlisted_user_id ON shortlists(shortlisted_user_id);
CREATE INDEX IF NOT EXISTS idx_shortlists_created_at ON shortlists(created_at DESC);

-- Enable RLS
ALTER TABLE shortlists ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view own shortlists
CREATE POLICY "Users can view own shortlists"
  ON shortlists FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert shortlists
CREATE POLICY "Users can insert shortlists"
  ON shortlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete shortlists
CREATE POLICY "Users can delete shortlists"
  ON shortlists FOR DELETE
  USING (auth.uid() = user_id);
