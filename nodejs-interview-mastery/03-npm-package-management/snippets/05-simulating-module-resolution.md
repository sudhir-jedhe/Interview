# Walking Up Directories to Simulate Node's Module Resolution Algorithm

```js
const path = require('node:path');
const fs = require('node:fs');

function resolveModuleDir(startDir, moduleName) {
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, 'node_modules', moduleName);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return null; // reached filesystem root
    dir = parent;
  }
}
console.log(resolveModuleDir(__dirname, 'express'));
```

This directly implements the walk-up algorithm described in `../theory/04-node-modules-resolution.md`: starting at `startDir`, check for `node_modules/<moduleName>`; if not found, move to the parent directory and repeat, until either a match is found or the filesystem root is reached (`path.dirname(dir) === dir` is the standard way to detect you've hit the root, since the root's own parent is itself). This is a simplified version of what Node's real module resolver does internally — the real resolver also handles `package.json` `"exports"` maps, file extensions, and index files, none of which this minimal version covers.
