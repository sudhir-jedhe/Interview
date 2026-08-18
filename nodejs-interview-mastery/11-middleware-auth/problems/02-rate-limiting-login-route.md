# Problem: Simple Rate-Limiting Middleware (Fixed Window, In-Memory) Protecting a Login Route

## Problem statement

Implement fixed-window rate-limiting middleware to protect `POST /login` from brute-force credential-stuffing attacks, without any external dependency (no Redis, no `express-rate-limit`).

## Requirements

- Key the limit by IP (or, better, by the combination of IP + attempted email, to avoid one IP blocking legitimate attempts against many accounts)
- Fixed window: e.g. "max 5 attempts per 60 seconds," resetting cleanly at each window boundary
- Return `429 Too Many Requests` with a `Retry-After` header once the limit is hit
- Successful logins should optionally reset the counter for that key, so a legitimate user who mistypes their password twice then succeeds isn't punished later
- Clean up stale entries so the in-memory store doesn't grow unbounded

## Worked solution

```js
// middleware/loginRateLimiter.js

function createFixedWindowLimiter({ windowMs = 60_000, max = 5 } = {}) {
  const buckets = new Map(); // key -> { count, windowStart }

  // periodic cleanup so the Map doesn't grow forever with stale keys
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now - bucket.windowStart > windowMs) buckets.delete(key);
    }
  }, windowMs).unref(); // .unref() so this timer doesn't keep the process alive in tests/scripts

  function keyFor(req) {
    const email = (req.body?.email || '').toLowerCase().trim();
    return `${req.ip}:${email}`;
  }

  function middleware(req, res, next) {
    const key = keyFor(req);
    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket || now - bucket.windowStart >= windowMs) {
      // new window — either first attempt ever, or the previous window has elapsed
      bucket = { count: 0, windowStart: now };
      buckets.set(key, bucket);
    }

    bucket.count++;

    if (bucket.count > max) {
      const retryAfterSec = Math.ceil((bucket.windowStart + windowMs - now) / 1000);
      res.set('Retry-After', String(retryAfterSec));
      return res.status(429).json({ error: { message: 'Too many login attempts, please try again later' } });
    }

    req._rateLimitKey = key; // stash so a downstream handler can reset it on success
    next();
  }

  function reset(key) {
    buckets.delete(key);
  }

  return { middleware, reset, keyFor };
}

module.exports = createFixedWindowLimiter;
```

```js
// routes/auth.js
const express = require('express');
const router = express.Router();
const createFixedWindowLimiter = require('../middleware/loginRateLimiter');

const loginLimiter = createFixedWindowLimiter({ windowMs: 60_000, max: 5 });

router.post('/login', loginLimiter.middleware, async (req, res) => {
  const user = await verifyLogin(req.body.email, req.body.password);
  if (!user) {
    return res.status(401).json({ error: { message: 'Invalid credentials' } });
  }

  loginLimiter.reset(req._rateLimitKey); // legitimate login clears the attempt counter for this key
  const accessToken = signAccessToken(user);
  res.json({ accessToken });
});

module.exports = router;
```

**Why key by `IP:email` instead of just IP:** a shared-IP scenario (office network, university, NAT'd mobile carrier) would otherwise let one abusive user's failed attempts lock out every other legitimate user behind the same IP trying to log into *different* accounts. Keying by the pair means the limit tracks "attempts against this specific account from this specific source," which is both the actual threat model (credential stuffing targets one account repeatedly) and fairer to unrelated users sharing an IP. In production, back this with Redis (`INCR` + `EXPIRE`) instead of an in-memory `Map` so limits are enforced consistently across multiple server instances.
