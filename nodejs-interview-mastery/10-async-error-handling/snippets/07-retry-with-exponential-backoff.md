# Snippet: Retrying a Flaky Async Operation with Exponential Backoff

```js
async function withRetry(fn, { retries = 3, baseDelayMs = 100 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// usage: await withRetry(() => fetch('https://flaky-api.example.com/data'));
```

**Explanation:** `withRetry` takes any zero-argument async function and retries it on failure, doubling the delay after each attempt (`baseDelayMs * 2^(attempt-1)`: 100ms, 200ms, 400ms, ...) — the standard "exponential backoff" shape that avoids hammering a struggling downstream service with immediate retries. Once `attempt` exceeds `retries`, the original error is rethrown rather than swallowed, so a caller that exhausts all retries still sees a rejected promise instead of silently succeeding with no result. See `problems/` for a fuller version with jitter and a maximum delay cap.
