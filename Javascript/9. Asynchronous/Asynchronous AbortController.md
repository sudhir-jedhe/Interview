The **`AbortController`** API is the standard JavaScript mechanism for signaling cancellation to asynchronous operations. It provides a controller-signal pair (`controller` and `signal`) that allows you to stop pending asynchronous tasks—like network requests, event listeners, or custom promises—instantly without waiting for them to complete or time out.

---

## How It Works

1. **`AbortController`**: The controller object that holds the `.abort()` method used to trigger cancellation.
2. **`AbortSignal`**: An EventTarget passed into an asynchronous operation. When `.abort()` is invoked on its parent controller, the signal emits an `abort` event and updates its `.aborted` property to `true`.

---

## 1. Built-in Integration: Canceling `fetch()`

Modern Web APIs like `fetch()` natively accept an `AbortSignal` inside their options object. Passing a signal allows you to abort ongoing network requests immediately.

```javascript
const controller = new AbortController();
const { signal } = controller;

async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/large-data", { signal });
    const data = await response.json();
    console.log("Data received:", data);
  } catch (error) {
    if (error.name === "AbortError") {
      console.warn("Fetch request was successfully aborted!");
    } else {
      console.error("Network error:", error.message);
    }
  }
}

fetchData();

// Cancel the network request after 150 milliseconds
setTimeout(() => {
  controller.abort();
}, 150);

```

---

## 2. Modern Static Helpers: `AbortSignal.timeout()`

Instead of manually creating an `AbortController` and setting a `setTimeout()`, modern environments (Browsers and Node.js v18+) provide `AbortSignal.timeout(ms)`. It generates a signal that automatically aborts after the specified delay:

```javascript
async function fetchWithDeadline(url, timeoutMs = 3000) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs) // Automatically aborts after timeoutMs
    });
    return await response.json();
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      console.error(`Operation timed out after ${timeoutMs}ms`);
    } else {
      console.error("Fetch failed:", error.message);
    }
  }
}

fetchWithDeadline("https://httpbin.org/delay/5", 2000);

```

---

## 3. Creating Custom Cancellable Async Functions

To make your own custom asynchronous functions support `AbortSignal`, check `signal.aborted` before performing tasks, and listen for the `'abort'` event to clean up resources or reject promises immediately.

```javascript
/**
 * A custom cancellable delay function.
 * 
 * @param {number} ms - Milliseconds to delay.
 * @param {AbortSignal} [signal] - Optional AbortSignal for cancellation.
 */
function cancellableDelay(ms, signal) {
  return new Promise((resolve, reject) => {
    // 1. Check if signal is already aborted before starting
    if (signal?.aborted) {
      return reject(new DOMException("Aborted", "AbortError"));
    }

    const timer = setTimeout(() => {
      resolve(`Finished waiting ${ms}ms`);
    }, ms);

    // 2. Listen for the abort event to interrupt waiting
    signal?.addEventListener("abort", () => {
      clearTimeout(timer); // Clean up timer
      reject(new DOMException("Aborted", "AbortError"));
    }, { once: true });
  });
}

// Usage Example
const controller = new AbortController();

cancellableDelay(5000, controller.signal)
  .then(console.log)
  .catch((err) => console.warn("Task cancelled:", err.message));

// Abort custom task after 1 second
setTimeout(() => controller.abort(), 1000);

```

---

## 4. Combining Multiple Signals (`AbortSignal.any()`)

When an operation needs to support **both** a timeout deadline **AND** a manual cancellation button (or parent abort signal), combine them using `AbortSignal.any()` (supported in modern browsers and Node.js v20+):

```javascript
const userCancelController = new AbortController();

async function executeCancellableTask(url) {
  // Combine a 5-second automatic timeout with a manual user cancellation controller
  const combinedSignal = AbortSignal.any([
    userCancelController.signal,
    AbortSignal.timeout(5000)
  ]);

  try {
    const response = await fetch(url, { signal: combinedSignal });
    return await response.json();
  } catch (error) {
    if (userCancelController.signal.aborted) {
      console.warn("Cancelled by user action.");
    } else if (combinedSignal.aborted) {
      console.warn("Cancelled due to 5-second timeout.");
    }
  }
}

// Simulate user clicking "Cancel" button after 1 second
setTimeout(() => {
  userCancelController.abort();
}, 1000);

executeCancellableTask("https://httpbin.org/delay/10");

```

---

## 5. Other Built-In Web APIs Supporting `AbortSignal`

`AbortSignal` is now integrated across many native browser and Node.js APIs beyond `fetch`:

* **Event Listeners:** Automatically remove event listeners without `removeEventListener`:

```javascript
const controller = new AbortController();

window.addEventListener('resize', handleResize, { signal: controller.signal });

// Later: removes the event listener automatically
controller.abort();

```

* **Web Streams API:** Abort readable or writable streams mid-transfer.
* **Node.js Modules:** Supported in `readline`, `events.on()`, `child_process`, and `fs/promises`.

---

## Summary Matrix

| Method / Feature                       | Purpose                                                                |
| -------------------------------------- | ---------------------------------------------------------------------- |
| **`new AbortController()`**            | Creates a new controller instance with `.abort()` and `.signal`.       |
| **`AbortSignal.timeout(ms)`**          | Creates a signal that auto-aborts after a set delay.                   |
| **`AbortSignal.any([s1, s2])`**        | Creates a composite signal that aborts if *any* input signal aborts.   |
| **`signal.aborted`**                   | Boolean flag indicating whether the signal has been aborted.           |
| **`signal.addEventListener('abort')`** | Listens for the cancellation event to clean up custom async resources. |

Explain how to implement fetch retries with exponential backoff and AbortController with code examples

Combining **fetch retries**, **exponential backoff**, and **`AbortController`** ensures your application handles temporary network glitches gracefully while remaining responsive to timeouts and manual cancellations.

---

## 1. What is Exponential Backoff with Jitter?

* **Exponential Backoff:** If a request fails, you wait before retrying. Each subsequent failure doubles the wait time (e.g., $1000\text{ms} \rightarrow 2000\text{ms} \rightarrow 4000\text{ms}$).
* **Jitter (Randomization):** Adding slight random noise to delay times prevents the **Thundering Herd Problem**—where thousands of client instances fail at the exact same moment and retry simultaneously, repeatedly overwhelming a recovering server.

---

## 2. Robust Implementation Example

Here is a production-ready, reusable `fetchWithRetry` function that handles:

1. Maximum retry limits.
2. Exponential delays with randomized jitter.
3. Selective retries (only retrying on network errors or server errors like $5\text{xx}$ or $429\text{ Too Many Requests}$, while failing fast on $4\text{xx}$ client errors).
4. Per-attempt timeouts and overall cancellation using `AbortController`.

```javascript
/**
 * Executes fetch with automatic retries, exponential backoff, and cancellation support.
 * 
 * @param {string} url - Target URL.
 * @param {Object} options - Standard fetch options + retry configuration.
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, options = {}) {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    backoffFactor = 2,
    timeoutPerAttemptMs = 3000,
    signal: externalSignal, // Optional external AbortSignal (e.g. from user cancel button)
    ...fetchOptions
  } = options;

  let attempt = 0;

  while (attempt <= maxRetries) {
    // Create an internal AbortController for per-attempt timeouts
    const attemptController = new AbortController();
    const timeoutId = setTimeout(() => attemptController.abort(), timeoutPerAttemptMs);

    // Combine external signal (if provided) with local attempt timeout signal
    const combinedSignal = externalSignal 
      ? AbortSignal.any([externalSignal, attemptController.signal])
      : attemptController.signal;

    try {
      console.log(`[Attempt ${attempt + 1}/${maxRetries + 1}] Fetching ${url}...`);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: combinedSignal
      });

      // Clear the timeout timer immediately if fetch resolves
      clearTimeout(timeoutId);

      // Don't retry on successful responses or standard client errors (4xx except 429)
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response;
      }

      throw new Error(`Server returned status HTTP ${response.status}`);

    } catch (error) {
      clearTimeout(timeoutId);

      // STOP RETRYING if the request was cancelled explicitly by the caller/user
      if (externalSignal?.aborted) {
        throw new Error("Request cancelled by user.");
      }

      attempt++;

      // Re-throw if max retries exceeded
      if (attempt > maxRetries) {
        throw new Error(`Failed after ${maxRetries} retries. Final Error: ${error.message}`);
      }

      // Calculate Exponential Backoff Delay with Full Jitter:
      // Base delay = initialDelay * (backoffFactor ^ attempt)
      const rawDelay = initialDelayMs * Math.pow(backoffFactor, attempt - 1);
      // Randomize between 50% and 100% of rawDelay to prevent thundering herd
      const jitteredDelay = Math.floor(rawDelay * (0.5 + Math.random() * 0.5));

      console.warn(`[Attempt ${attempt}] Failed (${error.message}). Retrying in ${jitteredDelay}ms...`);

      // Pause before the next retry loop iteration
      await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
    }
  }
}

```

---

## 3. Usage Examples

### A. Basic Fetch with Retry

```javascript
async function loadUserData() {
  try {
    const response = await fetchWithRetry("https://httpbin.org/status/503,200", {
      maxRetries: 3,
      initialDelayMs: 500,
      timeoutPerAttemptMs: 2000
    });

    const data = await response.json();
    console.log("Successfully retrieved data:", data);
  } catch (err) {
    console.error("All retries exhausted:", err.message);
  }
}

loadUserData();

```

---

### B. Fetch with Retry + User Cancel Button

If the user navigates away or clicks a "Cancel" button, the external `AbortSignal` immediately stops the retry loop without waiting for remaining retries:

```javascript
const userCancelController = new AbortController();

async function runCancellableOperation() {
  try {
    const response = await fetchWithRetry("https://httpbin.org/delay/5", {
      maxRetries: 4,
      timeoutPerAttemptMs: 2000, // Each attempt times out after 2s
      signal: userCancelController.signal // User signal
    });

    const data = await response.json();
    console.log("Data:", data);
  } catch (error) {
    console.log("Operation stopped:", error.message);
  }
}

// Start operation
runCancellableOperation();

// Simulate user clicking "Cancel" after 1.5 seconds
setTimeout(() => {
  console.log("\n[User Action] User clicked Cancel!");
  userCancelController.abort();
}, 1500);

```

---

## 4. Key Rules for HTTP Retries

| Scenario                                          | Should Retry? | Reason                                                     |
| ------------------------------------------------- | ------------- | ---------------------------------------------------------- |
| **Network Failure (Offline / DNS / CORS)**        | ✅ Yes         | Temporary network glitch.                                  |
| **HTTP $502, 503, 504$ (Server Error / Gateway)** | ✅ Yes         | Service may recover shortly.                               |
| **HTTP $429$ (Too Many Requests)**                | ✅ Yes         | Respect `Retry-After` headers if present.                  |
| **HTTP $400, 401, 403, 404$ (Client Errors)**     | ❌ No          | Retrying the exact same request will yield the same error. |
| **User Triggered Abort Signal**                   | ❌ No          | Stop immediately to respect user intent.                   |
