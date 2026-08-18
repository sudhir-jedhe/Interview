# Scenario: Clients Keep Double-Submitting Payments on Network Timeouts

You're building a checkout API. Mobile clients on flaky networks sometimes time out waiting for a response to `POST /payments`, then automatically retry the same request. Support tickets show customers being charged twice.

**Approach:**
Require clients to send a unique `Idempotency-Key` header generated once per user action (not per HTTP attempt). The server stores the result keyed by that value; a retry with the same key returns the original response instead of re-executing the charge.

```js
const crypto = require('crypto');
const idempotencyStore = new Map(); // production: Redis with TTL (e.g. 24h)

app.post('/payments', async (req, res) => {
  const key = req.get('Idempotency-Key');
  if (!key) return res.status(400).json({ error: { message: 'Idempotency-Key required' } });

  const bodyHash = crypto.createHash('sha256').update(JSON.stringify(req.body)).digest('hex');
  const cached = idempotencyStore.get(key);

  if (cached) {
    if (cached.bodyHash !== bodyHash) {
      return res.status(409).json({ error: { message: 'Idempotency key reused with different payload' } });
    }
    return res.status(cached.status).json(cached.body);
  }

  const payment = await chargeCard(req.body); // your actual charge logic
  const response = { status: 201, body: { data: payment } };
  idempotencyStore.set(key, { bodyHash, ...response });
  res.status(201).json(response.body);
});
```
Also make the underlying charge operation itself idempotent at the payment-provider level (Stripe supports its own idempotency keys) as defense in depth.
