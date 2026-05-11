-- Community Forum Tables
-- Create forum categories
CREATE TABLE IF NOT EXISTS forum_categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create forum posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES forum_categories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  views_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  helpful_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create forum replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id BIGINT NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default forum categories
INSERT INTO forum_categories (name, description, icon) VALUES
('General Discussion', 'General topics and announcements', 'MessageCircle'),
('Success Stories', 'Share and celebrate success stories', 'Heart'),
('Advice & Tips', 'Tips, advice, and guidance for the community', 'Lightbulb'),
('Events & Meetups', 'Organize and discuss community events', 'Calendar'),
('Regional Groups', 'Connect with people from your region', 'MapPin')
ON CONFLICT (name) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_user_id ON forum_replies(user_id);

-- Enable RLS for forum tables
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Forum posts are viewable by authenticated users" ON forum_posts
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Users can create their own forum posts" ON forum_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON forum_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Forum replies are viewable by authenticated users" ON forum_replies
  FOR SELECT USING (auth.role() = 'authenticated_user');

CREATE POLICY "Users can create their own replies" ON forum_replies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies" ON forum_replies
  FOR UPDATE USING (auth.uid() = user_id);
