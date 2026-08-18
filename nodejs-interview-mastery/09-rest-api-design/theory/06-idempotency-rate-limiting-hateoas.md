# Idempotency, Rate Limiting, and HATEOAS

## Idempotency

An operation is idempotent if calling it once has the same effect as calling it N times. `GET`, `PUT`, `DELETE` are idempotent by definition (or should be); `POST` is not. This matters for retries: if a client times out waiting for a response, it's safe to blindly retry a `PUT` but not a `POST` (which could create duplicate resources) unless you add an idempotency key.

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

## Rate limiting

Protects your API from abuse and accidental overload — typically implemented via a token bucket or sliding window counter keyed by API key/IP, returning `429 Too Many Requests` with a `Retry-After` header when exceeded.

```js
function rateLimit({ windowMs, max }) {
  const hits = new Map(); // ip -> timestamps[]
  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip;
    const timestamps = (hits.get(ip) || []).filter(t => now - t < windowMs);
    timestamps.push(now);
    hits.set(ip, timestamps);

    if (timestamps.length > max) {
      res.set('Retry-After', String(Math.ceil(windowMs / 1000)));
      return res.status(429).json({ error: { message: 'Too many requests' } });
    }
    next();
  };
}

app.use('/api', rateLimit({ windowMs: 60_000, max: 100 }));
```

## HATEOAS

Hypermedia As The Engine Of Application State — responses include links describing available next actions (`{ "self": "/orders/7", "cancel": "/orders/7/cancel" }`). It's the "purest" form of REST per Roy Fielding's dissertation, but almost nobody implements it fully in practice because it adds complexity most clients don't need.

## REST vs HATEOAS-compliant REST

| Aspect | Typical "REST" API (what most teams build) | HATEOAS-compliant REST |
|---|---|---|
| Client coupling | Client hardcodes URL structure and available actions | Client discovers available actions from links in the response |
| Response size/complexity | Smaller, simpler payloads | Larger payloads carrying `_links`/`actions` metadata |
| Adoption | Extremely common (Stripe, GitHub, most internal APIs) | Rare in practice (some hypermedia-heavy APIs like Siren/HAL adopters) |

Use plain REST (no HATEOAS) for the vast majority of APIs — it's simpler to build, document, and consume with typical client SDKs. Reach for HATEOAS only when clients genuinely need to adapt to server-driven workflow changes without redeploying. The common mistake in interviews is claiming an API is "RESTful" while it's really just an HTTP/JSON API without HATEOAS — that's fine in practice, just be precise about the terminology.
