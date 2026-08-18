# Importing a CommonJS Module from ESM (Default-Import Interop)

```js
// file: legacy.cjs
module.exports = { version: '1.0.0' };

// file: app.mjs
import legacy from './legacy.cjs';
console.log(legacy.version); // '1.0.0'
```

Node's ESM loader wraps a CJS module's entire `module.exports` object as the ESM default export — so `legacy` here is exactly the object `{ version: '1.0.0' }`, accessed the same way you'd access it in CJS via `require('./legacy.cjs')`. This default-import form always works regardless of how the CJS module's exports are structured, unlike named imports from CJS (see `../theory/05-cjs-esm-interop.md`), which rely on static analysis that can fail for dynamically-constructed export objects.
