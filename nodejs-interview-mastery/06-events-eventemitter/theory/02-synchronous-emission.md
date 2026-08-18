# Emission Is Synchronous — This Surprises People

`emit()` does not schedule listeners for later — it calls every registered listener **immediately, synchronously, in the current call stack**, in registration order. This means:

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();
ee.on('x', () => console.log('listener 1'));
ee.on('x', () => console.log('listener 2'));

console.log('before emit');
ee.emit('x');
console.log('after emit');

// before emit
// listener 1
// listener 2
// after emit
```

Nothing runs "after" `emit()` returns until *all* listeners have run. If a listener throws synchronously and no one catches it, it propagates up through `emit()` — which can crash the process if uncaught. If a listener is itself async (e.g., `async function` or does `setTimeout`), `emit()` does **not** wait for it; it fires-and-forgets, moving to the next listener and then returning control to the caller. This is a common bug source: people assume emitting will "wait" for async listeners the way `await` would.

## emit() to a synchronous listener vs deferral via process.nextTick / setImmediate

| Aspect | emit() to a sync listener | Deferred via nextTick/setImmediate |
|---|---|---|
| Timing | Runs immediately, same call stack | Scheduled for a later turn of the event loop/microtask queue |
| Stack trace on error | Preserves the emit() call site | Loses the original synchronous stack |
| Risk | Can block the event loop if listener is slow | Non-blocking, but adds latency |

Use direct synchronous emission for cheap, fast listeners; if a listener does heavy synchronous work, consider deferring it (e.g., wrapping in `setImmediate`) so it doesn't block other pending I/O. A common mistake is assuming `emit()` implicitly defers execution the way `setTimeout(fn, 0)` would — it does not.
