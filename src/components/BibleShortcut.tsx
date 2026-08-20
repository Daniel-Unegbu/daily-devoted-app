import { Icon } from '@/components/Icon';

export interface BibleTarget {
  book: string;
  chapter: number;
  verse?: number;
}

interface BibleShortcutProps {
  reference: string;
  onOpenBible: (target: BibleTarget) => void;
  className?: string;
}

export function parseBibleReference(reference: string): BibleTarget | null {
  const match = reference.trim().match(/^(.+?)\s+(\d+)(?::(\d+))?(?:[-–]\d+)?(?:\s+KJV)?$/i);
  if (!match) return null;
  return {
    book: match[1].trim(),
    chapter: Number(match[2]),
    verse: match[3] ? Number(match[3]) : undefined,
  };
}

export function BibleShortcut({ reference, onOpenBible, className = '' }: BibleShortcutProps) {
  const target = parseBibleReference(reference);
  if (!target) return <span className={className}>{reference}</span>;

  return (
    <button
      type="button"
      onClick={() => onOpenBible(target)}
      className={`inline-flex items-center gap-2 text-left font-label-md text-sm text-primary hover:underline ${className}`}
      aria-label={`Open ${reference} in the Bible`}
    >
      <span>{reference}</span>
      <Icon name="arrow_forward" className="text-base" />
    </button>
  );
}
