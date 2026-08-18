# Problem: Implement a Minimal require()-like Module Loader from Scratch

## Problem statement

Implement `createRequire(baseDir)` that returns a `require`-like function replicating the core mechanics of Node's CJS loader: read a file, wrap it in the module wrapper function, execute it with the right arguments, cache the result, and return `module.exports`.

## Requirements

- Support relative paths (`./foo`, `../bar`) resolved against the requiring file's directory.
- Auto-resolve `.js` extension if omitted (`require('./foo')` should find `./foo.js`).
- Cache modules by resolved absolute path — requiring the same file twice must return the *same* `module.exports` object, not re-execute the file.
- The loaded file must have access to `require`, `module`, `exports`, `__filename`, `__dirname` exactly like a real CJS module.
- Nested `require()` calls inside loaded modules must work (i.e. the injected `require` must itself be able to resolve relative to the module that's calling it).

## Solution

```js
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module'); // only used for Module.wrap's format reference; not required to use Node's real loader

const cache = Object.create(null);

function createRequire(fromDir) {
  function customRequire(specifier) {
    const resolvedPath = resolve(specifier, fromDir);

    if (cache[resolvedPath]) {
      return cache[resolvedPath].exports;
    }

    const moduleObj = { exports: {} };
    // Register in the cache BEFORE executing, so a circular require() sees
    // the partially-built exports instead of recursing infinitely.
    cache[resolvedPath] = moduleObj;

    const source = fs.readFileSync(resolvedPath, 'utf8');
    const dirname = path.dirname(resolvedPath);

    // Node's actual wrapper: function(exports, require, module, __filename, __dirname)
    const wrapper = `(function (exports, require, module, __filename, __dirname) {\n${source}\n})`;
    // eslint-disable-next-line no-eval
    const compiledWrapper = eval(wrapper); // in real Node this uses vm.compileFunction, not eval

    const scopedRequire = createRequire(dirname); // nested requires resolve relative to THIS module

    compiledWrapper(
      moduleObj.exports,
      scopedRequire,
      moduleObj,
      resolvedPath,
      dirname
    );

    return moduleObj.exports;
  }

  return customRequire;
}

function resolve(specifier, fromDir) {
  let candidate = path.resolve(fromDir, specifier);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  if (fs.existsSync(candidate + '.js')) return candidate + '.js';
  if (fs.existsSync(path.join(candidate, 'index.js'))) return path.join(candidate, 'index.js');
  throw new Error(`Cannot find module '${specifier}' from '${fromDir}'`);
}

module.exports = createRequire;

// --- usage ---
// const myRequire = createRequire(__dirname);
// const math = myRequire('./math'); // resolves ./math.js
```

**Key design points:**

- **Caching before execution** is essential for correctly handling circular requires: the cache entry is created (with an empty `exports` object) *before* the module's source runs, so if module A requires module B which requires A again, B receives A's still-in-progress (possibly incomplete) `exports` object rather than triggering infinite recursion — this mirrors real Node behavior (see `../theory/02-module-caching-and-circular-requires.md`).
- **Scoped nested require:** each loaded module gets its *own* `require` function bound to its own directory (`createRequire(dirname)`), so relative paths inside that module resolve correctly relative to itself, not the original caller.
- **Real Node uses `vm.compileFunction`**, not `eval`, for security and performance reasons (isolating global scope leakage) — `eval` is used here only for brevity in this from-scratch demonstration; production-grade reimplementations should use `vm.compileFunction(source, ['exports','require','module','__filename','__dirname'], { filename: resolvedPath })`.
- **No `node_modules` resolution** is implemented here for simplicity — a full reimplementation would add the upward directory-walking algorithm described in `../theory/04-require-vs-import-resolution.md` for bare specifiers like `require('lodash')`.
