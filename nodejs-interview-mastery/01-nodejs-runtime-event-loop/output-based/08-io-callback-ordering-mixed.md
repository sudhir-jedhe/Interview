# I/O Callback Ordering with Immediate and Timeout Mixed

```js
const fs = require('fs');
fs.readFile(__filename, () => {
  console.log('io callback');
  setTimeout(() => console.log('timeout in io'), 0);
  setImmediate(() => console.log('immediate in io'));
  process.nextTick(() => console.log('nextTick in io'));
});
```

**Answer:** `io callback`, `nextTick in io`, `immediate in io`, `timeout in io`

**Why:** Inside the I/O callback (poll phase), `nextTick in io` runs first because microtasks drain as soon as the stack for that callback empties. The loop then proceeds from poll directly to the check phase (`immediate in io`) before looping back around to timers (`timeout in io`).
