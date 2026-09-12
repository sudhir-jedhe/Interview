By default, passing an array of promises to `Promise.all` executes all operations simultaneously. To throttle execution to a maximum concurrency limit $L$, you must pass **task-generating functions** (thunks: `() => Promise`) rather than pre-instantiated promises, and process them through a pool or queue.

---

### Method 1: The Worker Pool Pattern (Zero Dependencies)

Spawn a fixed number of concurrent "worker" chains that pull items from a shared iterator. Each worker processes tasks sequentially until the iterator is exhausted.

```javascript
async function mapConcurrent(items, limit, asyncFn) {
  const results = new Array(items.length);
  const iterator = items.entries(); // yields [index, item]

  async function worker() {
    for (const [index, item] of iterator) {
      results[index] = await asyncFn(item);
    }
  }

  // Launch 'limit' workers in parallel
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker()
  );

  await Promise.all(workers);
  return results;
}

// Example usage:
const urls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const fetchMock = (id) =>
  new Promise((res) => setTimeout(() => res(`Data ${id}`), 500));

mapConcurrent(urls, 3, fetchMock).then((data) => {
  console.log("All finished:", data);
});

```

* **Preserves Indexing:** Results match the original order because they write directly to `results[index]`.
* **No Extra Queues:** Uses native JS iterator semantics to safely distribute tasks across concurrent runners.

---

### Method 2: Sliding-Window Pool with `Promise.race`

Run an active batch up to the concurrency limit. Once the batch fills, use `Promise.race` to wait for any single operation to finish before enqueuing the next.

```javascript
async function pLimitAll(taskFns, limit) {
  const results = [];
  const executing = new Set();

  for (const [index, taskFn] of taskFns.entries()) {
    // Wrap task to capture index and clean itself up when finished
    const p = Promise.resolve().then(() => taskFn()).then((val) => {
      results[index] = val;
      executing.delete(p);
    });

    executing.add(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  // Drain the remaining tasks
  await Promise.all(executing);
  return results;
}

```

---

### Method 3: Using `p-limit` (Production Standard)

In production environments, the lightweight npm package [`p-limit`](https://www.npmjs.com/package/p-limit) is standard practice:

```bash
npm install p-limit

```

```javascript
import pLimit from "p-limit";

const limit = pLimit(3); // Max 3 concurrent operations

const tasks = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => {
  return limit(() => fetchMock(id));
});

// Promise.all receives promises wrapped by the limiter
const results = await Promise.all(tasks);
console.log(results);

```

---

### Key Requirements for Concurrency Limiting

* **Defer Execution:** Do **not** call `fetch(url)` or create promises prior to enqueueing. Pass factories (`() => fetch(url)`) so promises only instantiate when concurrency allows.
* **Error Semantics:** With `await Promise.all`, if any single task throws an error, the outer promise rejects immediately. If you need all tasks to run regardless of failures, wrap tasks in `.catch()` handlers or use `Promise.allSettled` to gather all settled states.
