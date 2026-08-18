# A blocking synchronous loop delays EVERYTHING, even "immediate" async work

```js
console.log('start');
setTimeout(() => console.log('timeout fired'), 0);
const start = Date.now();
while (Date.now() - start < 100) {} // blocks the thread for 100ms
console.log('after blocking loop');
// start
// after blocking loop   <- runs ~100ms later, then...
// timeout fired          <- only now, even though it was "due" much earlier
```

The timer callback becomes ready almost immediately, but it cannot run until the call stack empties — and the synchronous `while` loop keeps the stack busy for the full 100ms.
