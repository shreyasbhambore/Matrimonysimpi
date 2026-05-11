-- 08_create_messages_table.sql
-- Stores individual messages in conversations

CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their conversations
CREATE POLICY "Users can view conversation messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE auth.uid() = user_1_id OR auth.uid() = user_2_id
    )
  );

-- Users can send messages to conversations they're in
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE auth.uid() = user_1_id OR auth.uid() = user_2_id
    )
  );

-- Users can mark their received messages as read
CREATE POLICY "Users can mark messages as read" ON messages
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE (auth.uid() = user_1_id OR auth.uid() = user_2_id) 
      AND auth.uid() != sender_id
    )
  )
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE (auth.uid() = user_1_id OR auth.uid() = user_2_id) 
      AND auth.uid() != sender_id
    )
  );
