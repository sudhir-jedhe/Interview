# Output: Debounce collapses rapid synchronous calls into one

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

let count = 0;
const inc = debounce(() => { count++; console.log("ran, count =", count); }, 100);

inc();
inc();
inc();
setTimeout(() => console.log("final count:", count), 200);
```

**Answer:**
```
ran, count = 1
final count: 1
```

**Why:** Each call to `inc()` cancels the previously scheduled timer via `clearTimeout` and schedules a new one. Since all three calls happen synchronously (essentially at the same instant), only the last scheduled timer ever survives to fire — so `fn` runs exactly once, 100ms after the last `inc()` call, not three times.
