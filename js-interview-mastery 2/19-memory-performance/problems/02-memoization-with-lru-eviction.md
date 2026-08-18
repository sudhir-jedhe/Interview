# Problem: A memoization cache with max-size (LRU-ish) eviction

**Task:** Implement `memoizeWithLimit(fn, maxSize)` — a memoizing wrapper whose internal cache never grows past `maxSize` entries, evicting the least-recently-used entry when it's full.

## Full solution

```js
function memoizeWithLimit(fn, maxSize = 100) {
  // A Map preserves insertion order, which we exploit to track recency:
  // re-inserting a key on access moves it to the "most recently used" end.
  const cache = new Map();

  function keyFor(args) {
    // Simple, works for primitive args; for object args you'd want a
    // proper serializer or a WeakMap-based per-object cache instead.
    return JSON.stringify(args);
  }

  const memoized = function (...args) {
    const key = keyFor(args);

    if (cache.has(key)) {
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value); // re-insert -> marks as most recently used
      return value;
    }

    const result = fn.apply(this, args);

    if (cache.size >= maxSize) {
      const oldestKey = cache.keys().next().value; // first inserted = least recently used
      cache.delete(oldestKey);
    }
    cache.set(key, result);
    return result;
  };

  memoized.cache = cache; // exposed for inspection/testing
  return memoized;
}

// Demo:
let calls = 0;
const slowDouble = (n) => { calls++; return n * 2; };
const fastDouble = memoizeWithLimit(slowDouble, 3); // cache holds at most 3 entries

fastDouble(1); // computes -- calls = 1
fastDouble(2); // computes -- calls = 2
fastDouble(3); // computes -- calls = 3, cache: [1, 2, 3]
fastDouble(1); // cache hit -- calls still 3, cache reordered to: [2, 3, 1]

fastDouble(4); // computes -- calls = 4; cache is full (size 3), evicts LRU (2) -> cache: [3, 1, 4]
console.log([...fastDouble.cache.keys()]); // ["3", "1", "4"]

fastDouble(2); // "2" was evicted -- recomputes -- calls = 5
console.log(calls); // 5
```

## Why this doesn't just grow forever

The plain `memoize` from `../theory/04-memoization.md` never removes anything — every unique input the process has ever seen stays cached for the process's lifetime, which is itself a slow memory leak in a long-running app (a server process, or a browser tab left open for hours). Bounding the cache with an eviction policy trades a small amount of cache-hit rate (you might recompute something you'd cached before, if it's evicted) for a hard, predictable memory ceiling — exactly the same tradeoff made by `../scenarios/02-unbounded-response-cache.md`'s `LRUCache`, applied here to a general-purpose function-memoization helper instead of a URL-keyed response cache.
