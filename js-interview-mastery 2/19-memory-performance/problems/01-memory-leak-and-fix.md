# Problem: Deliberately create a memory leak, then fix it

**Task:** Write a script that leaks memory via a forgotten `setInterval` closure holding a large array, demonstrate why it leaks, then fix it.

## The leaky version

```js
function startDashboardPolling() {
  // Simulates a large in-memory dataset the polling loop "needs" to reference
  const cachedRecords = new Array(500_000).fill(0).map((_, i) => ({ id: i, value: Math.random() }));

  setInterval(() => {
    // Only ever reads the length, but the WHOLE cachedRecords array stays
    // reachable because the callback closure references it, and setInterval
    // holds a live reference to the callback for as long as it keeps running.
    console.log("polling... currently tracking", cachedRecords.length, "records");
  }, 5000);

  // Bug: the interval id is never returned or stored anywhere.
  // There is now NO way to ever call clearInterval() on it -- this interval,
  // and therefore `cachedRecords` (half a million objects), leaks for the
  // entire lifetime of the page/process.
}

startDashboardPolling();
// Calling this function 10 times (e.g., across 10 SPA navigations to a
// "dashboard" page) leaks 10 separate 500,000-element arrays, forever --
// nothing in the program retains a way to stop any of the intervals.
```

## Why it leaks

1. `setInterval`'s callback is a closure over `cachedRecords`.
2. The browser/Node runtime itself holds a reference to that callback as long as the interval is active (that's how it's able to keep calling it every 5s).
3. Because the interval id was never captured, there is no code path anywhere that can call `clearInterval()` — the interval, its closure, and everything the closure references (`cachedRecords`, half a million objects) are reachable from a GC root (the runtime's internal timer list) forever, or until the page/process itself terminates.

## The fix

```js
function startDashboardPolling() {
  const cachedRecords = new Array(500_000).fill(0).map((_, i) => ({ id: i, value: Math.random() }));

  const intervalId = setInterval(() => {
    console.log("polling... currently tracking", cachedRecords.length, "records");
  }, 5000);

  // Return a teardown function so the caller can stop polling and release cachedRecords.
  return function stopPolling() {
    clearInterval(intervalId);
    // After this point, nothing references cachedRecords (assuming no other
    // code kept a copy), so it becomes eligible for garbage collection.
  };
}

const stop = startDashboardPolling();

// When the "dashboard" is torn down (e.g., component unmount, navigation away):
stop();
```

## Key takeaway

The fix isn't really about `cachedRecords` at all — it's about always keeping a handle (the interval id) to anything you start that runs indefinitely, and calling the matching teardown (`clearInterval`, `removeEventListener`, an unsubscribe function) at the point where that resource is no longer needed. This is the exact pattern described in `../scenarios/01-spa-memory-climbs-on-navigation.md`.
