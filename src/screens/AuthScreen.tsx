import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Icon } from '@/components/Icon';

interface AuthScreenProps {
  onContinueAsGuest?: () => void;
}

export function AuthScreen({ onContinueAsGuest }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name.');
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-surface p-4 sm:p-6 flex flex-col items-center justify-start">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center -z-10">
        <div className="w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] bg-primary-container/30 rounded-full blur-[100px] opacity-70" />
      </div>

      <div className="w-full max-w-md flex flex-col items-center animate-fade-in my-auto py-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-headline-lg-mobile text-2xl sm:text-3xl font-bold text-on-surface mb-2">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant">
            {isSignUp
              ? 'Begin your daily walk with structured prayer and Scripture.'
              : 'Sign in to access your saved prayers, streaks, and readings.'}
          </p>
        </div>

        {errorMsg && (
          <div className="w-full mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-xs sm:text-sm text-center">
            {errorMsg}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-3 px-4 mb-4 bg-surface-container-lowest border border-outline/20 text-on-surface font-label-md text-sm font-semibold rounded-full shadow-sm hover:bg-surface-container-low transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Icon name="g_translate" className="text-lg" />
          <span>{isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
        </button>

        <div className="w-full flex items-center my-3">
          <div className="flex-1 h-px bg-outline/20" />
          <span className="px-3 text-xs text-on-surface-variant uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-outline/20" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-3">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Full Name
              </label>
              <input
                type="text"
                required={isSignUp}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full py-3 px-4 rounded-xl bg-surface-container-lowest border border-outline/20 text-on-surface text-sm focus:outline-none focus:border-secondary-fixed"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full py-3 px-4 rounded-xl bg-surface-container-lowest border border-outline/20 text-on-surface text-sm focus:outline-none focus:border-secondary-fixed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full py-3 px-4 rounded-xl bg-surface-container-lowest border border-outline/20 text-on-surface text-sm focus:outline-none focus:border-secondary-fixed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 mt-2 bg-secondary-fixed text-on-secondary-fixed font-label-md text-sm sm:text-base font-semibold rounded-full shadow-[0_8px_16px_rgba(245,225,174,0.3)] hover:shadow-[0_12px_20px_rgba(245,225,174,0.4)] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Mode & Guest Option */}
        <div className="w-full flex flex-col gap-2 mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
            }}
            className="text-sm sm:text-sm text-black hover:text-blue-800"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>

          {onContinueAsGuest && (
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="py-2 px-4 text-xs sm:text-sm text-on-surface-variant hover:text-on-surface transition-all duration-200 flex items-center justify-center gap-1 mx-auto"
            >
              Continue as Guest
              <Icon name="arrow_forward" className="text-sm" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}