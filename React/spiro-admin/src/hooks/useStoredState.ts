/**
 * State backed by browser storage.
 *
 * One hook, two lifetimes — see `lib/storage.ts` for which to pick.
 *
 * The cross-tab behaviour differs on purpose:
 *
 *   local    listens for `storage` events, so changing the theme in one tab
 *            changes it in the others. That is what a preference should do.
 *   session  does NOT listen. sessionStorage is per-tab by definition, and
 *            the `storage` event does not fire for it anyway — two tabs are
 *            two workspaces, and a filter set in one must not move the other.
 */

import { useCallback, useEffect, useState } from 'react';
import { readStored, writeStored, type Scope } from '@/lib/storage';

export function useStoredState<T>(scope: Scope, key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStored(scope, key, initial));

  const set = useCallback(
    (next: T | ((current: T) => T)) => {
      setValue((current) => {
        const resolved = typeof next === 'function' ? (next as (c: T) => T)(current) : next;
        writeStored(scope, key, resolved);
        return resolved;
      });
    },
    [scope, key]
  );

  useEffect(() => {
    if (scope !== 'local') return;

    const onStorage = (event: StorageEvent) => {
      if (event.key !== `spiro:${key}` || event.newValue === null) return;
      try {
        setValue(JSON.parse(event.newValue) as T);
      } catch {
        /* ignore a malformed write from another tab */
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [scope, key]);

  return [value, set] as const;
}

/** A preference: survives the browser closing, shared across tabs. */
export function usePreference<T>(key: string, initial: T) {
  return useStoredState<T>('local', key, initial);
}

/** A position: dies with the tab, private to it. */
export function useSessionState<T>(key: string, initial: T) {
  return useStoredState<T>('session', key, initial);
}
