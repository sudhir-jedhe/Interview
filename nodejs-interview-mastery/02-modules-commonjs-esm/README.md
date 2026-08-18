# Modules: CommonJS & ES Modules

Node.js supports two module systems — CommonJS (`require`/`module.exports`), the original synchronous system Node was built on, and ECMAScript Modules (`import`/`export`), the standardized system now natively supported. This topic covers how each works internally, how module caching and resolution behave, the concrete syntactic and semantic differences between them (sync vs static analysis, strict mode, top-level await), and the often-confusing rules for mixing the two in one project. Interviewers frequently probe the "why can't I `require()` an ESM module" question and the module wrapper function, both covered here with worked examples.

> Looking for your original flat notes on this? See `../SOURCE-MAP.md`.

## Folder structure

- **`theory/`** — core concepts, split by subject:
  - `01-commonjs-require-and-wrapper.md` — the module wrapper function, `module.exports` vs `exports`
  - `02-module-caching-and-circular-requires.md` — `require.cache`, singleton behavior, circular require semantics
  - `03-esm-basics.md` — `import`/`export`, static analysis, strict mode, top-level await, live bindings, `.mjs`/`.cjs`/`"type"` rules
  - `04-require-vs-import-resolution.md` — when each is resolved, conditional loading, `node_modules` walk-up resolution
  - `05-cjs-esm-interop.md` — importing CJS from ESM, why `require()` of ESM fails, interop directions
- **`snippets/`** — 7 runnable code snippets, one per file (export patterns, require caching, top-level await, CJS→ESM interop, ESM→CJS dynamic import, `__dirname` in ESM, conditional require)
- **`output-based/`** — 8 "predict the output" questions with full traces (exports reassignment, caching, circular require, `ERR_REQUIRE_ESM`, top-level await blocking, live reference checks, named-import static analysis, mixed syntax)
- **`scenarios/`** — 5 real-world scenarios (an `ERR_REQUIRE_ESM` upgrade break, shared mutable config causing cross-request bugs, incremental CJS→ESM migration, a shared-array-reference surprise, resetting module state between tests)
- **`interview-qa/`** — 13 Q&A pairs grouped into 4 themed files: CommonJS fundamentals, configuring module systems, ESM semantics, and interop/ESM-only APIs
- **`problems/`** — 3 hands-on coding challenges: a minimal `require()`-like loader built from scratch, a full CJS→ESM module conversion, and a circular-require bug demonstration + fix
- **`assets/`** — placeholder for original images/PDFs (see `assets/README.md`)

## What's covered

- CommonJS: `require`, `module.exports` vs `exports`, synchronous loading
- Module caching by resolved file path, and cache-busting gotchas
- The CommonJS module wrapper function and what `require`, `module`, `__dirname` actually are
- ES Modules: `import`/`export`, `"type": "module"`, `.mjs`/`.cjs` extension rules
- Static analysis (import hoisting, tree-shaking) vs CJS's fully dynamic `require`
- Top-level `await` and strict mode by default in ESM
- CJS ↔ ESM interop, and why `require()` of a pure ESM module fails
