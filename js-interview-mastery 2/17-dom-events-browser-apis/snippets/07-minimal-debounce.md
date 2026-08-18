# Snippet: A minimal debounce wrapper around an input handler

```js
function debounce(fn, delay) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

const log = debounce((value) => console.log("searching for:", value), 300);
// Rapid calls within 300ms of each other collapse into a single trailing call:
log("a");
log("ap");
log("app");
// only "searching for: app" logs, ~300ms after the last call
```

See `../problems/02-debounce-and-throttle.md` for a fuller, from-scratch implementation of both debounce and throttle with a live demo.
