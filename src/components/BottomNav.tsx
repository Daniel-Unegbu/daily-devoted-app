import { Icon } from './Icon';

export type TabKey = 'home' | 'bible' | 'prayer' | 'growth' | 'account';

interface BottomNavProps {
  active: TabKey;
  onNavigate: (tab: TabKey) => void;
  dark?: boolean;
}

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'bible', label: 'Bible', icon: 'book_2' },
  { key: 'prayer', label: 'Prayer', icon: 'favorite' },
  { key: 'growth', label: 'Growth', icon: 'grass' },
  { key: 'account', label: 'Account', icon: 'person' },
];

export function BottomNav({ active, onNavigate, dark = false }: BottomNavProps) {
  const baseText = dark ? 'text-on-surface-variant' : 'text-on-surface-variant';
  const activeText = dark ? 'text-primary' : 'text-primary';

  return (
    <nav
      className={`fixed bottom-0 w-full z-50 rounded-t-xl backdrop-blur-xl border-t shadow-sm md:hidden ${
        dark
          ? 'bg-surface/80 border-outline/10'
          : 'bg-surface/80 border-outline-variant/30'
      }`}
    >
      <div className="flex justify-around items-center px-4 pb-6 pt-3 w-full max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              onClick={() => onNavigate(tab.key)}
              className={`flex flex-col items-center justify-center transition-all active:scale-90 duration-200 w-16 ${
                isActive ? `${activeText} font-bold` : `${baseText} opacity-70`
              }`}
            >
              <Icon
                name={tab.icon}
                fill={isActive}
                weight={isActive ? 400 : 300}
                className="mb-1 text-[24px]"
              />
              <span className="font-label-sm text-[10px]">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
