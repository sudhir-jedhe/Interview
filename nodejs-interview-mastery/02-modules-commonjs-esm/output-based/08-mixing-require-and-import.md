# Mixing require and import in the Same File

```js
import fs from 'node:fs';
const path = require('node:path');
console.log(fs, path);
```

**Answer:** `SyntaxError: Cannot use import statement outside a module` or (if in an `.mjs`/ESM context) `ReferenceError: require is not defined`.

**Why:** `import`/`export` and `require`/`module.exports` belong to two mutually exclusive module systems selected per-file (via extension or `package.json` `"type"`). A file is parsed as one or the other before execution — you cannot use both syntaxes together in a single file, though you can `import`/dynamic-`import()` across the boundary between separate files.
