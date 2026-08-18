# Snippet: Connection Retry with Exponential Backoff at App Startup

```js
async function connectWithRetry(pool, maxAttempts = 5) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connected');
      return;
    } catch (err) {
      const delay = 1000 * 2 ** attempt;
      console.warn(`DB connect attempt ${attempt} failed: ${err.message}. Retrying in ${delay}ms`);
      if (attempt === maxAttempts) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
```

**Explanation:** `SELECT 1` is a trivial no-op query used purely to verify the database is reachable and accepting connections — useful at application startup in containerized environments where the database container might take a moment longer to become ready than the app container. Each failed attempt doubles the delay before the next try (`1000 * 2^attempt`), and critically, once `attempt === maxAttempts`, the function `throw`s rather than silently returning — a caller relying on this function knows for certain whether the connection ultimately succeeded.
