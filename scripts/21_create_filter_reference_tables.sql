-- Create reference tables for filter values
-- These tables store the valid options for Gotra, Rashi, Nakshatra, etc.

-- Gotra reference table
CREATE TABLE IF NOT EXISTS gotra_reference (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  religion VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rashi reference table
CREATE TABLE IF NOT EXISTS rashi_reference (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL UNIQUE,
  symbol VARCHAR(50),
  start_date VARCHAR(20),
  end_date VARCHAR(20),
  element VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Nakshatra reference table
CREATE TABLE IF NOT EXISTS nakshatra_reference (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL UNIQUE,
  rashi_id BIGINT REFERENCES rashi_reference(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Horoscope compatibility reference table
CREATE TABLE IF NOT EXISTS horoscope_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  your_rashi_id BIGINT NOT NULL REFERENCES rashi_reference(id),
  their_rashi_id BIGINT NOT NULL REFERENCES rashi_reference(id),
  compatibility_score INT CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_horoscope_compat UNIQUE(your_rashi_id, their_rashi_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gotra_reference_name ON gotra_reference(name);
CREATE INDEX IF NOT EXISTS idx_gotra_reference_religion ON gotra_reference(religion);
CREATE INDEX IF NOT EXISTS idx_rashi_reference_name ON rashi_reference(name);
CREATE INDEX IF NOT EXISTS idx_nakshatra_reference_name ON nakshatra_reference(name);
CREATE INDEX IF NOT EXISTS idx_nakshatra_reference_rashi_id ON nakshatra_reference(rashi_id);
CREATE INDEX IF NOT EXISTS idx_horoscope_compat_score ON horoscope_compatibility(compatibility_score DESC);

-- Enable RLS
ALTER TABLE gotra_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE rashi_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE nakshatra_reference ENABLE ROW LEVEL SECURITY;
ALTER TABLE horoscope_compatibility ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view reference data
CREATE POLICY "Anyone can view gotra reference"
  ON gotra_reference FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view rashi reference"
  ON rashi_reference FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view nakshatra reference"
  ON nakshatra_reference FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view horoscope compatibility"
  ON horoscope_compatibility FOR SELECT
  USING (true);

-- RLS Policy: Only admins can modify reference data
CREATE POLICY "Only admins can manage gotra reference"
  ON gotra_reference FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
      AND (admin_users.role = 'admin' OR admin_users.is_super_admin = true)
    )
  );

-- Insert common Rashi data
INSERT INTO rashi_reference (name, symbol, start_date, end_date, element)
VALUES
  ('Aries', '♈', 'Mar 21', 'Apr 19', 'Fire'),
  ('Taurus', '♉', 'Apr 20', 'May 20', 'Earth'),
  ('Gemini', '♊', 'May 21', 'Jun 20', 'Air'),
  ('Cancer', '♋', 'Jun 21', 'Jul 22', 'Water'),
  ('Leo', '♌', 'Jul 23', 'Aug 22', 'Fire'),
  ('Virgo', '♍', 'Aug 23', 'Sep 22', 'Earth'),
  ('Libra', '♎', 'Sep 23', 'Oct 22', 'Air'),
  ('Scorpio', '♏', 'Oct 23', 'Nov 21', 'Water'),
  ('Sagittarius', '♐', 'Nov 22', 'Dec 21', 'Fire'),
  ('Capricorn', '♑', 'Dec 22', 'Jan 19', 'Earth'),
  ('Aquarius', '♒', 'Jan 20', 'Feb 18', 'Air'),
  ('Pisces', '♓', 'Feb 19', 'Mar 20', 'Water')
ON CONFLICT (name) DO NOTHING;

-- Insert common Nakshatra data
INSERT INTO nakshatra_reference (name, description)
VALUES
  ('Ashwini', 'The horsewoman, swift and powerful'),
  ('Bharani', 'The bringer of fruit'),
  ('Krittika', 'The cutter, associated with fire'),
  ('Rohini', 'The red one, associated with growth'),
  ('Mrigashira', 'The deer head, associated with search'),
  ('Ardra', 'The moist one, tears and suffering'),
  ('Punarvasu', 'The returning sun, prosperity'),
  ('Pushya', 'The nourisher, sacred and pure'),
  ('Ashlesha', 'The coiled serpent, mystical'),
  ('Magha', 'The mighty one, ancestral'),
  ('Purva Phalguni', 'The former reddish one'),
  ('Uttara Phalguni', 'The latter reddish one')
ON CONFLICT (name) DO NOTHING;

-- Insert common Gotra data
INSERT INTO gotra_reference (name, religion)
VALUES
  ('Kasyapa', 'Hindu'),
  ('Vasishtha', 'Hindu'),
  ('Bhrigu', 'Hindu'),
  ('Atri', 'Hindu'),
  ('Kutsa', 'Hindu'),
  ('Gautama', 'Hindu'),
  ('Vishvamitra', 'Hindu'),
  ('Agastya', 'Hindu')
ON CONFLICT (name) DO NOTHING;
