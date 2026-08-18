# Memory Leaks and MaxListenersExceededWarning

Every `EventEmitter` has a default max-listeners cap of **10 per event name**. If you exceed it, Node logs a `MaxListenersExceededWarning` to stderr — this is a heuristic leak detector, not a hard limit (nothing actually breaks at 11 listeners). It typically indicates a real bug: registering a new listener every time some function runs (e.g., inside a request handler) instead of once at setup time, which causes unbounded listener accumulation and genuine memory growth over the process lifetime.

```js
const { EventEmitter } = require('events');
const emitter = new EventEmitter();
for (let i = 0; i < 15; i++) {
  emitter.on('data', () => {});
}
// (node:12345) MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
// 11 data listeners added. Use emitter.setMaxListeners() to increase limit
```

If the high listener count is legitimate (not a leak), raise the limit with `emitter.setMaxListeners(n)`. If it's not legitimate, the fix is almost always to move `.on()` calls out of hot/repeated code paths and into one-time setup, or to use `.once()` where appropriate. See `problems/03-fix-listener-memory-leak.md` for a full worked example of diagnosing and fixing this in a long-running service.
