A Stale-While-Revalidate (SWR) cache serves cached data immediately (even if stale) while asynchronously fetching fresh data in the background. Pairing this with **request coalescing** guarantees that multiple concurrent requests for the same stale/missing resource share a single in-flight network call instead of causing a cache stampede.

---

### Key State Transitions

* **Fresh Cache Hit:** Returns cached data immediately. No network request.
* **Stale Cache Hit:** Returns stale cached data immediately, triggers an in-flight coalesced background fetch, and updates the cache once complete.
* **Cache Miss:** Waits on a coalesced network fetch, updates the cache, and returns the fresh value.

---

### Implementation

```javascript
class SWRCache {
  /**
   * @param {Object} config
   * @param {number} config.ttl - Time-to-live in ms for data to be considered strictly fresh.
   * @param {number} config.staleTtl - Additional time window in ms where stale data can be served.
   * @param {Function} [config.onRevalidated] - Optional hook called when background revalidation succeeds.
   */
  constructor({ ttl = 5000, staleTtl = 30000, onRevalidated = null } = {}) {
    this.ttl = ttl;
    this.staleTtl = staleTtl;
    this.onRevalidated = onRevalidated;

    // Storage for resolved cache entries: key -> { data, timestamp }
    this.cache = new Map();

    // In-flight deduplication map: key -> Promise
    this.inFlight = new Map();
  }

  /**
   * Coalesced background/foreground fetcher
   */
  _fetchCoalesced(key, fetcher) {
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }

    const promise = Promise.resolve()
      .then(() => fetcher(key))
      .then((data) => {
        this.cache.set(key, { data, timestamp: Date.now() });
        return data;
      })
      .finally(() => {
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, promise);
    return promise;
  }

  /**
   * Main accessor method
   * @param {string} key 
   * @param {Function} fetcher - Async data producer: (key) => Promise<T>
   * @returns {Promise<T>}
   */
  async get(key, fetcher) {
    const entry = this.cache.get(key);
    const now = Date.now();

    // Case 1: Cache Miss or Expired beyond allowable staleness
    if (!entry || now - entry.timestamp > this.ttl + this.staleTtl) {
      return this._fetchCoalesced(key, fetcher);
    }

    const age = now - entry.timestamp;

    // Case 2: Fresh Cache Hit
    if (age <= this.ttl) {
      return entry.data;
    }

    // Case 3: Stale Hit (age > ttl, but <= ttl + staleTtl)
    // Fire a background coalesced revalidation without awaiting it here
    this._fetchCoalesced(key, fetcher)
      .then((newData) => {
        if (typeof this.onRevalidated === "function") {
          this.onRevalidated(key, newData);
        }
      })
      .catch((err) => {
        // Silently capture background revalidation error so stale data remains usable
        console.warn(`[SWR] Background revalidation failed for ${key}:`, err.message);
      });

    // Immediately return the stale data
    return entry.data;
  }

  /**
   * Manual cache invalidation
   */
  invalidate(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    this.inFlight.clear();
  }
}

```

---

### Usage Example

```javascript
let remoteCalls = 0;

// Simulated API with 300ms latency
async function fetchUser(userId) {
  remoteCalls++;
  console.log(`[Network Call #${remoteCalls}] Fetching fresh data for user: ${userId}`);
  await new Promise((res) => setTimeout(res, 300));
  return { id: userId, version: remoteCalls, fetchedAt: new Date().toISOString() };
}

const swr = new SWRCache({
  ttl: 1000,      // Fresh for 1s
  staleTtl: 4000, // Stale-usable for another 4s (total window = 5s)
  onRevalidated: (key, freshData) => {
    console.log(`[Event] Cache silently updated for ${key}:`, freshData);
  }
});

async function runDemo() {
  console.log("--- 1. Cold Cache: 3 Concurrent calls ---");
  // All 3 share the single in-flight network promise
  const [u1, u2, u3] = await Promise.all([
    swr.get("user:101", fetchUser),
    swr.get("user:101", fetchUser),
    swr.get("user:101", fetchUser)
  ]);
  console.log("Returned version:", u1.version); // 1
  console.log("Network calls so far:", remoteCalls); // 1

  console.log("\n--- 2. Fresh Window (after 500ms) ---");
  await new Promise((res) => setTimeout(res, 500));
  const fresh = await swr.get("user:101", fetchUser);
  console.log("Returned version (instant hit):", fresh.version); // 1
  console.log("Network calls so far:", remoteCalls); // Still 1

  console.log("\n--- 3. Stale Window (after 1.5s) with 2 concurrent callers ---");
  await new Promise((res) => setTimeout(res, 1000)); // Total elapsed ~1500ms -> Stale!

  // Both callers immediately get the stale value (version 1)
  // Meanwhile, a single background request is scheduled and coalesced
  const [stale1, stale2] = await Promise.all([
    swr.get("user:101", fetchUser),
    swr.get("user:101", fetchUser)
  ]);
  console.log("Returned stale data immediately:", stale1.version, stale2.version); // 1, 1

  // Wait for the background revalidation to settle
  await new Promise((res) => setTimeout(res, 400));
  console.log("Network calls after revalidation:", remoteCalls); // 2

  console.log("\n--- 4. Subsequent read receives the freshly updated cache ---");
  const updated = await swr.get("user:101", fetchUser);
  console.log("New cached version:", updated.version); // 2
}

runDemo();

```

---

### Critical Considerations

* **Fault Isolation on Revalidation:** When serving stale data, background fetch rejections are caught inside the detachment `.catch(...)`. This prevents a network failure from crashing the consumer or unseating otherwise valid stale cache data.
* **Separation of In-Flight vs. Cache Maps:** `cache` holds resolved data and timestamps, while `inFlight` stores raw promises. Storing the promise inside the primary cache instead of isolating it can cause race conditions during background invalidation.
* **Memory Management:** In long-running Node.js processes, replace `Map` with an LRU structure (like `lru-cache`) or evict based on the `staleTtl` window to prevent unbounded memory growth.
