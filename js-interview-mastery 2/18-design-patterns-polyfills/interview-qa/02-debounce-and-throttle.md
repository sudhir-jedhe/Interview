# Interview Q&A: Debounce & Throttle

**Q: Implement debounce.**
```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```
Every invocation cancels the previous pending timer and schedules a new one, so `fn` only fires once activity has stopped for `delay` milliseconds.

**Q: Implement throttle.**
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
```
It tracks the timestamp of the last successful call and only invokes `fn` again once at least `interval` milliseconds have passed, silently ignoring calls that land inside the window.
