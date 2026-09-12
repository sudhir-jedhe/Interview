In modern JavaScript, the standard way to combine a global pipeline `AbortSignal` with a per-request timeout `AbortSignal` is **`AbortSignal.any()`** combined with **`AbortSignal.timeout()`**.

---

### The Modern Native Approach: `AbortSignal.any()`

`AbortSignal.any(signals)` takes an iterable of signals and returns a new `AbortSignal` that triggers as soon as **any** of the input signals abort, carrying forward the original abort reason.

```javascript
async function fetchWithTimeoutAndPipeline(url, { globalSignal, timeoutMs = 3000 } = {}) {
  // 1. Create a per-request timeout signal
  const perRequestTimeoutSignal = AbortSignal.timeout(timeoutMs);

  // 2. Combine the signals
  const combinedSignal = globalSignal
    ? AbortSignal.any([globalSignal, perRequestTimeoutSignal])
    : perRequestTimeoutSignal;

  try {
    // 3. Pass combined signal to fetch or downstream task
    const response = await fetch(url, { signal: combinedSignal });
    return await response.json();
  } catch (err) {
    // 4. Distinguish whether it was the global abort or the local timeout
    if (globalSignal?.aborted) {
      console.error("Cancelled due to global pipeline shutdown:", globalSignal.reason);
    } else if (perRequestTimeoutSignal.aborted) {
      console.warn(`Request to ${url} timed out after ${timeoutMs}ms.`);
    }
    throw err;
  }
}

```

---

### Integrating Into a Retry Loop

When retrying, a **fresh** per-request timeout must be generated for each individual attempt, while the global pipeline signal remains constant across all attempts:

```javascript
async function fetchWithRetryAndSignals(url, {
  globalSignal,
  perAttemptTimeoutMs = 2000,
  maxRetries = 3
} = {}) {
  let attempt = 0;

  while (true) {
    globalSignal?.throwIfAborted();
    attempt++;

    // Fresh timeout signal created specifically for this attempt
    const attemptTimeoutSignal = AbortSignal.timeout(perAttemptTimeoutMs);

    const combinedSignal = globalSignal
      ? AbortSignal.any([globalSignal, attemptTimeoutSignal])
      : attemptTimeoutSignal;

    try {
      return await fetch(url, { signal: combinedSignal }).then(r => r.json());
    } catch (err) {
      // Rule 1: Never retry if the GLOBAL pipeline was aborted
      if (globalSignal?.aborted) {
        throw err;
      }

      // Rule 2: If the request timed out or network glitched, retry up to maxRetries
      const isTimeout = attemptTimeoutSignal.aborted || err.name === "TimeoutError";
      const isRetriable = isTimeout || err.name === "TypeError"; // Network error

      if (attempt > maxRetries || !isRetriable) {
        throw err;
      }

      console.warn(`Attempt ${attempt} timed out or failed. Retrying...`);
    }
  }
}

```

---

### Polyfill for Older Environments (`any()` fallback)

If you are running in legacy runtimes where `AbortSignal.any()` is not supported, you can compose signals manually using an `AbortController`:

```javascript
function composeSignals(signals) {
  const controller = new AbortController();

  for (const signal of signals) {
    if (!signal) continue;

    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }

    signal.addEventListener(
      "abort",
      () => controller.abort(signal.reason),
      { once: true }
    );
  }

  return controller.signal;
}

```

---

### Key Behavioral Differences to Note

* **Rejection Names:**
* A signal triggered by `AbortSignal.timeout()` aborts with a native `TimeoutError` (`DOMException`), where `err.name === "TimeoutError"`.
* A signal aborted manually via `controller.abort()` defaults to an `AbortError` (`DOMException`), where `err.name === "AbortError"` (or whatever custom reason is passed).

* **Scope Placement:** Never reuse the same `AbortSignal.timeout()` across multiple retry attempts. Once an `AbortSignal` enters the aborted state, it is permanent; reusing it will immediately fail all subsequent retries.
