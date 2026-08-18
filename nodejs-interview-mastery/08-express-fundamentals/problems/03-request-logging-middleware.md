# Problem: Request Logging Middleware That Measures Response Time

## Problem Statement

Implement `requestLogger(options)`, an Express middleware factory that logs `method`, `path`, final `status` code, and `duration` in milliseconds for every request — where the status and duration can only be known once the response has actually finished sending.

## Requirements

- Returns an Express-compatible `(req, res, next) => void` middleware.
- Logs exactly once per request, after the response has fully finished (not right after `next()` is called, which runs before the response is complete).
- Log line includes: HTTP method, path (`req.originalUrl` if available, else `req.url`), final `res.statusCode`, and duration in milliseconds with one decimal place.
- Accepts an optional custom `logFn` (defaults to `console.log`) so it's testable without capturing stdout.
- Must not throw or double-log if the connection is aborted by the client mid-response (the `'close'` event can fire without `'finish'` firing).

## Approach

Record a high-resolution start time when the middleware runs (before calling `next()`), then attach a one-time listener to `res`'s `'finish'` event — Node's `http.ServerResponse` (which Express's `res` extends) emits `'finish'` exactly once, after the entire response has been flushed to the socket, at which point `res.statusCode` reflects the real final status. Guard against double-logging by also listening for `'close'` (which fires if the client disconnects before `'finish'`) and using a `logged` flag so at most one line is ever emitted per request.

## Solution

```js
function requestLogger({ logFn = console.log } = {}) {
  return function (req, res, next) {
    const startedAt = process.hrtime.bigint();
    let logged = false;

    const logOnce = (statusOverride) => {
      if (logged) return;
      logged = true;
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
      const path = req.originalUrl || req.url;
      const status = statusOverride ?? res.statusCode;
      logFn(`${req.method} ${path} ${status} ${durationMs.toFixed(1)}ms`);
    };

    res.on('finish', () => logOnce());
    // If the client disconnects before the response finishes, 'finish' never
    // fires — 'close' does, and we still want exactly one log line for the request.
    res.on('close', () => logOnce(res.statusCode || 'ABORTED'));

    next();
  };
}

module.exports = { requestLogger };

// --- verification, using a fake Express-like res built on EventEmitter ---
const { EventEmitter } = require('events');

function fakeRes() {
  const res = new EventEmitter();
  res.statusCode = 200;
  res.status = function (code) { res.statusCode = code; return res; };
  res.json = function () {
    process.nextTick(() => res.emit('finish')); // simulate async flush to the socket
    return res;
  };
  return res;
}

const logs = [];
const middleware = requestLogger({ logFn: (line) => logs.push(line) });

const req = { method: 'GET', originalUrl: '/api/users/42' };
const res = fakeRes();

middleware(req, res, () => {
  // simulate a route handler doing some work, then responding
  setTimeout(() => {
    res.status(200).json({ id: 42 });
  }, 15);
});

setTimeout(() => {
  console.log(logs);
  // [ 'GET /api/users/42 200 15.X ms' ]  (exact duration varies, format is stable)
}, 30);
```

**Why this works:** listening on `res.on('finish', ...)` rather than logging synchronously after `next()` returns is the crux of the problem — `next()` only hands control to the *next* middleware/handler; it returns long before that handler has actually produced and flushed a response, so `res.statusCode` at that point could still be the Express default (`200`) even if the real handler is about to set `404`. By the time `'finish'` fires, `res.statusCode` is guaranteed to reflect whatever the handler actually sent. The `logged` guard combined with listening to both `'finish'` and `'close'` ensures exactly one log line is produced whether the response completes normally or the client disconnects early — a case naive "just use `'finish'`" implementations often miss.
