# once() Auto-Removes the Listener After First Invocation

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.once('ready', () => console.log('ready fired'));
ee.emit('ready'); // "ready fired"
ee.emit('ready'); // nothing — listener was removed after first call
```

This is the standard pattern for one-shot lifecycle events (`'ready'`, `'connect'`, `'close'`) where you don't want to manually track and remove the listener yourself.
