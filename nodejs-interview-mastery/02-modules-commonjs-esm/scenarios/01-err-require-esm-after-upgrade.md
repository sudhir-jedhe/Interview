# You Upgraded a Dependency and Now Get ERR_REQUIRE_ESM

Your CJS codebase (`"type": "commonjs"`, using `require()` everywhere) upgraded a package and the build broke with `Error [ERR_REQUIRE_ESM]: require() of ES Module ... not supported` at the `require('some-package')` call site.

**Approach:** The package dropped CJS support and now ships ESM-only (common for modern npm packages). You have three options: (1) pin the dependency to its last CJS-compatible version if migration isn't feasible right now; (2) convert the specific import site to a dynamic `import()`, which works from CJS since it returns a Promise:

```js
// before (breaks)
const pkg = require('some-esm-only-package');

// after
let pkg;
async function loadPkg() {
  if (!pkg) pkg = await import('some-esm-only-package');
  return pkg;
}
module.exports.doThing = async (...args) => {
  const { default: fn } = await loadPkg();
  return fn(...args);
};
```

(3) If feasible, migrate your whole package to `"type": "module"` — the more future-proof but more invasive fix, since every `require`/`module.exports` call site needs converting. Recommend option 2 as a quick unblock and option 3 as a tracked follow-up. See `../theory/05-cjs-esm-interop.md` for why `require()` can never work here, and `../problems/02-cjs-to-esm-conversion.md` for a full module conversion walkthrough.
