# Snippet: Cleaning up an interval/listener to avoid a leak

```js
function startPolling(emitter, intervalMs) {
  const id = setInterval(() => emitter.emit('tick'), intervalMs);
  return () => clearInterval(id); // caller MUST call this when done
}
const { EventEmitter } = require('events');
const emitter = new EventEmitter();
const stop = startPolling(emitter, 100);
emitter.on('tick', () => console.log('tick'));
setTimeout(stop, 350); // stops after ~3 ticks; without this the interval runs forever
```

**Explanation:** `startPolling` returns a disposer function that closes over the interval's ID, making cleanup explicit and impossible to forget the ID of. Without ever calling the returned `stop()` function, the `setInterval` would keep firing indefinitely — the classic forgotten-timer leak, since a live timer's callback closure keeps everything it references reachable for as long as the timer exists.
