"use client";

import { useSyncExternalStore } from "react";

// A store that never changes: the server snapshot is `false`, the client's is
// `true`, so React flips the value exactly once as it hydrates.
const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Use this to gate UI that depends on browser-only state (localStorage,
 * `window`, the resolved theme) so server and client markup agree on the first
 * paint — without a setState-in-effect, which triggers a cascading render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}
