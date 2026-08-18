# A Recursive Polling Function Using process.nextTick Is Causing Your HTTP Server to Stop Accepting New Connections

Someone wrote a "poll until condition" helper using `process.nextTick` recursively, and under certain conditions the server appears to hang and stop responding to incoming requests entirely.

**Approach:** Recursive `process.nextTick` calls are drained fully before the event loop can proceed to any other phase (including poll, where new connections are accepted) — if the recursion doesn't terminate quickly, it starves I/O indefinitely. Replace with `setImmediate` (a real phase that yields back to the loop) or, better, an actual event-driven wait:

```js
// Bad: can starve the event loop
function waitForCondition(check, cb) {
  if (check()) return cb();
  process.nextTick(() => waitForCondition(check, cb));
}

// Better: yields control back to the event loop each iteration
function waitForCondition(check, cb) {
  if (check()) return cb();
  setImmediate(() => waitForCondition(check, cb));
}
```

Best of all, avoid polling entirely — use an `EventEmitter` or Promise that resolves when the condition becomes true, driven by the actual event that changes it. See `../theory/03-microtasks-nexttick-promises.md` and `../snippets/06-nexttick-recursion-starvation.md` for the mechanics behind why this starves the loop.
