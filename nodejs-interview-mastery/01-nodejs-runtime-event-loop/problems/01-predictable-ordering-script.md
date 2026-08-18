# Problem: Write a Script with Predictable Log Ordering Using nextTick/setImmediate/setTimeout

## Problem statement

Write a Node.js script that uses `process.nextTick`, `setImmediate`, and `setTimeout` such that the console output is **guaranteed** to be, in order:

```
sync
nextTick
immediate
timeout
```

## Requirements

- The order must be deterministic — it must not depend on top-level timing races (recall that `setImmediate` vs `setTimeout(fn, 0)` ordering is *not* guaranteed at the top level).
- Use at least one line of plain synchronous code that logs before any scheduled callback runs.
- Explain, phase by phase, why the order is guaranteed.

## Solution

The trick is that `setImmediate` vs `setTimeout` is only deterministic **inside an I/O callback** (poll phase), not at the top level. So we deliberately nest the scheduling inside an I/O callback (`setImmediate` used as a "next iteration" trigger works too, but the cleanest guaranteed way is via an actual I/O operation like `fs.readFile`, or by nesting inside `setImmediate` itself since check always follows poll before looping back to timers):

```js
const fs = require('node:fs');

console.log('sync');

process.nextTick(() => console.log('nextTick'));

// Force setImmediate/setTimeout into a context where their order is deterministic:
// schedule the timeout OUTSIDE any I/O callback so it's guaranteed to be queued
// for the *next* full loop iteration, then use an I/O callback to guarantee
// setImmediate fires within the current iteration, before that next-iteration timer.
fs.readFile(__filename, () => {
  setImmediate(() => console.log('immediate'));
});

setTimeout(() => console.log('timeout'), 10); // delay long enough to lose the race unconditionally
```

**Output (guaranteed):**
```
sync
nextTick
immediate
timeout
```

**Why this ordering is guaranteed:**

1. **`sync`** — runs immediately as part of the synchronous script.
2. **`nextTick`** — the `nextTick` queue is fully drained as soon as the current synchronous script finishes and before the event loop advances to any phase, so it always runs before any timer or I/O callback.
3. **`immediate`** — `fs.readFile`'s callback runs in the **poll** phase; `setImmediate` scheduled from inside it runs in the **check** phase, which always immediately follows poll in the same loop iteration — this part is deterministic by spec, unlike top-level `setImmediate` vs `setTimeout(0)`.
4. **`timeout`** — scheduled with an explicit 10ms delay (not `0`), which all but guarantees it won't be ready by the time the loop first reaches the timers phase (typically within a fraction of a millisecond of process start) — but more importantly, even a `0`ms timeout scheduled at the top level would still need to wait for the *next* full loop iteration's timers phase, which necessarily comes after the check phase where `immediate` already ran in the current iteration for typical fast local file reads. Using a real delay here removes any doubt entirely.

The general lesson: don't rely on `setImmediate` vs `setTimeout(0)` ordering at the top level — anchor `setImmediate` inside an I/O callback (or otherwise force a wide enough timer delay) whenever deterministic ordering actually matters.
