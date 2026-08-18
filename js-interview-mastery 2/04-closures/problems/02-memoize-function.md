# Problem: Implement `memoize(fn)`

## Problem Statement

Implement a `memoize(fn)` utility that caches the result of `fn` per unique set of arguments, using a closure-captured cache, so repeated calls with the same arguments skip recomputation and return the cached result instantly.

## Requirements

- `memoize(fn)` returns a new function with the same call signature as `fn`.
- Calling the memoized function with arguments it hasn't seen before computes and caches the result.
- Calling it again with the *same* arguments returns the cached result without re-invoking `fn`.
- Must support functions taking more than one argument, using a composite cache key (not just the first argument).
- Provide a way to inspect how many times the underlying `fn` actually ran, to verify caching is working.

## Approach

Use a `Map` captured in the returned function's closure as the cache. Since `Map` keys can be any value but arguments come in as an array, build a single string key by serializing the argument list (`JSON.stringify` is sufficient for primitive/plain-object arguments, which covers the common case). Look up that key before calling `fn`; only call `fn` and store the result on a cache miss.

## Solution

```js
function memoize(fn) {
  const cache = new Map(); // captured by the closure, persists across every call to the memoized fn

  function memoized(...args) {
    const key = JSON.stringify(args); // composite key covering ALL arguments, not just the first
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  }

  memoized.cache = cache; // exposed for inspection/testing, e.g. memoized.cache.size
  return memoized;
}

module.exports = { memoize };

// --- verification ---
let calls = 0;
const slowAdd = (a, b) => {
  calls++;
  return a + b;
};
const fastAdd = memoize(slowAdd);

console.log(fastAdd(2, 3)); // 5 — computed, calls = 1
console.log(fastAdd(2, 3)); // 5 — cached, calls stays 1
console.log(fastAdd(3, 2)); // 5 — DIFFERENT args (order matters in the key), computed again, calls = 2
console.log('underlying fn ran', calls, 'time(s)'); // underlying fn ran 2 time(s)
console.log('cache size:', fastAdd.cache.size); // 2 — two distinct argument combinations cached
```

**Why this works:** the `cache` `Map` is only reachable through the closure formed when `memoize(fn)` is called, so each call to `memoize` produces a completely independent cache — memoizing the same underlying function twice (`const a = memoize(fn); const b = memoize(fn);`) gives two separate caches, which is the correct, safe default. Serializing the full argument list via `JSON.stringify(args)` (rather than just using the first argument, or relying on object identity) correctly distinguishes `fastAdd(2, 3)` from `fastAdd(3, 2)` as different cache entries. This implementation is best suited to pure functions with primitive or simple serializable arguments — see `../scenarios/04-stale-memoization-cache-bug.md` for what goes wrong when the wrapped function isn't actually pure.
