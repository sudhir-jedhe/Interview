Building a custom React hook for API caching and request deduplication requires managing three distinct states:

1. **In-memory cache:** Storing fetched data across component remounts.
2. **In-flight requests:** Storing ongoing `Promise` instances to deduplicate simultaneous duplicate calls.
3. **Component state:** Subscribing individual components to the cached data, loading states, and potential errors.

Here is a complete, production-ready implementation from scratch.

---

### Implementation

```tsx
import { useState, useEffect, useRef } from 'react';

// 1. Global in-memory cache and active request tracking
const globalCache = new Map<string, { data: any; timestamp: number }>();
const inFlightRequests = new Map<string, Promise<any>>();

interface UseFetchOptions {
  cacheTimeMs?: number; // How long cache remains valid (default: 5 minutes)
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCachedFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchState<T> {
  const { cacheTimeMs = 5 * 60 * 1000 } = options;

  const [data, setData] = useState<T | null>(() => {
    const cached = globalCache.get(url);
    if (cached && Date.now() - cached.timestamp < cacheTimeMs) {
      return cached.data;
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(!data);
  const [error, setError] = useState<Error | null>(null);

  // Track component mount status to avoid state updates on unmounted components
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let isCancelled = false;

    const fetchData = async () => {
      // Step A: Check if valid cached data exists
      const cached = globalCache.get(url);
      if (cached && Date.now() - cached.timestamp < cacheTimeMs) {
        if (isMounted.current) {
          setData(cached.data);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let requestPromise: Promise<T>;

        // Step B: Deduplicate in-flight requests
        if (inFlightRequests.has(url)) {
          requestPromise = inFlightRequests.get(url)!;
        } else {
          // If no active request exists, create one and store it globally
          requestPromise = fetch(url)
            .then(async (res) => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            })
            .finally(() => {
              // Clean up in-flight promise once completed or failed
              inFlightRequests.delete(url);
            });

          inFlightRequests.set(url, requestPromise);
        }

        const result = await requestPromise;

        // Step C: Update global cache
        globalCache.set(url, { data: result, timestamp: Date.now() });

        if (!isCancelled && isMounted.current) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled && isMounted.current) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
      isMounted.current = false;
    };
  }, [url, cacheTimeMs]);

  // Manual refetch bypasses the cache
  const refetch = () => {
    globalCache.delete(url);
    inFlightRequests.delete(url);
    setLoading(true);
    
    // Trigger re-render effect execution by updating state directly
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        globalCache.set(url, { data: result, timestamp: Date.now() });
        if (isMounted.current) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error(err));
          setLoading(false);
        }
      });
  };

  return { data, loading, error, refetch };
}

```

---

### How It Works

1. **Request Deduplication:** If five components render at the exact same moment calling `useCachedFetch('/api/user')`, only **one HTTP request** is made. The first caller populates `inFlightRequests.set(url, promise)`, and the remaining four components attach directly to that existing `Promise`.
2. **In-Memory Caching:** Once the `Promise` resolves, the result goes into `globalCache` along with a timestamp. Any subsequent calls (e.g., navigating away and coming back) hit the cache immediately without making a network request.
3. **Stale Cleanup:** If `Date.now() - cached.timestamp` exceeds `cacheTimeMs`, the hook ignores the cache and fetches fresh data.
4. **Race Condition Protection:** The `isCancelled` flag inside `useEffect` cleanup prevents setting state on unmounted components if the URL changes rapidly or the component unmounts mid-flight.

---

### Example Usage

```tsx
function UserProfile({ userId }: { userId: string }) {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const { data, loading, error, refetch } = useCachedFetch(url, { cacheTimeMs: 60000 });

  if (loading) return <p>Loading user...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h3>{data.name}</h3>
      <p>Email: {data.email}</p>
      <button onClick={refetch}>Refresh Data</button>
    </div>
  );
}

```

Show how to add stale-while-revalidate functionality and explicit cache invalidation methods to this custom hook.

Adding **stale-while-revalidate (SWR)** and explicit **cache invalidation** improves UX: components render stale cached data immediately while fetching fresh data in the background.

---

### Implementation with SWR & Invalidation

Below is the complete updated hook featuring SWR mechanics, explicit cache invalidation, and subscription event listeners to keep all mounted components synchronized when cache updates occur.

```tsx
import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface UseFetchOptions {
  cacheTimeMs?: number; // Duration before data is considered stale (default: 5 mins)
  revalidateOnFocus?: boolean; // Revalidate when window recovers focus
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  isValidating: boolean;
  error: Error | null;
  mutate: (newData?: T | ((prev: T | null) => T), shouldRevalidate?: boolean) => void;
  revalidate: () => Promise<T | null>;
}

// Global in-memory cache and state tracking
const globalCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();
const listeners = new Map<string, Set<() => void>>();

// Helper to notify all component instances subscribed to a specific key
const notifyListeners = (key: string) => {
  listeners.get(key)?.forEach((callback) => callback());
};

/**
 * Global cache invalidation helpers
 */
export const cacheManager = {
  invalidateKey: (key: string) => {
    globalCache.delete(key);
    notifyListeners(key);
  },
  invalidateMatching: (pattern: RegExp) => {
    for (const key of globalCache.keys()) {
      if (pattern.test(key)) {
        globalCache.delete(key);
        notifyListeners(key);
      }
    }
  },
  clear: () => {
    globalCache.clear();
    listeners.forEach((_, key) => notifyListeners(key));
  },
};

export function useCachedFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchState<T> {
  const { cacheTimeMs = 5 * 60 * 1000, revalidateOnFocus = false } = options;

  const getCachedEntry = useCallback((): CacheEntry<T> | undefined => {
    return globalCache.get(url);
  }, [url]);

  const cachedEntry = getCachedEntry();

  // Local state initialized with cached data if available
  const [data, setData] = useState<T | null>(() => cachedEntry?.data ?? null);
  const [loading, setLoading] = useState<boolean>(!cachedEntry);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const isMounted = useRef(true);

  // Sync state across multiple component instances using the same URL key
  useEffect(() => {
    if (!listeners.has(url)) {
      listeners.set(url, new Set());
    }
    const urlListeners = listeners.get(url)!;

    const handleCacheChange = () => {
      const updated = globalCache.get(url);
      if (isMounted.current) {
        setData(updated ? updated.data : null);
      }
    };

    urlListeners.add(handleCacheChange);
    return () => {
      urlListeners.delete(handleCacheChange);
      if (urlListeners.size === 0) {
        listeners.delete(url);
      }
    };
  }, [url]);

  // Core fetch & revalidation routine
  const performFetch = useCallback(
    async (isBackground: boolean = false): Promise<T | null> => {
      if (isBackground) {
        setIsValidating(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        let requestPromise: Promise<T>;

        // Deduplicate in-flight requests
        if (inFlightRequests.has(url)) {
          requestPromise = inFlightRequests.get(url)!;
        } else {
          requestPromise = fetch(url)
            .then(async (res) => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            })
            .finally(() => {
              inFlightRequests.delete(url);
            });

          inFlightRequests.set(url, requestPromise);
        }

        const result = await requestPromise;

        // Update global cache & broadcast update
        globalCache.set(url, { data: result, timestamp: Date.now() });
        notifyListeners(url);

        if (isMounted.current) {
          setError(null);
        }
        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An unknown error occurred');
        if (isMounted.current) {
          setError(errorObj);
        }
        return null;
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setIsValidating(false);
        }
      }
    },
    [url]
  );

  // Synchronize fetch logic with SWR policy
  useEffect(() => {
    isMounted.current = true;
    const currentEntry = getCachedEntry();
    const isStale = !currentEntry || Date.now() - currentEntry.timestamp > cacheTimeMs;

    if (currentEntry) {
      // SWR: Instantly show cached data
      setData(currentEntry.data);
      setLoading(false);

      // Revalidate in background if stale
      if (isStale) {
        performFetch(true);
      }
    } else {
      // Hard load if no cache exists
      performFetch(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [url, cacheTimeMs, getCachedEntry, performFetch]);

  // Revalidate on window focus handler
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const onFocus = () => {
      if (document.visibilityState === 'visible') {
        performFetch(true);
      }
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', onFocus);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onFocus);
    };
  }, [revalidateOnFocus, performFetch]);

  // Manual revalidation bypasses cache check
  const revalidate = useCallback(() => {
    return performFetch(true);
  }, [performFetch]);

  // Local/Global cache mutation helper
  const mutate = useCallback(
    (newData?: T | ((prev: T | null) => T), shouldRevalidate = true) => {
      if (typeof newData !== 'undefined') {
        const updatedData =
          typeof newData === 'function'
            ? (newData as (prev: T | null) => T)(globalCache.get(url)?.data ?? null)
            : newData;

        globalCache.set(url, { data: updatedData, timestamp: Date.now() });
        notifyListeners(url);
      }

      if (shouldRevalidate) {
        performFetch(true);
      }
    },
    [url, performFetch]
  );

  return {
    data,
    loading,
    isValidating,
    error,
    mutate,
    revalidate,
  };
}

```

---

### Key Architectural Additions

1. **Stale-While-Revalidate Flow:**

* Initial render returns cached data instantly (`loading` remains `false`).
* If the cached data's age exceeds `cacheTimeMs`, `isValidating` becomes `true` while fresh data is fetched in the background.
* Component state updates seamlessly once the network request resolves without showing a full loading spinner.

1. **Cross-Component Syncing (`listeners` subscriber pool):**

* When one component mutates or revalidates a URL, all other mounted components using `useCachedFetch(url)` update automatically.

1. **Optimistic Mutations (`mutate`):**

* Allows updating the local cache immediately before a server response completes.

1. **Global Invalidation (`cacheManager`):**

* Exposes methods (`cacheManager.invalidateKey`, `cacheManager.invalidateMatching`, `cacheManager.clear`) to invalidate items outside of React components (e.g., inside an Axios interceptor or API submit handler).

---

### Usage Example

```tsx
import { useCachedFetch, cacheManager } from './useCachedFetch';

function UserProfile({ userId }: { userId: string }) {
  const url = `/api/users/${userId}`;
  const { data, loading, isValidating, error, mutate, revalidate } = useCachedFetch(url, {
    cacheTimeMs: 30000, // 30s before considered stale
    revalidateOnFocus: true,
  });

  if (loading) return <div>Loading initial user...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleOptimisticUpdate = () => {
    // Optimistically update name, then trigger revalidation
    mutate((prev) => (prev ? { ...prev, name: 'New Name' } : null), true);
  };

  return (
    <div>
      <h3>
        {data?.name} {isValidating && <span>(Updating...)</span>}
      </h3>
      <p>Email: {data?.email}</p>

      <button onClick={handleOptimisticUpdate}>Optimistic Rename</button>
      <button onClick={() => revalidate()}>Force Revalidate</button>
      <button onClick={() => cacheManager.invalidateKey(url)}>Invalidate Cache</button>
    </div>
  );
}

// Invalidate all user queries after a POST/PUT request elsewhere in your app
async function updateUser(userId: string, payload: any) {
  await fetch(`/api/users/${userId}`, { method: 'PUT', body: JSON.stringify(payload) });
  // Invalidates all user endpoints using regex
  cacheManager.invalidateMatching(/\/api\/users/);
}

```

Show how to persist the global cache to LocalStorage or IndexedDB so cached API data survives page reloads.

To make the cache survive page reloads, you can layer **IndexedDB** (or `localStorage`) underneath your in-memory `globalCache`.

IndexedDB is the best choice for web caching because it is **asynchronous** (doesn't block the main render thread) and handles **large data payloads** without hitting the strict 5MB synchronous storage limit of `localStorage`.

---

### Implementation Architecture

The architecture uses a **two-tier cache**:

1. **Tier 1 (In-Memory `Map`):** Synchronous, instant access on initial component render to avoid layout shifts.
2. **Tier 2 (IndexedDB Store):** Asynchronous persistent fallback. Loaded into Tier 1 during initialization and updated asynchronously whenever network requests succeed or items are mutated.

```tsx
import { useState, useEffect, useRef, useCallback } from 'react';

// ==========================================
// 1. IndexedDB Lightweight Storage Wrapper
// ==========================================
const DB_NAME = 'api_cache_db';
const STORE_NAME = 'http_responses';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // SSR guard
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const idbStorage = {
  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: CacheEntry<T>): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
    } catch (e) {
      console.warn('Failed to write to IndexedDB cache', e);
    }
  },

  async delete(key: string): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
    } catch {}
  },

  async clear(): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
    } catch {}
  },
};

// ==========================================
// 2. Custom Hook with Persistent SWR
// ==========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface UseFetchOptions {
  cacheTimeMs?: number; // How long cache is considered fresh (default: 5 min)
  revalidateOnFocus?: boolean;
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  isValidating: boolean;
  error: Error | null;
  mutate: (newData?: T | ((prev: T | null) => T), shouldRevalidate?: boolean) => void;
  revalidate: () => Promise<T | null>;
}

// In-Memory Tier 1 Cache & Pub/Sub
const globalMemoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();
const listeners = new Map<string, Set<() => void>>();

const notifyListeners = (key: string) => {
  listeners.get(key)?.forEach((cb) => cb());
};

// Global Cache Invalidation Manager
export const cacheManager = {
  invalidateKey: async (key: string) => {
    globalMemoryCache.delete(key);
    await idbStorage.delete(key);
    notifyListeners(key);
  },
  clear: async () => {
    globalMemoryCache.clear();
    await idbStorage.clear();
    listeners.forEach((_, key) => notifyListeners(key));
  },
};

export function usePersistedCachedFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchState<T> {
  const { cacheTimeMs = 5 * 60 * 1000, revalidateOnFocus = false } = options;

  // Initialize state synchronously from Memory (Tier 1)
  const memoryEntry = globalMemoryCache.get(url);
  const [data, setData] = useState<T | null>(() => memoryEntry?.data ?? null);
  const [loading, setLoading] = useState<boolean>(!memoryEntry);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const isMounted = useRef(true);

  // Synchronize state across multiple hook instances
  useEffect(() => {
    if (!listeners.has(url)) listeners.set(url, new Set());
    const urlListeners = listeners.get(url)!;

    const handleCacheChange = () => {
      const updated = globalMemoryCache.get(url);
      if (isMounted.current) {
        setData(updated ? updated.data : null);
      }
    };

    urlListeners.add(handleCacheChange);
    return () => {
      urlListeners.delete(handleCacheChange);
      if (urlListeners.size === 0) listeners.delete(url);
    };
  }, [url]);

  // Core network fetch routine
  const performFetch = useCallback(
    async (isBackground: boolean = false): Promise<T | null> => {
      if (isBackground) setIsValidating(true);
      else setLoading(true);

      setError(null);

      try {
        let requestPromise: Promise<T>;

        if (inFlightRequests.has(url)) {
          requestPromise = inFlightRequests.get(url)!;
        } else {
          requestPromise = fetch(url)
            .then(async (res) => {
              if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
              return res.json();
            })
            .finally(() => inFlightRequests.delete(url));

          inFlightRequests.set(url, requestPromise);
        }

        const result = await requestPromise;
        const entry: CacheEntry<T> = { data: result, timestamp: Date.now() };

        // Save to Tier 1 (Memory) + Tier 2 (IndexedDB)
        globalMemoryCache.set(url, entry);
        await idbStorage.set(url, entry);
        notifyListeners(url);

        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Unknown Error');
        if (isMounted.current) setError(errorObj);
        return null;
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setIsValidating(false);
        }
      }
    },
    [url]
  );

  // Initialize and check persistent storage
  useEffect(() => {
    isMounted.current = true;

    const initializeData = async () => {
      let currentEntry = globalMemoryCache.get(url);

      // If Tier 1 (Memory) is empty, check Tier 2 (IndexedDB)
      if (!currentEntry) {
        const persistedEntry = await idbStorage.get<T>(url);
        if (persistedEntry) {
          currentEntry = persistedEntry;
          globalMemoryCache.set(url, persistedEntry); // Hydrate Memory
          if (isMounted.current) {
            setData(persistedEntry.data);
            setLoading(false);
          }
        }
      }

      const isStale = !currentEntry || Date.now() - currentEntry.timestamp > cacheTimeMs;

      if (currentEntry) {
        if (isStale) {
          performFetch(true); // Revalidate in background
        }
      } else {
        performFetch(false); // Initial hard load
      }
    };

    initializeData();

    return () => {
      isMounted.current = false;
    };
  }, [url, cacheTimeMs, performFetch]);

  // Window Focus Handler
  useEffect(() => {
    if (!revalidateOnFocus) return;
    const onFocus = () => {
      if (document.visibilityState === 'visible') performFetch(true);
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onFocus);
    };
  }, [revalidateOnFocus, performFetch]);

  // Mutations (Local State + Tier 1 + Tier 2 Sync)
  const mutate = useCallback(
    async (newData?: T | ((prev: T | null) => T), shouldRevalidate = true) => {
      if (typeof newData !== 'undefined') {
        const currentData = globalMemoryCache.get(url)?.data ?? null;
        const updatedData =
          typeof newData === 'function'
            ? (newData as (prev: T | null) => T)(currentData)
            : newData;

        const entry: CacheEntry<T> = { data: updatedData, timestamp: Date.now() };

        globalMemoryCache.set(url, entry);
        await idbStorage.set(url, entry);
        notifyListeners(url);
      }

      if (shouldRevalidate) {
        performFetch(true);
      }
    },
    [url, performFetch]
  );

  const revalidate = useCallback(() => performFetch(true), [performFetch]);

  return { data, loading, isValidating, error, mutate, revalidate };
}

```

---

### Key Workflow Highlights

1. **Zero-Latency App Startup (Hydration):**

* On full page refresh, Tier 1 memory is empty.
* The hook queries IndexedDB asynchronously. If cached data exists from a previous session, it populates `data` immediately without waiting for a server round-trip.

1. **Asynchronous Non-Blocking Writes:**

* Writing to IndexedDB happens asynchronously behind the scenes, ensuring API responses don't cause jank on the UI thread.

1. **Automatic Tier-1 Memory Hydration:**

* Once retrieved from IndexedDB, entries are saved to `globalMemoryCache`. Subsequent component mounts access it synchronously without querying IndexedDB again.

---

### Usage Example

```tsx
function OfflineNewsFeed() {
  const { data, loading, isValidating, mutate } = usePersistedCachedFetch('/api/news', {
    cacheTimeMs: 10 * 60 * 1000, // 10 minutes
    revalidateOnFocus: true,
  });

  if (loading) return <div>Loading feed from persistent storage...</div>;

  return (
    <div>
      {isValidating && <p className="badge">Updating feed in background...</p>}
      
      <ul>
        {data?.map((article: any) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>

      <button onClick={() => mutate()}>Refresh Feed</button>
    </div>
  );
}

```

Update the custom React hook to support automatic retry logic with exponential backoff on network failures.

Adding **exponential backoff retry logic** ensures that temporary network glitches or server rate-limits ($5\text{xx}$ or $429$ status codes) don't immediately surface as errors to your components.

---

### Implementation with Exponential Backoff Retries

Below is the updated hook. It introduces configurable retry parameters (`retryCount`, `retryDelayMs`, `maxRetryDelayMs`) and a helper that implements exponential backoff with **jitter** to prevent thundering herd problems when many client requests fail simultaneously.

```tsx
import { useState, useEffect, useRef, useCallback } from 'react';

// ==========================================
// 1. IndexedDB Lightweight Storage Wrapper
// ==========================================
const DB_NAME = 'api_cache_db';
const STORE_NAME = 'http_responses';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const idbStorage = {
  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: CacheEntry<T>): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
    } catch (e) {
      console.warn('Failed to write to IndexedDB cache', e);
    }
  },

  async delete(key: string): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
    } catch {}
  },

  async clear(): Promise<void> {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
    } catch {}
  },
};

// ==========================================
// 2. Exponential Backoff & Retry Helpers
// ==========================================

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculates exponential backoff delay with randomized jitter:
 * delay = min(maxDelay, baseDelay * 2^attempt) + jitter
 */
function getBackoffDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponential = baseDelay * Math.pow(2, attempt);
  const capped = Math.min(maxDelay, exponential);
  // Add random jitter (±20%) to prevent simultaneous retries
  const jitter = capped * 0.2 * Math.random();
  return Math.floor(capped + jitter);
}

// ==========================================
// 3. Custom Hook with Persisted SWR + Retries
// ==========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface UseFetchOptions {
  cacheTimeMs?: number; // Duration before data is considered stale (default: 5 mins)
  revalidateOnFocus?: boolean;
  retryCount?: number; // Number of retry attempts on failure (default: 3)
  retryDelayMs?: number; // Initial base retry delay in ms (default: 1000)
  maxRetryDelayMs?: number; // Maximum retry delay cap in ms (default: 30000)
  shouldRetry?: (error: Error) => boolean; // Custom predicate to decide whether to retry
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  isValidating: boolean;
  error: Error | null;
  retryAttempt: number; // Current active retry attempt count (0 if not retrying)
  mutate: (newData?: T | ((prev: T | null) => T), shouldRevalidate?: boolean) => void;
  revalidate: () => Promise<T | null>;
}

// In-Memory Tier 1 Cache & Subscriptions
const globalMemoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();
const listeners = new Map<string, Set<() => void>>();

const notifyListeners = (key: string) => {
  listeners.get(key)?.forEach((cb) => cb());
};

export const cacheManager = {
  invalidateKey: async (key: string) => {
    globalMemoryCache.delete(key);
    await idbStorage.delete(key);
    notifyListeners(key);
  },
  clear: async () => {
    globalMemoryCache.clear();
    await idbStorage.clear();
    listeners.forEach((_, key) => notifyListeners(key));
  },
};

export function usePersistedCachedFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchState<T> {
  const {
    cacheTimeMs = 5 * 60 * 1000,
    revalidateOnFocus = false,
    retryCount = 3,
    retryDelayMs = 1000,
    maxRetryDelayMs = 30000,
    shouldRetry = (err) => !err.message.startsWith('HTTP 4'), // Don't retry 4xx client errors by default
  } = options;

  const memoryEntry = globalMemoryCache.get(url);
  const [data, setData] = useState<T | null>(() => memoryEntry?.data ?? null);
  const [loading, setLoading] = useState<boolean>(!memoryEntry);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryAttempt, setRetryAttempt] = useState<number>(0);

  const isMounted = useRef(true);

  // Sync state across subscribers
  useEffect(() => {
    if (!listeners.has(url)) listeners.set(url, new Set());
    const urlListeners = listeners.get(url)!;

    const handleCacheChange = () => {
      const updated = globalMemoryCache.get(url);
      if (isMounted.current) {
        setData(updated ? updated.data : null);
      }
    };

    urlListeners.add(handleCacheChange);
    return () => {
      urlListeners.delete(handleCacheChange);
      if (urlListeners.size === 0) listeners.delete(url);
    };
  }, [url]);

  /**
   * Helper that executes the fetch call with automatic retries and exponential backoff
   */
  const executeFetchWithRetry = useCallback(
    async (): Promise<T> => {
      let attempt = 0;

      while (true) {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return await res.json();
        } catch (err) {
          const errorObj = err instanceof Error ? err : new Error(String(err));

          // Check if retries remain and error passes retry predicate
          if (attempt < retryCount && shouldRetry(errorObj)) {
            attempt++;
            if (isMounted.current) {
              setRetryAttempt(attempt);
            }

            const backoffMs = getBackoffDelay(attempt - 1, retryDelayMs, maxRetryDelayMs);
            await sleep(backoffMs);

            if (!isMounted.current) {
              throw new Error('Component unmounted during retry backoff');
            }
          } else {
            throw errorObj; // Exhausted retries or non-retryable error
          }
        }
      }
    },
    [url, retryCount, retryDelayMs, maxRetryDelayMs, shouldRetry]
  );

  // Core fetch routine managing deduplication and state updates
  const performFetch = useCallback(
    async (isBackground: boolean = false): Promise<T | null> => {
      if (isBackground) setIsValidating(true);
      else setLoading(true);

      setError(null);
      setRetryAttempt(0);

      try {
        let requestPromise: Promise<T>;

        if (inFlightRequests.has(url)) {
          requestPromise = inFlightRequests.get(url)!;
        } else {
          requestPromise = executeFetchWithRetry().finally(() => {
            inFlightRequests.delete(url);
          });
          inFlightRequests.set(url, requestPromise);
        }

        const result = await requestPromise;
        const entry: CacheEntry<T> = { data: result, timestamp: Date.now() };

        globalMemoryCache.set(url, entry);
        await idbStorage.set(url, entry);
        notifyListeners(url);

        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Unknown Error');
        if (isMounted.current) {
          setError(errorObj);
        }
        return null;
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setIsValidating(false);
          setRetryAttempt(0);
        }
      }
    },
    [url, executeFetchWithRetry]
  );

  // Initialization & hydration from storage
  useEffect(() => {
    isMounted.current = true;

    const initializeData = async () => {
      let currentEntry = globalMemoryCache.get(url);

      if (!currentEntry) {
        const persistedEntry = await idbStorage.get<T>(url);
        if (persistedEntry) {
          currentEntry = persistedEntry;
          globalMemoryCache.set(url, persistedEntry);
          if (isMounted.current) {
            setData(persistedEntry.data);
            setLoading(false);
          }
        }
      }

      const isStale = !currentEntry || Date.now() - currentEntry.timestamp > cacheTimeMs;

      if (currentEntry) {
        if (isStale) {
          performFetch(true);
        }
      } else {
        performFetch(false);
      }
    };

    initializeData();

    return () => {
      isMounted.current = false;
    };
  }, [url, cacheTimeMs, performFetch]);

  // Focus revalidation
  useEffect(() => {
    if (!revalidateOnFocus) return;
    const onFocus = () => {
      if (document.visibilityState === 'visible') performFetch(true);
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onFocus);
    };
  }, [revalidateOnFocus, performFetch]);

  // Mutations
  const mutate = useCallback(
    async (newData?: T | ((prev: T | null) => T), shouldRevalidate = true) => {
      if (typeof newData !== 'undefined') {
        const currentData = globalMemoryCache.get(url)?.data ?? null;
        const updatedData =
          typeof newData === 'function'
            ? (newData as (prev: T | null) => T)(currentData)
            : newData;

        const entry: CacheEntry<T> = { data: updatedData, timestamp: Date.now() };

        globalMemoryCache.set(url, entry);
        await idbStorage.set(url, entry);
        notifyListeners(url);
      }

      if (shouldRevalidate) {
        performFetch(true);
      }
    },
    [url, performFetch]
  );

  const revalidate = useCallback(() => performFetch(true), [performFetch]);

  return { data, loading, isValidating, error, retryAttempt, mutate, revalidate };
}

```

---

### How the Retry Backoff Calculation Works

1. **Exponential Base:** For `retryDelayMs = 1000`, successive attempts delay as follows:

* Attempt 1: $1000\text{ms} \times 2^0 = 1000\text{ms}$ ($1\text{s}$)
* Attempt 2: $1000\text{ms} \times 2^1 = 2000\text{ms}$ ($2\text{s}$)
* Attempt 3: $1000\text{ms} \times 2^2 = 4000\text{ms}$ ($4\text{s}$)

1. **Jitter:** Up to +20% randomized time is added to prevent client requests from aligning during server outages.
2. **Smart Rejection (`shouldRetry`):** By default, errors with status $4\text{xx}$ (e.g., $401\text{ Unauthorized}$, $404\text{ Not Found}$) fail immediately without retrying, while network drops or $5\text{xx}$ server errors trigger retries.
3. **Active Feedback (`retryAttempt`):** The hook exposes `retryAttempt` so the UI can communicate active retries to the end user.

---

### Usage Example

```tsx
function ResilientDataViewer() {
  const { data, loading, error, retryAttempt, isValidating, revalidate } =
    usePersistedCachedFetch('/api/unstable-endpoint', {
      retryCount: 4,
      retryDelayMs: 1000,
      maxRetryDelayMs: 16000,
      revalidateOnFocus: true,
    });

  if (loading) {
    return (
      <div>
        <p>Loading initial data...</p>
        {retryAttempt > 0 && <p>Connection weak, retry attempt #{retryAttempt}...</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Failed to load data: {error.message}</p>
        <button onClick={() => revalidate()}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      {retryAttempt > 0 && (
        <p style={{ color: 'orange' }}>Revalidating... Retry attempt #{retryAttempt}</p>
      )}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

```
