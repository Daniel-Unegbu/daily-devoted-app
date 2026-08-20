import { useState, useEffect, useRef } from 'react';
import { Icon } from '@/components/Icon';
import { BottomNav, TabKey } from '@/components/BottomNav';
import { Header } from '@/components/Header';
import { NavigationItem } from '@/components/Navigation';

export function Settings({
  onNavigate,
  initialSection,
  onNavigation,
}: {
  onNavigate: (tab: TabKey) => void;
  initialSection?: string;
  onNavigation?: (item: NavigationItem) => void;
}) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Notification States
  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [alarmTime, setAlarmTime] = useState('07:00');
  const [alarmSound, setAlarmSound] = useState('gentle_chime');

  // Appearance States
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');

  // Privacy & Email States
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [devotionalReminders, setDevotionalReminders] = useState(true);

  useEffect(() => {
    if (initialSection) {
      window.setTimeout(() => {
        sectionRefs.current[initialSection]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }, [initialSection]);

  return (
    <div className="min-h-screen bg-surface pb-[120px]">
      <Header onNavigate={onNavigate} title="Settings" backTo="account" onNavigation={onNavigation} />

      <main className="max-w-3xl mx-auto px-container-margin pt-4 space-y-4">
        {/* 1. NOTIFICATIONS SECTION */}
        <section
          ref={(el) => { sectionRefs.current['Notifications'] = el; }}
          className="scroll-mt-20 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant/10 pb-2">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
              <Icon name="notifications" className="text-base" />
            </div>
            <div>
              <h2 className="font-headline-lg-mobile text-base font-bold text-on-surface">Notifications</h2>
              <p className="font-body-md text-xs text-on-surface-variant">Daily devotional alarms & prayer alerts</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Alarm Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label-md text-xs font-bold text-on-surface">Prayer & Devotional Alarm</p>
                <p className="font-body-md text-[11px] text-on-surface-variant">Receive a daily reminder call to seek God</p>
              </div>
              <button
                type="button"
                onClick={() => setAlarmEnabled(!alarmEnabled)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  alarmEnabled ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    alarmEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Expandable Alarm Settings */}
            {alarmEnabled && (
              <div className="space-y-2.5 pt-2 border-t border-outline-variant/10 bg-surface-container-low/40 p-2.5 rounded-lg">
                {/* Alarm Time Picker */}
                <div className="flex items-center justify-between">
                  <label htmlFor="alarm-time" className="font-label-md text-xs text-on-surface">Alarm Time</label>
                  <input
                    id="alarm-time"
                    type="time"
                    value={alarmTime}
                    onChange={(e) => setAlarmTime(e.target.value)}
                    className="bg-surface-container-lowest border border-outline-variant/20 rounded-md px-2 py-1 text-xs font-bold text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Alarm Sound Picker */}
                <div className="flex items-center justify-between">
                  <label htmlFor="alarm-sound" className="font-label-md text-xs text-on-surface">Sound Tone</label>
                  <select
                    id="alarm-sound"
                    value={alarmSound}
                    onChange={(e) => setAlarmSound(e.target.value)}
                    className="bg-surface-container-lowest border border-outline-variant/20 rounded-md px-2 py-1 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="gentle_chime">Gentle Chime</option>
                    <option value="morning_harp">Morning Harp</option>
                    <option value="peaceful_bells">Peaceful Bells</option>
                    <option value="soft_piano">Soft Piano</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2. APPEARANCE SECTION */}
        <section
          ref={(el) => { sectionRefs.current['Appearance'] = el; }}
          className="scroll-mt-20 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant/10 pb-2">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
              <Icon name="palette" className="text-base" />
            </div>
            <div>
              <h2 className="font-headline-lg-mobile text-base font-bold text-on-surface">Appearance</h2>
              <p className="font-body-md text-xs text-on-surface-variant">Customize comfortable reading modes</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-label-md text-xs font-bold text-on-surface">Theme Mode</span>
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/10">
              {(['light', 'dark', 'system'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setThemeMode(mode)}
                  className={`px-2.5 py-1 rounded-md font-label-md text-xs capitalize transition-all ${
                    themeMode === mode
                      ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. PRIVACY & COMMUNICATIONS SECTION */}
        <section
          ref={(el) => { sectionRefs.current['Privacy'] = el; }}
          className="scroll-mt-20 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant/10 pb-2">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
              <Icon name="lock" className="text-base" />
            </div>
            <div>
              <h2 className="font-headline-lg-mobile text-base font-bold text-on-surface">Privacy & Email</h2>
              <p className="font-body-md text-xs text-on-surface-variant">Your spiritual data & communication preferences</p>
            </div>
          </div>

          {/* Default Privacy Info Banner */}
          <div className="bg-surface-container-low/60 p-2.5 rounded-lg border border-outline-variant/10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary">
              <Icon name="verified_user" className="text-sm" />
              <p className="font-label-md text-xs font-bold">Private By Default</p>
            </div>
            <p className="font-body-md text-[11px] text-on-surface-variant leading-relaxed">
              Your read Scripture history, bookmark lists, personal prayers, and spiritual checklists are strictly private to your device and account.
            </p>
          </div>

          {/* Email Toggles */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-label-md text-xs font-bold text-on-surface">Devotional & Encouragement Emails</p>
                <p className="font-body-md text-[11px] text-on-surface-variant">Receive weekly Scripture insights & prayer letters</p>
              </div>
              <button
                type="button"
                onClick={() => setDevotionalReminders(!devotionalReminders)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  devotionalReminders ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    devotionalReminders ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-outline-variant/10 pt-2.5">
              <div>
                <p className="font-label-md text-xs font-bold text-on-surface">Product Updates & News</p>
                <p className="font-body-md text-[11px] text-on-surface-variant">Occasional announcements about new features in Devoted</p>
              </div>
              <button
                type="button"
                onClick={() => setMarketingEmails(!marketingEmails)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  marketingEmails ? 'bg-primary' : 'bg-surface-variant'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    marketingEmails ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 4. HELP & SUPPORT SECTION */}
        <section
          ref={(el) => { sectionRefs.current['Help & Support'] = el; }}
          className="scroll-mt-20 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-sm space-y-2.5"
        >
          <div className="flex items-center gap-2.5 text-primary border-b border-outline-variant/10 pb-2">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
              <Icon name="help" className="text-base" />
            </div>
            <div>
              <h2 className="font-headline-lg-mobile text-base font-bold text-on-surface">Help & Support</h2>
              <p className="font-body-md text-xs text-on-surface-variant">Get assistance or offer feedback</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <button className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/40 hover:bg-surface-container-low transition-colors text-left">
              <span className="font-label-md text-xs text-on-surface">Frequently Asked Questions</span>
              <Icon name="chevron_right" className="text-sm text-on-surface-variant" />
            </button>
            <button className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low/40 hover:bg-surface-container-low transition-colors text-left">
              <span className="font-label-md text-xs text-on-surface">Contact Support Team</span>
              <Icon name="chevron_right" className="text-sm text-on-surface-variant" />
            </button>
          </div>
        </section>
      </main>

      <BottomNav active="account" onNavigate={onNavigate} />
    </div>
  );
}