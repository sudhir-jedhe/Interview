# Native ESM with Named + Default Export and Top-Level Await

```js
// file: fetchData.mjs
export async function getData() {
  return { ok: true };
}
export default getData;

const preloaded = await getData(); // top-level await, ESM-only
console.log(preloaded);
```

This file exports `getData` both as a named export and (the same function) as the default export, letting consumers pick either `import { getData } from './fetchData.mjs'` or `import getData from './fetchData.mjs'`. The `await getData()` call at the bottom runs directly at module scope, with no wrapping `async function` — only legal in ESM, since ESM module evaluation is implicitly async (see `../theory/03-esm-basics.md`). CommonJS has no equivalent; you'd need an IIFE (`(async () => { ... })()`) to get similar top-level `await`-like behavior, and even then it wouldn't block sibling `require()` calls the way ESM top-level await blocks importers.
