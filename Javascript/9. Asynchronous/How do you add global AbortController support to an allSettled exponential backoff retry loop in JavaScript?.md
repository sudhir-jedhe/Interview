To add global `AbortController` cancellation to an `allSettled` retry loop with exponential backoff, you need to handle three cancellation interception points:

1. **The Backoff Sleep:** Interrupt the sleep timer immediately if an abort occurs during the wait between retry attempts.
2. **In-Flight Tasks:** Pass the `signal` down into individual workers (e.g., native `fetch(url, { signal })`) so network calls terminate promptly.
3. **Queue / Batch Boundaries:** Stop scheduling subsequent attempts and mark any remaining pending tasks as rejected with an `AbortError`.

---

### Implementation

```javascript
/**
 * Abortable sleep helper that resolves after `ms` or rejects immediately on abort.
 */
function abortableSleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    }

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Executes a batch of tasks using allSettled with retries, exponential backoff,
 * and global AbortController support.
 *
 * @param {Array<T>} items - Original input items
 * @param {Function} taskFn - (item: T, originalIndex: number, signal: AbortSignal) => Promise<R>
 * @param {Object} options
 * @param {AbortSignal} [options.signal] - Global cancellation signal
 * @param {number} [options.maxRetries=3] - Maximum retry passes
 * @param {number} [options.baseDelay=300] - Base delay in ms
 * @param {number} [options.maxDelay=5000] - Cap on delay in ms
 * @param {Function} [options.shouldRetry] - Filter for transient errors: (err) => boolean
 * @returns {Promise<Array<{status: 'fulfilled', value: R} | {status: 'rejected', reason: any}>>}
 */
async function allSettledWithRetryAndAbort(items, taskFn, {
  signal,
  maxRetries = 3,
  baseDelay = 300,
  maxDelay = 5000,
  shouldRetry = (err) => err.name !== "AbortError"
} = {}) {
  const finalResults = new Array(items.length);
  let pendingEntries = items.map((item, originalIndex) => ({ originalIndex, item }));

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (pendingEntries.length === 0) break;

    // 1. Bail out immediately if cancelled before backoff or next run
    if (signal?.aborted) {
      const reason = signal.reason ?? new DOMException("Aborted", "AbortError");
      for (const { originalIndex } of pendingEntries) {
        finalResults[originalIndex] = { status: "rejected", reason };
      }
      break;
    }

    // 2. Interruptible backoff delay before retries
    if (attempt > 0) {
      const expDelay = baseDelay * Math.pow(2, attempt - 1);
      const delayWithJitter = Math.random() * expDelay;
      const actualDelay = Math.min(maxDelay, delayWithJitter);

      try {
        await abortableSleep(actualDelay, signal);
      } catch (err) {
        // Interrupted while sleeping: mark all pending tasks as aborted
        for (const { originalIndex } of pendingEntries) {
          finalResults[originalIndex] = { status: "rejected", reason: err };
        }
        break;
      }
    }

    // 3. Run pending tasks passing the signal down for in-flight cancellation
    const settledBatch = await Promise.allSettled(
      pendingEntries.map(({ item, originalIndex }) => taskFn(item, originalIndex, signal))
    );

    const nextFailedEntries = [];

    settledBatch.forEach((outcome, batchIndex) => {
      const { originalIndex, item } = pendingEntries[batchIndex];

      if (outcome.status === "fulfilled") {
        finalResults[originalIndex] = outcome;
      } else {
        // Never retry if cancelled or if the failure is non-retriable
        const isAborted = signal?.aborted || outcome.reason?.name === "AbortError";
        const canRetry = attempt < maxRetries && !isAborted && shouldRetry(outcome.reason);

        if (canRetry) {
          nextFailedEntries.push({ originalIndex, item });
        } else {
          finalResults[originalIndex] = outcome;
        }
      }
    });

    pendingEntries = nextFailedEntries;

    // Stop execution passes if global signal tripped during batch execution
    if (signal?.aborted) break;
  }

  return finalResults;
}

```

---

### Usage Example

```javascript
// Simulated async worker respecting an AbortSignal
function mockWorker(item, index, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      // Simulate transient failure on item 2
      if (item === 2) {
        reject(new Error("503 Gateway Timeout"));
      } else {
        resolve(`Data for item ${item}`);
      }
    }, 400);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

async function run() {
  const controller = new AbortController();
  const items = [1, 2, 3, 4];

  // Trigger global abort after 700ms (during retry attempt 1's backoff)
  setTimeout(() => {
    console.log("--> [AbortController] Cancelling entire pipeline...");
    controller.abort(new DOMException("Pipeline cancelled by client", "AbortError"));
  }, 700);

  const results = await allSettledWithRetryAndAbort(items, mockWorker, {
    signal: controller.signal,
    maxRetries: 3,
    baseDelay: 500,
  });

  console.log("\nFinal Status Report:");
  results.forEach((res, i) => {
    if (res.status === "fulfilled") {
      console.log(`[Item ${items[i]}]: Fulfilled ->`, res.value);
    } else {
      console.log(`[Item ${items[i]}]: Rejected  ->`, res.reason.name, "-", res.reason.message);
    }
  });
}

run();

```

---

### Execution Output

```text
--> [AbortController] Cancelling entire pipeline...

Final Status Report:
[Item 1]: Fulfilled -> Data for item 1
[Item 2]: Rejected  -> AbortError - Pipeline cancelled by client
[Item 3]: Fulfilled -> Data for item 3
[Item 4]: Fulfilled -> Data for item 4

```

---

### Architectural Highlights

* **Preserving Succeeded Tasks:** Unlike `Promise.all` which rejects entirely on abort, `allSettled` records what completed successfully prior to cancellation. Items 1, 3, and 4 keep their fulfilled outputs, while only the pending/retrying item (Item 2) is marked rejected with `AbortError`.
* **Break Sleep Instantly:** When `controller.abort()` fires, `abortableSleep` eliminates lingering timers immediately via `clearTimeout` and rejects without waiting for the backoff interval to finish.
* **Avoid Zombie Retries:** The condition `!isAborted && shouldRetry(...)` prevents aborted promises from being placed back onto the `nextFailedEntries` queue for another attempt.
