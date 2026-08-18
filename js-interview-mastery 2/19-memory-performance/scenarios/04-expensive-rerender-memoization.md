# Scenario: An expensive recomputation running on every re-render

**A dashboard recomputes an expensive derived statistic (e.g., a rolling aggregate over thousands of records) every time a component re-renders, even when the underlying data hasn't changed. This is causing visible frame drops. How do you fix it without changing the underlying data model?**

**Approach:**
This is a pure-function memoization candidate: the computation depends only on its inputs, so cache the result keyed by a reference or a cheap-to-compute signature of the input, and only recompute when that signature actually changes. Careful with cache key choice — using the array reference itself works if the data is treated as immutable (a new array/object is created on every real change, which is standard in most modern state-management approaches); if the data is mutated in place, you need a different invalidation signal (e.g., a version counter).

```js
function memoizeByReference(fn) {
  let lastArg, lastResult;
  return (arg) => {
    if (arg === lastArg) return lastResult; // same reference -> assume same value (immutable data)
    lastResult = fn(arg);
    lastArg = arg;
    return lastResult;
  };
}

const computeStats = memoizeByReference((records) => {
  // expensive aggregate logic
  return records.reduce((acc, r) => acc + r.value, 0);
});
```
