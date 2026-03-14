-- GfG Club Central Security & Cloud Sync Procedure
-- Run this in the Supabase SQL Editor

-- 1. Ensure Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Repair Profiles Table & Remove Restrictive Constraints
DO $$ 
BEGIN 
    -- Drop the restrictive tier check constraint if it exists
    -- This allows industry names like 'Elite Node' or 'Gold Tier'
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_tier_check') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_tier_check;
    END IF;

    -- Add 'points' if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='points') THEN
        ALTER TABLE profiles ADD COLUMN points INTEGER DEFAULT 0;
    END IF;

    -- Add 'rank' if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='rank') THEN
        ALTER TABLE profiles ADD COLUMN rank TEXT DEFAULT '--';
    END IF;

    -- Add 'featured_project' if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='featured_project') THEN
        ALTER TABLE profiles ADD COLUMN featured_project TEXT DEFAULT 'Aurora Engine';
    END IF;

    -- Ensure 'tier' can hold any length text
    ALTER TABLE profiles ALTER COLUMN tier TYPE TEXT;
END $$;

-- 3. Synchronize Demo Personas
-- We use a zero-UUID approach for demo reliability
INSERT INTO profiles (id, full_name, role, points, attendance_count, project_count, rank, tier, featured_project)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin Node', 'admin', 999, 15, 8, '1', 'Elite Node', 'System Core'),
  ('00000000-0000-0000-0000-000000000002', 'Geek Member', 'user', 150, 4, 1, '42', 'Gold Tier', 'Aurora Engine')
ON CONFLICT (id) DO UPDATE SET 
  points = EXCLUDED.points,
  attendance_count = EXCLUDED.attendance_count,
  project_count = EXCLUDED.project_count,
  rank = EXCLUDED.rank,
  tier = EXCLUDED.tier,
  featured_project = EXCLUDED.featured_project;

-- 4. Finalize Security Visibility
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."profiles";
CREATE POLICY "Enable read access for all users" ON "public"."profiles" FOR SELECT USING (true);
