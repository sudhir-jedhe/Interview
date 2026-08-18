# Promise Chain vs Multiple nextTicks

```js
process.nextTick(() => console.log('tick 1'));
Promise.resolve().then(() => {
  console.log('promise 1');
  process.nextTick(() => console.log('tick 2'));
});
process.nextTick(() => console.log('tick 3'));
```

**Answer:** `tick 1`, `tick 3`, `promise 1`, `tick 2`

**Why:** Both initial nextTicks run first, in FIFO order, fully draining that queue. Then the Promise callback runs, logging `promise 1` and scheduling `tick 2` on the now-empty nextTick queue, which runs next since it's checked again before the loop moves to any new phase.
