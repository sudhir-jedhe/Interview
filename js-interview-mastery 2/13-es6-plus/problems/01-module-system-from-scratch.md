# Problem: Implement a Module System by Hand

**Goal:** Build a tiny module system using a shared registry object, to understand conceptually what `import`/`export` desugars to under the hood (this is roughly how CommonJS's `require` cache works, and conceptually similar to how bundlers wire ES modules together at build time).

## The idea

Real ES modules are resolved statically by the engine, but at a conceptual level, each module:
1. Runs its body exactly once.
2. Registers whatever it wants to expose under its own module ID.
3. Any other module that "imports" it just looks up that ID in a shared registry, running the module first if it hasn't been run yet.

## Implementation

```js
// --- the "module system" runtime ---
const registry = new Map(); // moduleId -> { exports, loaded }

function defineModule(id, factory) {
  registry.set(id, { factory, exports: null, loaded: false });
}

function requireModule(id) {
  const mod = registry.get(id);
  if (!mod) throw new Error(`Module not found: ${id}`);
  if (!mod.loaded) {
    // Run the factory exactly once, giving it an empty exports object to fill in —
    // this mirrors how CommonJS gives every module a fresh `module.exports = {}`.
    const moduleExports = {};
    mod.factory(moduleExports, requireModule);
    mod.exports = moduleExports;
    mod.loaded = true; // mark before returning so circular requires don't re-run the factory
  }
  return mod.exports;
}
```

## Two "modules" using the registry

```js
// "math" module — exports two named things, like `export const PI` / `export function square`
defineModule('math', (exports) => {
  exports.PI = 3.14159;
  exports.square = (x) => x * x;
});

// "app" module — "imports" from math, like `import { PI, square } from './math.js'`
defineModule('app', (exports, require) => {
  const { PI, square } = require('math');
  exports.describeCircle = (r) => `Area ≈ ${(PI * square(r)).toFixed(2)}`;
});

const app = requireModule('app');
console.log(app.describeCircle(2)); // Area ≈ 12.57
```

## What this illustrates

- `export` conceptually means "attach a property to this module's exports object."
- `import { x } from './mod.js'` conceptually means "call require('mod'), then read `.x` off the result."
- A module only runs once no matter how many times it's imported — `mod.loaded` guards re-execution, exactly like Node's `require` cache. Real ES modules take this further with **live bindings** (see `theory/02-es-modules.md`): this hand-rolled version returns a copied reference to the exports object, so if `math` later mutated `exports.PI`, an `app` that already destructured `PI` out wouldn't see the change — the same limitation CommonJS has.
- Circular requires are handled the same way Node handles them: the `loaded` flag is set *before* the factory returns, so a module that circularly requires itself gets back a partially-filled exports object rather than infinite recursion.
