# Named Import of a CJS Module That Doesn't Statically Resolve

```js
// dynamic-exports.cjs
function build() {
  const obj = {};
  obj.value = 42;
  return obj;
}
module.exports = build();

// app.mjs
import { value } from './dynamic-exports.cjs';
console.log(value);
```

**Answer:** Works and logs `42` in modern Node (v18+), but is fragile — for more dynamic/computed export shapes Node's CJS-named-exports static analysis can fail with `SyntaxError: Named export 'value' not found`.

**Why:** Node's ESM/CJS interop layer uses a static syntactic scan (via `cjs-module-lexer`) of the CJS file to detect likely named exports without executing it first — simple object literal patterns are detected, but sufficiently dynamic construction can defeat the analysis. The safe, guaranteed-to-work approach is always `import pkg from './dynamic-exports.cjs'; pkg.value`.
