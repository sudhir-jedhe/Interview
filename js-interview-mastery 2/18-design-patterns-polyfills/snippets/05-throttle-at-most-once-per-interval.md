# Snippet: Throttle — guarantees execution at most once per interval

```js
function throttle(fn, interval) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

const onScroll = throttle(() => console.log("scroll handled"), 1000);
// Even if `onScroll()` is called 100 times in the next 500ms, it only actually
// runs once (the first call); subsequent calls within the 1000ms window are ignored.
```
