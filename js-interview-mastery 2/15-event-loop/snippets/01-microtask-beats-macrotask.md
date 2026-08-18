# Microtask (Promise) always beats a 0ms macrotask (setTimeout)

```js
setTimeout(() => console.log('macrotask'), 0);
Promise.resolve().then(() => console.log('microtask'));
// microtask
// macrotask
```

Regardless of code order, the microtask queue always fully drains before the event loop even glances at the macrotask queue.
