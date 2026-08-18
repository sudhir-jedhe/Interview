# require() vs import: Resolution Behavior

Beyond the syntax differences covered in `03-esm-basics.md`, `require()` and `import` differ in *when* and *how* they resolve — this matters for anything relying on dynamic/conditional module loading.

| Aspect | require() | import |
|---|---|---|
| When resolved | At the exact line, at runtime | Statically hoisted, resolved before module body runs |
| Can appear in conditionals/functions | Yes | No (static form); use dynamic `import()` instead |
| Caching mechanism | `require.cache` keyed by resolved path | Internal module map, same one-instance-per-resolved-path guarantee |
| Returns | The value directly (synchronous) | A Promise (dynamic `import()`) or bound live binding (static `import`) |

`require()` gives you a snapshot copy of the exported value at call time; ESM `import` gives you a **live binding** (see `03-esm-basics.md`). The common mistake is assuming CJS exports update live the way ESM ones do — they don't, since `require()` returns a plain object reference, not a binding.

## Conditional/dynamic loading

CJS's `require()` being a plain function call means it can be called conditionally:

```js
// featureFlag.cjs — legal in CJS
function loadFeature(enabled) {
  if (enabled) {
    return require('./featureModule.cjs'); // fine -- require is just a function
  }
  return null;
}
module.exports = loadFeature;
```

ESM's static `import` cannot appear inside a conditional at all (it's a syntax error, not just discouraged) — the equivalent in ESM is the dynamic `import()` function, which returns a Promise and can be called anywhere, including conditionally:

```js
// esmOnly.mjs
export const flag = true;

// loader.mjs
async function loadFeature(enabled) {
  if (enabled) {
    return await import('./esmOnly.mjs');
  }
  return null;
}
```

## Node's node_modules resolution algorithm

Both `require()` and `import` specifiers that aren't relative/absolute paths (bare specifiers like `'express'`) are resolved by walking up the directory tree looking for a matching `node_modules` folder, starting from the requiring file's own directory:

```
/project/src/routes/users.js requires 'express'
-> /project/src/routes/node_modules/express?  (no)
-> /project/src/node_modules/express?          (no)
-> /project/node_modules/express?              (yes, found)
```

This is why a single top-level `node_modules` at the project root satisfies requires from any nested file, and why a package can hold a private, version-conflicting copy of a dependency nested inside its own `node_modules` that takes precedence for its own code.
