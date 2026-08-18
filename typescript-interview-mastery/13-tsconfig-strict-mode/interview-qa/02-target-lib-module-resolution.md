# Interview Q&A: target, lib, module, and moduleResolution

**Q: What's the difference between `target` and `lib`?**
A: `target` controls what ECMAScript version the compiler *emits* — it downlevels newer syntax (async/await, optional chaining) to run on older engines if needed. `lib` controls what global APIs the *type checker* assumes exist (`Promise`, `fetch`, DOM globals, etc.), independent of what syntax is emitted. Setting `target` without an explicit `lib` implicitly picks a matching-era `lib`, which can silently exclude modern APIs like `Promise` or `fetch` even if your actual runtime fully supports them.

**Q: Why would you need `"DOM"` in `lib` but not in a Node.js backend project?**
A: `"DOM"` declares browser globals — `window`, `document`, `fetch`, `HTMLElement`, etc. A Node.js backend doesn't have these available at runtime (without extra polyfills), so including `"DOM"` there would let code type-check against APIs that don't actually exist in that environment, producing false confidence and runtime `ReferenceError`s.

**Q: What's the practical difference between `moduleResolution: "node"` and `"bundler"`?**
A: `"node"` (a.k.a. `"node10"`) implements legacy Node.js CommonJS resolution and does not understand a package's `package.json` `"exports"` map — an increasingly common way modern packages declare their public entry points. `"bundler"` understands `"exports"` maps (matching how Webpack/Vite/esbuild actually resolve imports) but relaxes strict extension requirements that `"nodenext"` enforces. Using `"node"` resolution against a modern `"exports"`-only package often produces false `Cannot find module` errors even though the package works fine at runtime.

**Q: Why does `esModuleInterop` matter for importing CommonJS packages?**
A: CommonJS has no true "default export" concept — `module.exports = X` just assigns the whole exports object. Without `esModuleInterop`, TypeScript requires namespace-style imports (`import * as x from "pkg"`) for such packages; with it enabled, `import x from "pkg"` works correctly and matches what most bundlers already do at runtime, avoiding a mismatch between what TypeScript accepts and what actually works when bundled.

**Q: What's the risk of `skipLibCheck: true`, and why is it still the near-universal default?**
A: It skips type-checking of all `.d.ts` declaration files, including ones inside `node_modules`, so a genuine error in a third-party package's own type definitions won't be caught by your build. It's still the default almost everywhere because it meaningfully speeds up compilation and avoids false-positive failures from conflicting or overlapping `.d.ts` files between unrelated packages — a far more common annoyance in practice than actually-broken third-party type declarations.
