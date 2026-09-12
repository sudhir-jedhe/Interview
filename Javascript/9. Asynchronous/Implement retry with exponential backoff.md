```javascript
/**
 * Executes an asynchronous operation with exponential backoff and jitter.
 *
 * @param {Function} fn - Function returning the promise to execute.
 * @param {Object} options - Configuration options.
 * @param {number} [options.retries=5] - Maximum number of retries.
 * @param {number} [options.delay=1000] - Initial delay in milliseconds.
 * @param {number} [options.factor=2] - Exponential backoff multiplier.
 * @param {number} [options.maxDelay=30000] - Cap for the maximum delay.
 * @param {Function} [options.shouldRetry=() => true] - Optional predicate to filter retriable errors.
 * @returns {Promise<*>} Result of the resolved promise.
 */
async function retryWithBackoff(fn, {
  retries = 5,
  delay = 1000,
  factor = 2,
  maxDelay = 30000,
  shouldRetry = () => true
} = {}) {
  let currentDelay = delay;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === retries;

      // Fail immediately if not retriable (e.g., 400 Bad Request, 401 Unauthorized) or out of attempts
      if (isLastAttempt || !shouldRetry(error)) {
        throw error;
      }

      // Calculate exponential delay with full jitter to avoid the "thundering herd" problem
      const calculatedDelay = Math.min(currentDelay * Math.pow(factor, attempt - 1), maxDelay);
      const jitteredDelay = Math.random() * calculatedDelay;

      console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${Math.round(jitteredDelay)}ms...`);

      await new Promise(resolve => setTimeout(resolve, jitteredDelay));
    }
  }
}

```

---

### Usage Example

```javascript
// Mock function simulating an API call
async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

// Execution
(async () => {
  try {
    const data = await retryWithBackoff(fetchData, {
      retries: 4,
      delay: 500,     // start at 500ms
      factor: 2,      // 500ms -> 1000ms -> 2000ms -> 4000ms
      maxDelay: 10000,
      shouldRetry: (err) => {
        // Retry only for network errors or server 5xx errors; bail on client errors (4xx)
        return !err.status || err.status >= 500;
      }
    });
    console.log('Success:', data);
  } catch (err) {
    console.error('All retries exhausted or unrecoverable error:', err);
  }
})();

```

---

### Key Mechanics

* **Exponential Delay**: Scales using $delay \times factor^{attempt - 1}$, giving the failing downstream service progressively more time to recover.
* **Full Jitter (`Math.random() * calculatedDelay`)**: Spreads out concurrent retries across an interval so many clients recovering from an outage do not hit the backend simultaneously in synchronized spikes.
* **`maxDelay` Cap**: Prevents delays from growing into impractically long waits (e.g., several minutes).
* **Retry Filtering (`shouldRetry`)**: Prevents retrying non-transient failures, such as `401 Unauthorized` or `404 Not Found`.
