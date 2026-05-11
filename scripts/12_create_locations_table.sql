-- Create locations table for Karnataka cities
CREATE TABLE IF NOT EXISTS locations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(state, city)
);

-- Insert Karnataka cities
INSERT INTO locations (state, city, region) VALUES
('Karnataka', 'Bangalore', 'South'),
('Karnataka', 'Mysore', 'South'),
('Karnataka', 'Mangalore', 'South'),
('Karnataka', 'Udupi', 'South'),
('Karnataka', 'Hubli', 'North'),
('Karnataka', 'Belgaum', 'North'),
('Karnataka', 'Tumkur', 'Central'),
('Karnataka', 'Davangere', 'Central'),
('Karnataka', 'Hassan', 'Central'),
('Karnataka', 'Chikmagalur', 'Central'),
('Karnataka', 'Chitradurga', 'North'),
('Karnataka', 'Raichur', 'North'),
('Karnataka', 'Koppal', 'North'),
('Karnataka', 'Bellary', 'North'),
('Karnataka', 'Kolar', 'East'),
('Karnataka', 'Chikballapur', 'East')
ON CONFLICT (state, city) DO NOTHING;

-- Create index for fast location lookups
CREATE INDEX IF NOT EXISTS idx_locations_state_city ON locations(state, city);
CREATE INDEX IF NOT EXISTS idx_locations_region ON locations(region);
