# Snippet: Simple In-Memory Rate Limiter Middleware (Sliding Window per IP)

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

**Explanation:** For each IP, the middleware keeps a rolling list of request timestamps and discards any older than the window (`now - t < windowMs`), giving a true sliding window rather than a fixed-bucket reset. If the count after adding the current request exceeds `max`, it responds `429` with a `Retry-After` hint. This in-memory version only works correctly on a single process — a multi-instance deployment needs a shared store (Redis) so limits are enforced consistently across all instances, otherwise each instance independently allows up to `max` requests.
