To handle partial failures when limiting concurrent executions, you should adopt the **`allSettled` pattern**: instead of letting an unhandled rejection immediately short-circuit the queue, wrap task executions in individual `try/catch` blocks (or `.then().catch()`) and capture normalized `{ status, value }` / `{ status, reason }` descriptor objects.

This prevents one failure from halting other active or pending tasks, preserves input indexing, and provides a full audit trail at the end.

---

### Implementation: Worker Pool with Settlement Tracking

This pattern ensures that every task runs to completion regardless of individual rejections, and slots are freed immediately.

```javascript
/**
 * Executes async tasks with limited concurrency, capturing all successes and failures.
 *
 * @param {Array<T>} items - Array of items to process.
 * @param {number} limit - Maximum concurrent executions.
 * @param {Function} taskFn - (item: T, index: number) => Promise<R>
 * @returns {Promise<Array<{status: 'fulfilled', value: R} | {status: 'rejected', reason: any}>>}
 */
async function mapConcurrentSettled(items, limit, taskFn) {
  const results = new Array(items.length);
  const iterator = items.entries(); // yields [index, item]

  async function worker() {
    for (const [index, item] of iterator) {
      try {
        const value = await taskFn(item, index);
        results[index] = { status: "fulfilled", value };
      } catch (reason) {
        results[index] = { status: "rejected", reason };
      }
    }
  }

  // Spawn limited worker pool
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    () => worker()
  );

  // Workers never throw, so Promise.all cleanly waits for all to drain
  await Promise.all(workers);
  return results;
}

```

---

### Usage Example

```javascript
const userIds = [1, 2, 3, 4, 5, 6];

// Simulated operation where IDs 2 and 5 fail
async function syncUserRecord(id) {
  await new Promise((res) => setTimeout(res, 200));
  if (id === 2 || id === 5) {
    throw new Error(`Database timeout for user ${id}`);
  }
  return { id, synced: true };
}

async function run() {
  const outcomes = await mapConcurrentSettled(userIds, 2, syncUserRecord);

  // Partition results into successes and failures
  const successful = [];
  const failed = [];

  outcomes.forEach((outcome, index) => {
    const id = userIds[index];
    if (outcome.status === "fulfilled") {
      successful.push(outcome.value);
    } else {
      failed.push({ id, error: outcome.reason.message });
    }
  });

  console.log("Successful syncs:", successful);
  console.log("Failed syncs:", failed);
}

run();

```

---

### Production Pattern with `p-limit`

If using [`p-limit`](https://www.npmjs.com/package/p-limit), pass the wrapped tasks to `Promise.allSettled()` instead of `Promise.all()`:

```javascript
import pLimit from "p-limit";

const limit = pLimit(3);
const items = [101, 102, 103, 104];

const tasks = items.map((item) =>
  limit(() => syncUserRecord(item))
);

// Native Promise.allSettled collects both resolutions and rejections
const results = await Promise.allSettled(tasks);

```

---

### Common Fallback Strategies for Partial Failures

Depending on the domain requirements, you can handle the captured failures in several ways:

1. **Dead-Letter Queue (DLQ):** Route items matching `status === 'rejected'` to a secondary queue or database table for inspection and alert generation.
2. **Targeted Re-try Batch:** Extract only the failed items and run them through a secondary pass with a lower concurrency limit and exponential backoff:

```javascript
const failedIds = outcomes
  .map((res, i) => (res.status === "rejected" ? userIds[i] : null))
  .filter(Boolean);

if (failedIds.length > 0) {
  const retryOutcomes = await mapConcurrentSettled(failedIds, 1, syncUserRecord);
}

```

1. **Threshold Abort:** If the cumulative failure count exceeds a business threshold (e.g., more than $20\%$ of requests fail), use an `AbortController` to cancel the remainder of the pool early to prevent cascading failures.
