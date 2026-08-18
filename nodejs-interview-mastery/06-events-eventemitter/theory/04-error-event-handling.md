# The Special 'error' Event

Node singles out `'error'` as special: **if an `EventEmitter` emits `'error'` and there is no listener registered for it, Node throws the error and, by default, crashes the process** (uncaught exception). This is deliberate — silent error swallowing in async code is dangerous, so Node forces you to opt in to handling it explicitly.

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();
ee.emit('error', new Error('boom')); // throws synchronously, crashes process if unhandled

// Correct: always attach an error listener on emitters you don't fully control
ee.on('error', (err) => console.error('handled:', err.message));
ee.emit('error', new Error('boom')); // logged, no crash
```

Any code creating sockets, streams, or child processes should always attach an `'error'` listener before doing anything else with the object, since errors can fire asynchronously at any time.
