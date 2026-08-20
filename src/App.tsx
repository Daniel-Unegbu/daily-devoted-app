import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AuthScreen } from '@/screens/AuthScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { Dashboard } from '@/screens/Dashboard';
import { BibleReaderScreen } from '@/screens/BibleReaderScreen';
import { VerseOfDayScreen } from '@/screens/VerseOfDayScreen';
import { PrayerPlan } from '@/screens/PrayerPlan';
import { NightPrayer } from '@/screens/NightPrayer';
import { ShareFaith } from '@/screens/ShareFaith';
import { Repentance } from '@/screens/Repentance';
import { Account } from '@/screens/Account';
import { Settings } from '@/screens/Settings';
import { Growth } from '@/screens/Growth';
import { SavedScripture } from '@/screens/SavedScripture';
import { MemorizeVerses } from '@/screens/MemorizeVerses';
import { PrayerJournal } from '@/screens/PrayerJournal';
import { TabKey } from '@/components/BottomNav';
import { NavigationItem } from '@/components/Navigation';
import { BibleTarget } from '@/components/BibleShortcut';
import { LastDays } from '@/screens/LastDays';
import { LastDaysScripture } from '@/screens/LastDaysScripture';
import { LastDaysSectionPage } from '@/screens/LastDaysSectionPage';
import { LastDaysSectionId } from '@/lib/lastdaysDb';
import { ScrollToTop } from '@/components/ScrollToTop';

type Screen = TabKey | 'verseofday' | 'nightprayer' | 'sharefaith' | 'repentance' | 'settings' | 'saved' | 'memorize' | 'journal' | 'lastdays' | 'lastdays-section' | 'lastdays-scripture';

function AppContent() {
  const { session, profile, loading } = useAuth();
  const [screen, setScreen] = useState<Screen>('home');
  const [accountSection, setAccountSection] = useState<string | undefined>();
  const [repentanceTab, setRepentanceTab] = useState<'instant' | 'weekly' | 'addictions'>('instant');
  const [lastDaysSection, setLastDaysSection] = useState<LastDaysSectionId>('understanding-the-times');
  const [bibleTarget, setBibleTarget] = useState<BibleTarget | undefined>();

  // Reset to home when auth state changes
  useEffect(() => {
    if (session) setScreen('home');
  }, [session?.user.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  // Show welcome/onboarding if profile exists but salvation hasn't been addressed yet
  if (profile && !profile.salvation_accepted && !profile.salvation_date) {
    return <WelcomeScreen />;
  }

  const scrollToTop = <ScrollToTop screen={screen} disabled={screen === 'bible'} />;

  const handleNavigate = (tab: TabKey) => {
    setAccountSection(undefined);
    if (tab !== 'bible') setBibleTarget(undefined);
    setScreen(tab);
  };

  const handleOpenBible = (target: BibleTarget) => {
    setBibleTarget(target);
    setScreen('bible');
  };

  const handleOpenSettings = (section: string) => {
    setAccountSection(section);
    setScreen('settings');
  };

  const handleOpenGrowthPage = (page: 'saved' | 'memorize' | 'journal') => {
    setScreen(page);
  };

  const handleNavigation = (item: NavigationItem) => {
    if (item === 'night') setScreen('nightprayer');
    else if (item === 'appearance') handleOpenSettings('Appearance');
    else if (item === 'gospel') setScreen('sharefaith');
    else if (item === 'repentance') { setRepentanceTab('instant'); setScreen('repentance'); }
    else if (item === 'addiction') { setRepentanceTab('addictions'); setScreen('repentance'); }
    else if (item === 'weekly') { setRepentanceTab('weekly'); setScreen('repentance'); }
    else if (item === 'lastdays') setScreen('lastdays');
  };

  const handleOpenSection = (section: 'morning' | 'bible' | 'gospel' | 'night' | 'repentance') => {
    if (section === 'morning') setScreen('prayer');
    else if (section === 'bible') setScreen('verseofday');
    else if (section === 'gospel') setScreen('sharefaith');
    else if (section === 'night') setScreen('nightprayer');
    else if (section === 'repentance') setScreen('repentance');
  };

  switch (screen) {
    case 'home':
      return (
        <>{scrollToTop}<Dashboard onNavigate={handleNavigate} onOpenSection={handleOpenSection} onNavigation={handleNavigation} /></>
      );
    case 'bible':
      return <>{scrollToTop}<BibleReaderScreen onNavigate={handleNavigate} onNavigation={handleNavigation} initialTarget={bibleTarget} /></>;
    case 'verseofday':
      return <>{scrollToTop}<VerseOfDayScreen onNavigate={handleNavigate} onNavigation={handleNavigation} /></>;
    case 'prayer':
      return (
        <>{scrollToTop}<PrayerPlan
          onNavigate={handleNavigate}
          onOpenNightPrayer={() => setScreen('nightprayer')}
          onNavigation={handleNavigation}
        /></>
      );
    case 'growth':
      return <>{scrollToTop}<Growth onNavigate={handleNavigate} onOpen={(page) => page === 'weekly' ? handleNavigation('weekly') : handleOpenGrowthPage(page)} onNavigation={handleNavigation} /></>;
    case 'lastdays':
      return <>{scrollToTop}<LastDays onNavigate={handleNavigate} onNavigation={handleNavigation} onOpenBible={handleOpenBible} onOpenSection={(section) => { setLastDaysSection(section); setScreen(section === 'scriptural-resources' ? 'lastdays-scripture' : 'lastdays-section'); }} /></>;
    case 'lastdays-section':
      return <>{scrollToTop}<LastDaysSectionPage sectionId={lastDaysSection} onNavigate={handleNavigate} onNavigation={handleNavigation} onOpenBible={handleOpenBible} onBack={() => setScreen('lastdays')} /></>;
    case 'lastdays-scripture':
      return <>{scrollToTop}<LastDaysScripture onNavigate={handleNavigate} onNavigation={handleNavigation} onOpenBible={handleOpenBible} onBack={() => setScreen('lastdays')} /></>;
    case 'saved':
      return <>{scrollToTop}<SavedScripture onNavigate={handleNavigate} onNavigation={handleNavigation} /></>;
    case 'memorize':
      return <>{scrollToTop}<MemorizeVerses onNavigate={handleNavigate} onNavigation={handleNavigation} /></>;
    case 'journal':
      return <>{scrollToTop}<PrayerJournal onNavigate={handleNavigate} onNavigation={handleNavigation} /></>;
    case 'account':
      return (
        <>{scrollToTop}<Account
          onNavigate={handleNavigate}
          onOpenSettings={handleOpenSettings}
          onOpenGrowthPage={handleOpenGrowthPage}
          onNavigation={handleNavigation}
        /></>
      );
    case 'settings':
      return <>{scrollToTop}<Settings onNavigate={handleNavigate} initialSection={accountSection} onNavigation={handleNavigation} /></>;
    case 'nightprayer':
      return <>{scrollToTop}<NightPrayer onNavigate={handleNavigate} onBack={() => setScreen('prayer')} onNavigation={handleNavigation} /></>;
    case 'sharefaith':
      return (
        <>{scrollToTop}<ShareFaith
          onNavigate={handleNavigate}
          onOpenRepentance={() => setScreen('repentance')}
          onBack={() => setScreen('home')}
          onNavigation={handleNavigation}
          onOpenBible={handleOpenBible}
        /></>
      );
    case 'repentance':
      return <>{scrollToTop}<Repentance onNavigate={handleNavigate} onBack={() => setScreen('home')} initialTab={repentanceTab} onNavigation={handleNavigation} onOpenBible={handleOpenBible} /></>;
    default:
      return (
        <>{scrollToTop}<Dashboard
          onNavigate={handleNavigate}
          onOpenSection={handleOpenSection}
          onNavigation={handleNavigation}
        /></>
      );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
