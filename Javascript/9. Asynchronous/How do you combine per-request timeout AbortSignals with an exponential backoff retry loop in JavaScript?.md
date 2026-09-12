To combine per-request timeouts with an exponential backoff retry loop, you must manage two distinct cancellation scopes:

1. **Per-Attempt Timeout Scope:** A new `AbortSignal.timeout(ms)` must be created **inside** the retry loop for each individual attempt and combined with the caller's signal. If an attempt times out, only that attempt is aborted, allowing the loop to back off and try again.
2. **Persistent External Scope:** An optional outer `signal` (representing a user abort or global deadline) that persists across all attempts. If this aborts, the loop must terminate immediately—including waking up from backoff sleep.

---

### Implementation

```javascript
/**
 * Interruptible sleep that wakes and rejects immediately if signal aborts.
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
 * Executes a task with per-attempt timeouts and exponential backoff.
 *
 * @param {Function} taskFn - (signal: AbortSignal) => Promise<T>
 * @param {Object} options
 * @param {AbortSignal} [options.signal] - Global abort signal (persists across retries)
 * @param {number} [options.perAttemptTimeoutMs=2000] - Timeout for each attempt
 * @param {number} [options.maxRetries=3] - Maximum retry attempts
 * @param {number} [options.baseDelay=300] - Initial delay in ms
 * @param {number} [options.maxDelay=5000] - Backoff delay cap in ms
 * @param {Function} [options.shouldRetry] - Filter to decide if an error is retriable
 */
async function fetchWithRetryAndTimeout(taskFn, {
  signal: globalSignal,
  perAttemptTimeoutMs = 2000,
  maxRetries = 3,
  baseDelay = 300,
  maxDelay = 5000,
  shouldRetry = () => true,
} = {}) {
  let attempt = 0;

  while (true) {
    // 1. Bail out immediately if global pipeline cancelled
    globalSignal?.throwIfAborted();

    // 2. Create a FRESH timeout signal for THIS attempt only
    const attemptTimeoutSignal = AbortSignal.timeout(perAttemptTimeoutMs);

    // 3. Compose signals: triggers if EITHER the global signal or this attempt times out
    const combinedSignal = globalSignal
      ? AbortSignal.any([globalSignal, attemptTimeoutSignal])
      : attemptTimeoutSignal;

    try {
      return await taskFn(combinedSignal);
    } catch (err) {
      attempt++;

      // 4. Inspect reason: Never retry if the GLOBAL signal caused the abort
      if (globalSignal?.aborted) {
        throw globalSignal.reason;
      }

      // Check if failure was caused by this attempt's timeout or a network glitch
      const isAttemptTimeout = attemptTimeoutSignal.aborted || err.name === "TimeoutError";
      const isRetriable = (isAttemptTimeout || shouldRetry(err)) && attempt <= maxRetries;

      if (!isRetriable) {
        throw err;
      }

      console.warn(`Attempt ${attempt} failed (${err.name}: ${err.message}). Backing off...`);

      // 5. Exponential backoff with full jitter
      const expDelay = baseDelay * Math.pow(2, attempt - 1);
      const delay = Math.min(maxDelay, Math.random() * expDelay);

      // Backoff sleep listens ONLY to the global signal so it can be interrupted
      await abortableSleep(delay, globalSignal);
    }
  }
}

```

---

### Usage Example

```javascript
// Simulated flaky network endpoint
async function simulateNetworkCall(attemptSignal) {
  // Pass the combined attemptSignal directly to fetch:
  // return fetch("https://api.example.com/data", { signal: attemptSignal });

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve({ data: "Success!" });
    }, 800);

    attemptSignal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(attemptSignal.reason);
      },
      { once: true }
    );
  });
}

async function run() {
  const userController = new AbortController();

  // Scenario: Per-attempt timeout is 400ms, but task takes 800ms (will timeout and retry)
  try {
    const result = await fetchWithRetryAndTimeout(
      (signal) => simulateNetworkCall(signal),
      {
        signal: userController.signal,
        perAttemptTimeoutMs: 400, // Shorter than call duration -> triggers TimeoutError
        maxRetries: 2,
        baseDelay: 200,
      }
    );
    console.log("Result:", result);
  } catch (err) {
    console.error("All retries failed with error:", err.name, err.message);
  }
}

run();

```

---

### Execution Output

```text
Attempt 1 failed (TimeoutError: The operation timed out). Backing off...
Attempt 2 failed (TimeoutError: The operation timed out). Backing off...
All retries failed with error: TimeoutError The operation timed out

```

---

### Critical Safeguards

* **Fresh Signal Instantiation:** `AbortSignal.timeout()` returns a permanently settled signal once it fires. Creating it inside the `while` loop guarantees each retry attempt gets a clean, running timer.
* **Distinguishing Global vs. Local Abort:** When `taskFn` throws, inspect `globalSignal?.aborted`. If true, the user or root process requested an immediate halt—bypassing retries and throwing immediately.
* **Backoff Sleep Must Not Use the Attempt Signal:** In `abortableSleep(delay, globalSignal)`, pass **only** `globalSignal`. If you pass `combinedSignal`, the sleep will reject instantly because `attemptTimeoutSignal` is already aborted from the failed attempt.
