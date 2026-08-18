# Output: An interval keeps its captured data alive until cleared

```js
let timerId;
function schedule() {
  const data = { big: "x".repeat(1000) };
  timerId = setInterval(() => {
    console.log(data.big.length);
  }, 1000);
}
schedule();
// ... some time later ...
clearInterval(timerId);
```

**Answer:**
```
1000
1000
... (repeats every second until clearInterval runs)
```

**Why:** `data` stays alive and accessible on every tick because the interval's callback closure retains a reference to it — `setInterval` itself holds a reference to the callback, and the callback's closure holds a reference to `data`. `data` only becomes eligible for garbage collection once `clearInterval(timerId)` runs and the interval (and its callback closure) is fully torn down; until then, it's retained for as long as the interval keeps firing, regardless of whether `schedule()` has already returned.
