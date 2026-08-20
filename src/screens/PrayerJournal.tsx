import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { GrowthPage } from './SavedScripture';
import { TabKey } from '@/components/BottomNav';
import { NavigationItem } from '@/components/Navigation';

export function PrayerJournal({ onNavigate, onNavigation }: { onNavigate: (tab: TabKey) => void; onNavigation?: (item: NavigationItem) => void }) {
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState(profile?.prayer_journal ?? []);
  const addEntry = async (event: React.FormEvent) => { event.preventDefault(); if (!user || !title.trim() || !content.trim()) return; const entry = { id: crypto.randomUUID(), title: title.trim(), content: content.trim(), is_answered: false, created_at: new Date().toISOString() }; const next = [entry, ...entries]; setEntries(next); setTitle(''); setContent(''); await supabase.from('profiles').update({ prayer_journal: next }).eq('id', user.id); };
  return <GrowthPage title="Prayer Journal" onNavigate={onNavigate} onNavigation={onNavigation}><form onSubmit={addEntry} className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-5 ambient-shadow space-y-3"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Prayer title" className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 text-sm" /><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Write your prayer..." rows={4} className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 text-sm" /><button className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary">Save Prayer</button></form>{entries.map((entry) => <article key={entry.id} className="rounded-xl bg-surface-container-lowest border border-outline-variant/10 p-5 ambient-shadow"><p className="font-label-md text-sm font-bold text-primary">{entry.title}</p><p className="mt-2 text-sm leading-relaxed text-on-surface">{entry.content}</p></article>)}</GrowthPage>;
}