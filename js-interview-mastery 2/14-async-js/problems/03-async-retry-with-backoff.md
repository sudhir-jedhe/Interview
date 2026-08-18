# Problem: Async Retry with Exponential Backoff

**Goal:** Implement a `retryWithBackoff(fn, options)` utility that retries a flaky async operation, waiting progressively longer between attempts, and gives up after a maximum number of retries.

## Implementation

```js
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryWithBackoff(
  fn,
  { retries = 3, baseDelayMs = 200, maxDelayMs = 5000, factor = 2, onRetry } = {}
) {
  let attempt = 0;
  while (true) {
    try {
      return await fn(); // success — return immediately, no more retries needed
    } catch (err) {
      attempt++;
      if (attempt > retries) {
        throw err; // retries exhausted — propagate the last error to the caller
      }
      const backoff = Math.min(baseDelayMs * factor ** (attempt - 1), maxDelayMs);
      // add jitter to avoid multiple clients retrying in lockstep ("thundering herd")
      const jitter = Math.random() * backoff * 0.2;
      onRetry?.(err, attempt, backoff + jitter);
      await delay(backoff + jitter);
    }
  }
}
```

## Usage against a flaky operation

```js
let callCount = 0;
async function flakyFetch() {
  callCount++;
  if (callCount < 3) throw new Error(`simulated failure #${callCount}`);
  return { data: 'success' };
}

retryWithBackoff(flakyFetch, {
  retries: 5,
  baseDelayMs: 100,
  onRetry: (err, attempt, waitMs) =>
    console.log(`attempt ${attempt} failed (${err.message}), retrying in ~${Math.round(waitMs)}ms`),
}).then((result) => console.log('succeeded:', result));

// attempt 1 failed (simulated failure #1), retrying in ~103ms
// attempt 2 failed (simulated failure #2), retrying in ~211ms
// succeeded: { data: 'success' }
```

## Key implementation details interviewers probe for

- **Exponential growth**: delay is `baseDelayMs * factor ^ attemptNumber`, capped by `maxDelayMs` so retries don't wait an unbounded amount of time.
- **Jitter**: adding a small random amount to each delay prevents many callers retrying the same failing dependency from all retrying at the exact same instant and re-overwhelming it (the "thundering herd" problem).
- **Distinguishing retryable vs. non-retryable errors**: a production version would inspect `err` (e.g., only retry on network errors or 5xx responses, not on a 400 Bad Request) rather than blindly retrying every failure — see `scenarios/03-promisify-legacy-callback-api.md`'s sibling topic in `16-error-handling` for more on classifying errors.
- **Propagating the final error**: after retries are exhausted, the *last* error is thrown (not swallowed), so the caller can still handle or log the ultimate failure.
