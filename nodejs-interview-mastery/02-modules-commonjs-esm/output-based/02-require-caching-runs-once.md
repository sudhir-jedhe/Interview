# require() Caching Means Top-Level Code Runs Once

```js
// log-once.cjs
console.log('module executed');
module.exports = {};

// main.cjs
require('./log-once.cjs');
require('./log-once.cjs');
require('./log-once.cjs');
```

**Answer:** `module executed` — printed exactly once.

**Why:** `require()` caches modules by resolved absolute path. After the first `require`, subsequent calls return the cached `module.exports` without re-executing the file's top-level code.
