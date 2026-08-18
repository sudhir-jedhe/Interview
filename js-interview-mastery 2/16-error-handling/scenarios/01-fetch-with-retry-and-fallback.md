**You're building a function that fetches a user profile from an API. If the network fails, you want to retry twice with a delay before giving up and showing a fallback UI. How do you implement this, and what edge cases matter?**

**Approach:**
Wrap the fetch in a retry loop with `try`/`catch` around each `await`, and only propagate the error after retries are exhausted. Edge cases: distinguishing a network failure from a valid-but-error HTTP response (fetch doesn't reject on 404/500 — you must check `res.ok`), avoiding infinite retries, and not retrying on errors that won't be fixed by retrying (e.g., a 400 Bad Request).

```js
async function fetchWithRetry(url, retries = 2, delayMs = 500) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        // Only retry on server errors; don't retry client errors like 400/404
        if (res.status >= 500 && attempt < retries) {
          await new Promise(r => setTimeout(r, delayMs));
          continue;
        }
        throw new Error(`Request failed: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err; // exhausted retries, propagate
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}
```
See `problems/02-safeasync-go-style-tuple.md` for a wrapper that turns a call like this into a `[error, result]` tuple instead of a throw, and the async-js topic's `problems/03-async-retry-with-backoff.md` for a more general exponential-backoff version of this same pattern.
