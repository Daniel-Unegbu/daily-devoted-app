/*
# Devoted - Christian Daily Devotion App Schema

## Overview
Creates the relational database schema for the "Devoted" app — a Christian daily devotion 
companion with daily checklists, prayer tracking, Bible reading, and gospel-sharing features.
All user data is private and secured with Row Level Security (RLS).

## New Tables
1. profiles — User profile linked to auth.users, tracks salvation journey and streak
2. daily_checklists — Per-day habit tracker (morning prayer, Bible reading, gospel share, night prayer)
3. user_prayers — Personal prayers with categories and answered status
4. gospel_card_views — Tracking views/completions of encouraging gospel-sharing steps
5. prayer_categories — Seed/reference table of pre-populated prayer categories (public read)
6. bible_readings — Seed/reference table of daily Bible reading references (public read)

## Security
- RLS enabled on ALL tables.
- profiles, daily_checklists, user_prayers, gospel_card_views: owner-scoped CRUD (authenticated, auth.uid() = user_id).
- prayer_categories, bible_readings: public read (anon + authenticated SELECT), authenticated insert/update/delete restricted to self.

## Important Notes
1. profiles.id references auth.users(id) so each profile maps 1:1 to an auth account.
2. user_id columns default to auth.uid() so frontend inserts omitting user_id succeed.
3. daily_checklists has a UNIQUE(user_id, date) constraint to prevent duplicates per day.
4. Seed data includes 8 prayer categories and 7 daily Bible reading references.
*/

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  salvation_accepted boolean NOT NULL DEFAULT false,
  salvation_date timestamptz,
  current_streak integer NOT NULL DEFAULT 0
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- ============================================================
-- 2. daily_checklists
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  morning_prayer boolean NOT NULL DEFAULT false,
  bible_reading boolean NOT NULL DEFAULT false,
  gospel_share boolean NOT NULL DEFAULT false,
  night_prayer boolean NOT NULL DEFAULT false,
  UNIQUE (user_id, date)
);

ALTER TABLE daily_checklists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_checklists" ON daily_checklists;
CREATE POLICY "select_own_checklists" ON daily_checklists FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_checklists" ON daily_checklists;
CREATE POLICY "insert_own_checklists" ON daily_checklists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_checklists" ON daily_checklists;
CREATE POLICY "update_own_checklists" ON daily_checklists FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_checklists" ON daily_checklists;
CREATE POLICY "delete_own_checklists" ON daily_checklists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 3. user_prayers
-- ============================================================
CREATE TABLE IF NOT EXISTS user_prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text,
  content text,
  is_answered boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_prayers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_prayers" ON user_prayers;
CREATE POLICY "select_own_prayers" ON user_prayers FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_prayers" ON user_prayers;
CREATE POLICY "insert_own_prayers" ON user_prayers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_prayers" ON user_prayers;
CREATE POLICY "update_own_prayers" ON user_prayers FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_prayers" ON user_prayers;
CREATE POLICY "delete_own_prayers" ON user_prayers FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 4. gospel_card_views
-- ============================================================
CREATE TABLE IF NOT EXISTS gospel_card_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  card_category text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gospel_card_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_gospel_views" ON gospel_card_views;
CREATE POLICY "select_own_gospel_views" ON gospel_card_views FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_gospel_views" ON gospel_card_views;
CREATE POLICY "insert_own_gospel_views" ON gospel_card_views FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_gospel_views" ON gospel_card_views;
CREATE POLICY "update_own_gospel_views" ON gospel_card_views FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_gospel_views" ON gospel_card_views;
CREATE POLICY "delete_own_gospel_views" ON gospel_card_views FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- 5. prayer_categories (seed/reference table — public read)
-- ============================================================
CREATE TABLE IF NOT EXISTS prayer_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE prayer_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_prayer_categories" ON prayer_categories;
CREATE POLICY "read_prayer_categories" ON prayer_categories FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- 6. bible_readings (seed/reference table — public read)
-- ============================================================
CREATE TABLE IF NOT EXISTS bible_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text NOT NULL,
  reference text NOT NULL,
  title text,
  summary text
);

ALTER TABLE bible_readings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_bible_readings" ON bible_readings;
CREATE POLICY "read_bible_readings" ON bible_readings FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_daily_checklists_user_date ON daily_checklists(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_prayers_user_id ON user_prayers(user_id);
CREATE INDEX IF NOT EXISTS idx_gospel_card_views_user_id ON gospel_card_views(user_id);

-- ============================================================
-- SEED DATA: Prayer Categories
-- ============================================================
INSERT INTO prayer_categories (name, description, icon, sort_order) VALUES
  ('Anxiety', 'Find calm in His presence when worries overwhelm.', 'water_drop', 1),
  ('Healing', 'Prayers for physical and spiritual restoration.', 'healing', 2),
  ('Night', 'End your day in quiet reflection and find restful peace.', 'bedtime', 3),
  ('Repentance', 'Seek grace, forgiveness, and a renewed heart.', 'water_drop', 4),
  ('Family', 'Uplifting your loved ones in faith and love.', 'family_home', 5),
  ('Strength', 'Courage to face the challenges of the day.', 'fitness_center', 6),
  ('Forgiveness', 'Reflect on the day and release others.', 'water_drop', 7),
  ('Protection', 'Seek God''s covering over your home and loved ones.', 'shield', 8)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- SEED DATA: Bible Readings
-- ============================================================
INSERT INTO bible_readings (day_of_week, reference, title, summary) VALUES
  ('Monday', 'Psalm 23', 'The Lord is my Shepherd', 'A comforting reminder of God''s guidance and provision.'),
  ('Tuesday', 'John 3:16', 'For God So Loved the World', 'The core of the gospel — God''s love and the gift of eternal life.'),
  ('Wednesday', 'Philippians 4:6-7', 'Peace That Surpasses Understanding', 'Bring your anxieties to God and receive His peace.'),
  ('Thursday', 'Romans 8:28', 'All Things Work Together', 'Trust that God weaves all things for good for those who love Him.'),
  ('Friday', 'Matthew 6:25-34', 'Do Not Worry', 'Jesus teaches us to seek first the Kingdom and trust God''s provision.'),
  ('Saturday', 'Isaiah 41:10', 'Fear Not, For I Am With You', 'God promises strength, help, and upheld in His righteous hand.'),
  ('Sunday', 'Romans 10:9', 'If You Declare With Your Mouth', 'The promise of salvation through faith in the resurrection.')
ON CONFLICT DO NOTHING;

-- AUTOMATIC PROFILE CREATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (
    new.id, 
    COALESCE(new.email, '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
