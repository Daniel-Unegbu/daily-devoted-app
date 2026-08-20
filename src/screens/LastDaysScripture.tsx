import { useState } from 'react';
import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NavigationItem } from '@/components/Navigation';
import { BibleShortcut, BibleTarget } from '@/components/BibleShortcut';
import { lastDaysResources } from '@/lib/lastdaysDb';

const categories = ['All', 'Prophecy', 'Conduct', 'Hope', 'Preparation', 'Soul-winning'];

export function LastDaysScripture({ onNavigate, onNavigation, onBack, onOpenBible }: { onNavigate: (tab: TabKey) => void; onNavigation?: (item: NavigationItem) => void; onBack: () => void; onOpenBible: (target: BibleTarget) => void }) {
  const [category, setCategory] = useState('All');
  const [copied, setCopied] = useState<string | null>(null);
  const resources = category === 'All' ? lastDaysResources : lastDaysResources.filter((resource) => resource.category === category);

  const copyReference = async (id: string, reference: string) => {
    await navigator.clipboard?.writeText(reference);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return <div className="min-h-screen bg-surface pb-[120px]">
    <Header onNavigate={onNavigate} onBack={onBack} onNavigation={onNavigation} />
    <main className="max-w-3xl mx-auto px-container-margin pt-6 space-y-5">
      <section><p className="font-label-sm text-xs uppercase tracking-wider text-primary">The Last Days</p><h2 className="mt-1 font-headline-lg-mobile text-2xl font-bold text-on-surface">Core Scriptures for End Times</h2><p className="mt-3 font-body-md text-sm leading-relaxed text-on-surface-variant">Choose a topic and meditate on the passages that form a true, reliable response to the end times.</p></section>
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-3 py-2 font-label-sm text-xs ${category === item ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>{item}</button>)}</div>
      <section className="space-y-3">{resources.map((resource) => <article key={resource.id} className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="font-label-sm text-xs uppercase tracking-wider text-primary">{resource.category}</p><h3 className="mt-1 font-label-md text-sm font-bold text-on-surface">{resource.title}</h3></div><button onClick={() => copyReference(resource.id, resource.reference)} className="rounded-lg p-2 text-primary hover:bg-surface-container-low" aria-label={`Copy ${resource.reference}`}><Icon name={copied === resource.id ? 'check' : 'content_copy'} /></button></div><p className="mt-2 font-body-md text-xs leading-relaxed text-on-surface-variant">{resource.summary}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">{resource.reference.split(';').map((reference) => <BibleShortcut key={reference} reference={reference.trim()} onOpenBible={onOpenBible} />)}</div></article>)}</section>
    </main>
    <BottomNav active="home" onNavigate={onNavigate} />
  </div>;
}
