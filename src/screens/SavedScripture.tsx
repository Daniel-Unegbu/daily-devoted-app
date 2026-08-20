import { useAuth } from '@/lib/auth';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NavigationItem } from '@/components/Navigation';

export function SavedScripture({ onNavigate, onNavigation }: { onNavigate: (tab: TabKey) => void; onNavigation?: (item: NavigationItem) => void }) {
  const { profile } = useAuth();
  const verses = profile?.saved_verses ?? [];
    return <GrowthPage title="Saved Scripture" onNavigate={onNavigate} onNavigation={onNavigation}>
    {verses.length ? verses.map((verse) => <article key={verse.id} className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-5 ambient-shadow"><p className="font-label-md text-sm font-bold text-primary">{verse.book} {verse.chapter}:{verse.verse}</p><p className="font-scripture-text text-base text-on-surface mt-2 leading-relaxed">{verse.text}</p></article>) : <EmptyState text="Your saved verses will appear here." />}
  </GrowthPage>;
}

export function GrowthPage({ title, onNavigate, onNavigation, children }: { title: string; onNavigate: (tab: TabKey) => void; onNavigation?: (item: NavigationItem) => void; children: React.ReactNode }) {
  return <div className="min-h-screen bg-surface pb-[120px]"><Header onNavigate={onNavigate} title={title} backTo="growth" onNavigation={onNavigation} /><main className="max-w-3xl mx-auto px-container-margin pt-6 space-y-4">{children}</main><BottomNav active="growth" onNavigate={onNavigate} /></div>;
}

function EmptyState({ text }: { text: string }) { return <p className="text-center text-sm text-on-surface-variant py-12">{text}</p>; }