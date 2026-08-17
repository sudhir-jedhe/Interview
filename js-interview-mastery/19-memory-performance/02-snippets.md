# Snippets: Memory & Performance

```js
// 1. Reachability: reassigning removes the last reference, making an object collectible
let user = { name: "Ana" };
let alias = user; // second reference to the same object
user = null;
console.log(alias.name); // "Ana" -- still reachable via `alias`
alias = null; // NOW nothing references the object; it becomes eligible for GC
```

```js
// 2. An interval keeps its closure (and everything it references) alive
function startLeak() {
  const bigData = new Array(1_000_000).fill("leak-me");
  const id = setInterval(() => {
    console.log(bigData.length); // keeps bigData alive as long as the interval runs
  }, 10000);
  return id; // caller MUST clearInterval(id) eventually, or bigData never gets collected
}
const intervalId = startLeak();
// ... later, when the work is done:
clearInterval(intervalId); // now bigData becomes eligible for garbage collection
```

```js
// 3. Detached DOM node still referenced from JS -- classic leak (browser-only)
let node = document.createElement("div");
document.body.append(node);
document.body.removeChild(node); // removed from the visible page
console.log(document.body.contains(node)); // false
console.log(node.textContent);              // still works -- node is fully alive in memory
node = null; // only now is it eligible for garbage collection
```

```js
// 4. Accidental global variable (non-strict mode)
function leaky() {
  accidentalGlobal = "I forgot let/const"; // no declaration keyword
}
leaky();
console.log(typeof globalThis.accidentalGlobal); // "string" -- leaked onto the global object

function safe() {
  "use strict";
  try {
    trulyUndeclared = "nope";
  } catch (e) {
    console.log(e instanceof ReferenceError); // true -- strict mode prevents the leak
  }
}
safe();
```

```js
// 5. Memoization with a Map cache
function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (cache.has(n)) {
      console.log("cache hit for", n);
      return cache.get(n);
    }
    const result = fn(n);
    cache.set(n, result);
    return result;
  };
}

const slowSquare = (n) => { for (let i = 0; i < 1e6; i++); return n * n; };
const fastSquare = memoize(slowSquare);
fastSquare(5); // computes, caches
fastSquare(5); // "cache hit for 5" -- returns instantly from cache
```

```js
// 6. WeakMap doesn't prevent its key from being garbage collected
const metadata = new WeakMap();
let session = { id: "abc123" };
metadata.set(session, { createdAt: Date.now() });

console.log(metadata.has(session)); // true
session = null;
// The `session` object is now eligible for garbage collection because WeakMap
// holds only a weak reference to it -- the entry disappears automatically.
// (You can't observe the exact moment; there's no synchronous way to prove
// the collection happened, but no strong reference remains anywhere.)
```

```js
// 7. Avoiding allocation in a hot loop -- reuse instead of recreate
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
