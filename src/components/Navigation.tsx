import { useEffect, useRef } from 'react';
import { Icon } from './Icon';

export type NavigationItem =
  | 'night'
  | 'appearance'
  | 'gospel'
  | 'repentance'
  | 'addiction'
  | 'weekly'
  | 'lastdays';

interface NavigationProps {
  onSelect: (item: NavigationItem) => void;
  onClose: () => void;
  align?: 'left' | 'right';
}

const items = [
  { key: 'night', label: 'Night Prayer', icon: 'bedtime' },
  { key: 'appearance', label: 'Appearance', icon: 'palette' },
  { key: 'gospel', label: 'Share the Gospel', icon: 'campaign' },
  { key: 'repentance', label: 'Repentance', icon: 'front_hand' },
  { key: 'addiction', label: 'Dealing with Addiction', icon: 'healing' },
  { key: 'weekly', label: 'Weekly Guide', icon: 'map' },
  { key: 'lastdays', label: 'The Last Days', icon: 'event' },
] as const;

export function Navigation({ onSelect, onClose, align = 'left' }: NavigationProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const positionClass = align === 'right' ? 'right-4 top-14' : 'left-4 top-14';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`absolute ${positionClass} z-50 w-60 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-2 ambient-shadow`}
    >
      {/* Header bar with title and Close 'X' Button */}
      <div className="flex items-center justify-between px-3 py-1">
        <p className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant">
          Navigate
        </p>
        <button
          onClick={onClose}
          type="button"
          aria-label="Close navigation menu"
          className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
        >
          <Icon name="close" className="text-base" />
        </button>
      </div>

      {/* Navigation Links */}
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => {
            onSelect(item.key);
            onClose();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-on-surface hover:bg-surface-container-low"
        >
          <Icon name={item.icon} className="text-xl text-primary" />
          <span className="font-label-md text-sm">{item.label}</span>
        </button>
      ))}
    </div>
  );
}