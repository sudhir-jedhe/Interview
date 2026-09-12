/**
 * Bind a component to the in-memory database.
 *
 * `useSyncExternalStore` is the right primitive here rather than an effect +
 * setState: it is tear-free under concurrent rendering, and the snapshot is
 * read during render, so a component can never paint one frame of stale data
 * after a mutation.
 *
 * `getSnapshot` returns the version NUMBER. Returning `db.vehicles` would
 * return a new array identity on some paths and loop forever; a number is
 * `Object.is`-stable by construction.
 */

import { useCallback, useSyncExternalStore } from 'react';
import { db } from '@/lib/mock/db';

export function useDbVersion(): number {
  return useSyncExternalStore(db.subscribe, db.getVersion, db.getVersion);
}

/**
 * Derive a value from the database, recomputed on every mutation.
 *
 * `select` is called during render, so it must be pure and cheap. Pass it
 * inline — the version number is what drives the update, not the identity of
 * this function.
 */
export function useDbSelector<T>(select: () => T): T {
  const version = useDbVersion();
  // The version is a real dependency: it is what makes this recompute.
  const compute = useCallback(select, [version]); // eslint-disable-line react-hooks/exhaustive-deps
  return compute();
}
