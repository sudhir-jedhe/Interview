```js
console.log('start');

setTimeout(() => {
  console.log('timeout');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);

Promise.resolve().then(() => {
  console.log('promise');
  setTimeout(() => console.log('timeout inside promise'), 0);
});

console.log('end');
```
**Answer:** `start end promise timeout promise inside timeout timeout inside promise`
**Why:** Sync code runs first (`start`, `end`). The first microtask (`promise`) drains next, and while running it schedules a *new* macrotask (`timeout inside promise`) — but scheduling a macrotask doesn't jump any queue, it just joins the back of the macrotask queue. With the microtask queue now empty, the event loop runs the next macrotask in FIFO order, which is the original `setTimeout` (`timeout`), and that callback's own promise (`promise inside timeout`) drains as a microtask immediately after, before the second macrotask (`timeout inside promise`) gets its turn.
