import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NavigationItem } from '@/components/Navigation';
import { BibleShortcut, BibleTarget } from '@/components/BibleShortcut';
import { getLastDaysSection, LastDaysSectionId } from '@/lib/lastdaysDb';

export function LastDaysSectionPage({ sectionId, onNavigate, onNavigation, onBack, onOpenBible }: { sectionId: LastDaysSectionId; onNavigate: (tab: TabKey) => void; onNavigation?: (item: NavigationItem) => void; onBack: () => void; onOpenBible: (target: BibleTarget) => void }) {
  const section = getLastDaysSection(sectionId);
  if (!section) return null;

  return <div className="min-h-screen bg-surface pb-[120px]">
    <Header onNavigate={onNavigate} onBack={onBack} onNavigation={onNavigation} />
    <main className="max-w-3xl mx-auto px-container-margin pt-6 space-y-5">
      <section className="rounded-2xl bg-primary-container/40 border border-primary/15 p-6 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-primary"><Icon name={section.icon} className="text-2xl" /></div>
        <p className="mt-4 font-label-sm text-xs uppercase tracking-wider text-primary">The Last Days</p>
        <h2 className="mt-1 font-headline-lg-mobile text-2xl font-bold text-on-surface">{section.title}</h2>
        <p className="mt-3 font-body-md text-sm leading-relaxed text-on-surface-variant">{section.description}</p>
      </section>
      <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="font-headline-lg-mobile text-lg font-bold text-on-surface">Scripture to study</h3>
        <div className="mt-4 space-y-3">{section.passages.map((passage) => <article key={passage} className="flex items-center gap-3 rounded-lg bg-surface-container-low p-4"><Icon name="menu_book" className="text-primary" /><BibleShortcut reference={passage} onOpenBible={onOpenBible} /></article>)}</div>
      </section>
      <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-sm">
        <h3 className="font-headline-lg-mobile text-lg font-bold text-on-surface">A faithful response</h3>
        <p className="mt-3 font-body-md text-sm leading-relaxed text-on-surface-variant">Read these passages slowly, ask what they reveal about God, and choose one faithful response for today. The aim is readiness shaped by love, sound judgment, and hope in Christ.</p>
      </section>
    </main>
    <BottomNav active="home" onNavigate={onNavigate} />
  </div>;
}
