# Problem: A Simple JSON Body-Parsing "Middleware" From Scratch

## Problem Statement

Implement `jsonBodyParser(options)`, a middleware-style function for a raw `http` server (no Express) that parses a JSON request body and attaches it to `req.body`, mimicking the essential behavior of `express.json()`: content-type checking, a size limit, and structured error propagation.

## Requirements

- Returns a function `(req, res, next) => void` — usable as `jsonBodyParser()(req, res, next)` for any raw handler willing to adopt this `(req, res, next)` convention.
- Only attempts to parse the body when `Content-Type` starts with `application/json`; otherwise calls `next()` immediately without touching `req`.
- Enforces a configurable `limit` (default 1MB) on total body size; aborts the request with a `413`-flavored error passed to `next(err)` if exceeded, without buffering more than the limit.
- On successful parse, sets `req.body` to the parsed object and calls `next()`.
- On malformed JSON, calls `next(err)` with a descriptive error rather than crashing or hanging.
- Never double-calls `next()` for the same request.

## Approach

This mirrors the manual JSON-parsing pattern from the theory notes, but hardened into a reusable, config-driven function with the three things hand-rolled parsing usually forgets: a size cap enforced incrementally (not after the fact), content-type gating, and consistent error propagation via a `next(err)` convention rather than ad hoc try/catch scattered across every route.

## Solution

```js
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

function jsonBodyParser({ limit = 1024 * 1024 } = {}) {
  return function (req, res, next) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.startsWith('application/json')) {
      return next(); // not our content-type; leave req untouched
    }

    let receivedBytes = 0;
    const chunks = [];
    let settled = false;

    const finish = (err) => {
      if (settled) return; // guard against double-calling next() (e.g. after destroy())
      settled = true;
      req.removeListener('data', onData);
      req.removeListener('end', onEnd);
      req.removeListener('error', onError);
      next(err);
    };

    function onData(chunk) {
      receivedBytes += chunk.length;
      if (receivedBytes > limit) {
        // Stop consuming further data and respond immediately. Deliberately NOT
        // calling req.destroy() here — destroying the request tears down the
        // shared socket before res.end() can flush the 413 response to the client.
        return finish(new HttpError(413, `Request body exceeds limit of ${limit} bytes`));
      }
      chunks.push(chunk);
    }

    function onEnd() {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw.length === 0) {
        req.body = {};
        return finish();
      }
      try {
        req.body = JSON.parse(raw);
        finish();
      } catch (err) {
        finish(new HttpError(400, 'Malformed JSON body'));
      }
    }

    function onError(err) {
      finish(err);
    }

    req.on('data', onData);
    req.on('end', onEnd);
    req.on('error', onError);
  };
}

module.exports = { jsonBodyParser, HttpError };

// --- verification (usage sketch against a raw http server) ---
const http = require('http');

function run(req, res, middlewares, handler) {
  let i = 0;
  function next(err) {
    if (err) {
      res.writeHead(err.statusCode || 500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
    const mw = middlewares[i++];
    if (mw) return mw(req, res, next);
    handler(req, res);
  }
  next();
}

const server = http.createServer((req, res) => {
  run(req, res, [jsonBodyParser({ limit: 1024 })], () => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: req.body }));
  });
});

module.exports.server = server;
```

**Why this works:** the byte count is checked incrementally inside `onData`, so an oversized body is rejected as soon as the limit is crossed rather than after the entire payload has already been buffered — this is the difference between a real DoS mitigation and a cosmetic one. Removing the `'data'`/`'end'`/`'error'` listeners in `finish()` (instead of destroying the request) means the 413 response can still be written and flushed over the same socket; any further bytes the client keeps sending are simply left unread, which lets Node's own backpressure handle the client without a hard socket teardown. The `settled` guard prevents `next()` from firing twice, e.g. if `'error'` fires on `req` after the size limit already triggered `finish()`. Content-type gating means this middleware is safe to mount unconditionally ahead of every route, exactly like `express.json()` is.
