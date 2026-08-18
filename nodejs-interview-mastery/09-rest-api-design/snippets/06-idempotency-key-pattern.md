# Snippet: Idempotency Key Pattern for a Non-Idempotent POST (e.g. Payments)

```js
const processedKeys = new Map(); // in production: Redis with TTL

app.post('/payments', (req, res) => {
  const idempotencyKey = req.get('Idempotency-Key');
  if (!idempotencyKey) return res.status(400).json({ error: { message: 'Idempotency-Key header required' } });

  if (processedKeys.has(idempotencyKey)) {
    return res.status(200).json(processedKeys.get(idempotencyKey)); // return the original result
  }

  const payment = { id: Date.now(), amount: req.body.amount, status: 'completed' };
  const response = { data: payment };
  processedKeys.set(idempotencyKey, response);
  res.status(201).json(response);
});
```

**Explanation:** The client generates a unique `Idempotency-Key` once per logical action (not per HTTP attempt) and sends it on every retry of that same action. The server stores the result of the *first* successful request keyed by that value; any retry with the same key short-circuits straight to the cached response instead of re-executing the charge. This makes an inherently non-idempotent operation (`POST`) safe to retry after a network timeout. A production-grade version should also hash the request body and reject (`409`) if the same key is reused with a different payload — see the output-based question on this exact gap.
