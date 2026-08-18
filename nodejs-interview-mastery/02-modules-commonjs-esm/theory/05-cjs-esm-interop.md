# CJS ↔ ESM Interop

Given two module systems (CommonJS covered in `01`/`02`, ESM in `03`/`04`), Node needs interop rules for when one system needs to consume the other. The rules are asymmetric — one direction works cleanly, the other doesn't work at all synchronously.

## ESM importing CJS: supported

You **can** `import` a CJS module from ESM — Node wraps the CJS module's `module.exports` as the default export (and does best-effort static analysis for named exports of simple `object` patterns):

```js
// ESM importing CJS
import pkg from './legacy-cjs-module.cjs';
```

```js
// file: legacy.cjs
module.exports = { version: '1.0.0' };

// file: app.mjs
import legacy from './legacy.cjs';
console.log(legacy.version); // '1.0.0'
```

Named imports (`import { thing } from './legacy.cjs'`) can also work if Node's static analysis (via `cjs-module-lexer`) can detect simple, statically-shaped exports:

```js
// dynamic-exports.cjs
function build() {
  const obj = {};
  obj.value = 42;
  return obj;
}
module.exports = build();

// app.mjs
import { value } from './dynamic-exports.cjs';
console.log(value); // works in modern Node (v18+), but fragile
```

This works in modern Node because the export shape (a plain object with a static-looking property) is simple enough for the lexer to detect — but sufficiently dynamic construction can defeat the analysis and throw `SyntaxError: Named export 'value' not found`. The safe, guaranteed-to-work approach is always the default import: `import pkg from './dynamic-exports.cjs'; pkg.value`.

## CJS requiring ESM: not supported

You **cannot** `require()` a genuine ESM module. `require()` is fundamentally synchronous, but loading an ES module is an inherently asynchronous operation (its own dependency graph must be fetched/linked/evaluated first) — there's no way to synchronously unwrap that into a `require()` return value. Node throws `ERR_REQUIRE_ESM` rather than offering broken partial support:

```js
// pure.mjs
export const x = 1;

// loader.cjs
const mod = require('./pure.mjs');
console.log(mod.x);
// Throws: Error [ERR_REQUIRE_ESM]: require() of ES Module ... not supported.
```

The workaround is a dynamic `import()`, which returns a Promise and works from CJS code:

```js
// inside a CJS file
async function loadEsmDep() {
  const esmModule = await import('./pure-esm-module.mjs');
  return esmModule.default;
}
```

## Interop directions summary

| Aspect | ESM importing CJS | CJS requiring ESM |
|---|---|---|
| Supported? | Yes | No — throws `ERR_REQUIRE_ESM` |
| Mechanism | `module.exports` becomes the default export; named exports best-effort via static analysis | N/A — must use dynamic `import()` (async) instead |
| Reliability | Default import always works; named import can fail for dynamic export shapes | Dynamic `import()` always works, but forces the CJS caller into async code |

Reach for default import as the reliable path when consuming CJS from ESM. The common mistake is trying `require()` on a package that ships ESM-only (common in modern npm packages) and hitting `ERR_REQUIRE_ESM` — the fix is `await import(...)` or checking if the package still ships a CJS build. See `../scenarios/01-err-require-esm-after-upgrade.md` for a full incident walkthrough, and `../problems/02-cjs-to-esm-conversion.md` for converting a module across the boundary properly.
