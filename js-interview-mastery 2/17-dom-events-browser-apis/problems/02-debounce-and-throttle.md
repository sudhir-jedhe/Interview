# Problem: Implement `debounce(fn, delay)` and `throttle(fn, delay)` from scratch

This is an extremely commonly asked interview problem. Both functions wrap `fn` and return a new function with different timing guarantees. Below are full implementations, plus a demo on a scroll and an input handler.

## `debounce`

Delays running `fn` until `delay` ms have passed with no new calls — every new call resets the timer.

```js
function debounce(fn, delay) {
  let timerId;
  return function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

## `throttle`

Guarantees `fn` runs at most once per `interval` ms, regardless of how many times the returned function is called during that window (leading-edge variant — fires immediately on the first call of a burst, then ignores calls until the window elapses).

```js
function throttle(fn, interval) {
  let lastCall = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

### Trailing-edge variant

The leading-edge-only throttle above can drop the *last* call in a burst (e.g., the final scroll position before the user stops scrolling never gets reported). A trailing-edge variant guarantees one more call fires shortly after activity stops:

```js
function throttleWithTrailing(fn, interval) {
  let lastCall = 0;
  let timer = null;
  return function (...args) {
    const now = Date.now();
    const remaining = interval - (now - lastCall);
    if (remaining <= 0) {
      clearTimeout(timer);
      lastCall = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        lastCall = Date.now();
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

## Demo: debounce on an input handler (search-as-you-type)

```js
const searchInput = document.querySelector("#search");

const handleSearch = debounce((event) => {
  console.log("searching for:", event.target.value);
  // fetch(`/api/search?q=${event.target.value}`) ...
}, 300);

searchInput.addEventListener("input", handleSearch);
// Typing "react" quickly fires only ONE search call, ~300ms after the last keystroke.
```

## Demo: throttle on a scroll handler (steady position tracking)

```js
const handleScroll = throttle(() => {
  console.log("scrollY:", window.scrollY);
  // update a "back to top" button visibility, a progress bar, etc.
}, 200);

window.addEventListener("scroll", handleScroll);
// Even if "scroll" fires 60 times/second, handleScroll only actually runs
// at most every 200ms, keeping the handler cheap during continuous scrolling.
```

## Key interview talking points

- Debounce: "wait until things go quiet." Throttle: "steady drip regardless of activity."
- Both need to preserve `this` and forward all arguments (`fn.apply(this, args)`), since the wrapped function is often a method or event handler expecting a specific `this`/argument shape.
- Debounce alone is wrong for scroll (nothing updates until scrolling stops); throttle alone is wrong for search-as-you-type (fires mid-keystroke on stale partial input).
- See `../theory/06-debounce-and-throttle.md` for the conceptual comparison, and `../../18-design-patterns-polyfills/` for these same patterns discussed alongside other design patterns.
