import { useEffect, useState } from 'react';
import { supabase, BibleReading } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NavigationItem } from '@/components/Navigation';
import { fetchVersesForReference, VerseItem } from '@/lib/bibleDb';

const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

export function VerseOfDayScreen({ onNavigate, onNavigation }: { onNavigate: (tab: TabKey) => void; onNavigation?: (item: NavigationItem) => void }) {
  const { user } = useAuth();
  const [todayReading, setTodayReading] = useState<BibleReading | null>(null);
  const [devotionVerses, setDevotionVerses] = useState<VerseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [devotionLoading, setDevotionLoading] = useState(false);

  useEffect(() => {
    async function loadReading() {
      try {
        const { data } = await supabase
          .from('bible_readings')
          .select('*')
          .eq('day_of_week', dayName)
          .maybeSingle();

        setTodayReading(data as BibleReading | null);
      } catch (err) {
        console.error('Error fetching Bible reading:', err);
      } finally {
        setLoading(false);
      }
    }

    loadReading();
  }, []);

  useEffect(() => {
    if (!todayReading) return;

    async function loadDevotionText() {
      setDevotionLoading(true);
      const verses = await fetchVersesForReference(todayReading!.reference);
      setDevotionVerses(verses);
      setDevotionLoading(false);
    }

    loadDevotionText();
  }, [todayReading]);

  const handleMarkAsRead = async () => {
    if (!user || !todayReading) return;
    const today = new Date().toISOString().split('T')[0];

    try {
      const { data } = await supabase
        .from('daily_checklists')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (data) {
        await supabase.from('daily_checklists').update({ bible_reading: true }).eq('id', data.id);
      }
    } catch (err) {
      console.warn('Offline: Could not sync checklist update immediately.', err);
    }

    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-surface pb-[120px]">
      <Header onNavigate={onNavigate} onNavigation={onNavigation} />

      <main className="max-w-3xl mx-auto px-container-margin pt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : todayReading ? (
          <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-md border border-outline-variant/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
            <span className="inline-flex px-3 py-1 bg-primary-container text-on-primary-container font-label-sm text-xs rounded-full font-semibold uppercase tracking-wider">
              {todayReading.day_of_week} • Verse of the Day
            </span>

            <h2 className="font-headline-lg-mobile text-2xl font-bold text-on-surface mt-5">{todayReading.reference}</h2>
            {todayReading.title && (
              <p className="font-body-md text-on-surface-variant text-sm mt-0.5">{todayReading.title}</p>
            )}

            <div className="my-6 pl-4 border-l-2 border-primary/40 font-scripture-text text-on-surface space-y-3">
              {devotionLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : devotionVerses.length > 0 ? (
                devotionVerses.map((verse) => (
                  <p key={verse.verse} className="relative text-base leading-relaxed">
                    <sup className="text-xs text-outline mr-1">{verse.verse}</sup>
                    {verse.text}
                  </p>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant italic">Passage text unavailable.</p>
              )}
            </div>

            {todayReading.summary && (
              <div className="bg-secondary-container/20 rounded-xl p-4 mb-6 border border-secondary-fixed/30 flex items-start gap-3">
                <Icon name="lightbulb" fill weight={400} className="text-secondary text-xl mt-0.5" />
                <div>
                  <p className="font-label-sm text-xs text-secondary uppercase tracking-wider mb-0.5 font-bold">Reflection</p>
                  <p className="font-body-md text-on-surface-variant text-xs md:text-sm">{todayReading.summary}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleMarkAsRead}
              className="w-full py-3 px-5 bg-primary text-on-primary font-label-md text-sm rounded-full shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Icon name="check_circle" fill weight={400} />
              Mark Today's Reading as Complete
            </button>
          </section>
        ) : (
          <p className="text-center text-on-surface-variant py-20">Today's reading is unavailable.</p>
        )}
      </main>

      <BottomNav active="bible" onNavigate={onNavigate} />
    </div>
  );
}
