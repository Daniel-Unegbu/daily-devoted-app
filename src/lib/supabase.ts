import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface Profile {
  id: string;
  email: string;
  created_at: string;
  salvation_accepted: boolean;
  salvation_date: string | null;
  current_streak: number;
  saved_verses: SavedVerse[];
  prayer_journal: PrayerJournalEntry[];
}

export interface SavedVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  saved_at: string;
}

export interface PrayerJournalEntry {
  id: string;
  title: string;
  content: string;
  is_answered: boolean;
  created_at: string;
}

export interface DailyChecklist {
  id: string;
  user_id: string;
  date: string;
  morning_prayer: boolean;
  bible_reading: boolean;
  gospel_share: boolean;
  night_prayer: boolean;
}

export interface UserPrayer {
  id: string;
  user_id: string;
  title: string;
  category: string | null;
  content: string | null;
  is_answered: boolean;
  created_at: string;
}

export interface GospelCardView {
  id: string;
  user_id: string;
  card_category: string;
  completed_at: string;
}

export interface PrayerCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface BibleReading {
  id: string;
  day_of_week: string;
  reference: string;
  title: string | null;
  summary: string | null;
}
