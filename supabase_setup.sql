-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  points INTEGER DEFAULT 0,
  attendance_count INTEGER DEFAULT 0,
  project_count INTEGER DEFAULT 0,
  rank TEXT DEFAULT '--',
  tier TEXT DEFAULT 'Standard Tier',
  featured_project TEXT DEFAULT 'None'
);

-- Seed initial demo data
INSERT INTO profiles (full_name, role, points, attendance_count, project_count, rank, tier, featured_project)
VALUES 
('Admin Node', 'admin', 999, 15, 8, '1', 'Elite Node', 'System Core'),
('Geek Member', 'user', 150, 4, 1, '42', 'Gold Tier', 'Aurora Engine')
ON CONFLICT DO NOTHING;
