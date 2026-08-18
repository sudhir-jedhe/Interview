```js
setTimeout(() => console.log('timeout 1'), 0);
setTimeout(() => console.log('timeout 2'), 0);
Promise.resolve().then(() => console.log('promise 1'));
Promise.resolve().then(() => console.log('promise 2'));
```
**Answer:** `promise 1 promise 2 timeout 1 timeout 2`
**Why:** Both promise callbacks are microtasks and both timeout callbacks are macrotasks. All queued microtasks run before the *first* macrotask is even attempted, and within each queue, callbacks run in the order they were scheduled (FIFO) — so both promises log before either timeout, in their original order.
