import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NavigationItem } from '@/components/Navigation';
import { BibleShortcut, BibleTarget } from '@/components/BibleShortcut';
import { LastDaysSectionId, lastDaysSections } from '@/lib/lastdaysDb';

interface LastDaysProps {
  onNavigate: (tab: TabKey) => void;
  onNavigation?: (item: NavigationItem) => void;
  onOpenSection: (section: LastDaysSectionId) => void;
  onOpenBible: (target: BibleTarget) => void;
}

export function LastDays({ onNavigate, onNavigation, onOpenSection, onOpenBible }: LastDaysProps) {
  return (
    <div className="min-h-screen bg-surface pb-[120px]">
      <Header onNavigate={onNavigate} onNavigation={onNavigation} />
      <main className="max-w-3xl mx-auto px-container-margin pt-6 space-y-5">
        <section className="rounded-2xl bg-primary-container/40 border border-primary/15 p-6 shadow-sm">
          <p className="font-label-sm text-xs uppercase tracking-wider text-primary">A steady hope</p>
          <h2 className="font-headline-lg-mobile text-2xl font-bold text-on-surface mt-1">The Last Days</h2>
          <p className="font-body-md text-sm leading-relaxed text-on-surface-variant mt-3">Navigating the end times with wisdom, hope, and a biblical foundation. This guide is for faithful readiness, not fear or speculation.</p>
          <blockquote className="mt-5 border-l-2 border-primary/50 pl-4 font-scripture-text text-sm italic leading-relaxed text-on-surface">
            “For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.”
            <footer className="mt-2 font-label-md text-xs not-italic text-primary"><BibleShortcut reference="2 Timothy 1:7" onOpenBible={onOpenBible} /></footer>
          </blockquote>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {lastDaysSections.map((section) => { const isScripture = section.id === 'scriptural-resources'; return <button key={section.id} onClick={() => onOpenSection(section.id)} className={`rounded-xl border p-4 text-left shadow-sm transition-colors ${isScripture ? 'border-red-200 bg-red-50 hover:bg-red-100' : 'border-outline-variant/10 bg-surface-container-lowest hover:bg-surface-container-low'}`}><div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-full ${isScripture ? 'bg-red-100 text-red-700' : 'bg-primary-container/50 text-primary'}`}><Icon name={section.icon} /></div><h3 className={`font-label-md text-sm font-bold ${isScripture ? 'text-red-900' : 'text-on-surface'}`}>{section.title}</h3></div><p className={`mt-3 font-body-md text-xs leading-relaxed ${isScripture ? 'text-red-800/80' : 'text-on-surface-variant'}`}>{section.description}</p><Icon name="chevron_right" className={`mt-3 ${isScripture ? 'text-red-700' : 'text-outline'}`} /></button>; })}
        </section>
      </main>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}