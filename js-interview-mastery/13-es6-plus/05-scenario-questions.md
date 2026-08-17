# Scenario Questions: ES6+ Features

**You're building a caching layer that maps arbitrary request objects (not strings) to cached responses, and needs cached entries to be automatically evicted once nothing else references the request object. Plain objects can't use object keys meaningfully — what data structure solves this, and what's the garbage-collection subtlety?**

**Approach:**
A plain object coerces any non-symbol key to a string, so distinct request objects would collide under `"[object Object]"`. `Map` correctly supports object identity as keys:

```js
const cache = new Map();
function getCached(requestObj, computeFn) {
  if (!cache.has(requestObj)) {
    cache.set(requestObj, computeFn(requestObj));
  }
  return cache.get(requestObj);
}
```
But a regular `Map` holds a **strong reference** to its keys — as long as the `Map` exists, the request objects (and their cached values) can never be garbage collected, even if nothing else in the app references them anymore, causing a memory leak. For exactly this eviction-on-no-references scenario, use `WeakMap` instead: it holds weak references to its keys, so once a request object has no other references, both the key and its cached value become eligible for garbage collection automatically. The trade-off is `WeakMap` isn't iterable and has no `.size`, since its contents can vanish at any time.

---

**A teammate wrote a utility module using CommonJS (`module.exports`) that your new ES-module-based codebase needs to consume, and you're debugging why an exported counter variable doesn't update as expected when imported. What's the root cause, and how does the fix differ between the two module systems?**

**Approach:**
The root cause is almost certainly a misunderstanding of "live bindings." In native ES modules, `import { count } from './mod.js'` creates a live, read-only reference — if the module internally does `count++`, every importer automatically sees the updated value. CommonJS `module.exports = { count }` instead copies the **value** of `count` at the moment `module.exports` is assigned; later internal mutations to the source's local `count` variable are invisible to anything that already destructured it out via `const { count } = require('./mod')`.

```js
// ES module — works as expected
export let count = 0;
export function inc() { count++; }
// importer sees updates automatically

// CommonJS — does NOT reflect later updates to the primitive
let count = 0;
function inc() { count++; }
module.exports = { count, inc }; // count is copied at export time
```
The fix in CommonJS is to expose a getter function (`module.exports = { getCount: () => count, inc }`) rather than the raw value, forcing consumers to always re-read the current value instead of relying on a stale copy.

---

**You're writing a data-processing pipeline that reads a huge CSV file line by line and needs to expose a `parseCsv(text)` function returning something the caller can `for-of` over one row at a time, without loading every parsed row into memory at once. How do generators solve this, and what would go wrong with an array-returning approach for a very large file?**

**Approach:**
```js
function* parseCsv(text) {
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const values = lines[i].split(',');
    yield Object.fromEntries(headers.map((h, idx) => [h, values[idx]]));
  }
}

for (const row of parseCsv(csvText)) {
  console.log(row);
  // could `break` early without ever parsing the rest of the file
}
```
An array-returning version (`function parseCsv(text) { return lines.map(...); }`) forces the entire file to be parsed and held in memory before the caller can process a single row — for a multi-gigabyte CSV this can exhaust memory or introduce a large upfront latency spike. The generator version parses lazily, one row per `next()` call, so memory usage stays constant regardless of file size, and a caller who only needs the first few rows (e.g., a preview feature) can `break` out of the loop early, skipping the cost of parsing the rest entirely.

---

**You need a feature flag / permission system where flags are looked up by dynamically-generated keys from third-party plugin code, and you're worried a plugin could accidentally (or maliciously) register a flag with a name like `"__proto__"` or `"toString"` and break the whole system. How do ES6 tools address this?**

**Approach:**
Two complementary defenses. First, use `Symbol()` for keys that must never collide, if the plugin identity is known ahead of time and controlled by your code:

```js
const flagKey = Symbol('feature:newCheckout');
const flags = { [flagKey]: true };
```
More realistically, for dynamic string keys from untrusted input, avoid plain objects as the store entirely and use a `Map`, which treats every key as a distinct opaque value with no special-cased string keys like `"__proto__"`:

```js
const flags = new Map();
flags.set('__proto__', true); // perfectly safe — just a normal entry
console.log(flags.get('__proto__')); // true, no prototype pollution
```
A plain object (`{}`) used as a dictionary is vulnerable because certain string keys (`"__proto__"`, `"constructor"`, `"prototype"`) interact with the prototype chain in surprising ways depending on how the object is constructed and accessed; `Map` sidesteps this entirely since it has no such special key semantics — every `.set()`/`.get()` call operates on genuinely isolated internal storage, not object property slots.
