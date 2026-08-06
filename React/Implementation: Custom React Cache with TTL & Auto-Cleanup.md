Combining nested `Map` objects with Time-To-Live (TTL) mechanics is an excellent pattern for managing hierarchical, short-lived client-side state in React applications.

By structuring keys as `Map<UserId, CacheItem Map<Resource,>>`, you gain $O(1)$ read/write access while maintaining clean separation between user sessions and individual data entities.

Here is a breakdown of how to build, optimize, and safely manage this caching pattern in production React environments.

---

# Implementation: Custom React Cache with TTL & Auto-Cleanup

A production-grade implementation requires three critical features:

1. **Thread-Safe / Stale-Safe Reads:** Checking expiration before returning cached data.
2. **Periodic Garbage Collection:** Pruning expired entries to prevent memory leaks.
3. **React Hook Integration:** Providing an ergonomic interface (`useTTLCache`) with trigger updates.

```typescript
// types.ts
type CacheValue<T> = {
  value: T;
  expiry: number; // Timestamp in milliseconds
};

export class NestedTTLCache<UserId extends string | number, ResourceKey extends string, T> {
  // Nested Map structure: Map<UserId, Map<ResourceKey, CacheValue<T>>>
  private store = new Map<UserId, Map<ResourceKey, CacheValue<T>>>();
  private defaultTTL: number;
  private cleanupIntervalId?: ReturnType<typeof setInterval>;

  constructor(defaultTTLMs: number = 60000, cleanupIntervalMs: number = 30000) {
    this.defaultTTL = defaultTTLMs;
    this.startPeriodicCleanup(cleanupIntervalMs);
  }

  // 1. SET: Store resource under specific UserId with expiration
  set(userId: UserId, resource: ResourceKey, value: T, ttlMs?: number): void {
    if (!this.store.has(userId)) {
      this.store.set(userId, new Map());
    }

    const userMap = this.store.get(userId)!;
    const expiry = Date.now() + (ttlMs ?? this.defaultTTL);

    userMap.set(resource, { value, expiry });
  }

  // 2. GET: O(1) Lookup with lazy expiration check
  get(userId: UserId, resource: ResourceKey): T | null {
    const userMap = this.store.get(userId);
    if (!userMap) return null;

    const item = userMap.get(resource);
    if (!item) return null;

    // Lazy Eviction: Check if item has expired
    if (Date.now() > item.expiry) {
      userMap.delete(resource);
      if (userMap.size === 0) this.store.delete(userId);
      return null;
    }

    return item.value;
  }

  // 3. EVICT: Clear specific resource or entire user cache (e.g., on Logout)
  clearUser(userId: UserId): void {
    this.store.delete(userId);
  }

  // 4. GARBAGE COLLECTION: Prevent silent memory leaks
  private startPeriodicCleanup(intervalMs: number): void {
    this.cleanupIntervalId = setInterval(() => {
      const now = Date.now();
      for (const [userId, userMap] of this.store.entries()) {
        for (const [resource, item] of userMap.entries()) {
          if (now > item.expiry) {
            userMap.delete(resource);
          }
        }
        if (userMap.size === 0) {
          this.store.delete(userId);
        }
      }
    }, intervalMs);
  }

  destroy(): void {
    if (this.cleanupIntervalId) clearInterval(this.cleanupIntervalId);
    this.store.clear();
  }
}

```

---

# Integrating with React Components

When using in-memory caches outside React's render loop, updating the cache directly won't trigger component re-renders unless hooked into state management or subscriptions:

```tsx
// useTTLCache.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { NestedTTLCache } from './NestedTTLCache';

// Single global cache instance across app lifecycle
const globalCache = new NestedTTLCache<string, string, any>(60000); 

export function useCachedFetch<T>(userId: string, resourceKey: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(() => globalCache.get(userId, resourceKey));
  const [loading, setLoading] = useState<boolean>(!data);

  const loadData = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = globalCache.get(userId, resourceKey);
      if (cached !== null) {
        setData(cached);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const freshData = await fetcher();
      globalCache.set(userId, resourceKey, freshData);
      setData(freshData);
    } finally {
      setLoading(false);
    }
  }, [userId, resourceKey, fetcher]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, refresh: () => loadData(true) };
}

```

---

# Crucial Considerations for Production React Apps

While nested `Map` caching works well for simple temporary state, pay attention to these edge cases:

1. **User Logout & Security Isolation:**
When switching accounts or logging out, call `cache.clearUser(userId)` explicitly. Leaving previous user data in memory opens potential security risks in shared/public browser environments.
2. **Memory Bounding (LRU Eviction):**
A standard `Map` does not have an upper capacity limit. If thousands of resources are cached, relying purely on TTL can cause memory spikes. Consider adding a maximum capacity ceiling (e.g., max 100 entries per user map) using an **LRU (Least Recently Used)** strategy.
3. **When to use Standard Libraries (TanStack Query / SWR):**
For server state, standard tools like **TanStack Query (React Query)** or **SWR** handle nested keying (`['users', userId, 'resources', resourceId]`), background revalidation, retry logic, and garbage collection out of the box.

---

### How do you handle temporary caching in your projects?

* Do you use custom in-memory `Map`/`WeakMap` structures for ephemeral state?
* Or do you rely primarily on **TanStack Query / SWR** for server-state caching and **IndexedDB / Web Storage** for client persistence?
