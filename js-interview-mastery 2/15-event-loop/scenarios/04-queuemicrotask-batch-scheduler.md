**You need to implement a lightweight polyfill-style scheduler that runs a large batch of independent callback functions "eventually," without blocking the main thread, but also without unnecessary delay (i.e., faster than repeated `setTimeout` calls, which get throttled/clamped). What built-in gives you this, and how does it fit into the event loop model?**

**Approach:**
`queueMicrotask()` schedules a callback as a genuine microtask — it runs as soon as the current synchronous execution and any already-queued microtasks finish, without the ~4ms minimum clamping that repeated nested `setTimeout` calls incur in browsers, and crucially without blocking the thread since it still respects the call stack being empty first:

```js
function runBatch(callbacks) {
  callbacks.forEach(cb => queueMicrotask(cb));
}
```
This is faster than `setTimeout`-based batching because microtasks have no minimum delay and run before the browser even considers rendering — but that's also the danger: scheduling too many/expensive microtasks can still starve rendering and input handling, since (unlike `setTimeout`) microtasks don't yield to the browser's rendering step at all. For genuinely large batches where responsiveness matters more than raw scheduling speed, chunking with `setTimeout` (or `requestIdleCallback` for "when the browser is idle" semantics) is the safer choice; `queueMicrotask` is best for smaller, fast, must-run-before-anything-else deferred work — e.g., normalizing internal library callback timing to always be async even when a value is already available synchronously.
