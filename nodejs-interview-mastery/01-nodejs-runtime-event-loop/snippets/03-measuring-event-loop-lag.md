# Measuring Event Loop Lag Caused by a Synchronous Blocking Loop

A quick way to observe blocking: schedule a `setTimeout(fn, 0)` right before running a synchronous busy-loop, and measure how much later than expected the timer actually fires.

```js
const start = Date.now();
setTimeout(() => {
  console.log(`Timer fired ${Date.now() - start}ms late`);
}, 0);

const blockUntil = Date.now() + 200;
while (Date.now() < blockUntil) {} // blocks the single JS thread
```

**Output (approximate):** `Timer fired 200ms late`

The timer was scheduled to fire essentially immediately, but it can't run until the event loop reaches the timers phase — and the synchronous `while` loop occupies the single JS thread for the full 200ms first. This is a simple diagnostic pattern; for continuous production monitoring, see `../problems/02-event-loop-lag-monitor.md`, which builds a reusable lag-measuring utility using `setImmediate`, and `../scenarios/05-setinterval-heartbeat-firing-late.md`, which uses `perf_hooks.monitorEventLoopDelay()` for percentile-based lag tracking.
