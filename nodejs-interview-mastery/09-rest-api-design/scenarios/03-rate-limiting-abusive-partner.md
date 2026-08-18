# Scenario: A Public API Is Getting Hammered by a Misbehaving Integration

You expose `/api/*` to third-party partners. One partner's buggy retry loop is sending thousands of requests per minute, causing latency spikes for all other partners.

**Approach:**
Add per-API-key rate limiting with a sliding window (or token bucket), returning `429` with a `Retry-After` header so well-behaved clients back off automatically. In production use a shared store (Redis) so limits apply correctly across multiple app instances, not just one.

```js
const rateLimit = require('express-rate-limit');
// npm install express-rate-limit ioredis rate-limit-redis (production store)

const limiter = rateLimit({
  windowMs: 60_000,
  max: (req) => req.apiKeyTier === 'premium' ? 1000 : 100, // tiered limits
  keyGenerator: (req) => req.apiKey,
  standardHeaders: true, // adds RateLimit-* headers
  handler: (req, res) => {
    res.status(429).json({ error: { message: 'Rate limit exceeded', code: 'RATE_LIMITED' } });
  },
});

app.use('/api', identifyApiKey, limiter);
```
Also alert on sustained 429 rates per client so you can proactively reach out rather than waiting for a support ticket.
