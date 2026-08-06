When maintaining JavaScript libraries, supporting both **CommonJS (CJS)** (used historically by Node.js with `require()`) and **ECMAScript Modules (ESM)** (the modern standard with `import`) creates a critical challenge known as the **Dual-Package Hazard**.

Understanding how `package.json` resolution fields—`main`, `module`, and modern conditional `exports`—work together prevents runtime state corruption and keeps bundle sizes optimal.

---

# What is the Dual-Package Hazard?

The Dual-Package Hazard occurs when a consumer application accidentally loads **both** the CJS and ESM builds of the same library into memory at runtime.

```text
 CONSUMER APPLICATION
 ├── import { state } from 'my-library';   ──► Resolves to my-library/dist/index.mjs (Instance A)
 └── const { state } = require('my-library'); ──► Resolves to my-library/dist/index.cjs (Instance B)

 RESULT: Two separate module instances run in memory!
 • state.counter in Instance A !== state.counter in Instance B
 • instanceOf checks fail: (instanceA instanceof ClassB) === false

```

### Why Dual Loading Breaks Applications

1. **State Divergence:** If your package maintains internal state (singletons, stores, registries, or caches), `import` and `require` write to two completely independent state copies.
2. **Type Identity Failure:** Classes exported by the CJS build fail `instanceof` checks against objects created by the ESM build.
3. **Bundle Bloat:** Client-side bundlers bundle the entire library twice, doubling its footprint.

---

## 1. Evolution of Resolution Fields in `package.json`

### A. The Legacy Field: `"main"`

* **Introduced by:** Node.js (CommonJS).
* **Behavior:** Points to the main entry point for `require()`.
* **Limitation:** Does not distinguish between CJS and ESM. Defaults to CJS semantics unless `"type": "module"` is configured.

```json
{
  "main": "./dist/index.cjs"
}

```

---

### B. The Community Standard: `"module"`

* **Introduced by:** Rollup and Webpack (Not an official Node.js standard).
* **Behavior:** Points bundlers to an ESM version (`.mjs` or ES6 code) to enable **tree-shaking** for web applications, while Node.js falls back to `"main"`.
* **Limitation:** Node.js historically ignored `"module"`. If a Node.js app used ESM `import` statements natively, Node still resolved `"main"` (CJS), leading to dual-instance loading between backend tools and frontend bundlers.

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs"
}

```

---

### C. The Modern Official Standard: Subpath & Conditional `"exports"`

* **Introduced in:** Node.js v12.11.0+ (Official Specification).
* **Behavior:** Replaces `main` and `module` with explicit **Conditional Resolution Rules** that strictly control how runtime environments and bundlers access package entry points.

```json
{
  "name": "my-library",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./utils": {
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.cjs"
    }
  }
}

```

### Key Advantages of `"exports"`

* **Encapsulation:** Only paths explicitly defined in `"exports"` can be imported. Internal helper files (e.g., `my-library/dist/internal/secret.js`) are private and throw a `MODULE_NOT_FOUND` error if accessed.
* **Deterministic Resolution:** Completely overrides `"main"` and `"module"` in modern Node.js and bundlers (Vite, Webpack 5, esbuild).

---

## 2. Preventing the Dual-Package Hazard

Package authors use two primary architectural strategies to eliminate the dual-package hazard:

```text
 STRATEGY 1: CJS WRAPPER PATTERN (Recommended)
 CJS Build (index.cjs) ──► Re-exports / Delegates to ──► ESM Build (index.mjs)
 (Guarantees both import and require execute the EXACT same underlying ESM file)

 STRATEGY 2: STATE ISOLATION PATTERN
 Shared Global State File (state.cjs) ◄── Imported by both index.mjs & index.cjs

```

### Strategy 1: The CJS Wrapper Pattern (Best Practice)

Write your library natively in ESM (`index.mjs`). Then create a lightweight CommonJS wrapper (`index.cjs`) that asynchronously or dynamically imports the ESM instance:

```javascript
// dist/index.cjs (CJS Bridge)
// Delegates directly to the ESM instance so only ONE instance exists in memory
module.exports = import('./index.mjs').then((esm) => esm);

```

---

### Strategy 2: Isolated Global State

If your package *must* maintain separate CJS and ESM entry files for synchronous execution, isolate all state variables into a dedicated single-instance file using `globalThis` or a shared CJS singleton:

```javascript
// src/state.js
const globalStateKey = Symbol.for('my-library.state');

if (!globalThis[globalStateKey]) {
  globalThis[globalStateKey] = { count: 0 };
}

export const state = globalThis[globalStateKey];

```

---

## 3. Order Precedence in Conditional Exports

Order matters inside the `exports` object. Environment keys are evaluated sequentially from top to bottom:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",      // 1. TypeScript declaration
      "import": "./dist/index.mjs",      // 2. ESM import
      "require": "./dist/index.cjs",     // 3. CJS require
      "default": "./dist/index.cjs"      // 4. Fallback
    }
  }
}

```

> **Important Rule:** `types` must always come **first** in conditional exports so TypeScript can resolve the correct type definitions before checking module formats.

---

## Technical Summary Matrix

| Field           | Introduced By      | Primary Consumer                 | Encapsulation / Private Files        | Dual-Package Protection                        |
| --------------- | ------------------ | -------------------------------- | ------------------------------------ | ---------------------------------------------- |
| **`"main"`**    | Node.js            | Legacy Node & bundlers           | ❌ No (All files accessible)          | ❌ None                                         |
| **`"module"`**  | Rollup / Webpack   | Client-side bundlers             | ❌ No                                 | ⚠️ Partial (Bundlers use ESM; Node uses CJS)    |
| **`"exports"`** | Node.js (Official) | Modern Node.js, Vite, Webpack 5+ | ✅ **Strict** (Internal paths hidden) | ✅ **Full** (Enforces explicit CJS/ESM mapping) |
