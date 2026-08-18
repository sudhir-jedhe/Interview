# Scenario: An unbounded API response cache growing without limit

**You have a client-side cache for API responses keyed by URL, used to avoid redundant network requests. After the app runs for a few hours in a long browsing session, memory usage is very high. How do you fix the cache without losing its benefit?**

**Approach:**
An unbounded cache is a memory leak by design — every unique URL ever fetched stays cached forever. Cap it with an eviction policy: a simple LRU (least-recently-used) cache with a max size bound is usually enough, optionally combined with a TTL so stale entries expire even if the size cap isn't hit.

```js
class LRUCache {
  #map = new Map();
  #maxSize;
  constructor(maxSize) { this.#maxSize = maxSize; }

  get(key) {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key);
    this.#map.delete(key);
    this.#map.set(key, value); // re-insert to mark as most-recently used
    return value;
  }

  set(key, value) {
    if (this.#map.has(key)) this.#map.delete(key);
    else if (this.#map.size >= this.#maxSize) {
      const oldestKey = this.#map.keys().next().value; // Map preserves insertion order
      this.#map.delete(oldestKey);
    }
    this.#map.set(key, value);
  }
}

const responseCache = new LRUCache(100); // never grows past 100 entries
```

See `../problems/02-memoization-with-lru-eviction.md` for this same idea applied specifically to a memoization cache, with a full runnable example.
