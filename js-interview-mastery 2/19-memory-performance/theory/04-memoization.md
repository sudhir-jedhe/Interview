# Memoization

Caches the result of an expensive, pure function call keyed by its arguments, trading memory for CPU time on repeated calls with the same input.

```js
function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}
```
This only helps for pure functions (same input always produces same output) and can itself become a memory leak if the cache grows unbounded — pair it with a max-size or TTL eviction strategy for long-running processes. A full max-size/LRU-ish implementation is in `../problems/02-memoization-with-lru-eviction.md`.

## Memoization vs. debounce/throttle

| Aspect | Memoization | Debounce / throttle |
|---|---|---|
| Optimizes | Redundant *identical* calls (same input, pure function) | Call *frequency* over time, regardless of input |
| Mechanism | Cache keyed by arguments | Delay/rate-limit execution via timers |
| Requires purity | Yes — same input must always produce same output | No — works with any function, including side effects |
| Risk | Unbounded cache growth (a memory leak) | Missed calls if not configured for the right trailing/leading behavior |

Use memoization for expensive pure computations called repeatedly with overlapping arguments (e.g., Fibonacci, parsing the same config twice). Use debounce/throttle for taming *event frequency*, not computation cost — see `../../18-design-patterns-polyfills/` and `../../17-dom-events-browser-apis/` for those. The common mistake is memoizing a function that isn't actually pure (e.g., one that reads mutable external state), which produces stale, incorrect cached results.
