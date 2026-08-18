# Basic Microtask vs Macrotask Ordering

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```

**Answer:** `1`, `4`, `3`, `2`

**Why:** Synchronous code runs first (`1`, `4`). The call stack then empties, so the microtask queue (Promise callbacks) drains before the event loop proceeds to the timers phase, so `3` prints before `2`.
