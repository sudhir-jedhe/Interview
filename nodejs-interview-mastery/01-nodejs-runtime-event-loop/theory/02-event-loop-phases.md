# The Event Loop Phases

Node's runtime pairs V8 with libuv (see `01-v8-libuv-architecture.md`); this file covers the actual loop libuv runs to drive your JS callbacks. Each iteration ("tick") of the libuv event loop runs through ordered phases, each with its own FIFO callback queue:

1. **timers** — runs callbacks scheduled by `setTimeout`/`setInterval` whose threshold has elapsed.
2. **pending callbacks** — executes I/O callbacks deferred from the previous loop iteration (some system-level errors, e.g. TCP errors).
3. **idle, prepare** — internal use only.
4. **poll** — retrieves new I/O events; executes I/O-related callbacks (almost everything, e.g. `fs.readFile` callback). If the poll queue is empty, Node may block here waiting for callbacks, unless timers are due or `setImmediate` is queued.
5. **check** — `setImmediate` callbacks run here, always after poll.
6. **close callbacks** — e.g. `socket.on('close', ...)`.

```js
setTimeout(() => console.log('timer'), 0);
setImmediate(() => console.log('immediate'));
```

The order of these two is **not guaranteed** when run at the top level (timer precision varies), but inside an I/O callback `setImmediate` always fires before `setTimeout(fn, 0)`, because poll → check happens before looping back to timers:

```js
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate')); // always first here
});
```

## setTimeout(fn, 0) vs setImmediate(fn)

| Aspect | setTimeout(fn, 0) | setImmediate(fn) |
|---|---|---|
| Phase | timers | check |
| Guaranteed order at top level | No — depends on startup timing | No — same |
| Guaranteed order inside I/O callback | Runs after setImmediate | Always runs first |
| Minimum delay | Clamped to ~1ms internally | No delay concept, next check phase |

Use `setImmediate` when you want to defer work until after the current poll phase's I/O callbacks, e.g. inside an I/O callback where deterministic ordering matters. The most common mistake is assuming `setTimeout(fn, 0)` and `setImmediate` are interchangeable at the top level — they're not always ordered the same way outside an I/O context.

## Timer accuracy under load

Timers are only as accurate as the event loop's availability — if synchronous or CPU-heavy work occupies the main thread past a timer's due time, the timer callback simply waits in the timers-phase queue until the loop gets back to it; it does not queue up multiple missed firings, and it's not compensated for afterward. This applies to `setInterval` as much as `setTimeout`: a busy loop can cause heartbeat-style intervals to fire late and irregularly rather than "catching up." See `../scenarios/05-setinterval-heartbeat-firing-late.md` for a worked diagnostic example using `perf_hooks.monitorEventLoopDelay()`.
