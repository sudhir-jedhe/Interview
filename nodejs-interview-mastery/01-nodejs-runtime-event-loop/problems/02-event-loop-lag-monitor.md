# Problem: Implement a Function That Measures and Logs Event Loop Lag Using setImmediate

## Problem statement

Implement a reusable `startLagMonitor(intervalMs, onSample)` function that periodically measures how "late" the event loop is running compared to ideal — i.e., how much synchronous/CPU-bound work is delaying callback execution — using `setImmediate` as the measurement primitive (no `perf_hooks` allowed, to understand the mechanism from first principles).

## Requirements

- `startLagMonitor(intervalMs, onSample)` schedules a lag measurement roughly every `intervalMs`.
- Each measurement should compute how many milliseconds elapsed between *scheduling* a `setImmediate` callback and it actually *running*, which approximates event loop lag (in a healthy loop with no blocking work, this should be close to 0ms).
- `onSample(lagMs)` is called with each measurement.
- Return a `stop()` function to cancel further monitoring.

## Solution

```js
function startLagMonitor(intervalMs, onSample) {
  let stopped = false;
  let timer = null;

  function sample() {
    if (stopped) return;
    const start = Date.now();
    // setImmediate's callback runs in the check phase, right after the current
    // poll phase completes -- if the loop is healthy, this fires almost
    // instantly; if something is blocking the loop, this measurement absorbs
    // that delay directly, since it can't run until the blocking work finishes.
    setImmediate(() => {
      const lagMs = Date.now() - start;
      onSample(lagMs);
      if (!stopped) {
        timer = setTimeout(sample, intervalMs);
      }
    });
  }

  sample();

  return function stop() {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}

// Usage:
const stop = startLagMonitor(1000, (lagMs) => {
  console.log(`event loop lag: ${lagMs}ms`);
});

// Simulate blocking work after 3 seconds to see lag spike:
setTimeout(() => {
  const end = Date.now() + 500;
  while (Date.now() < end) {} // blocks for 500ms
}, 3000);

// stop(); // call when done monitoring
```

**How it works:** Each `sample()` call records `start = Date.now()` and immediately schedules a `setImmediate` callback. Under normal conditions, `setImmediate` fires on the very next check phase, so `Date.now() - start` is close to 0ms (just scheduling overhead). If synchronous CPU-bound work is occupying the main thread when the `setImmediate` callback *should* run, that callback can't execute until the blocking work finishes and the loop reaches the check phase — so the measured `lagMs` directly reflects how long the loop was unavailable. Chaining the next `sample()` via `setTimeout` (rather than `setInterval`) avoids stacking up overlapping measurements if a single sample takes longer than `intervalMs` to resolve.

This is the same underlying idea used by `perf_hooks.monitorEventLoopDelay()` (see `../scenarios/05-setinterval-heartbeat-firing-late.md` for that production-grade alternative), but built from scratch using only `setImmediate`/`setTimeout`/`Date.now()`.
