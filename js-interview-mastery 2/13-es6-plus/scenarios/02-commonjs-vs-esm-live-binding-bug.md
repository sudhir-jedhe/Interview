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
