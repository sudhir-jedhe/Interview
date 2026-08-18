# Problem: Implement an Async Route Wrapper (catchAsync) From Scratch

## Problem statement

Build a `catchAsync` (a.k.a. `asyncHandler`) wrapper for Express 4 route handlers, and demonstrate concretely what breaks without it.

## Requirements

- `catchAsync(fn)` returns a new Express-compatible middleware/handler
- Any rejection from `fn` (whether from an awaited promise or a synchronous `throw` inside an `async` function) must reach `next(err)`
- Must work regardless of whether `fn` is `async` or returns a plain value/promise
- Should not swallow or alter the error in any way — the exact same `Error` object reaches the error middleware

## What breaks without it

```js
const express = require('express');
const app = express();

// BUG: no wrapper — Express 4 has no idea this handler's promise rejected
app.get('/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) throw new Error('User not found'); // rejection Express 4 never sees
  res.json({ data: user });
});

app.use((err, req, res, next) => {
  console.log('error middleware hit:', err.message); // NEVER RUNS for the case above
  res.status(500).json({ error: { message: err.message } });
});

// GET /users/999 (nonexistent) -> request just hangs forever, no response, no log
```
The client gets no response at all — not even a 500 — because the rejected promise returned by the `async` handler is never awaited or `.catch()`-ed by Express's routing layer. The connection simply hangs until the client's own timeout fires.

## Worked solution

```js
// utils/catchAsync.js
function catchAsync(fn) {
  return function wrappedHandler(req, res, next) {
    // Promise.resolve(...) normalizes both sync and async fn into a thenable,
    // so this works whether fn is `async` or a plain function that might throw.
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = catchAsync;
```

```js
// routes/users.js — the same handler, now wrapped
const catchAsync = require('../utils/catchAsync');

app.get('/users/:id', catchAsync(async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) throw new Error('User not found'); // now correctly forwarded
  res.json({ data: user });
}));

app.use((err, req, res, next) => {
  console.log('error middleware hit:', err.message); // now runs correctly
  res.status(err.status || 500).json({ error: { message: err.message } });
});

// GET /users/999 -> 500 { "error": { "message": "User not found" } }, logged correctly
```

**Why it works:** `catchAsync` returns a plain (non-async) function so Express treats it as an ordinary handler. Inside, `Promise.resolve(fn(req, res, next))` guarantees a promise regardless of what `fn` returns — if `fn` throws synchronously, `Promise.resolve()` never even gets a chance to run (the synchronous throw happens first and Express's own sync try/catch handles it); if `fn` is `async` and its returned promise rejects, `.catch(next)` intercepts that rejection and forwards it to `next(err)`, which is exactly the shape Express needs to route it to error-handling middleware.
