# Interview Q&A: Promise Combinators

**Q: What's the difference between `Promise.all` and `Promise.allSettled`?**
`Promise.all` resolves with an array of values only if every input promise fulfills, and rejects immediately with the first rejection it encounters, discarding all other results. `Promise.allSettled` always resolves (never rejects) once every promise has settled, returning an array describing each outcome individually (`{status: 'fulfilled', value}` or `{status: 'rejected', reason}`), so partial failures don't erase successful results.

**Q: What's the difference between `Promise.race` and `Promise.any`?**
`Promise.race` settles with whichever promise settles first, whether it fulfills or rejects — a fast rejection "wins" the race and causes `race` to reject. `Promise.any` specifically waits for the first *fulfillment*, ignoring rejections along the way, and only rejects if every single promise rejects (with an `AggregateError` collecting all the reasons).

**Q: How would you implement a timeout for a promise that might never resolve (e.g., a hung network request)?**
Race it against a promise that rejects after a timer: `Promise.race([fetchPromise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))])`. Whichever settles first — the real fetch or the timeout — determines the outcome; note this doesn't cancel the underlying request (use `AbortController` for that), it just stops waiting for it.
