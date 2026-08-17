# Scenario Questions: Memory & Performance

## 1. Your single-page app's memory usage climbs steadily every time the user navigates between pages, even though each "page" component is supposed to unmount cleanly. How do you find and fix this?

**Approach:**
This is the classic SPA leak pattern: components attach event listeners, timers, or subscriptions on mount but never clean them up on unmount, so each navigation leaves behind live references that keep the old component's entire tree in memory. Use browser DevTools' heap snapshot comparison (take a snapshot, navigate away and back several times, take another snapshot, diff them) to spot growing detached DOM trees or accumulating listener counts. The fix is disciplined teardown: every `addEventListener`, `setInterval`, and subscription created during mount must have a matching removal during unmount.

```js
function mountWidget(root) {
  const onResize = () => updateLayout();
  window.addEventListener("resize", onResize);

  const intervalId = setInterval(pollStatus, 5000);

  const unsubscribe = store.subscribe(onStateChange);

  // Teardown function -- MUST be called when the component unmounts
  return function unmount() {
    window.removeEventListener("resize", onResize);
    clearInterval(intervalId);
    unsubscribe();
  };
}
```

## 2. You have a client-side cache for API responses keyed by URL, used to avoid redundant network requests. After the app runs for a few hours in a long browsing session, memory usage is very high. How do you fix the cache without losing its benefit?

**Approach:**
An unbounded cache is a memory leak by design — every unique URL ever fetched stays cached forever. Cap it with an eviction policy: a simple LRU (least-recently-used) cache with a max size bound is usually enough, optionally combined with a TTL so stale entries expire even if the size cap isn't hit.

```js
class LRUCache {
  #map = new Map();
  #maxSize;
  constructor(maxSize) { this.#maxSize = maxSize; }

  get(key) {
    if (!this.#map.has(key)) return undefined;
    const value = this.#map.get(key);
    this.#map.delete(key);
    this.#map.set(key, value); // re-insert to mark as most-recently used
    return value;
  }

  set(key, value) {
    if (this.#map.has(key)) this.#map.delete(key);
    else if (this.#map.size >= this.#maxSize) {
      const oldestKey = this.#map.keys().next().value; // Map preserves insertion order
      this.#map.delete(oldestKey);
    }
    this.#map.set(key, value);
  }
}

const responseCache = new LRUCache(100); // never grows past 100 entries
```

## 3. You're building a UI library that lets consumers attach arbitrary custom data to DOM elements it renders (e.g., a "state" object per row in a virtualized list). You don't want the library to leak memory if the consumer removes rows from the DOM without explicitly telling your library to clean up.

**Approach:**
Use a `WeakMap` keyed by the DOM node instead of a regular `Map` or an expando property (`node.__myLibData = ...`, which is also leak-prone and pollutes the DOM API). Because `WeakMap` holds only a weak reference to the key, once the consumer removes the node and drops all other references to it, both the node and its associated metadata become eligible for garbage collection automatically — no manual cleanup API required.

```js
const rowState = new WeakMap();

function renderRow(item) {
  const el = document.createElement("div");
  rowState.set(el, { expanded: false, item });
  return el;
}

function toggleRow(el) {
  const state = rowState.get(el);
  state.expanded = !state.expanded;
  render(el, state);
}
// When a row's <div> is removed from the DOM and no other code holds a reference
// to it, it's collected along with its WeakMap entry automatically.
```

## 4. A dashboard recomputes an expensive derived statistic (e.g., a rolling aggregate over thousands of records) every time a component re-renders, even when the underlying data hasn't changed. This is causing visible frame drops. How do you fix it without changing the underlying data model?

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

## 5. Your app accidentally creates thousands of accidental global variables across a large, older non-strict-mode codebase (missing `let`/`const` in many places), and it's causing subtle bugs and bloated global scope. How do you find and fix these systematically, without rewriting the whole codebase at once?

**Approach:**
Rather than manually hunting through thousands of lines, add `"use strict"` incrementally (per-file or per-module) so the engine itself throws a `ReferenceError` on any undeclared assignment, immediately surfacing every offending line during testing/CI rather than requiring manual code review. Pair this with a linter rule (e.g., ESLint's `no-undef` / `no-implicit-globals`) so new violations are caught before merge, and migrate files to ES modules over time (which are strict by default and give real file-scoped privacy instead of relying on discipline alone).

```js
"use strict";
// Any line like `total = 0;` (missing declaration) now throws immediately in
// testing/dev instead of silently leaking a `total` property onto `window`,
// surfacing the bug location precisely instead of requiring a memory audit.
```
