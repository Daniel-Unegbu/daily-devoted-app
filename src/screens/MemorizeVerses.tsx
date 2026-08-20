import { useState } from 'react';
import { GrowthPage } from './SavedScripture';
import { getMemorizeVerses, saveMemorizeVerses } from '@/lib/memorizeDb';
import { TabKey } from '@/components/BottomNav';
import { NavigationItem } from '@/components/Navigation';

export function MemorizeVerses({ onNavigate, onNavigation }: { onNavigate: (tab: TabKey) => void; onNavigation?: (item: NavigationItem) => void }) {
  const [verses, setVerses] = useState(getMemorizeVerses);
  const toggle = (id: string) => { const next = verses.map((verse) => verse.id === id ? { ...verse, memorized: !verse.memorized } : verse); setVerses(next); saveMemorizeVerses(next); };
  return <GrowthPage title="Memorize Verses" onNavigate={onNavigate} onNavigation={onNavigation}>{verses.map((verse) => <button key={verse.id} onClick={() => toggle(verse.id)} className={`w-full rounded-xl border p-5 text-left transition-colors ${verse.memorized ? 'border-secondary/30 bg-secondary-container/30' : 'border-outline-variant/10 bg-surface-container-lowest'}`}><div className="flex justify-between gap-3"><p className="font-label-md text-sm font-bold text-primary">{verse.reference}</p><span className="font-label-sm text-xs text-secondary">{verse.memorized ? 'Memorized' : 'Mark complete'}</span></div><p className="font-scripture-text text-base text-on-surface mt-2 leading-relaxed">{verse.text}</p></button>)}</GrowthPage>;
}