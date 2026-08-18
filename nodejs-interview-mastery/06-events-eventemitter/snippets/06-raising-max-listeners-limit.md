# Raising the Max Listeners Limit for a Legitimately High-Fanout Emitter

When a high listener count is expected behavior (not a leak), raise the cap explicitly instead of ignoring the warning.

```js
const { EventEmitter } = require('events');
const bus = new EventEmitter();
bus.setMaxListeners(50); // suppress warning when 50 subscribers is expected

for (let i = 0; i < 20; i++) {
  bus.on('broadcast', () => {}); // no MaxListenersExceededWarning now
}
console.log(bus.listenerCount('broadcast')); // 20
```

Prefer scoping `setMaxListeners` to the specific emitter that needs it, rather than raising `EventEmitter.defaultMaxListeners` globally, which would hide genuine leaks in unrelated code elsewhere in the process.
