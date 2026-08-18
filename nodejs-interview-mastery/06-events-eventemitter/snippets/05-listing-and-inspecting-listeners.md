# Listing and Inspecting Listeners for Debugging

`EventEmitter` exposes introspection methods useful for debugging suspected listener leaks or verifying setup.

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.on('save', () => {});
ee.on('save', () => {});
console.log(ee.listenerCount('save')); // 2
console.log(ee.eventNames());          // [ 'save' ]
```

`listenerCount(event)` and `eventNames()` are the two most useful methods for diagnosing "why do I have more listeners than I expect" bugs, without needing external tooling.
