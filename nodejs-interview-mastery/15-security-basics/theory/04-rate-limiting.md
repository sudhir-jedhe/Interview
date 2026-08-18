# Security Basics — Rate Limiting

## Why rate limiting matters

Rate limiting throttles requests per IP/user/API-key to blunt brute-force login attempts and basic DoS. `express-rate-limit` is the standard middleware; apply stricter limits on sensitive endpoints (login, password reset) than on general API traffic.

```js
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }); // 5 attempts / 15 min
app.post('/login', loginLimiter, loginHandler);
```

Apply the strictest limits on sensitive, low-cost-to-abuse endpoints — login, password reset, signup — since those are the ones attackers automate against; general read-only API traffic can tolerate a looser limit. Note that a simple in-process rate limiter is scoped per process — if your app runs behind `cluster` or across multiple instances, counters need to live in a shared store (Redis) for the limit to actually be enforced globally rather than per-worker.
