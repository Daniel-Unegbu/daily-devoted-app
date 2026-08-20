ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS saved_verses JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS prayer_journal JSONB DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_saved_verses_is_array') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT check_saved_verses_is_array CHECK (jsonb_typeof(saved_verses) = 'array');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_prayer_journal_is_array') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT check_prayer_journal_is_array CHECK (jsonb_typeof(prayer_journal) = 'array');
  END IF;
END $$;