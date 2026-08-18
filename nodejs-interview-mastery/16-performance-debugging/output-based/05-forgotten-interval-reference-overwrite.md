# Output-Based: reassigning a timer variable loses the reference to clear it

```js
let timer;
function poll() {
  timer = setInterval(() => console.log('poll'), 1000);
}
poll();
poll(); // called again, e.g. on a route handler hit twice
setTimeout(() => clearInterval(timer), 2500);
```

**Answer:** `poll` logs roughly 4-5 times before the timers stop (two overlapping intervals firing independently, only the second's ID gets cleared).

**Why:** Calling `poll()` twice creates two separate `setInterval` timers; reassigning `timer` on the second call overwrites the reference to the *first* interval's ID, so `clearInterval(timer)` only ever stops the second one — the first interval keeps firing forever (a classic forgotten-timer leak). This is why timer/listener setup functions should be idempotent or explicitly guard against being called more than once.
