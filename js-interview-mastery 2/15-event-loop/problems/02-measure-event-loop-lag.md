# Problem: Measure Actual Event Loop Lag

**Goal:** Implement a function that measures real event loop "lag" (a.k.a. delay, or jitter) — the gap between when a `setTimeout(fn, 0)` *should* fire and when it actually does, which grows whenever the event loop is busy with other synchronous or queued work. This is a real technique used by Node.js monitoring tools (e.g., `event-loop-lag` style libraries) to detect an overloaded process.

## Implementation (works in both Node and the browser)

```js
function measureEventLoopLag() {
  return new Promise((resolve) => {
    const expectedDelayMs = 0;
    const start = performance.now();
    setTimeout(() => {
      const actualDelayMs = performance.now() - start;
      const lagMs = actualDelayMs - expectedDelayMs;
      resolve(lagMs);
    }, expectedDelayMs);
  });
}
```

## Continuous monitoring with nested `setTimeout(0)`

A single measurement is noisy; a monitor that samples repeatedly (using nested timeouts, not `setInterval`, so a slow tick doesn't cause overlapping measurements) is more useful in practice:

```js
function startEventLoopLagMonitor(onSample, intervalMs = 500) {
  let stopped = false;

  function sample() {
    if (stopped) return;
    const start = performance.now();
    setTimeout(() => {
      const lagMs = performance.now() - start;
      onSample(lagMs);
      setTimeout(sample, intervalMs); // schedule the NEXT sample only after this one completes
    }, 0);
  }

  sample();
  return () => { stopped = true; }; // returns a stop function
}

const stop = startEventLoopLagMonitor((lagMs) => {
  console.log(`event loop lag: ${lagMs.toFixed(2)}ms`);
});
// stop() later to end monitoring
```

## Demonstrating it under load

```js
startEventLoopLagMonitor((lagMs) => console.log(`lag: ${lagMs.toFixed(1)}ms`), 200);

// Simulate the event loop being busy with a heavy synchronous task partway through:
setTimeout(() => {
  const start = Date.now();
  while (Date.now() - start < 300) {} // blocks for 300ms
  console.log('heavy synchronous work finished');
}, 1000);

// Expected: lag samples stay near 0-a few ms normally, then one sample spikes to
// roughly 300ms (or however much of the blocking window it overlapped with),
// because the setTimeout(0) inside sample() couldn't fire until the blocking loop released the stack.
```

## Key implementation details interviewers probe for

- **Why `performance.now()` (or `process.hrtime()` in Node) instead of `Date.now()`**: it's higher resolution and monotonic (never affected by system clock adjustments), which matters for measuring small millisecond-level lag accurately.
- **Why nested `setTimeout`, not `setInterval`**: `setInterval` can queue up overlapping callbacks if a tick runs long, silently distorting the "lag" measurement; scheduling the *next* sample only after the current one resolves guarantees samples never overlap.
- **What causes lag**: any synchronous work (heavy computation, huge loops), a long chain of microtasks that never yields to macrotasks, or in Node, blocking I/O in a way that starves the loop — this technique is exactly how you'd empirically confirm a suspected blocking bug in production.
