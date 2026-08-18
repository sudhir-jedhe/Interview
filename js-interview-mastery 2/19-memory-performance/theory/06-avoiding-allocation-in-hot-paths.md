# Avoiding Unnecessary Allocation in Hot Paths

In a loop processing large data on every animation frame (or any genuinely "hot" code path), chaining array methods like `.map().filter()` allocates a full intermediate array on every call; replacing it with a single manual loop that both transforms and filters in one pass avoids that extra allocation.

```js
// Bad in a hot path: allocates a new array on every call, twice
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
```

This kind of optimization is only worth the added complexity **after profiling identifies the loop as an actual bottleneck** — applying it preemptively across a codebase usually just hurts readability for no measurable benefit. Debugging a real leak generally starts with DevTools' Memory panel: take heap snapshots at two points that should have equivalent memory usage (e.g., before and after repeatedly performing an action that should be fully reversible, like opening/closing a modal), then diff them to see what object types grew and trace their retaining paths.
