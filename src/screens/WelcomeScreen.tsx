import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Icon } from '@/components/Icon';

export function WelcomeScreen() {
  const { user, refreshProfile } = useAuth();
  const [accepting, setAccepting] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    if (user) {
      await supabase
        .from('profiles')
        .update({ salvation_accepted: true, salvation_date: new Date().toISOString() })
        .eq('id', user.id);
      await refreshProfile();
    }
    setAccepting(false);
  };

  const handleSkip = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .update({ salvation_accepted: false })
        .eq('id', user.id);
      await refreshProfile();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface p-4 sm:p-6 flex flex-col items-center justify-start">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center -z-10">
        <div className="w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] bg-primary-container/30 rounded-full blur-[100px] opacity-70" />
      </div>

      {/* Main Container - my-auto allows vertical centering without clipping on small screens */}
      <div className="w-full max-w-lg flex flex-col items-center animate-fade-in my-auto py-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-headline-lg-mobile text-2xl sm:text-3xl font-bold text-on-surface mb-2">
            A New Beginning
          </h1>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
            Take a moment for this prayer of salvation.
          </p>
        </div>

        {/* Scripture Card */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-5 sm:p-7 mb-6 border-l-4 border-secondary-fixed shadow-[0_20px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-secondary-fixed/20 to-transparent rounded-bl-full opacity-50" />
          <p className="font-scripture-text text-sm sm:text-base text-on-surface mb-3 leading-relaxed">
            "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God
            raised him from the dead, you will be saved."
          </p>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-secondary-fixed-dim" />
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
              Romans 10:9
            </p>
          </div>
        </div>

        {/* Prayer Text */}
        <div className="w-full text-center px-2 mb-6">
          <p className="font-body-lg text-sm sm:text-base text-on-surface/80 leading-relaxed max-w-md mx-auto">
            Lord Jesus, for too long I've kept you out of my life. I know that I am a sinner and that I cannot save myself.
            Dear Lord Jesus, I believe You are the Son of God, I believe you died on the cross and shed your blood for my salvation. I believe You rose from the dead, ascended to heaven and You are coming back.
            Dear Jesus, I acknowledge I am a sinner in need of salvation. Forgive my sin. Cleanse me now with Your blood. Come into my heart and save my soul right now. I receive You now as my Savior and I am Yours forever.
            From this moment on, I belong to You and no longer to this world. I am born again. Amen!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mt-2">
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full py-3.5 px-6 bg-secondary-fixed text-on-secondary-fixed font-label-md text-sm sm:text-base font-semibold rounded-full shadow-[0_8px_16px_rgba(245,225,174,0.3)] hover:shadow-[0_12px_20px_rgba(245,225,174,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
          >
            I Accepted Jesus Today
          </button>
          <button
            onClick={handleSkip}
            className="w-full py-2.5 px-6 text-on-surface-variant font-label-sm text-xs sm:text-sm hover:text-on-surface active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-1"
          >
            Remind Me Later
            <Icon name="arrow_forward" className="text-sm" />
          </button>
        </div>

      </div>
    </div>
  );
}