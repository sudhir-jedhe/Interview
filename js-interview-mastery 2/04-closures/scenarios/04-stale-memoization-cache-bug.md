# Diagnosing a Memoized Function Returning Stale Results

**Scenario:** A memoized function in your app is unexpectedly returning stale results after the underlying data source changes, even though the memoization was implemented "correctly" using a closure cache. What's the likely root cause, and how do you fix it?

**Approach:** Memoization assumes the wrapped function is pure — same input always produces the same output. If the function actually depends on external mutable state (a database, a global variable, the current time) in addition to its argument, caching by argument alone becomes incorrect once that external state changes.

```js
let taxRate = 0.08;
function memoize(fn) {
  const cache = new Map();
  return (price) => {
    if (cache.has(price)) return cache.get(price);
    const result = fn(price);
    cache.set(price, result);
    return result;
  };
}
const getTotal = memoize((price) => price * (1 + taxRate));

console.log(getTotal(100)); // 108, cached under key 100
taxRate = 0.10; // external state changed
console.log(getTotal(100)); // still 108 — stale! taxRate change isn't reflected
```

Fixes: (1) include every relevant input in the cache key, e.g. memoize on `(price, taxRate)` as a composite key, restoring purity with respect to the cache; (2) add an explicit cache invalidation mechanism — expose a `clearCache()` closure method that resets the `Map`, called whenever the external dependency changes; (3) if the function is fundamentally impure (depends on unpredictable external state like current time or a live database), reconsider whether memoization is appropriate at all, or add a TTL (time-to-live) to cache entries so they expire rather than persisting forever. See `../problems/02-memoize-function.md` for a clean, from-scratch `memoize` implementation to build these fixes on top of.
