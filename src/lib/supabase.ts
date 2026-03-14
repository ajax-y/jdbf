import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  role: 'user' | 'admin';
  attendance_count: number;
  project_count: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  qr_secret: string;
  is_active: boolean;
};

export type Attendance = {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  github_url: string;
  author_id: string;
  likes: string[];
  created_at: string;
};
