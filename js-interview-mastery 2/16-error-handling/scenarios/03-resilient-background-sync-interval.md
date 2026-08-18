**Your app has a background sync feature using `setInterval` that pushes local changes to a server every 30 seconds. Occasionally it throws and silently kills future syncs. How do you make it resilient?**

**Approach:**
The core bug is usually that an uncaught throw inside the interval's callback doesn't stop `setInterval` itself, but if the callback is `async` and rejects, nothing observes it — and if a synchronous throw happens before an internal state flag resets, subsequent ticks can get stuck. Wrap each tick's logic in `try`/`catch`, ensure a `finally` resets any in-flight flags, and add a global `unhandledrejection` listener as a safety net for anything that slips through.

```js
let syncing = false;

async function syncTick() {
  if (syncing) return; // avoid overlapping ticks
  syncing = true;
  try {
    await pushLocalChanges();
  } catch (err) {
    console.error("sync failed, will retry next tick:", err);
    reportToMonitoring(err);
  } finally {
    syncing = false; // always released, even after an error
  }
}

setInterval(syncTick, 30000);

window.addEventListener("unhandledrejection", (event) => {
  console.error("unexpected unhandled rejection:", event.reason);
  reportToMonitoring(event.reason);
});
```
See `problems/03-global-unhandled-rejection-uncaught-exception-handlers.md` for the Node equivalent of this safety net, wired up for a standalone script.
