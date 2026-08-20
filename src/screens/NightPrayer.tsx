import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { getNightPrayerEntry } from '@/lib/nightPrayerDb';
import { Navigation, NavigationItem } from '@/components/Navigation';

interface NightPrayerProps {
  onNavigate: (tab: TabKey) => void;
  onBack: () => void;
  onNavigation?: (item: NavigationItem) => void;
}

const prayerCards = [
  {
    icon: 'bedtime',
    title: 'Peaceful Sleep',
    desc: "Prayers to calm your mind and invite restful slumber under God's watch.",
  },
  {
    icon: 'water_drop',
    title: 'Forgiveness',
    desc: 'Reflect on the day, seek grace for shortcomings, and release others.',
  },
  {
    icon: 'shield',
    title: 'Protection',
    desc: "Seek God's covering over your home, loved ones, and yourself through the night.",
  },
];

export function NightPrayer({ onNavigate, onBack, onNavigation }: NightPrayerProps) {
  const { user, profile } = useAuth();
  const [selectedPrayer, setSelectedPrayer] = useState<string | null>(null);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const rawName = profile?.full_name || profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || '';
  const firstName = rawName.trim().split(' ')[0];

  if (selectedPrayer) {
    return (
      <NightPrayerDetailPage
        entry={getNightPrayerEntry(selectedPrayer)}
        onBack={() => setSelectedPrayer(null)}
        onNavigate={onNavigate}
        onNavigation={onNavigation}
      />
    );
  }

  return (
    <div className="dark min-h-screen bg-[#1A1A2E] text-[#e2e2e8] pb-[120px] flex flex-col font-body-md selection:bg-primary/20 selection:text-primary">
      <header className="w-full top-0 sticky bg-[#1A1A2E] z-40">
        <div className="flex items-center justify-between px-container-margin py-unit max-w-7xl mx-auto h-16">
          <button
            onClick={onBack}
            aria-label="Back to prayer"
            className="text-[#D4AF37] hover:bg-white/5 transition-colors active:scale-95 p-2 rounded-full w-10 h-10 flex items-center justify-center"
          >
            <Icon name="arrow_back" weight={300} />
          </button>
          <div className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-[#D4AF37]">Devoted</div>
          <div className="relative flex items-center gap-2">
            <button onClick={() => setNavigationOpen((open) => !open)} aria-label="Open navigation" className="text-[#D4AF37] hover:bg-white/5 transition-colors active:scale-95 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <Icon name="menu" weight={300} />
            </button>
            {navigationOpen && onNavigation && (
              <Navigation align="right" onSelect={(item) => { setNavigationOpen(false); onNavigation(item); }} onClose={() => setNavigationOpen(false)} />
            )}
            <button
              onClick={() => onNavigate('account')}
              aria-label="Open account"
              className="w-10 h-10 rounded-full bg-white/5 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-label-md hover:bg-white/10 transition-colors"
            >
              {firstName[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-container-margin pt-section-gap">
        <section className="mb-10 text-center flex flex-col items-center">
          <Icon name="mode_night" fill weight={400} className="text-[#D4AF37] text-5xl mb-4 icon-glow" />
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-white mb-2">Night Prayer</h1>
          <p className="font-body-md text-[#c1c1c9] max-w-md mx-auto text-center opacity-80">
            Find peace in His presence before you rest. Let go of the day's worries.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-section-gap">
          {prayerCards.map((card) => (
            <button
              key={card.title}
              onClick={() => setSelectedPrayer(card.title.toLowerCase().replace(/\s+/g, '-'))}
              className="bg-[#1F1F36] rounded-3xl p-8 flex flex-col items-start text-left relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D4AF37]/10 border border-white/5 h-[280px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-full bg-[#1A1A2E] flex items-center justify-center mb-6 shadow-sm border border-[#D4AF37]/10 gold-glow">
                <Icon name={card.icon} weight={300} className="text-[#D4AF37] icon-glow" />
              </div>
              <h3 className="font-headline-lg-mobile text-2xl text-[#e2e2e8] mb-3 relative z-10">{card.title}</h3>
              <p className="font-body-md text-[#c1c1c9] opacity-80 relative z-10 flex-grow">{card.desc}</p>
              <div className="mt-4 flex items-center text-[#D4AF37] font-label-md relative z-10">
                <span className="mr-2">Begin</span>
                <Icon name="arrow_forward" className="text-sm transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </section>

        <section className="bg-[#2e2e4f] rounded-3xl p-1 relative overflow-hidden mb-8 border border-white/5">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] rounded-l-3xl" />
          <div className="bg-[#1F1F36] rounded-[22px] p-8 relative">
            <Icon
              name="format_quote"
              fill
              weight={400}
              className="text-[#D4AF37]/20 text-6xl absolute top-4 left-4"
            />
            <div className="relative z-10 flex flex-col items-center text-center px-4">
              <p className="font-scripture-text text-scripture-text text-[#e2e2e8] mb-6 italic leading-relaxed">
                "In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety."
              </p>
              <p className="font-label-md text-[#D4AF37] tracking-widest uppercase">Psalm 4:8</p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav active="prayer" onNavigate={onNavigate} dark />
    </div>
  );
}

function NightPrayerDetailPage({
  entry,
  onBack,
  onNavigate,
  onNavigation,
}: {
  entry: ReturnType<typeof getNightPrayerEntry>;
  onBack: () => void;
  onNavigate: (tab: TabKey) => void;
  onNavigation?: (item: NavigationItem) => void;
}) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  return (
    <div className="dark min-h-screen bg-[#1A1A2E] text-[#e2e2e8] pb-[120px] flex flex-col font-body-md">
      <header className="w-full -top-1 sticky bg-[#1A1A2E] z-40">
        <div className="flex items-center gap-3 px-container-margin py-unit max-w-3xl mx-auto h-16">
          <button onClick={onBack} aria-label="Back to night prayer" className="text-[#D4AF37] hover:bg-white/5 transition-colors active:scale-95 p-2 rounded-full w-10 h-10 flex items-center justify-center">
            <Icon name="arrow_back" weight={300} />
          </button>
          <h1 className="font-headline-lg-mobile text-xl font-bold text-[#D4AF37]">{entry.title}</h1>
          <div className="relative ml-auto">
            <button onClick={() => setNavigationOpen((open) => !open)} aria-label="Open navigation" className="text-[#D4AF37] hover:bg-white/5 transition-colors active:scale-95 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <Icon name="menu" weight={300} />
            </button>
            {navigationOpen && onNavigation && (
              <Navigation align="right" onSelect={(item) => { setNavigationOpen(false); onNavigation(item); }} />
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-3xl mx-auto px-container-margin pt-8 space-y-6">
        <section className="bg-[#2e2e4f] rounded-3xl p-6 border border-white/5">
          <p className="font-label-sm text-xs text-[#f0c538] uppercase tracking-wider mb-2">Night prayer</p>
          <h2 className="font-headline-lg-mobile text-2xl font-bold text-[#e2e2e8] mb-2">{entry.title}</h2>
          <p className="font-body-md text-[#c1c1c9] opacity-80">{entry.introduction}</p>
        </section>

        <section className="space-y-3">
          <h3 className="font-headline-lg-mobile text-xl font-bold text-[#e2e2e8]">20 Prayer Points</h3>
          {entry.points.map((point, index) => (
            <div key={point} className="bg-[#1F1F36] rounded-2xl p-4 border border-white/5 flex gap-3">
              <span className="w-7 h-7 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center flex-shrink-0 font-label-sm text-xs">
                {index + 1}
              </span>
              <p className="font-body-md text-[#c1c1c9] text-sm leading-relaxed">{point.replace(/^\d+\.\s*/, '')}</p>
            </div>
          ))}
        </section>
      </main>

      <BottomNav active="prayer" onNavigate={onNavigate} dark />
    </div>
  );
}