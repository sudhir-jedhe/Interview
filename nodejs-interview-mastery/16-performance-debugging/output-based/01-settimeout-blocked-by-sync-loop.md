# Output-Based: a busy loop delays a `setTimeout(fn, 0)`

```js
console.log('start');
setTimeout(() => console.log('timeout'), 0);

let sum = 0;
for (let i = 0; i < 3e9; i++) sum += i; // several-second busy loop

console.log('end of sync code');
```

**Answer:** `start`, then (after the multi-second delay) `end of sync code`, then `timeout` — never `timeout` before `end of sync code`, regardless of the `0`ms delay.

**Why:** `setTimeout(fn, 0)` doesn't run "immediately" — it schedules `fn` for the timers phase of the event loop, which can't run until the current synchronous call stack finishes. A multi-second synchronous busy loop blocks that from happening no matter how small the requested delay is; the timer only fires once the main thread is free.
