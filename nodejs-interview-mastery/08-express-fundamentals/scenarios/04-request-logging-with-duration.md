# Logging Method/Path/Status/Duration for Every Request

**Scenario:** Your team wants request logging (method, path, status code, duration) for every request, but the duration can only be known after the response finishes. How do you implement this as Express middleware?

**Approach:** Register logging middleware early (so it wraps the whole downstream chain), record a start timestamp, and hook into the response's `'finish'` event (emitted once the response has been fully sent) to log the final status and computed duration — rather than trying to log immediately after `next()`, which would run before the response is actually complete.

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`);
  });

  next();
});

app.get('/slow', async (req, res) => {
  await new Promise((r) => setTimeout(r, 200));
  res.json({ done: true });
});

app.listen(3000);
```

Using `res.on('finish', ...)` instead of code placed immediately after `next()` is the key insight: `next()` returns as soon as control passes to the next middleware, long before the actual response has been written to the socket — `'finish'` is the correct signal that the full response, including the final status code, is known and sent. See `problems/03-request-logging-middleware.md` for a standalone, reusable version of this middleware.
