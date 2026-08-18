# CommonJS: How require() Actually Works

CommonJS (CJS) is Node's original module system. Every `.js` file (unless `"type": "module"` is set) is treated as a CJS module. Before your code runs, Node wraps the entire file contents in a function:

```js
(function (exports, require, module, __filename, __dirname) {
  // your file's code lives here
});
```

This is why `require`, `module`, `exports`, `__filename`, and `__dirname` appear to be "globals" available in every file — they're actually parameters injected by the wrapper, scoped per-module.

## module.exports vs exports

`module.exports` starts as `{}`; whatever you assign to it (or mutate on it) is what `require()` returns to callers. `exports` is just a reference to `module.exports` — reassigning `exports = {...}` breaks the link (the caller still gets the original `module.exports`), while mutating `exports.foo = ...` works fine.

```js
// math.js
module.exports = { add: (a, b) => a + b };

// or, equivalently, mutate the shared reference:
exports.subtract = (a, b) => a - b;

// this DOES NOT work as expected — breaks the exports/module.exports link:
exports = { multiply: (a, b) => a * b }; // caller never sees this
```

Both start out pointing to the *exact same object* — at the start of module execution, `exports === module.exports` is `true`, because `exports` is literally the wrapper function's parameter, pre-set to point to `module.exports`. Since mutating (not reassigning) either one changes properties on that same shared object, `module.exports.foo = 'bar'` is visible through `exports.foo` too, and vice versa.

## Loading is synchronous

`require()` blocks until the file is read and executed — fine for local files at startup, but why `require()` inside hot request-handling paths, or against network filesystems, is discouraged.

## Common gotchas

- Mixing `require` and `import` in the same file is not allowed — pick one system per file.
- `__dirname`/`__filename` don't exist in ESM; use `import.meta.url` with `fileURLToPath` instead (see `03-esm-basics.md`).
- Circular `require()`s return a partially-populated `module.exports` (whatever was set before the cycle was hit), which can silently produce `undefined` for not-yet-assigned exports — covered in depth in `04-module-caching-and-circular-requires.md`.
