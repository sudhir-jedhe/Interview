To limit concurrent asynchronous executions to a specific batch size, there are two common approaches:

1. **Chunking / Rigid Batching:** Process tasks in distinct chunks (e.g., $N$ tasks at once, wait until all $N$ finish, then process the next $N$).
2. **Sliding Window / Worker Pool:** Maintain exactly $N$ active tasks at all times. As soon as any single task finishes, the next task from the queue starts immediately.

The **Sliding Window** approach is almost always preferred in production because it prevents a single slow task from holding back the entire batch.

---

### Approach 1: The Sliding Window Pool (Recommended)

This pattern spawns a fixed number of "worker" loops. Each worker continuously pulls and executes tasks from a shared iterator until all items are processed.

```javascript
/**
 * Processes items with a maximum concurrency limit.
 *
 * @param {Array<T>} items - Input items to process.
 * @param {number} limit - Maximum concurrent executions.
 * @param {Function} asyncFn - Task runner: (item: T, index: number) => Promise<R>
 * @returns {Promise<Array<R>>} - Results preserving input order.
 */
async function mapConcurrent(items, limit, asyncFn) {
  const results = new Array(items.length);
  const iterator = items.entries(); // yields [index, item] pairs

  async function worker() {
    for (const [index, item] of iterator) {
      results[index] = await asyncFn(item, index);
    }
  }

  // Launch only `limit` workers
  const workerPool = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker()
  );

  await Promise.all(workerPool);
  return results;
}

// Example usage:
const taskIds = [1, 2, 3, 4, 5, 6, 7, 8];
const mockFetch = (id) =>
  new Promise((resolve) => {
    const duration = Math.random() * 500 + 200;
    setTimeout(() => {
      console.log(`Finished task ${id}`);
      resolve(`Result for ${id}`);
    }, duration);
  });

mapConcurrent(taskIds, 3, mockFetch).then((data) => {
  console.log("All tasks completed:", data);
});

```

* **Why it's better:** If item 1 takes 2000ms and items 2 and 3 take 100ms, slots 2 and 3 immediately pick up items 4, 5, 6, etc., without waiting for item 1.
* **Order Preserved:** Writing to `results[index]` guarantees the output array order matches the input array regardless of execution timing.

---

### Approach 2: Rigid Chunked Batching

If your API or business logic strictly requires batches to finish together before the next batch begins:

```javascript
/**
 * Executes tasks in rigid, sequential chunks of size `batchSize`.
 */
async function runInRigidBatches(items, batchSize, asyncFn) {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    
    // Fire the entire chunk concurrently and wait for all to resolve
    const chunkResults = await Promise.all(
      chunk.map((item, index) => asyncFn(item, i + index))
    );
    
    results.push(...chunkResults);
  }

  return results;
}

```

* **Trade-off:** The entire batch is gated by the slowest task in that chunk. If 9 tasks finish in 50ms and 1 takes 1000ms, the next batch waits the full 1000ms.

---

### Approach 3: Using the `p-limit` Library (Industry Standard)

If you use external packages, [`p-limit`](https://www.npmjs.com/package/p-limit) is the battle-tested standard in the Node.js / JavaScript ecosystem:

```bash
npm install p-limit

```

```javascript
import pLimit from "p-limit";

const limit = pLimit(3); // Max 3 concurrent tasks

const items = [1, 2, 3, 4, 5, 6, 7, 8];

const tasks = items.map((id) =>
  // Wrap the call inside limit()
  limit(() => mockFetch(id))
);

const results = await Promise.all(tasks);
console.log(results);

```

---

### Summary Comparison

| Strategy                         | Performance                           | Complexity      | Best Used When                                              |
| -------------------------------- | ------------------------------------- | --------------- | ----------------------------------------------------------- |
| **Sliding Window (Worker Pool)** | **Optimal** (no idle slots)           | Low (native JS) | General I/O concurrency limiting (API calls, DB queries)    |
| **Rigid Batching**               | **Sub-optimal** (idles on slow tasks) | Minimal         | APIs that enforce batch endpoints or strict lockstep steps  |
| **`p-limit`**                    | **Optimal**                           | Zero (library)  | Production projects where adding a micro-dependency is fine |
