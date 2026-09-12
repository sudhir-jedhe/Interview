import { useSyncExternalStore } from 'react';

/**
 * Read a media query reactively.
 *
 * useSyncExternalStore is the right primitive here: it is tear-free under
 * concurrent rendering, unlike a useState + useEffect pair, and it gives a
 * server snapshot for SSR.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  };

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const useIsMobile = () => useMediaQuery('(max-width: 900px)');
