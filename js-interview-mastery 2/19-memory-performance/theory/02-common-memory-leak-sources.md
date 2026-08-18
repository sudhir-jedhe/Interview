# Common Memory Leak Sources

## Forgotten timers/intervals

A running `setInterval` holds a reference to its callback, and that callback's closure keeps everything it references alive — including large objects or DOM nodes — for as long as the interval keeps running.

```js
function startPolling(largeCache) {
  setInterval(() => {
    console.log(largeCache.size); // keeps largeCache alive indefinitely
  }, 5000);
  // If this interval is never cleared, largeCache can NEVER be garbage collected,
  // even if the code that created it has long since finished.
}
```
The fix is always to store the interval id and call `clearInterval` when the work is no longer needed (e.g., on component unmount). See `../problems/01-memory-leak-and-fix.md` for a full worked example.

## Detached DOM nodes

If you remove an element from the DOM (`node.remove()`) but a JS variable (or a closure) still references it, the node — and its entire subtree — stays in memory even though it's no longer visible or attached to the page.

```js
let cachedNode = document.querySelector("#widget");
cachedNode.remove(); // removed from the page, but NOT garbage collected
// because `cachedNode` still references it
```

Removing a node from the DOM does not, by itself, make it eligible for garbage collection — reachability is what matters, not DOM attachment.

## Accidental globals

Forgetting `let`/`const`/`var` in non-strict mode silently creates a property on the global object, which lives for the entire page/process lifetime and is never eligible for collection.

```js
function leaky() {
  leakedVar = "oops"; // no declaration keyword -- becomes window.leakedVar (non-strict mode)
}
```
`"use strict"` (or ES modules, which are strict by default) turns this into a `ReferenceError` instead of a silent leak.

## Growing caches / never-removed event listeners

A cache with no eviction policy grows forever if keys are never removed; listeners attached but never removed (especially on long-lived objects like `window`) accumulate over a single-page app's life, each holding whatever its closure captured. See `../problems/02-memoization-with-lru-eviction.md` for a bounded-cache fix.
