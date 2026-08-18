```js
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve()
  .then(() => {
    console.log('microtask 1');
    return Promise.resolve();
  })
  .then(() => console.log('microtask 2'));
console.log('end');
```
**Answer:**
```
start
end
microtask 1
microtask 2
timeout
```
**Why:** Sync code runs first (`start`, `end`). Then the microtask queue drains completely — including *chained* microtasks created while draining (`microtask 1` runs, and because it returns a promise, `microtask 2` is scheduled as another microtask and also runs) — all before the engine even looks at the macrotask queue, so `timeout` is guaranteed to be last.
