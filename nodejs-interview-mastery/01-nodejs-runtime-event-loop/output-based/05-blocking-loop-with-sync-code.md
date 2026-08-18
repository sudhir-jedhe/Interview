# Blocking the Loop with a Synchronous Loop

```js
console.log('start');
setTimeout(() => console.log('timeout fired'), 100);
const end = Date.now() + 300;
while (Date.now() < end) {} // busy-wait
console.log('after busy loop');
```

**Answer:** `start`, `after busy loop`, `timeout fired` (roughly 300ms after start, not 100ms)

**Why:** The timer's callback can only run once the event loop reaches the timers phase, but the synchronous `while` loop occupies the single JS thread for 300ms, delaying everything — including a timer whose delay had already elapsed.
