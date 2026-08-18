# require() of a Pure ESM File

```js
// pure.mjs
export const x = 1;

// loader.cjs
const mod = require('./pure.mjs');
console.log(mod.x);
```

**Answer:** Throws `Error [ERR_REQUIRE_ESM]: require() of ES Module ... not supported.`

**Why:** `require()` is synchronous, but loading and linking an ES module graph is inherently asynchronous in the spec. Node cannot synchronously produce a `module.exports`-shaped value from an ESM file, so it refuses outright rather than partially supporting it. The fix is `await import('./pure.mjs')`.
