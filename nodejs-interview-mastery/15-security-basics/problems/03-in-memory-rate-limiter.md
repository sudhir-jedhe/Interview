# Problem: A Simple In-Memory Rate Limiter to Mitigate Brute-Force Login Attempts

## Problem statement

Implement a rate limiter (without any external dependency like `express-rate-limit`) that tracks request counts per key (e.g., per IP address) within a sliding time window, and exposes Express middleware that rejects requests once the limit is exceeded within that window.

## Requirements

- `new RateLimiter({ windowMs, max })` — configurable window duration and max requests per window, per key.
- `limiter.check(key)` returns whether the request is allowed, and records it if so.
- Old timestamps outside the current window must be pruned so memory doesn't grow unbounded over the process's lifetime (a naive "count forever" implementation would itself become a memory leak).
- Expose `limiter.middleware()` returning Express middleware that keys by `req.ip`, calls `check()`, and responds `429` with a `Retry-After` hint if the limit is exceeded.
- Document the limitation explicitly: this is per-process only — it won't correctly enforce a global limit across multiple `cluster` workers or server instances (that requires a shared store like Redis).

## Solution

```js
// rate-limiter.js
class RateLimiter {
  constructor({ windowMs, max }) {
    this.windowMs = windowMs;
    this.max = max;
    this.hits = new Map(); // key -> array of timestamps (ms) within the current window
  }

  check(key) {
    const now = Date.now();
    const timestamps = this.hits.get(key) || [];

    // Prune timestamps that have aged out of the window — keeps memory bounded
    const withinWindow = timestamps.filter((t) => now - t < this.windowMs);

    if (withinWindow.length >= this.max) {
      this.hits.set(key, withinWindow); // still store the pruned list
      const oldestInWindow = withinWindow[0];
      const retryAfterMs = this.windowMs - (now - oldestInWindow);
      return { allowed: false, retryAfterMs };
    }

    withinWindow.push(now);
    this.hits.set(key, withinWindow);
    return { allowed: true };
  }

  middleware() {
    return (req, res, next) => {
      const key = req.ip;
      const result = this.check(key);

      if (!result.allowed) {
        res.set('Retry-After', Math.ceil(result.retryAfterMs / 1000).toString());
        return res.status(429).json({ error: 'Too many requests, please try again later.' });
      }

      next();
    };
  }
}

module.exports = { RateLimiter };
```

```js
// server.js
const express = require('express');
const { RateLimiter } = require('./rate-limiter');

const app = express();
app.use(express.json());

// 5 login attempts per 15-minute window, per client IP
const loginLimiter = new RateLimiter({ windowMs: 15 * 60 * 1000, max: 5 });

app.post('/login', loginLimiter.middleware(), (req, res) => {
  // ... real auth logic here ...
  res.json({ ok: true });
});

module.exports = app;
```

```js
// Note on scaling beyond a single process:
// This RateLimiter's `hits` Map lives in one process's memory. If the app runs under
// `cluster` (one worker per CPU core) or across multiple instances behind a load
// balancer, each worker/instance enforces its OWN independent limit — an attacker
// distributing requests across workers could effectively get `max * numWorkers`
// attempts instead of `max`. For a limit that holds globally, back the counter with
// a shared store (Redis, using INCR + EXPIRE per key) instead of an in-process Map.
```

**How it works:** `check()` keeps a per-key array of hit timestamps, pruning any that have aged past `windowMs` on every call — this is what keeps the sliding window accurate (rather than a fixed window that resets all-at-once) and keeps memory bounded (old entries never accumulate forever, unlike an unbounded counter). If the pruned array's length is already at `max`, the request is rejected with a computed `retryAfterMs` based on when the oldest in-window hit will finally age out; otherwise the current timestamp is recorded and the request proceeds. The `middleware()` wrapper keys by `req.ip` and translates a rejected check into a `429` response with a `Retry-After` header, giving well-behaved clients a hint about when to retry — directly mitigating brute-force login attempts by making rapid repeated guesses expensive in wall-clock time.
