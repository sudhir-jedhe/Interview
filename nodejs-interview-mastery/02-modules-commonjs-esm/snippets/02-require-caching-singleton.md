# Demonstrating require() Module Caching (Singleton Behavior)

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

`a` and `b` are two separate `const` bindings, but both point to the exact same `module.exports` object, because `require()` caches modules by resolved file path — the second `require('./counter.cjs')` call returns the cached export instead of re-executing `counter.cjs`. Calling `a.increment()` mutates the single shared `count` closure variable, so `b.get()` reflects that mutation. See `../theory/02-module-caching-and-circular-requires.md` for the caching mechanism in full.
