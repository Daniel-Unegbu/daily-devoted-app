import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NavigationItem } from '@/components/Navigation';
import { BibleTarget } from '@/components/BibleShortcut';
import {
  getBibleBooks,
  getBibleChapters,
  getBibleVerses,
} from '@/lib/bibleDb';
import type { VerseItem } from '@/lib/bibleDb';

interface BibleReaderScreenProps {
  onNavigate: (tab: TabKey) => void;
  onNavigation?: (item: NavigationItem) => void;
  initialTarget?: BibleTarget;
}

export function BibleReaderScreen({ onNavigate, onNavigation, initialTarget }: BibleReaderScreenProps) {
  const [readerBook, setReaderBook] = useState(initialTarget?.book ?? 'John');
  const [readerChapter, setReaderChapter] = useState(initialTarget?.chapter ?? 3);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(initialTarget?.verse ?? null);
  const [verses, setVerses] = useState<VerseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [books, setBooks] = useState<string[]>([]);
  const [chapters, setChapters] = useState<number[]>([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectionLoading, setSelectionLoading] = useState(false);
  const verseRefs = useRef<Record<number, HTMLParagraphElement | null>>({});

  useEffect(() => {
    async function loadChapter() {
      setLoading(true);
      setVerses(await getBibleVerses(readerBook, readerChapter));
      setLoading(false);
    }

    loadChapter();
  }, [readerBook, readerChapter]);

  useEffect(() => {
    if (loading || selectedVerse === null) return;

    verseRefs.current[selectedVerse]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [loading, selectedVerse]);

  const openSearch = async () => {
    setSearchOpen(true);
    if (books.length === 0) {
      setSelectionLoading(true);
      setBooks(await getBibleBooks());
      setSelectionLoading(false);
    }
  };

  const selectBook = async (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setSelectionLoading(true);
    setChapters(await getBibleChapters(book));
    setSelectionLoading(false);
  };

  const selectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
  };

  const selectVerse = (verse: number) => {
    setReaderBook(selectedBook);
    setReaderChapter(selectedChapter!);
    setSelectedVerse(verse);
    setSearchOpen(false);
  };

  const moveChapter = async (direction: -1 | 1) => {
    setLoading(true);
    const allBooks = await getBibleBooks();
    const bookIndex = allBooks.indexOf(readerBook);
    const currentChapters = await getBibleChapters(readerBook);
    const chapterIndex = currentChapters.indexOf(readerChapter);

    let nextBook = readerBook;
    let nextChapterIndex = chapterIndex + direction;

    if (nextChapterIndex < 0 && bookIndex > 0) {
      nextBook = allBooks[bookIndex - 1];
      const previousChapters = await getBibleChapters(nextBook);
      nextChapterIndex = previousChapters.length - 1;
    } else if (nextChapterIndex >= currentChapters.length && bookIndex < allBooks.length - 1) {
      nextBook = allBooks[bookIndex + 1];
      nextChapterIndex = 0;
    }

    if (nextBook !== readerBook || nextChapterIndex !== chapterIndex) {
      const nextChapters = nextBook === readerBook ? currentChapters : await getBibleChapters(nextBook);
      setReaderBook(nextBook);
      setReaderChapter(nextChapters[nextChapterIndex]);
      setSelectedVerse(null);
    } else {
      setLoading(false);
    }
  };

  const reference = `${readerBook} ${readerChapter}`;

  const resetSearch = () => {
    setSelectedBook('');
    setSelectedChapter(null);
    setChapters([]);
  };

  return (
    <div className="min-h-screen bg-surface pb-[120px]">
      <Header onNavigate={onNavigate} onNavigation={onNavigation} />

      <main className="max-w-3xl mx-auto px-container-margin pt-6 space-y-4">
        <section className="flex items-center justify-between border-b border-outline-variant/30 pb-3 gap-3">
          <div>
           <h2 className="font-headline-md text-xl font-semibold text-on-surface">Scripture Reader</h2>
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">KJV</p>
          </div>
          <button
            onClick={openSearch}
            className="flex-1 max-w-[220px] flex items-center gap-2 px-3 py-2 bg-surface-container-low border border-outline-variant/40 rounded-lg text-sm text-on-surface-variant text-left hover:border-primary transition-colors"
          >
            <Icon name="search" className="text-lg" />
            <span className="truncate">Search book, chapter, verse</span>
          </button>
        </section>

        <ChapterNavigation onMove={moveChapter} />

        <article className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm border border-outline-variant/10 min-h-[300px]">
          <h3 className="text-lg font-bold text-primary mb-6">{reference}</h3>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : verses.length > 0 ? (
            <div className="pl-4 font-scripture-text text-on-surface space-y-4">
              {verses.map((verse) => (
                <p
                  key={verse.verse}
                  ref={(element) => {
                    verseRefs.current[verse.verse] = element;
                  }}
                  className={`relative leading-relaxed rounded-lg transition-colors ${
                    selectedVerse === verse.verse ? 'bg-primary-container/40 px-2 -mx-2' : ''
                  }`}
                >
                  <sup className="text-xs text-outline absolute -left-4 top-1 font-label-sm">{verse.verse}</sup>
                  {verse.text}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-center text-on-surface-variant py-12 text-sm">No verses found for this reference.</p>
          )}
        </article>

        <ChapterNavigation onMove={moveChapter} />
      </main>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-on-surface/40 p-4 pb-24 sm:pb-4 flex items-end sm:items-center justify-center" onClick={() => setSearchOpen(false)}>
          <section
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-surface rounded-2xl p-5 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Find a Bible verse"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-label-sm text-xs text-primary uppercase tracking-wider">Find Scripture</p>
                <h2 className="font-headline-lg-mobile text-xl font-bold text-on-surface">
                  {!selectedBook ? 'Choose a book' : selectedChapter === null ? 'Choose a chapter' : 'Choose a verse'}
                </h2>
              </div>
              <button onClick={() => setSearchOpen(false)} className="p-2 text-outline hover:text-on-surface" aria-label="Close search">
                <Icon name="close" />
              </button>
            </div>

            {selectedBook && (
              <button onClick={resetSearch} className="mb-4 flex items-center gap-1 text-primary text-sm font-label-md">
                <Icon name="arrow_back" className="text-base" />
                Books
              </button>
            )}

            {selectionLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : !selectedBook ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {books.map((book) => (
                  <button key={book} onClick={() => selectBook(book)} className="p-3 rounded-lg bg-surface-container-low text-sm text-left hover:bg-primary-container hover:text-on-primary-container transition-colors">
                    {book}
                  </button>
                ))}
              </div>
            ) : selectedChapter === null ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {chapters.map((chapter) => (
                  <button key={chapter} onClick={() => selectChapter(chapter)} className="p-3 rounded-lg bg-surface-container-low text-sm text-center hover:bg-primary-container hover:text-on-primary-container transition-colors">
                    {chapter}
                  </button>
                ))}
              </div>
            ) : (
              <VersePicker book={selectedBook} chapter={selectedChapter} onSelect={selectVerse} onBack={() => setSelectedChapter(null)} />
            )}
          </section>
        </div>
      )}

      <BottomNav active="bible" onNavigate={onNavigate} />
    </div>
  );
}

function ChapterNavigation({ onMove }: { onMove: (direction: -1 | 1) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <button
        onClick={() => onMove(-1)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-primary font-label-md text-sm hover:bg-primary-container transition-colors"
      >
        <Icon name="arrow_back" className="text-lg" />
        Previous chapter
      </button>
      <button
        onClick={() => onMove(1)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-primary font-label-md text-sm hover:bg-primary-container transition-colors"
      >
        Next chapter
        <Icon name="arrow_forward" className="text-lg" />
      </button>
    </div>
  );
}

function VersePicker({
  book,
  chapter,
  onSelect,
  onBack,
}: {
  book: string;
  chapter: number;
  onSelect: (verse: number) => void;
  onBack: () => void;
}) {
  const [verses, setVerses] = useState<number[]>([]);

  useEffect(() => {
    getBibleVerses(book, chapter).then((items) => setVerses(items.map((item) => item.verse)));
  }, [book, chapter]);

  return (
    <>
      <button onClick={onBack} className="mb-4 flex items-center gap-1 text-primary text-sm font-label-md">
        <Icon name="arrow_back" className="text-base" />
        Chapters
      </button>
      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
        {verses.map((verse) => (
          <button key={verse} onClick={() => onSelect(verse)} className="p-3 rounded-lg bg-surface-container-low text-sm text-center hover:bg-primary-container hover:text-on-primary-container transition-colors">
            {verse}
          </button>
        ))}
      </div>
    </>
  );
}
