# Multiple setTimeouts with the same delay run in scheduling order

```js
setTimeout(() => console.log('first'), 0);
setTimeout(() => console.log('second'), 0);
setTimeout(() => console.log('third'), 0);
// first
// second
// third
```

The macrotask queue is FIFO — timers with the same (or effectively equal, after clamping) delay run in the order they were originally scheduled.
