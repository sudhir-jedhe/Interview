# Conditional require() — Legal in CJS, Illegal Syntax at Top Level in ESM

```js
// file: featureFlag.cjs
function loadFeature(enabled) {
  if (enabled) {
    return require('./featureModule.cjs'); // fine -- require is just a function
  }
  return null;
}
module.exports = loadFeature;
```

Because `require()` is a completely ordinary synchronous function call — not special syntax — it can appear anywhere a function call is legal: inside `if` blocks, loops, try/catch, or deep inside other functions. This is a deliberate contrast with ESM's static `import` declaration (see `../theory/04-require-vs-import-resolution.md`), which must appear at the top level of a module and would be a `SyntaxError` if written inside this same `if` block — the ESM equivalent of conditional loading is the dynamic `import()` function, which returns a Promise rather than a value directly.
