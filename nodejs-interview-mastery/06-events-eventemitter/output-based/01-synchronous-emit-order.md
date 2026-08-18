# emit() Runs Listeners Synchronously

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.on('go', () => console.log('A'));
console.log('start');
ee.emit('go');
console.log('end');
```

**Answer:** `start`, `A`, `end`.

**Why:** `emit()` invokes listeners synchronously, in the same call stack, before returning. There's no microtask/macrotask deferral involved — it behaves like a plain synchronous function call to each listener.
