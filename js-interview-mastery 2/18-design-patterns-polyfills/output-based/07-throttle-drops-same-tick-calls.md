# Output: Throttle drops same-tick repeated calls

```js
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}

const log = throttle((n) => console.log("call", n), 1000);
log(1); // t=0
log(2); // t=0 (same tick)
log(3); // t=0 (same tick)
```

**Answer:**
```
call 1
```

**Why:** All three calls happen essentially at the same timestamp (`t=0`), well within the same 1000ms throttle window. Only the first call passes the `now - last >= interval` check (since `last` starts at `0` and `Date.now()` is a large positive number, technically the very first call always passes); the second and third calls are within the window and get dropped silently, with no trailing call scheduled (unlike debounce).
