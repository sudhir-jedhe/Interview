# Output-Based: Connection Retry Loop with Unhandled Max-Attempts Case

```js
async function connectWithRetry(attempt = 1) {
  try {
    await fakeConnect(); // always rejects in this example
  } catch (err) {
    console.log('attempt', attempt, 'failed');
    if (attempt >= 3) return; // silently gives up
    await connectWithRetry(attempt + 1);
  }
}

connectWithRetry().then(() => console.log('connectWithRetry resolved'));
```

**Answer:** Logs `attempt 1 failed`, `attempt 2 failed`, `attempt 3 failed`, then `connectWithRetry resolved`.

**Why:** After the third failed attempt, the function returns `undefined` instead of throwing, so the promise chain resolves successfully — the caller has no way to know the connection actually never succeeded. This is a realistic bug: a retry helper that "gives up" without rethrowing makes callers believe the operation succeeded. The fix is to `throw err` (or a wrapping error) once `attempt >= maxAttempts` instead of silently returning.
