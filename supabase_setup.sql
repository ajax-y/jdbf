-- GfG Club Central Security & Cloud Sync Procedure
-- FINAL VERSION: Decoupled from Auth for Demo Hub

-- 1. Ensure Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Repair Profiles Table & Remove Foreign Key Restrictions
DO $$ 
BEGIN 
    -- Drop the foreign key link to auth.users for demo personas
    -- This allows us to have profiles without requiring real signups
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_id_fkey') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
    END IF;

    -- Drop the restrictive tier check constraint
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

    -- Add 'password' if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='password') THEN
        ALTER TABLE profiles ADD COLUMN password TEXT DEFAULT 'member123';
    END IF;

    -- Add Social & Edit Fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='username') THEN
        ALTER TABLE profiles ADD COLUMN username TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='core_expertise') THEN
        ALTER TABLE profiles ADD COLUMN core_expertise TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='github_link') THEN
        ALTER TABLE profiles ADD COLUMN github_link TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='contact_info') THEN
        ALTER TABLE profiles ADD COLUMN contact_info TEXT;
    END IF;

    -- Ensure 'tier' can hold any length text
    ALTER TABLE profiles ALTER COLUMN tier TYPE TEXT;
END $$;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anyone" ON profiles;
CREATE POLICY "Enable all for anyone" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- 3. Synchronize Demo Personas
-- These will now work regardless of auth state
INSERT INTO profiles (id, full_name, role, points, attendance_count, project_count, rank, tier, featured_project, password, username)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin Node', 'admin', 0, 0, 0, '--', 'Elite Node', 'System Core', 'admin123', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Adarsh Gupta', 'user', 0, 0, 0, '--', 'Gold Tier', 'Aurora Engine', 'member123', 'geeks')
ON CONFLICT (id) DO UPDATE SET 
  points = EXCLUDED.points,
  attendance_count = EXCLUDED.attendance_count,
  project_count = EXCLUDED.project_count,
  rank = EXCLUDED.rank,
  tier = EXCLUDED.tier,
  featured_project = EXCLUDED.featured_project,
  password = EXCLUDED.password,
  username = EXCLUDED.username;

-- 5. Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    date DATE,
    time TIME,
    qr_secret TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Patch: add missing columns if table already existed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='time') THEN
        ALTER TABLE events ADD COLUMN time TIME;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='location') THEN
        ALTER TABLE events ADD COLUMN location TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='events' AND column_name='created_at') THEN
        ALTER TABLE events ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anyone" ON events;
CREATE POLICY "Enable all for anyone" ON events FOR ALL USING (true) WITH CHECK (true);

-- 6. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anyone" ON attendance;
CREATE POLICY "Enable all for anyone" ON attendance FOR ALL USING (true) WITH CHECK (true);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- 8. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES profiles(id),
    github_url TEXT,
    live_url TEXT,
    tech_stack TEXT[],
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patch: add missing columns to projects if table already existed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='live_url') THEN
        ALTER TABLE projects ADD COLUMN live_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='tech_stack') THEN
        ALTER TABLE projects ADD COLUMN tech_stack TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='owner_id') THEN
        ALTER TABLE projects ADD COLUMN owner_id UUID REFERENCES profiles(id);
    END IF;
END $$;

-- 9. Likes Table
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- 10. Project Comments Table
CREATE TABLE IF NOT EXISTS project_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Initial Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for anyone" ON projects;
CREATE POLICY "Enable all for anyone" ON projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for anyone" ON likes;
CREATE POLICY "Enable all for anyone" ON likes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for anyone" ON project_comments;
CREATE POLICY "Enable all for anyone" ON project_comments FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'projects') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE projects;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'likes') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE likes;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'project_comments') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE project_comments;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Ignore errors if publication doesn't exist or table already added
END $$;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anyone" ON notifications;
CREATE POLICY "Enable all for anyone" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- 8. Enable Realtime for relevant tables (safe: skip if already added)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE attendance;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE events;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
