# ES Modules Basics

With `"type": "module"` in `package.json` (or a `.mjs` extension), Node treats files as native ES Modules using `import`/`export` syntax:

```js
// math.mjs
export function add(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; }
```

```js
// app.mjs
import multiply, { add } from './math.mjs';
```

## Static analysis

ESM is **statically analyzed** — `import` statements must appear at the top level (not conditionally, not inside functions) and are resolved/hoisted before any code runs, which is what enables tree-shaking by bundlers and lets tools reason about the dependency graph without executing code. This is the opposite of CJS, where `require()` is just a function call you can put anywhere, including inside conditionals or loops:

```js
// legal in CJS, illegal in ESM (syntax error) at top level:
if (condition) {
  const dep = require('./maybe-needed');
}
```

## Strict mode and top-level await

ESM modules run in **strict mode automatically** (no `"use strict"` needed) — ESM was designed after `"use strict"` was already established as best practice, so the spec simply mandates it. CommonJS predates widespread strict-mode adoption and needed to preserve backward compatibility with existing non-strict scripts, so it defaults to sloppy mode unless a file explicitly opts in.

ESM also supports **top-level `await`** — you can `await` directly at module scope without wrapping in an async function, something CJS cannot do:

```js
// only valid in ESM
const data = await fetch('https://api.example.com/data').then(r => r.json());
export { data };
```

Node achieves this by treating the entire module's evaluation as implicitly async; any module that imports a module using top-level await will itself wait for that module to finish evaluating before proceeding — see `05-cjs-esm-interop.md` for the practical consequence when a slow dependency delays every module that imports it.

## Live bindings vs copied values

ESM `import`s are **live bindings**, not copies: if module A exports a mutable `let` binding and later reassigns it, every module that did `import { value } from './A.mjs'` sees the updated value automatically, because ESM imports are references to the exporting module's binding. CommonJS has no equivalent — `require()` returns the actual object/value at call time, and if the exporter later reassigns its own local variable (not mutates an object property), the CJS consumer's earlier `require()` result won't reflect that reassignment.

## File extension and package.json rules

- `.js` files: interpreted as CJS by default, or ESM if the nearest `package.json` has `"type": "module"`.
- `.mjs`: always ESM, regardless of `"type"`.
- `.cjs`: always CJS, regardless of `"type"`.
- No `"type"` field at all defaults to `"commonjs"` — purely a backward-compatibility default.

This escape hatch (`.mjs`/`.cjs`) lets you mix both systems in one package deliberately — see `../problems/02-cjs-to-esm-conversion.md` for a worked incremental migration.

### .mjs / .cjs extensions vs "type" field in package.json

| Aspect | Explicit extension (.mjs/.cjs) | `"type"` field in package.json |
|---|---|---|
| Scope | Per-file, always wins | Per-package (or per-directory with nested package.json) |
| Overridable | No — extension is authoritative | Yes — a `.mjs` file ignores `"type": "commonjs"` |
| Use case | Mixing systems deliberately within one package | Declaring a package's default module system |

Use explicit extensions when you need to mix both systems in one package (e.g. a CJS build alongside an ESM entry point); use the `"type"` field to set the default for all plain `.js` files in a package. The common mistake is setting `"type": "module"` in `package.json` and then being surprised that all existing `.js` files (previously CJS) now fail to parse `require()` calls.

### CommonJS vs ES Modules — the full picture

| Aspect | CommonJS | ES Modules |
|---|---|---|
| Syntax | `require()`, `module.exports` | `import`/`export` |
| Loading | Synchronous | Asynchronous (graph resolved before evaluation) |
| Dynamic loading | `require()` anywhere, even conditionally | Only via `import()` (returns a Promise); static `import` must be top-level |
| Strict mode | Opt-in via `"use strict"` | Always on, automatically |
| Top-level await | Not supported | Supported |
| `this` at module top level | `module.exports` (an object) | `undefined` |
| Import semantics | Value snapshot at `require()` call time | Live binding |

Use ESM for new projects when your tooling/deployment target supports it — it's the standardized, future-facing system with better static analyzability. The most common mistake is assuming you can freely mix `require` and `import` syntax in one file; you must pick per-file (via extension/`package.json`), though cross-file interop is possible (see `05-cjs-esm-interop.md`).
