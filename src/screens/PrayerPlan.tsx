import { useEffect, useState } from 'react';
import { supabase, PrayerCategory } from '@/lib/supabase';
import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NavigationItem } from '@/components/Navigation';
import { getPrayerPlanEntry, prayerCategorySlug } from '@/lib/prayerPlanDb';

interface PrayerPlanProps {
  onNavigate: (tab: TabKey) => void;
  onOpenNightPrayer: () => void;
  onNavigation?: (item: NavigationItem) => void;
}

export function PrayerPlan({ onNavigate, onOpenNightPrayer, onNavigation }: PrayerPlanProps) {
  const [categories, setCategories] = useState<PrayerCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('prayer_categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => {
        if (data) setCategories(data as PrayerCategory[]);
        setLoading(false);
      });
  }, []);

  if (selectedPrayer) {
    const entry = getPrayerPlanEntry(selectedPrayer);
    return (
      <PrayerDetailPage
        entry={entry}
        onBack={() => setSelectedPrayer(null)}
        onNavigate={onNavigate}
        onNavigation={onNavigation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-ivory pb-[120px]">
      <Header onNavigate={onNavigate} onNavigation={onNavigation} />

      <main className="max-w-7xl mx-auto px-container-margin pt-8 md:pt-12 space-y-section-gap">
        <section className="text-center space-y-4">
          <h2 className="font-headline-lg text-headline-lg text-primary">Prayer Plan</h2>
          <p className="font-body-md text-on-surface-variant max-w-lg mx-auto">
            Find peace and connection through guided prayers tailored to your needs today.
          </p>
        </section>

        <section className="flex justify-center">
          <button className="bg-primary-container text-on-primary-container font-label-md text-label-md px-8 py-4 rounded-full flex items-center gap-2 hover:bg-primary-fixed transition-colors ambient-shadow active:scale-95">
            <Icon name="timer" fill weight={400} />
            <span>Quick 1-Minute Prayer</span>
          </button>
        </section>

        <section>
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-6">Guided Prayers</h3>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedPrayer(prayerCategorySlug(cat.name))}
                  className="bg-surface-container-lowest rounded-xl p-6 ambient-shadow card-border-accent flex items-start gap-4 hover:-translate-y-1 transition-transform text-left group"
                >
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <Icon name={cat.icon ?? 'favorite'} className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-body-lg text-body-lg font-medium text-on-surface mb-1">
                      {cat.name === 'Night' ? 'For Night Prayer' : `For ${cat.name}`}
                    </h4>
                    <p className="font-body-md text-on-surface-variant text-sm">{cat.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="relative overflow-hidden rounded-xl ambient-shadow">
          <div className="relative bg-gradient-to-r from-[#1a2b4c] to-[#2a3b5c] p-8 flex flex-col md:flex-row items-center justify-between text-on-primary rounded-xl">
            <div className="mb-6 md:mb-0 space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-secondary-fixed">
                <Icon name="bedtime" fill weight={400} />
                <span className="font-label-md text-label-md uppercase tracking-wider">Evening Devotion</span>
              </div>
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-primary">Night Prayer</h3>
              <p className="font-body-md text-on-primary/80 max-w-md">
                End your day in quiet reflection, releasing the burdens of the day to find restful peace.
              </p>
            </div>
            <button
              onClick={onOpenNightPrayer}
              className="bg-transparent border border-secondary-fixed text-secondary-fixed hover:bg-secondary-fixed hover:text-[#1a2b4c] font-label-md text-label-md px-6 py-3 rounded-full transition-all active:scale-95"
            >
              Begin Night Prayer
            </button>
          </div>
        </section>
      </main>

      <BottomNav active="prayer" onNavigate={onNavigate} />
    </div>
  );
}

function PrayerDetailPage({
  entry,
  onBack,
  onNavigate,
  onNavigation,
}: {
  entry: ReturnType<typeof getPrayerPlanEntry>;
  onBack: () => void;
  onNavigate: (tab: TabKey) => void;
  onNavigation?: (item: NavigationItem) => void;
}) {
  return (
    <div className="min-h-screen bg-ivory pb-[120px]">
      <Header onNavigate={onNavigate} title={entry.title} onBack={onBack} onNavigation={onNavigation} />

      <main className="max-w-3xl mx-auto px-container-margin pt-8 space-y-6">
        <section className="bg-primary-container/40 rounded-2xl p-6 border border-primary/10">
          <p className="font-label-sm text-xs text-primary uppercase tracking-wider mb-2">Guided prayer</p>
          <h2 className="font-headline-lg-mobile text-2xl font-bold text-on-surface mb-2">{entry.title}</h2>
          <p className="font-body-md text-on-surface-variant">{entry.introduction}</p>
        </section>

        <section className="space-y-3">
          <h3 className="font-headline-lg-mobile text-xl font-bold text-on-surface">20 Prayer Points</h3>
          {entry.points.map((point, index) => (
            <div key={point} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 shadow-sm flex gap-3">
              <span className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center flex-shrink-0 font-label-sm text-xs">
                {index + 1}
              </span>
              <p className="font-body-md text-on-surface text-sm leading-relaxed">{point.replace(/^\d+\.\s*/, '')}</p>
            </div>
          ))}
        </section>
      </main>

      <BottomNav active="prayer" onNavigate={onNavigate} />
    </div>
  );
}
