Request coalescing (deduplicating in-flight promises) works by caching the **Promise itself**—not the resolved data—in a `Map` keyed by a request identifier.

Subsequent identical calls made while the promise is still pending receive the same promise instance. Once settled (whether resolved or rejected), the promise is immediately evicted from the map via `.finally()` so subsequent requests execute fresh.

---

### Implementation: Generic In-Flight Coalescer

```javascript
/**
 * Wraps an async function to deduplicate concurrent executions 
 * sharing the same cache key.
 *
 * @param {Function} fn - The async function to coalesce.
 * @param {Function} [keyResolver] - Generates a cache key from arguments.
 */
function createCoalescer(fn, keyResolver = (...args) => JSON.stringify(args)) {
  const inFlight = new Map();

  return function coalesced(...args) {
    const key = keyResolver(...args);

    // If an identical operation is already running, return the existing promise
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }

    // Wrap in Promise.resolve() to handle both async functions and sync throws
    const promise = Promise.resolve()
      .then(() => fn.apply(this, args))
      .finally(() => {
        // Clean up immediately when settled so subsequent calls fetch new data
        inFlight.delete(key);
      });

    inFlight.set(key, promise);
    return promise;
  };
}

```

---

### Usage Example

Simulating multiple components or callers requesting the same user record simultaneously:

```javascript
let networkCalls = 0;

// Expensive network/database operation
async function fetchUserById(id) {
  networkCalls++;
  console.log(`[Network] Hitting database for user ${id}...`);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { id, name: `User_${id}`, timestamp: Date.now() };
}

// Wrap with coalescing logic
const getDeduplicatedUser = createCoalescer(
  fetchUserById,
  (id) => `user:${id}` // Explicit key resolver
);

async function run() {
  console.log("Triggering 4 parallel requests for user 42...");

  // Fire 4 requests concurrently
  const [res1, res2, res3, res4] = await Promise.all([
    getDeduplicatedUser(42),
    getDeduplicatedUser(42),
    getDeduplicatedUser(42),
    getDeduplicatedUser(42),
  ]);

  console.log(`Results received. Total network calls: ${networkCalls}`); // Output: 1
  console.log("Are responses identical references?", res1 === res2); // true

  // Waiting until settled...
  await new Promise((r) => setTimeout(r, 400));

  console.log("Triggering a request after settling...");
  await getDeduplicatedUser(42);
  console.log(`Total network calls: ${networkCalls}`); // Output: 2 (fresh request executed)
}

run();

```

---

### Handling Cancellation with `AbortController`

If callers supply an `AbortSignal`, naively sharing the promise can cause an issue: **one caller aborting could inadvertently abort the in-flight request for all other callers.**

To coalesce properly with `AbortSignal`:

* Do **not** pass individual caller signals to the shared fetch.
* Instead, maintain a subscriber ref count and only abort the underlying fetch if **all** waiting callers have aborted.

```javascript
function createAbortableCoalescer(fetcher) {
  const inFlight = new Map(); // key -> { promise, subscribers: Set<AbortSignal>, controller }

  return function (key, { signal } = {}) {
    // If caller provided an already-aborted signal, fail immediately
    if (signal?.aborted) {
      return Promise.reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    }

    let entry = inFlight.get(key);

    if (!entry) {
      const controller = new AbortController();
      const subscribers = new Set();

      const promise = Promise.resolve()
        .then(() => fetcher(key, controller.signal))
        .finally(() => {
          inFlight.delete(key);
        });

      entry = { promise, subscribers, controller };
      inFlight.set(key, entry);
    }

    // Attach caller's signal to subscriber tracker
    if (signal) {
      entry.subscribers.add(signal);

      const onAbort = () => {
        entry.subscribers.delete(signal);
        // If all subscribers have aborted, abort the underlying network call
        if (entry.subscribers.size === 0) {
          entry.controller.abort(signal.reason);
        }
      };

      signal.addEventListener("abort", onAbort, { once: true });

      // Clean up listener when promise resolves to avoid memory leaks
      entry.promise.finally(() => {
        signal.removeEventListener("abort", onAbort);
      });
    }

    // If this specific caller aborts, return a rejected promise for them only
    return new Promise((resolve, reject) => {
      if (signal) {
        signal.addEventListener(
          "abort",
          () => reject(signal.reason ?? new DOMException("Aborted", "AbortError")),
          { once: true }
        );
      }
      entry.promise.then(resolve, reject);
    });
  };
}

```

---

### Key Edge Cases

* **Error Handling:** Using `.finally(() => inFlight.delete(key))` guarantees the cache is cleared on both resolution and rejection. If it rejects, subsequent callers are not permanently locked out with a cached rejection.
* **Synchronous Exceptions:** Wrapping the execution in `Promise.resolve().then(...)` ensures that if `fn()` throws a synchronous error, it transitions into a rejected promise and cleanly triggers `.finally()`.
* **Deep Argument Keys:** The default key resolver uses `JSON.stringify(args)`. For non-JSON-serializable arguments (functions, symbols, circular structures, streams), provide a custom `keyResolver`.
