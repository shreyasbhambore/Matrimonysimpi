-- 07_create_conversations_table.sql
-- Stores conversation metadata between two users

CREATE TABLE IF NOT EXISTS conversations (
  id BIGSERIAL PRIMARY KEY,
  user_1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_id BIGINT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure proper user ordering
  CONSTRAINT ordered_users CHECK(user_1_id < user_2_id),
  -- Prevent duplicate conversations
  CONSTRAINT no_duplicate_conversations UNIQUE(user_1_id, user_2_id)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_conversations_user_1 ON conversations(user_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_2 ON conversations(user_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Users can view conversations they're part of
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    auth.uid() = user_1_id OR auth.uid() = user_2_id
  );

-- Conversations created when first message sent
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = user_1_id OR auth.uid() = user_2_id
  );

-- Users can update their conversation metadata
CREATE POLICY "Users can update conversations" ON conversations
  FOR UPDATE USING (
    auth.uid() = user_1_id OR auth.uid() = user_2_id
  );
