# Always Guard Against Unhandled 'error' Events

Since `'error'` is treated specially by `EventEmitter` (see the theory notes on the error event), a factory function that always attaches a listener before returning the emitter is a common defensive pattern.

```js
const { EventEmitter } = require('events');

function createSafeEmitter() {
  const ee = new EventEmitter();
  ee.on('error', (err) => console.error('caught safely:', err.message));
  return ee;
}

const emitter = createSafeEmitter();
emitter.emit('error', new Error('something failed')); // logged, process stays alive
```

Without the `.on('error', ...)` registration, this same `emit('error', ...)` call would throw and crash the process.
