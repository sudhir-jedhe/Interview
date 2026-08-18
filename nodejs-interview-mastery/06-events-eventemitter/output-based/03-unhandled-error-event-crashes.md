# Unhandled 'error' Event Crashes the Process

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.emit('error', new Error('oops'));
console.log('never reached?');
```

**Answer:** Node throws an uncaught exception and crashes the process before `'never reached?'` ever logs.

**Why:** `'error'` is a special event name in EventEmitter. If emitted with no listeners registered for it, Node re-throws the error synchronously inside `emit()`. Since nothing catches it, it becomes an uncaught exception, which by default terminates the process.
