# Output-Based: asyncHandler Wrapper Catching a Rejected Promise

```js
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/data', asyncHandler(async (req, res) => {
  const data = await fetchData(); // fetchData() rejects with new Error('db down')
  res.json(data);
}));

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// GET /data
```

**Answer:** Client receives `500 { "error": "db down" }`.

**Why:** `asyncHandler` wraps the call in `Promise.resolve(...)`, guaranteeing a thenable regardless of whether `fn` is async, and attaches `.catch(next)`. When `fetchData()` rejects, the rejection propagates out of the `async` handler function (an async function that throws/rejects internally returns a rejected promise), `.catch(next)` fires, forwarding the error to Express's error-handling middleware as if `next(err)` had been called directly.
