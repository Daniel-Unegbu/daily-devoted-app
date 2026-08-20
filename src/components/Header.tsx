import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Icon } from '@/components/Icon';
import { TabKey } from '@/components/BottomNav';
import type { ReactNode } from 'react';
import { Navigation, NavigationItem } from '@/components/Navigation';

interface HeaderProps {
  onNavigate: (tab: TabKey) => void;
  title?: string;
  backTo?: TabKey;
  onBack?: () => void;
  menuContent?: ReactNode;
  onMenu?: () => void;
  onNavigation?: (item: NavigationItem) => void;
  alignMenu?: 'left' | 'right';
}

export function Header({
  onNavigate,
  title = 'Devoted',
  backTo,
  onBack,
  menuContent,
  onMenu,
  onNavigation,
  alignMenu,
}: HeaderProps) {
  const { user, profile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const rawName = profile?.full_name || profile?.name || user?.user_metadata?.full_name || user?.user_metadata?.name || '';
  const firstName = rawName.trim().split(' ')[0];
  const avatarInitial = firstName[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  const hasBackButton = Boolean(backTo || onBack);
  const menuAlignment = alignMenu ?? (hasBackButton ? 'right' : 'left');

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-surface-variant/20 transform-gpu will-change-transform">
      <div className="relative flex items-center justify-between px-container-margin py-unit max-w-7xl mx-auto">
        {hasBackButton ? (
          <button
            onClick={onBack ?? (() => onNavigate(backTo!))}
            className="p-2 -ml-2 text-primary hover:bg-surface-container-low rounded-full transition-colors active:scale-95"
            aria-label="Go back"
          >
            <Icon name="arrow_back" />
          </button>
        ) : (
          <div>
            <button
              onClick={() => {
                onMenu?.();
                if (onNavigation) setMenuOpen((open) => !open);
              }}
              className="p-2 -ml-2 text-primary hover:bg-surface-container-low rounded-full transition-colors active:scale-95"
              aria-label="Open navigation"
            >
              <Icon name="menu" />
            </button>
            {onNavigation && menuOpen && (
              <Navigation 
                align={menuAlignment} 
                onSelect={(item) => { setMenuOpen(false); onNavigation(item); }} 
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>
        )}

        {menuContent}
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">{title}</h1>

        <div className="flex items-center gap-2">
          {onNavigation && hasBackButton && (
            <div>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open navigation"
                className="p-2 text-primary hover:bg-surface-container-low rounded-full transition-colors active:scale-95"
              >
                <Icon name="menu" />
              </button>

              {menuOpen && (
                <Navigation 
                  align={menuAlignment} 
                  onSelect={(item) => { setMenuOpen(false); onNavigation(item); }} 
                  onClose={() => setMenuOpen(false)}
                />
              )}
            </div>
          )}

          <button
            onClick={() => onNavigate('account')}
            aria-label="Open account"
            className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed font-label-md hover:opacity-90 transition-opacity"
          >
            {avatarInitial}
          </button>
        </div>
      </div>
    </header>
  );
}