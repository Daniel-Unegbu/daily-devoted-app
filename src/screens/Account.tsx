import { useAuth } from '@/lib/auth';
import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NavigationItem } from '@/components/Navigation';

export function Account({ 
  onNavigate, 
  onOpenAuth,
  onOpenSettings,
  onOpenGrowthPage,
  onNavigation,
}: { 
  onNavigate: (tab: TabKey) => void;
  onOpenAuth?: () => void;
  onOpenSettings?: (section: string) => void;
  onOpenGrowthPage?: (page: 'saved' | 'journal') => void;
  onNavigation?: (item: NavigationItem) => void;
}) {
  const { user, profile, signOut } = useAuth();

  // Extract display name priority: profile table -> Google/Auth metadata -> fallback
  const displayName = 
    profile?.full_name || 
    user?.user_metadata?.full_name || 
    user?.user_metadata?.name || 
    'Believer';

  // Get initial for profile avatar
  const avatarInitial = displayName[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  // ---------------------------------------------------------------------------
  // GUEST MODE GUARD
  // If no user is logged in, show the guest prompt instead of account details
  // ---------------------------------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-surface pb-[120px] flex flex-col">
        <Header onNavigate={onNavigate} onNavigation={onNavigation} />

        <main className="flex-1 max-w-md mx-auto px-container-margin flex flex-col items-center justify-center text-center my-auto py-12">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-4">
            <Icon name="account_circle" className="text-3xl" />
          </div>
          <h2 className="font-headline-lg-mobile text-2xl font-bold text-on-surface mb-2">
            Sign in to view your profile
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
            Create an account or sign in to track your devotion streaks, save your prayers, and sync your habits across devices.
          </p>
          <button
            onClick={onOpenAuth}
            className="w-full py-3.5 px-6 bg-secondary-fixed text-on-secondary-fixed font-semibold rounded-full shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
          >
            Sign In or Create Account
          </button>
        </main>

        <BottomNav active="account" onNavigate={onNavigate} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED USER ACCOUNT SCREEN
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-surface pb-[120px]">
      <Header onNavigate={onNavigate} onNavigation={onNavigation} />

      <main className="max-w-3xl mx-auto px-container-margin pt-8 space-y-section-gap">
        {/* User Info Header */}
        <section className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed font-headline-lg text-3xl mb-3 shadow-sm">
            {avatarInitial}
          </div>
          
          {/* Full Name Display */}
          <h2 className="font-headline-lg-mobile text-2xl font-bold text-on-surface">
            {displayName}
          </h2>
          
          {/* Email in smaller, muted text directly below the name */}
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-0.5">
            {user.email}
          </p>

          <p className="font-body-md text-xs text-on-surface-variant/60 mt-2">
            Member since {profile ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}
          </p>
        </section>

        {/* User Stats Overview */}
        <section className="grid grid-cols-3 gap-4">
          <button
            onClick={() => onOpenGrowthPage?.('saved')}
            className="bg-surface-container-lowest rounded-xl p-4 ambient-shadow text-center border border-outline-variant/10 hover:bg-surface-container-low transition-colors"
          >
            <Icon name="bookmark" className="text-primary text-2xl" />
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mt-1">Saved Verses</p>
          </button>
          <div className="bg-surface-container-lowest rounded-xl p-4 ambient-shadow text-center border border-outline-variant/10">
            <p className="font-headline-lg-mobile text-2xl text-secondary">
              {profile?.salvation_accepted ? 'Yes' : '—'}
            </p>
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mt-1">Saved</p>
          </div>
          <button
            onClick={() => onOpenGrowthPage?.('journal')}
            className="bg-surface-container-lowest rounded-xl p-4 ambient-shadow text-center border border-outline-variant/10 hover:bg-surface-container-low transition-colors"
          >
            <Icon name="edit_note" className="text-primary text-2xl" />
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mt-1">Prayer Journal</p>
          </button>
        </section>

        {/* Settings List */}
        <section className="space-y-3">
          <h3 className="font-headline-lg-mobile text-lg font-bold text-on-surface mb-2">Settings</h3>
          {[
            { icon: 'notifications', label: 'Notifications', desc: 'Prayer reminders & daily alerts' },
            { icon: 'palette', label: 'Appearance', desc: 'Theme & display preferences' },
            { icon: 'lock', label: 'Privacy', desc: 'Your data & security' },
            { icon: 'help', label: 'Help & Support', desc: 'FAQs & contact' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onOpenSettings?.(item.label)}
              className="w-full bg-surface-container-lowest rounded-xl p-4 ambient-shadow flex items-center gap-4 text-left border border-outline-variant/10 hover:bg-surface-container-low transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                <Icon name={item.icon} weight={300} />
              </div>
              <div className="flex-grow">
                <p className="font-label-md text-sm font-semibold text-on-surface">{item.label}</p>
                <p className="font-body-md text-xs text-on-surface-variant">{item.desc}</p>
              </div>
              <Icon name="chevron_right" className="text-outline text-sm" />
            </button>
          ))}
        </section>

        {/* Sign Out Action */}
        <section>
          <button
            onClick={signOut}
            className="w-full py-3.5 px-6 bg-error-container text-on-error-container font-label-md text-sm font-semibold rounded-full hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Icon name="logout" weight={400} />
            Sign Out
          </button>
        </section>
      </main>

      <BottomNav active="account" onNavigate={onNavigate} />
    </div>
  );
}