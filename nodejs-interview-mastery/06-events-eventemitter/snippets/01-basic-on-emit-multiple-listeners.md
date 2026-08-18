# Basic on/emit with Multiple Listeners

Listeners registered with `.on()` fire in the exact order they were added, every time the event is emitted.

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.on('greet', (name) => console.log(`Hello, ${name}`));
ee.on('greet', (name) => console.log(`Hi again, ${name}`));
ee.emit('greet', 'Sam'); // Hello, Sam \n Hi again, Sam
```

Both listeners receive the same arguments passed to `emit`, and both run synchronously before `emit` returns.
