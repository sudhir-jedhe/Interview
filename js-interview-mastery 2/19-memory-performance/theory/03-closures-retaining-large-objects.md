# Closures Accidentally Retaining Large Objects

A closure keeps its entire enclosing scope alive for as long as the closure itself is reachable — not just the variables it actually uses. This can accidentally pin large, unrelated data in memory.

```js
function setup() {
  const hugeArray = new Array(1_000_000).fill("x"); // large
  const smallValue = 42;

  return function () {
    return smallValue; // only uses smallValue...
    // ...but depending on the engine's optimization, hugeArray may still be
    // retained in memory as long as this returned function exists, because
    // they share the same closure scope.
  };
}
```

Modern V8 often optimizes to retain only variables the inner function actually references, but this isn't a guarantee, and it's still a common leak when the inner function *does* reference something derived from the large object.

## Detached DOM node leak vs. normal DOM node removal

| Aspect | `node.remove()` with no lingering JS reference | `node.remove()` with a JS variable/closure still holding it |
|---|---|---|
| Eligible for garbage collection | Yes, immediately (once removed and unreferenced) | No — stays in memory as long as the reference exists |
| Visible on the page | No | No |
| Common cause | Clean removal, e.g., in a component's teardown logic | Caching a node reference (for performance) and forgetting to clear it |

The common mistake is caching references to DOM nodes for quick re-access and never nulling them out (or removing associated event listeners) after the node is torn down. This is the same underlying mechanism as the timer/closure leak above — a live reference, wherever it lives, keeps the referenced object (and its closure scope) alive.
