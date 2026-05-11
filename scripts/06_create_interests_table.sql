-- 06_create_interests_table.sql
-- Tracks interest sent/received between users

CREATE TABLE IF NOT EXISTS interests (
  id BIGSERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, withdrawn
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Prevent duplicate interests
  CONSTRAINT no_duplicate_interests UNIQUE(sender_id, receiver_id),
  -- Prevent self-interest
  CONSTRAINT no_self_interest CHECK(sender_id != receiver_id)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_interests_sender_id ON interests(sender_id);
CREATE INDEX IF NOT EXISTS idx_interests_receiver_id ON interests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_interests_status ON interests(status);
CREATE INDEX IF NOT EXISTS idx_interests_created_at ON interests(created_at DESC);

-- Row Level Security
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- Users can see interests sent/received to them
CREATE POLICY "Users can view their interests" ON interests
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

-- Users can send interests to others
CREATE POLICY "Users can send interests" ON interests
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
  );

-- Users can update their received interests (accept/reject)
CREATE POLICY "Users can respond to interests" ON interests
  FOR UPDATE USING (
    auth.uid() = receiver_id
  )
  WITH CHECK (
    auth.uid() = receiver_id
  );

-- Users can withdraw their sent interests
CREATE POLICY "Users can withdraw interests" ON interests
  FOR UPDATE USING (
    auth.uid() = sender_id
  )
  WITH CHECK (
    auth.uid() = sender_id AND status = 'withdrawn'
  );
