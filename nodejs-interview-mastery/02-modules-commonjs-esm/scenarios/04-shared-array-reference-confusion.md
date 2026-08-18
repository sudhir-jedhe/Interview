# A Teammate Is Confused Why Editing an Exported Array in One Module Shows Up in Another That Never Re-Imported It

```js
// state.cjs
const items = [];
module.exports = { items };

// producer.cjs
const { items } = require('./state.cjs');
items.push('a');

// consumer.cjs
const { items } = require('./state.cjs');
console.log(items); // ['a'] -- teammate expected []
```

**Approach:** Explain that `require()` doesn't copy the exported value — `items` in both `producer.cjs` and `consumer.cjs` is the exact same array reference, because `require.cache` returns the same cached `module.exports` object to every caller. Mutating the array in place (`.push`) is visible everywhere it's referenced, by design — this is the same behavior as passing an object by reference anywhere else in JS. If isolated copies were the goal, export a factory function instead of a shared instance:

```js
// state.cjs (fixed for isolation, if that's actually desired)
module.exports = { createItems: () => [] };
```

If shared mutable state genuinely is the goal (e.g. an in-memory cache), keep the current pattern but document it clearly and centralize all mutation through exported functions rather than allowing arbitrary external `.push()` calls, to keep invariants enforceable. See `../theory/02-module-caching-and-circular-requires.md` for the caching mechanism behind this.
