# Registering the Same Listener Twice Adds It Twice

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

function handler() { console.log('called'); }
ee.on('x', handler);
ee.on('x', handler);
ee.emit('x');
console.log(ee.listenerCount('x'));
```

**Answer:** `called`, `called`, then `2`.

**Why:** `EventEmitter` does not deduplicate listeners — registering the exact same function reference twice with `.on` adds it twice, and it will be invoked twice per emit. `listenerCount` reflects both registrations. (Calling `.off(handler)` once would only remove the first matching instance, leaving one behind.)
