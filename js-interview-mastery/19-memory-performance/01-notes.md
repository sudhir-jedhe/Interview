# Notes: Memory & Performance

## Garbage collection: reachability and mark-and-sweep

JavaScript manages memory automatically — you never explicitly free objects. The engine decides what memory to reclaim based on **reachability**: a value is reachable if it's referenced, directly or through a chain of references, from a "root" (global object, currently executing function's local variables, or the call stack). If nothing reaches an object anymore, it's eligible for collection.

The dominant algorithm is **mark-and-sweep**: periodically, the engine starts from the roots, walks every reachable reference and marks each object it finds, then sweeps through memory and frees everything left unmarked. This correctly handles circular references (two objects referencing each other but unreachable from any root are both collected) — something older reference-counting garbage collectors got wrong.

```js
let obj = { data: "big payload" };
obj = null; // the object is now unreachable (assuming nothing else references it)
// The engine will eventually reclaim its memory -- you cannot force this or predict exactly when.
```

You never call anything like `free(obj)` — you simply stop referencing it, and the GC does the rest, on its own schedule, not synchronously.

## Common memory leak sources

**Forgotten timers/intervals**: a running `setInterval` holds a reference to its callback, and that callback's closure keeps everything it references alive — including large objects or DOM nodes — for as long as the interval keeps running.

```js
function startPolling(largeCache) {
  setInterval(() => {
    console.log(largeCache.size); // keeps largeCache alive indefinitely
  }, 5000);
  // If this interval is never cleared, largeCache can NEVER be garbage collected,
  // even if the code that created it has long since finished.
}
```
The fix is always to store the interval id and call `clearInterval` when the work is no longer needed (e.g., on component unmount).

**Detached DOM nodes**: if you remove an element from the DOM (`node.remove()`) but a JS variable (or a closure) still references it, the node — and its entire subtree — stays in memory even though it's no longer visible or attached to the page.

```js
let cachedNode = document.querySelector("#widget");
cachedNode.remove(); // removed from the page, but NOT garbage collected
// because `cachedNode` still references it
```

**Accidental globals**: forgetting `let`/`const`/`var` in non-strict mode silently creates a property on the global object, which lives for the entire page/process lifetime and is never eligible for collection.

```js
function leaky() {
  leakedVar = "oops"; // no declaration keyword -- becomes window.leakedVar (non-strict mode)
}
```
`"use strict"` (or ES modules, which are strict by default) turns this into a `ReferenceError` instead of a silent leak.

**Growing caches / never-removed event listeners**: a cache with no eviction policy grows forever if keys are never removed; listeners attached but never removed (especially on long-lived objects like `window`) accumulate over a single-page app's life, each holding whatever its closure captured.

## Closures accidentally retaining large objects

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

## Memoization

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
This only helps for pure functions (same input always produces same output) and can itself become a memory leak if the cache grows unbounded — pair it with a max-size or TTL eviction strategy for long-running processes.

## WeakMap and WeakSet

`WeakMap` and `WeakSet` hold **weak references** to their keys (WeakMap) or values (WeakSet): if the only remaining reference to an object is as a WeakMap key, the garbage collector can still reclaim it, and the entry is automatically removed. This makes them ideal for associating metadata with an object (like DOM nodes) without that association itself keeping the object alive forever.

```js
const cache = new WeakMap();
let el = document.querySelector("#widget");
cache.set(el, { clicks: 0 });
el = null; // if no other references exist, the DOM node AND its WeakMap entry
           // become eligible for garbage collection -- a regular Map would leak it
```
Neither is iterable (no `.keys()`, `.forEach()`, `.size`) precisely because their contents can vanish at any time via garbage collection, which would make iteration order/results nondeterministic.
