# Chained microtasks all drain before the next macrotask

```js
setTimeout(() => console.log('timeout'), 0);
Promise.resolve()
  .then(() => console.log('micro 1'))
  .then(() => console.log('micro 2'))
  .then(() => console.log('micro 3'));
// micro 1
// micro 2
// micro 3
// timeout
```

Each `.then` in the chain schedules its callback as a new microtask only once the previous one resolves, but all three still run before the event loop is allowed to move to the macrotask queue.
