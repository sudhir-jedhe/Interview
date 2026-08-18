# Removing a Specific Listener with off()

To remove a listener later, you need a reference to the exact same function passed to `.on()` — anonymous inline arrows can't be removed since nothing can reference them afterward.

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

function onData(payload) {
  console.log('received:', payload);
}

ee.on('data', onData);
ee.emit('data', 1); // received: 1
ee.off('data', onData);
ee.emit('data', 2); // nothing logged
```

`.off()` is an alias for `.removeListener()`; both remove a single matching listener instance.
