```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
```
**Answer:** `A D C B`
**Why:** Synchronous code (`A`, `D`) runs first to completion. The promise callback is a microtask and the timeout callback is a macrotask; the microtask queue is fully drained before the event loop even considers the next macrotask, so `C` logs before `B` regardless of the 0ms delay.
