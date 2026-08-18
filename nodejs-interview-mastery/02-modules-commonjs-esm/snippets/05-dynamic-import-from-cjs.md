# Dynamically Importing an ESM Module from a CommonJS File

```js
// file: esmOnly.mjs
export const flag = true;

// file: loader.cjs
async function main() {
  const mod = await import('./esmOnly.mjs'); // require('./esmOnly.mjs') would throw ERR_REQUIRE_ESM
  console.log(mod.flag);
}
main();
```

`loader.cjs` is a plain CommonJS file (using `require` implicitly available, though it isn't used here), but it can still reach a pure-ESM module via the dynamic `import()` function, which is available in both module systems and always returns a Promise resolving to the module's namespace object (`mod.flag`, `mod.default`, etc.). This is the only working path from CJS to ESM — a direct `require('./esmOnly.mjs')` would throw `ERR_REQUIRE_ESM` synchronously. See `../theory/05-cjs-esm-interop.md` for why the synchronous path is impossible.
