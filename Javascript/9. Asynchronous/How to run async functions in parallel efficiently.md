Running async functions in parallel efficiently in JavaScript depends on the size of your workload. Unbounded parallelism (`Promise.all` on thousands of tasks) will exhaust network sockets, file descriptors, and database connections.

Here are the three standard patterns, ordered from small batch operations to production-scale workloads.

---

### 1. Small to Medium Workloads (< 20-50 tasks): Native Combinators

If your operations are completely independent and the batch size is small, native Promise combinators offer the lowest overhead without extra abstractions.

* **`Promise.all`**: Use when all tasks **must succeed**. Short-circuits immediately on the first error.
* **`Promise.allSettled`**: Use when tasks are **independent** and you want all results regardless of individual failures.

```javascript
// Map items directly to in-flight promises
const urls = ['/api/item/1', '/api/item/2', '/api/item/3'];

// All-or-nothing
const results = await Promise.all(urls.map((url) => fetch(url).then((r) => r.json())));

// Fault-tolerant
const settled = await Promise.allSettled(urls.map((url) => fetch(url)));

```

---

### 2. Large Workloads (Hundreds to Thousands): The Sliding-Window Pool

When dealing with large arrays, running everything at once causes memory spikes and HTTP `429 Too Many Requests`. Instead, maintain a fixed pool of concurrent "workers" that pull from an iterator.

This is the most CPU- and memory-efficient pattern: **as soon as one task finishes, the next one starts immediately** (unlike rigid batching, which stalls on the slowest item of each batch).

```javascript
/**
 * Runs async tasks with bounded concurrency using a shared iterator.
 *
 * @param {Array<T>} items - Source data
 * @param {number} concurrency - Max simultaneous active promises
 * @param {Function} taskFn - (item: T, index: number) => Promise<R>
 * @returns {Promise<Array<R>>} - Results aligned with original indices
 */
async function mapConcurrent(items, concurrency, taskFn) {
  const results = new Array(items.length);
  const iterator = items.entries(); // Yields [index, item]

  async function worker() {
    for (const [index, item] of iterator) {
      results[index] = await taskFn(item, index);
    }
  }

  // Spawn only `concurrency` number of persistent workers
  const pool = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  );

  await Promise.all(pool);
  return results;
}

// Usage:
const userIds = Array.from({ length: 500 }, (_, i) => i + 1);

const profiles = await mapConcurrent(userIds, 10, async (id) => {
  const res = await fetch(`https://api.example.com/users/${id}`);
  return res.json();
});

```

**Why this is efficient:**

* **$O(1)$ Extra Allocation:** No intermediate arrays or queues are created.
* **Deterministic Memory:** Exactly `concurrency` promises exist in the microtask queue at any given instant.
* **Indexed Preservation:** Writing directly to `results[index]` preserves the original input order without sorting.

---

### 3. CPU-Bound Asynchronous Work: Worker Threads

JavaScript's event loop executes on a single thread. If your async tasks involve heavy computation (e.g., image resizing, encryption, data parsing) rather than network/disk I/O, `Promise.all` will still **block the main thread** sequentially.

To achieve real multicore parallelism for CPU-bound tasks, use Node.js `worker_threads` (or Web Workers in the browser) with a shared pool like `piscina`:

```javascript
import Piscina from 'piscina';

const piscina = new Piscina({
  filename: new URL('./worker.js', import.meta.url).href,
  maxThreads: 4 // Set based on CPU cores
});

// Runs across actual operating system threads in parallel
const results = await Promise.all(
  heavyDatasets.map((data) => piscina.run(data))
);

```

---

### Anti-Patterns to Avoid

| Anti-Pattern                     | Why It Degrades Performance                                                                                      | Fix                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `items.forEach(async fn)`        | Ignores returned promises; executes all tasks concurrently without error control or awaiting.                    | Use `Promise.all(items.map(fn))` or a concurrency pool. |
| Pre-instantiating Promises       | `[fn(), fn()]` starts execution immediately upon creation, bypassing any pool limiters.                          | Store factories: `[() => fn(), () => fn()]`.            |
| Rigid chunking (`slice` batches) | Idle slots: if 9 tasks take 10ms and 1 takes 1000ms, 9 slots sit idle for 990ms waiting for the chunk to finish. | Use a sliding window / iterator pool.                   |
