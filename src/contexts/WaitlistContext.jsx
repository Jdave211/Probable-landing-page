import { createContext, useContext, useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';

const WaitlistContext = createContext(null);

export function WaitlistProvider({ children }) {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const value = useMemo(
    () => ({
      isWaitlistOpen,
      openWaitlist: () => {
        trackEvent('waitlist_open', { placement: 'global' });
        setIsWaitlistOpen(true);
      },
      closeWaitlist: () => setIsWaitlistOpen(false),
    }),
    [isWaitlistOpen]
  );

  return <WaitlistContext.Provider value={value}>{children}</WaitlistContext.Provider>;
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) throw new Error('useWaitlist must be used within a WaitlistProvider');
  return ctx;
}


