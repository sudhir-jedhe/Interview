/**
 * Browser storage, with one rule that decides where a value goes.
 *
 *   localStorage    a PREFERENCE. It is about the person and it should still
 *                   be true tomorrow, on this machine, in every tab.
 *                   Theme, language, which columns you like, alarm
 *                   thresholds, whether the rail is pinned open.
 *
 *   sessionStorage  a POSITION. It is about what you are doing right now and
 *                   it should die with the tab — and, importantly, it must
 *                   NOT leak into another tab. Which country you are
 *                   filtering by, what you typed in a search box, which page
 *                   of a table you are on, which tab of a detail screen.
 *
 * The distinction is not pedantry. Put a search term in localStorage and a
 * user opens the app tomorrow to a table mysteriously filtered to "EC28".
 * Put the theme in sessionStorage and every new tab flashes white. Both are
 * the same bug — state stored at the wrong lifetime — and this file is where
 * the choice is made once rather than at each call site.
 *
 * Everything is wrapped: Safari's private mode throws on `setItem` rather
 * than failing quietly, and a corrupt value must never take the app down.
 */

export type Scope = 'local' | 'session';

const PREFIX = 'spiro:';

function backing(scope: Scope): Storage | null {
  try {
    return scope === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    // Accessing the property itself throws when storage is disabled.
    return null;
  }
}

export function readStored<T>(scope: Scope, key: string, fallback: T): T {
  try {
    const raw = backing(scope)?.getItem(PREFIX + key);
    return raw === null || raw === undefined ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored(scope: Scope, key: string, value: unknown): void {
  try {
    backing(scope)?.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota exceeded, or private mode — keep the in-memory value */
  }
}

export function removeStored(scope: Scope, key: string): void {
  try {
    backing(scope)?.removeItem(PREFIX + key);
  } catch {
    /* nothing to do */
  }
}

/** Drop everything this app owns from one scope, leaving other apps alone. */
export function clearScope(scope: Scope): void {
  const store = backing(scope);
  if (!store) return;

  try {
    // Collect first: removing while iterating by index reindexes the store
    // and silently skips every other key.
    const keys: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i);
      if (key?.startsWith(PREFIX)) keys.push(key);
    }
    for (const key of keys) store.removeItem(key);
  } catch {
    /* nothing to do */
  }
}

/** What the app has stored, for the settings screen and for support. */
export function inspectStorage(): { scope: Scope; key: string; bytes: number }[] {
  const rows: { scope: Scope; key: string; bytes: number }[] = [];

  for (const scope of ['local', 'session'] as Scope[]) {
    const store = backing(scope);
    if (!store) continue;

    try {
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (!key?.startsWith(PREFIX)) continue;
        rows.push({
          scope,
          key: key.slice(PREFIX.length),
          bytes: new Blob([store.getItem(key) ?? '']).size,
        });
      }
    } catch {
      /* skip this scope */
    }
  }

  return rows.sort((a, b) => a.scope.localeCompare(b.scope) || a.key.localeCompare(b.key));
}
