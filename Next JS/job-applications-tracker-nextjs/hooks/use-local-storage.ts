"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Parsed-value cache keyed by storage key. `useSyncExternalStore` requires
 * `getSnapshot` to return a referentially stable value between changes —
 * re-parsing the JSON on every render would return a fresh object each time and
 * spin the component forever.
 */
const cache = new Map<string, { raw: string | null; parsed: unknown }>();

function readSnapshot<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key);
  const cached = cache.get(key);

  if (cached && cached.raw === raw) return cached.parsed as T;

  let parsed: unknown = fallback;
  if (raw !== null) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = fallback; // Corrupt entry — fall back rather than throw.
    }
  }

  cache.set(key, { raw, parsed });
  return parsed as T;
}

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // `storage` fires for other tabs natively; same-tab writes dispatch it too.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function notify() {
  for (const listener of listeners) listener();
}

/**
 * localStorage-backed state that is SSR-safe: the server snapshot is always
 * `initialValue`, and the stored value is adopted on hydration without a
 * setState-in-effect round trip.
 *
 * Returns `[value, setValue, hydrated]`. `hydrated` is false during SSR and the
 * first client render, so callers can avoid rendering storage-dependent UI
 * until the real value is known.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const value = useSyncExternalStore(
    subscribe,
    () => readSnapshot(key, initialValue),
    () => initialValue,
  );

  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const update = useCallback(
    (next: T | ((current: T) => T)) => {
      const current = readSnapshot(key, initialValue);
      const resolved =
        typeof next === "function" ? (next as (c: T) => T)(current) : next;

      try {
        const serialised = JSON.stringify(resolved);
        window.localStorage.setItem(key, serialised);
        cache.set(key, { raw: serialised, parsed: resolved });
      } catch {
        // Quota exceeded or private mode — keep the value in the cache so the
        // UI still reflects the change for this session.
        cache.set(key, { raw: cache.get(key)?.raw ?? null, parsed: resolved });
      }

      notify();
    },
    [key, initialValue],
  );

  return [value, update, hydrated] as const;
}
