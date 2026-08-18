# Problem: An Async-Route Error-Catching Wrapper (catchAsync), and the Bug It Fixes

## Problem Statement

On Express 4, an `async` route handler that rejects does **not** automatically forward its error to `next(err)` — the rejection just becomes an unhandled promise rejection, and the client's request hangs forever (no response is ever sent, since nothing called `res.send`/`res.json`/`res.end` on the failure path). Implement a `catchAsync(fn)` wrapper that fixes this, and demonstrate the exact bug it fixes with a minimal reproduction that doesn't depend on Express itself.

## Requirements

- `catchAsync(fn)` returns a new `(req, res, next)` function.
- If `fn(req, res, next)` resolves, nothing extra happens (the handler already sent its own response).
- If `fn(req, res, next)` rejects (throws inside the async function, or explicitly rejects), the wrapper must call `next(err)` with that error — never let it become an unhandled rejection.
- Must work whether `fn` is `async` (returns a real Promise) or a plain sync function (in which case it should behave like calling `fn` directly, without breaking anything).
- Demonstrate, with a small self-contained "fake Express" dispatcher (no real Express dependency needed), that:
  - an **unwrapped** async handler that rejects leaves the request hanging (never reaches the error handler), and
  - the **same handler wrapped** in `catchAsync` correctly reaches the error handler.

## Approach

The core trick is `Promise.resolve(fn(req, res, next)).catch(next)`: wrapping the handler's return value in `Promise.resolve` normalizes both cases (a real Promise from an `async fn`, or a plain non-Promise return value from a sync `fn`) into a thenable, so `.catch(next)` can uniformly capture any rejection and forward it into the app's error-handling path via `next(err)`. To demonstrate the bug concretely without a real Express instance, build a tiny dispatcher that walks a middleware array with a `next()` closure — structurally identical to how Express itself invokes handlers — and show the same handler function hanging when unwrapped versus reaching the error handler when wrapped.

## Solution

```js
function catchAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { catchAsync };

// --- demonstration of the bug and the fix, using a minimal Express-like dispatcher ---

function runStack(layers, req, res) {
  let index = 0;
  const next = (err) => {
    if (err) {
      const errorLayer = layers.find((l) => l.isErrorHandler);
      return errorLayer
        ? errorLayer.handler(err, req, res, () => {})
        : console.error('UNHANDLED:', err);
    }
    const layer = layers[index++];
    if (!layer) return; // stack exhausted, nobody responded — simulates a hang
    if (layer.isErrorHandler) return next(); // skip error handlers during normal flow
    layer.handler(req, res, next);
  };
  next();
}

async function flakyHandler(req, res) {
  await new Promise((resolve) => setTimeout(resolve, 5));
  throw new Error('DB unavailable'); // simulates a rejected promise from a failed query
}

const errorHandler = {
  isErrorHandler: true,
  handler: (err, req, res, next) => {
    res.sentStatus = 500;
    res.sentBody = { error: err.message };
    console.log('error handler reached:', err.message);
  },
};

// In real Node, an unhandled promise rejection terminates the process by default
// (since Node 15). We capture that here purely to observe and log it for the
// demo instead of crashing — in production this is exactly the danger: an
// unwrapped async handler's rejection can crash the whole server, not just
// fail the one request.
process.on('unhandledRejection', (err) => {
  console.log('process-level unhandledRejection (the bug!):', err.message);
});

// --- BUGGY: unwrapped async handler ---
const buggyLayers = [{ handler: flakyHandler }, errorHandler];
const buggyRes = {};
runStack(buggyLayers, {}, buggyRes);
setTimeout(() => {
  console.log('buggy result after 20ms:', buggyRes); // {} — request "hung", error handler never reached
}, 20);

// --- FIXED: wrapped with catchAsync ---
const fixedLayers = [{ handler: catchAsync(flakyHandler) }, errorHandler];
const fixedRes = {};
runStack(fixedLayers, {}, fixedRes);
setTimeout(() => {
  console.log('fixed result after 20ms:', fixedRes); // { sentStatus: 500, sentBody: { error: 'DB unavailable' } }
}, 20);
```

**Why this works:** in the buggy version, `flakyHandler`'s returned promise is simply discarded by `runStack` — nothing is `await`ing or `.catch`ing it, so its eventual rejection becomes a Node-level unhandled rejection completely disconnected from the `next()`-driven dispatch chain, and the response object is never touched. `catchAsync` closes that gap by explicitly attaching `.catch(next)` to the handler's return value, so the rejection is captured and re-routed through the exact same `next(err)` mechanism the dispatcher already understands — which is precisely how Express 5 behaves out of the box, and precisely what `catchAsync`/`express-async-errors` retrofit onto Express 4.
