# Your setInterval-Based Health-Check Heartbeat Starts Firing Late and Irregularly

A `setInterval(() => sendHeartbeat(), 1000)` was expected to fire every second, but under load, gaps of 3-5 seconds appear between heartbeats, and logs show other synchronous work happening around those times.

**Approach:** Timers are only as accurate as the event loop's availability — if synchronous or CPU-heavy work occupies the main thread past the interval's due time, the timer callback simply waits in the timers-phase queue until the loop gets back to it; it does not queue up multiple missed firings, and it's not compensated for. Diagnose with `perf_hooks.monitorEventLoopDelay()` to correlate lag with the gaps:

```js
const { monitorEventLoopDelay } = require('perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
setInterval(() => {
  console.log('event loop delay p99 (ms):', h.percentile(99) / 1e6);
  h.reset();
}, 5000);
```

Fix by moving the blocking work (found via profiling) off the main thread, or replacing `setInterval` with a self-correcting recursive `setTimeout` that measures actual elapsed drift, which won't fix underlying blocking but avoids compounding timer skew. See `../theory/02-event-loop-phases.md` for why timer accuracy degrades this way, and `../problems/02-event-loop-lag-monitor.md` for a reusable lag-monitoring utility.
