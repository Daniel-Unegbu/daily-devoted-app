import { useEffect } from 'react';

interface ScrollToTopProps {
  screen: string;
  disabled?: boolean;
}

export function ScrollToTop({ screen, disabled = false }: ScrollToTopProps) {
  useEffect(() => {
    if (!disabled) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [screen, disabled]);

  return null;
}
