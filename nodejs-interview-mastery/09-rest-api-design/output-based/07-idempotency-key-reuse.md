# Output-Based: Idempotency Key Reuse with Different Bodies

```js
const store = new Map();

app.post('/payments', (req, res) => {
  const key = req.get('Idempotency-Key');
  if (store.has(key)) return res.json(store.get(key));
  const result = { id: Date.now(), amount: req.body.amount };
  store.set(key, result);
  res.status(201).json(result);
});

// Request 1: Idempotency-Key: abc, body { amount: 100 } -> id: 1000
// Request 2: Idempotency-Key: abc, body { amount: 500 } -> ?
```

**Answer:** Request 2 returns `{ id: 1000, amount: 100 }` — the *original* result, not a new charge for 500.

**Why:** The naive implementation keys purely on the idempotency key and returns whatever was cached, ignoring that the body changed. This is "working as coded" but is a real design bug: a robust idempotency implementation should hash the request body together with the key and reject (409) if the same key is reused with a different payload, rather than silently returning stale data.
