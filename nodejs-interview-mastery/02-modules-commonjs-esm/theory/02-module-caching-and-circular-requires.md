# Module Caching and Circular require()

This builds on `01-commonjs-require-and-wrapper.md` — since every CJS file is wrapped and executed by `require()`, Node needs a mechanism to avoid re-executing the same file's code every time it's imported, and a defined behavior for what happens when two modules require each other.

## Module caching

`require()` caches modules by their **fully resolved absolute file path** in `require.cache`. The second time any file `require`s the same resolved path, Node returns the cached `module.exports` object instantly — the module's top-level code does not re-run. This means modules are effectively singletons within a process, which is both a feature (shared state, like a DB connection pool) and a gotcha (mutating an exported object from one file affects every other file that required it).

```js
require.cache[require.resolve('./math.js')]; // inspect/delete to force re-execution
delete require.cache[require.resolve('./math.js')]; // rare, mostly for tests/hot-reload
```

```js
// file: counter.cjs
let count = 0;
module.exports = { increment: () => ++count, get: () => count };

// file: main.cjs
const a = require('./counter.cjs');
const b = require('./counter.cjs');
a.increment();
console.log(b.get()); // 1 -- same cached instance, not a fresh module
```

A practical consequence: because `require()` returns the same object reference every time, mutating an exported array or object in place (e.g. `.push()`) is visible everywhere that object is referenced — the same behavior as passing an object by reference anywhere else in JS, not a copy.

## Circular require()

Circular `require()`s don't cause infinite loops — Node detects the cycle and returns whatever partial `module.exports` the in-progress module has built up so far at the point the circular `require()` is hit.

```js
// a.cjs
console.log('a starting');
exports.done = false;
const b = require('./b.cjs');
console.log('in a, b.value is:', b.value);
exports.done = true;

// b.cjs
console.log('b starting');
const a = require('./a.cjs');
console.log('in b, a.done is:', a.done);
exports.value = 42;

// main.cjs
require('./a.cjs');
```

**Output:**
```
a starting
b starting
in b, a.done is: false
in a, b.value is: 42
```

**Trace:** `a.cjs` starts executing and requires `b.cjs` before setting `exports.done = true`. When `b.cjs` requires `a.cjs` back, Node returns the *currently* cached (incomplete) `module.exports` of `a` — at that point `done` is still `false`. `b.cjs` finishes fully, setting `value = 42`, and control returns to `a.cjs`, which now sees the completed `b.value`. Properties assigned after the point where the cycle was hit won't be visible to the module that circularly required it back — a common source of `undefined` values, fixed by restructuring to avoid the cycle or deferring property access until after both modules finish loading. See `../problems/03-circular-require-bug.md` for a worked fix.
