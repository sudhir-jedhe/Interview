# Debounce and Throttle (Implementation-Level)

Both limit how often a function runs in response to rapid, repeated triggers, but with different guarantees. **Debounce** waits until calls stop for a quiet period, then fires once. **Throttle** fires at a steady maximum rate no matter how continuously the trigger fires.

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, interval) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}
```

## Comparison

| Aspect | Debounce | Throttle |
|---|---|---|
| Core mechanism | `clearTimeout` + reschedule on every call | Timestamp check, ignore calls inside the window |
| When `fn` runs | Once, after calls stop for `delay` ms | Repeatedly, at most once per `interval` ms |
| Guarantees a call during nonstop activity | No | Yes (roughly every `interval`) |
| State needed | One timer id | One "last called at" timestamp (or a timer for trailing-edge variants) |

Use throttle for anything needing periodic feedback during continuous input (drag, scroll position). Use debounce for anything that should only react to the *settled* final state (validation after typing stops). Mixing them up is the most common mistake — e.g., throttling a search box means firing requests mid-typing on outdated partial input.

A trailing-edge throttle variant (fires during the burst *and* guarantees one final call after activity stops — useful for auto-save) and a full scroll/input demo live in `../../17-dom-events-browser-apis/problems/02-debounce-and-throttle.md`.
