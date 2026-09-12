Write a utility function which prints the number starting from an initial value and increment in a step which can be started and stopped by the user any number of times.

Here is an implementation using a closure to manage internal state (`currentValue`, `timerId`, `isRunning`), returning an object with `start`, `stop`, `reset`, and `getStatus` controls.

---

### Implementation

```javascript
/**
 * Creates an interval-based counter that can be started and stopped repeatedly.
 *
 * @param {Object} options
 * @param {number} [options.startValue=0] - Initial starting value.
 * @param {number} [options.step=1] - Increment added on each tick.
 * @param {number} [options.intervalMs=1000] - Frequency of ticks in milliseconds.
 * @param {Function} [options.onTick] - Custom handler (defaults to console.log).
 */
function createPausableCounter({
  startValue = 0,
  step = 1,
  intervalMs = 1000,
  onTick = (val) => console.log(val),
} = {}) {
  let currentValue = startValue;
  let timerId = null;
  let isRunning = false;

  function tick() {
    onTick(currentValue);
    currentValue += step;
  }

  function start() {
    if (isRunning) return; // Prevent multiple overlapping intervals

    isRunning = true;
    tick(); // Execute immediately on start/resume
    timerId = setInterval(tick, intervalMs);
  }

  function stop() {
    if (!isRunning) return;

    clearInterval(timerId);
    timerId = null;
    isRunning = false;
  }

  function reset(newValue = startValue) {
    stop();
    currentValue = newValue;
  }

  function getStatus() {
    return {
      currentValue,
      isRunning,
    };
  }

  return { start, stop, reset, getStatus };
}

```

---

### Usage Example

```javascript
// Configure counter: start at 10, step by 5, tick every 500ms
const counter = createPausableCounter({
  startValue: 10,
  step: 5,
  intervalMs: 500,
});

console.log("--- Starting counter ---");
counter.start(); // Prints: 10 immediately, then 15, 20...

// Pause after 1.6 seconds
setTimeout(() => {
  console.log("--- Pausing counter ---");
  counter.stop();
  console.log("Status while paused:", counter.getStatus());
}, 1600);

// Resume after 3 seconds
setTimeout(() => {
  console.log("--- Resuming counter ---");
  counter.start(); // Continues from where it left off
}, 3000);

// Stop and reset after 4.5 seconds
setTimeout(() => {
  console.log("--- Resetting counter to 0 ---");
  counter.reset(0);
  console.log("Status after reset:", counter.getStatus());
}, 4500);

```

---

### Key Details

* **Idempotent Controls:** Multiple calls to `start()` while running or `stop()` while paused are safely ignored to prevent leaking duplicate intervals.
* **Immediate Feedback:** `start()` invokes `tick()` immediately once so the user does not wait a full interval delay before the first number outputs.
* **State Preservation:** When `stop()` is called, `currentValue` remains intact in memory so subsequent `start()` calls pick up from the exact increment point.
