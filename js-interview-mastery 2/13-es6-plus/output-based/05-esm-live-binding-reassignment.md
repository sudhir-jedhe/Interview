```js
// counter.mjs
export let count = 0;
export function inc() { count++; }

// main.mjs
import { count, inc } from './counter.mjs';
console.log(count);
inc();
console.log(count);
count = 5; // attempt to reassign the imported binding
```
**Answer:**
```
0
1
TypeError: Assignment to constant variable. (or "count" is read-only, depending on engine)
```
**Why:** ES module imports are **live, read-only bindings**, not copies. The importing module always sees the current value from the source module (so `count` correctly becomes `1` after `inc()` runs elsewhere), but the importer cannot itself reassign the binding — only the exporting module can change it. Attempting to assign `count = 5` from `main.mjs` throws.
