export interface MemorizeVerse {
  id: string;
  reference: string;
  text: string;
  memorized: boolean;
}

const storageKey = 'devoted-memorize-verses';

const starterVerses: MemorizeVerse[] = [
  { id: 'john-3-16', reference: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', memorized: false },
  { id: 'philippians-4-13', reference: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.', memorized: false },
  { id: 'proverbs-3-5', reference: 'Proverbs 3:5', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.', memorized: false },
];

export function getMemorizeVerses(): MemorizeVerse[] {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) as MemorizeVerse[] : starterVerses;
}

export function saveMemorizeVerses(verses: MemorizeVerse[]) {
  localStorage.setItem(storageKey, JSON.stringify(verses));
}