export interface VerseItem {
  verse: number;
  text: string;
}

interface BibleChapterData {
  chapter: string | number;
  verses: Array<{ verse: string | number; text: string }>;
}

interface BibleBookData {
  chapters: BibleChapterData[];
}

// Memory cache so loaded books remain instant on repeated views
const bookCache: Record<string, BibleBookData> = {};
let bibleBooks: string[] | null = null;

/**
 * No-op helper for backwards compatibility. Option A loads files on demand.
 */
export async function seedBibleData(): Promise<boolean> {
  return true; 
}

function getFileName(bookName: string) {
  return bookName
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

async function loadBook(bookName: string): Promise<BibleBookData> {
  const fileName = getFileName(bookName);
  if (!bookCache[fileName]) {
    const res = await fetch(`/bible/Bible-kjv/${fileName}.json`);
    if (!res.ok) throw new Error(`Book file /bible/Bible-kjv/${fileName}.json not found`);
    bookCache[fileName] = (await res.json()) as BibleBookData;
  }
  return bookCache[fileName];
}

export async function getBibleBooks(): Promise<string[]> {
  if (bibleBooks) return bibleBooks;
  const res = await fetch('/bible/Bible-kjv/Books.json');
  if (!res.ok) throw new Error('Could not load Bible book list');
  bibleBooks = (await res.json()) as string[];
  return bibleBooks;
}

export async function getBibleChapters(bookName: string): Promise<number[]> {
  const book = await loadBook(bookName);
  return book.chapters.map((chapter) => Number(chapter.chapter));
}

export async function getBibleVerses(bookName: string, chapterNumber: number): Promise<VerseItem[]> {
  const book = await loadBook(bookName);
  const chapter = book.chapters.find((item) => Number(item.chapter) === chapterNumber);
  return chapter?.verses.map((verse) => ({
    verse: Number(verse.verse),
    text: verse.text,
  })) ?? [];
}

/**
 * Fetches verses directly from /bible/Bible-kjv/[Book].json
 */
export async function fetchVersesForReference(reference: string): Promise<VerseItem[]> {
  try {
    // Matches single- and multi-word books, such as "John 3:16" and "Song of Solomon 2:1".
    const match = reference.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!match) return [];

    const [, rawBookName, chapterStr, startVerseStr, endVerseStr] = match;
    const chapterNum = parseInt(chapterStr, 10);
    
    let bookName = rawBookName.trim();
    if (bookName.toLowerCase() === 'psalm') bookName = 'Psalms';

    const bookData = await loadBook(bookName);
    const chapters = bookData.chapters || [];
    
    const targetChapter = chapters.find((chapter) => {
      const chVal = typeof chapter.chapter === 'string' ? parseInt(chapter.chapter, 10) : chapter.chapter;
      return chVal === chapterNum;
    });

    if (!targetChapter || !targetChapter.verses) return [];

    let parsedVerses: VerseItem[] = targetChapter.verses.map((verse) => ({
      verse: typeof verse.verse === 'string' ? parseInt(verse.verse, 10) : verse.verse,
      text: verse.text
    }));

    // Filter by verse range if provided (e.g. John 3:16 or Philippians 4:6-7)
    if (startVerseStr) {
      const startVerse = parseInt(startVerseStr, 10);
      const endVerse = endVerseStr ? parseInt(endVerseStr, 10) : startVerse;
      parsedVerses = parsedVerses.filter((v) => v.verse >= startVerse && v.verse <= endVerse);
    }

    return parsedVerses;
  } catch (err) {
    console.warn(`Could not load passage ${reference} from JSON files:`, err);
    return [];
  }
}