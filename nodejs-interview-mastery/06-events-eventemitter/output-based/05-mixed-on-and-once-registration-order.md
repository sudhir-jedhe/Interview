# Mixed .on() and .once() Fire in Registration Order

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.on('x', () => console.log(1));
ee.once('x', () => console.log(2));
ee.on('x', () => console.log(3));

ee.emit('x');
ee.emit('x');
```

**Answer:** First emit: `1`, `2`, `3`. Second emit: `1`, `3`.

**Why:** Listeners fire in registration order regardless of `.on` vs `.once`. On the first `emit`, all three fire in order. The `.once` listener then removes itself, so the second `emit` only invokes the two `.on` listeners.
