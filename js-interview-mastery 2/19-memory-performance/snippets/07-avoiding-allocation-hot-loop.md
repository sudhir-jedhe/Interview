# Snippet: Avoiding allocation in a hot loop — reuse instead of recreate

```js
// Bad: allocates a new array on every call, inside a loop that runs often
function processBad(items) {
  return items.map(x => x * 2).filter(x => x > 10); // two new arrays every call
}

// Better in a genuinely hot path: single pass, no intermediate array
function processGood(items) {
  const result = [];
  for (let i = 0; i < items.length; i++) {
    const doubled = items[i] * 2;
    if (doubled > 10) result.push(doubled);
  }
  return result;
}
// Only worth doing after profiling shows this loop is actually a bottleneck --
// premature micro-optimization usually isn't worth the readability cost.
```
