# Interview Q&A: ESM Semantics

**Q: What is top-level await, and which module system supports it?**
Top-level await lets you use `await` directly at a module's top level, outside any `async function` — only ES Modules support this, not CommonJS. Node achieves it by treating the entire module's evaluation as implicitly async; any module that imports a module using top-level await will itself wait for that module to finish evaluating before proceeding.

```js
// only valid in .mjs / "type": "module"
const config = await loadConfigFromRemote();
```

**Q: Is ESM's import statement resolved statically or dynamically, and why does it matter?**
Statically — `import` declarations must appear at the top level of a module (not inside conditionals, loops, or functions) and are resolved and hoisted before any of the module's own code executes. This static structure is what allows tools to build an accurate dependency graph without executing code, enabling reliable tree-shaking and dead-code elimination in bundlers — something much harder to do soundly with CJS's fully dynamic `require()`, which can be called conditionally with computed paths.

**Q: Are ESM imports live bindings or copied values?**
Live bindings. If module A exports a mutable `let` binding and later reassigns it, every module that did `import { value } from './A.mjs'` sees the updated value automatically, because ESM imports are references to the exporting module's binding, not a snapshot. CommonJS has no equivalent — `require()` returns the actual object/value at call time, and if the exporter later reassigns its own local variable (not mutates an object property), the CJS consumer's earlier `require()` result won't reflect that reassignment.
