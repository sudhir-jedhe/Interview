# Problem: Convert a Small CJS Module to ESM, Fixing Interop Issues

## Problem statement

Given the following small CJS module, convert it to native ESM (`.mjs`, or `.js` under `"type": "module"`), fixing every interop issue that comes up along the way (mixed `require`/`module.exports`, `__dirname` usage, a dynamic `require()` inside a conditional, and a default export consumers rely on).

```js
// original: logger.cjs
const path = require('node:path');
const fs = require('node:fs');

const logFilePath = path.join(__dirname, 'app.log');

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFilePath, line);
}

function loadFormatter(useJson) {
  // conditional require -- legal in CJS
  if (useJson) {
    return require('./jsonFormatter.cjs');
  }
  return require('./textFormatter.cjs');
}

module.exports = log;
module.exports.loadFormatter = loadFormatter;
```

## Requirements

- Convert all `require()` calls to static `import` where possible.
- Replace the conditional `require()` with the ESM-appropriate equivalent.
- Replace `__dirname` with the ESM equivalent.
- Preserve the "default export is the log function, but it also has a `.loadFormatter` property" shape as closely as ESM allows, or restructure it to a more idiomatic ESM shape and explain the tradeoff.

## Solution

```js
// converted: logger.mjs
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// __dirname doesn't exist in ESM -- reconstruct it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, 'app.log');

export function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFilePath, line);
}

// Static import cannot be conditional -- use dynamic import(), which
// returns a Promise, so this function must become async.
export async function loadFormatter(useJson) {
  const mod = useJson
    ? await import('./jsonFormatter.mjs')
    : await import('./textFormatter.mjs');
  return mod.default;
}

// The original CJS shape attached loadFormatter as a property of the
// default-exported function (module.exports = log; module.exports.loadFormatter = ...).
// ESM doesn't support attaching arbitrary properties to a "default export" in the
// same ergonomic way -- the idiomatic ESM fix is separate named exports instead,
// as done above (`export function log`, `export async function loadFormatter`).
// A consumer that did `const log = require('./logger.cjs'); log('hi'); log.loadFormatter(true)`
// now does:
//   import { log, loadFormatter } from './logger.mjs';
//   log('hi');
//   const formatter = await loadFormatter(true);
```

**Interop issues fixed, one by one:**

1. **`require('node:path')` / `require('node:fs')`** → static `import path from 'node:path'` / `import fs from 'node:fs'`. Both are Node built-ins with default-export-friendly CJS shapes, so this is a direct swap.
2. **`__dirname`** → doesn't exist in ESM; reconstructed via `fileURLToPath(import.meta.url)` + `path.dirname()`, the standard idiom (see `../theory/05-cjs-esm-interop.md` and `../snippets/06-dirname-filename-in-esm.md`).
3. **Conditional `require()` inside `loadFormatter`** → illegal as static `import` syntax in ESM (`import` must be top-level, unconditional). Converted to dynamic `import()`, which is Promise-based — this forces `loadFormatter` to become `async`, a real behavioral change callers must adapt to, not just a syntax swap.
4. **`module.exports = log; module.exports.loadFormatter = loadFormatter`** → ESM has no direct equivalent for "a function as the default export that also carries named properties" as ergonomically as CJS. The idiomatic fix is to drop the single-default-export-with-attached-property pattern entirely in favor of separate named exports, which is both simpler and statically analyzable (better for tree-shaking) — the tradeoff is that every consumer's import site needs to change from `const log = require(...)` to `import { log, loadFormatter } from ...`, which is often the majority of the migration effort in a real codebase.
