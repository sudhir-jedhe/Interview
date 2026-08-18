# once() Fires Only on the First emit()

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.once('x', () => console.log('once handler'));
ee.emit('x');
ee.emit('x');
ee.emit('x');
```

**Answer:** `once handler` (only once).

**Why:** `.once()` internally wraps the listener so that on its first invocation, it removes itself from the emitter before/while executing. Subsequent `emit('x')` calls find no listeners registered.
