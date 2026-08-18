# Debounce and Throttle

High-frequency events (`scroll`, `resize`, `input`, `mousemove`) can fire dozens of times per second; running expensive work on every event kills performance.

**Debounce** delays execution until events stop firing for a period (good for "search as you type" — wait until the user pauses).

**Throttle** guarantees execution at most once per fixed interval regardless of how often the event fires (good for scroll position tracking, where you want steady updates, not just a final one).

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

## Comparison

| Aspect | Debounce | Throttle |
|---|---|---|
| Trigger timing | Fires once after events stop for N ms | Fires at most once every N ms while events keep firing |
| Guarantees a call during continuous activity | No — can be delayed indefinitely if events never stop | Yes — regular cadence regardless of activity |
| Typical use | Search-as-you-type, resize-end, autosave | Scroll position tracking, mousemove-driven UI, rate-limited API polling |
| Risk if misused | Search feels laggy if delay too long | UI feels choppy if interval too long |

Use debounce when you only care about the *final* state after activity settles; use throttle when you need steady, periodic updates *during* continuous activity. The common mistake is using debounce for scroll handlers, which can make the UI feel unresponsive because nothing updates until scrolling completely stops.

Full from-scratch implementations of both, plus a live demo on a scroll/input handler, are in `../problems/02-debounce-and-throttle.md`. A design-patterns-focused treatment (including a throttle-with-trailing-call variant) also lives in `../../18-design-patterns-polyfills/`.
