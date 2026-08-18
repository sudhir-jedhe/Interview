# Output-Based: even high-priority microtasks can't preempt a busy loop

```js
const start = process.hrtime.bigint();

Promise.resolve().then(() => {
  const end = process.hrtime.bigint();
  console.log('microtask ran after', Number(end - start) / 1e6, 'ms (roughly 0)');
});

let x = 0;
for (let i = 0; i < 2e9; i++) x += i; // multi-second blocking loop
```

**Answer:** The logged duration is roughly the full length of the busy loop (multiple seconds), not "roughly 0" as the comment optimistically claims.

**Why:** Even though `.then()` callbacks (microtasks) run before the next macrotask and have very high scheduling priority, they still can't preempt currently-executing synchronous code — the microtask queue is only drained once the current synchronous stack finishes. A blocking loop delays *everything* queued after it, microtasks included.
