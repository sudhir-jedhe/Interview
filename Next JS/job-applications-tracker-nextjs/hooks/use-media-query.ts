"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query. Returns `false` on the server and during the first
 * client render, then the real value — subscribing through
 * `useSyncExternalStore` rather than a setState-in-effect.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
