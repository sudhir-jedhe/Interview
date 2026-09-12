To re-run only the failed tasks from a batch without re-executing successful ones, maintain a **master results array** referenced by original index. After each pass with `Promise.allSettled`, extract only the items whose status is `'rejected'`, apply an exponential backoff delay with jitter, and dispatch a new settled batch until all items succeed or the retry budget is exhausted.

---

### Implementation

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Re-runs only failed tasks with exponential backoff and jitter.
 *
 * @param {Array<T>} items - Original array of inputs
 * @param {Function} taskFn - Worker: (item: T, index: number) => Promise<R>
 * @param {Object} options
 * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
 * @param {number} options.baseDelay - Initial backoff base in ms (default: 300)
 * @param {number} options.maxDelay - Maximum backoff cap in ms (default: 5000)
 * @param {Function} options.shouldRetry - Filter for transient errors: (err) => boolean
 * @returns {Promise<Array<{status: 'fulfilled', value: R} | {status: 'rejected', reason: any}>>}
 */
async function allSettledWithRetry(items, taskFn, {
  maxRetries = 3,
  baseDelay = 300,
  maxDelay = 5000,
  shouldRetry = () => true
} = {}) {
  // Pre-allocate results to preserve original input indexing
  const finalResults = new Array(items.length);

  // Initialize working set: [{ originalIndex, item }]
  let pendingEntries = items.map((item, originalIndex) => ({ originalIndex, item }));

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (pendingEntries.length === 0) break;

    // Apply backoff before retries (skip on initial pass)
    if (attempt > 0) {
      const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
      const delayWithJitter = Math.random() * exponentialDelay;
      const actualDelay = Math.min(maxDelay, delayWithJitter);
      await sleep(actualDelay);
    }

    // Execute only currently pending/failed tasks concurrently
    const settledBatch = await Promise.allSettled(
      pendingEntries.map(({ item, originalIndex }) => taskFn(item, originalIndex))
    );

    const nextFailedEntries = [];

    settledBatch.forEach((outcome, batchIndex) => {
      const { originalIndex, item } = pendingEntries[batchIndex];

      if (outcome.status === "fulfilled") {
        // Record success permanently in master output
        finalResults[originalIndex] = outcome;
      } else {
        const canRetry = attempt < maxRetries && shouldRetry(outcome.reason);

        if (canRetry) {
          // Re-queue for next iteration pass
          nextFailedEntries.push({ originalIndex, item });
        } else {
          // Terminal failure: recorded permanently
          finalResults[originalIndex] = outcome;
        }
      }
    });

    pendingEntries = nextFailedEntries;
  }

  return finalResults;
}

```

---

### Usage Example

```javascript
// Simulated API where specific IDs fail initially and recover on retry
const networkFailures = new Map();

async function syncRecord(recordId) {
  const previousFailures = networkFailures.get(recordId) || 0;

  // Simulate IDs 2 and 4 failing on their first attempt
  if ((recordId === 2 || recordId === 4) && previousFailures < 1) {
    networkFailures.set(recordId, previousFailures + 1);
    const err = new Error(`503 Server Busy on record ${recordId}`);
    err.status = 503;
    throw err;
  }

  // Simulate ID 5 failing permanently (client error: non-retriable)
  if (recordId === 5) {
    const err = new Error("400 Bad Request: Malformed Payload");
    err.status = 400;
    throw err;
  }

  return { id: recordId, status: "synchronized" };
}

async function run() {
  const records = [1, 2, 3, 4, 5];

  console.log("Starting batch sync...");

  const results = await allSettledWithRetry(records, syncRecord, {
    maxRetries: 3,
    baseDelay: 200,
    // Only retry transient 5xx or network errors, bypass 4xx client errors
    shouldRetry: (err) => err.status !== 400
  });

  results.forEach((res, index) => {
    if (res.status === "fulfilled") {
      console.log(`[Record ${records[index]}] Success:`, res.value);
    } else {
      console.error(`[Record ${records[index]}] Final Failure:`, res.reason.message);
    }
  });
}

run();

```

---

### Output Walkthrough

```text
Starting batch sync...
[Record 1] Success: { id: 1, status: 'synchronized' }
[Record 2] Success: { id: 2, status: 'synchronized' }
[Record 3] Success: { id: 3, status: 'synchronized' }
[Record 4] Success: { id: 4, status: 'synchronized' }
[Record 5] Final Failure: 400 Bad Request: Malformed Payload

```

1. **Attempt 0:** Records 1 and 3 resolve immediately. Records 2, 4 (transient 503), and 5 (400) reject.
2. **Filtering:** Record 5 matches `err.status === 400`, failing `shouldRetry`. It is logged immediately to `finalResults` as rejected and excluded from re-runs.
3. **Attempt 1:** After backoff, only records 2 and 4 re-execute. Both resolve and update `finalResults[1]` and `finalResults[3]`.
4. **Completion:** `pendingEntries` drains to zero; the function returns all items in their original array indices.

---

### Architectural Highlights

* **Input-Index Mapping:** By capturing `{ originalIndex, item }` in the working queue, outcomes write directly back to `finalResults[originalIndex]`. The caller receives results aligned 1-to-1 with the input array without manual sorting.
* **Full Jitter:** Calculating `Math.random() * exponentialDelay` spreads out the retried attempts, preventing synchronized retry stampedes when a remote service recovers.
* **Error Predicates (`shouldRetry`):** Permanent errors (like validation faults, `401`, or `404`) are saved immediately to save network overhead and prevent futile retries.
