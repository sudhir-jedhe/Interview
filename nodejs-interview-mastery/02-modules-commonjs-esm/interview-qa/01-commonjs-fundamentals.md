# Interview Q&A: CommonJS Fundamentals

**Q: What's the difference between `module.exports` and `exports` in CommonJS?**
Both start out pointing to the same object — `exports` is just a local variable reference to `module.exports`, provided as a convenience. Mutating properties on either (`exports.foo = 1` or `module.exports.foo = 1`) works identically. But reassigning `exports = {...}` only rebinds the local variable, breaking its link to `module.exports` — the caller of `require()` always receives whatever `module.exports` points to, so that reassignment is invisible to them.

**Q: What is the CommonJS module wrapper function?**
Before executing a CJS file, Node wraps its contents in `function(exports, require, module, __filename, __dirname) { ... }` and calls it with the appropriate arguments. This is why those five identifiers appear available in every module without explicit declaration — they're injected function parameters, scoped per file, not true globals.

**Q: How does require() caching work, and what's a practical consequence of it?**
Node caches loaded modules in `require.cache`, keyed by the fully resolved absolute file path. Every subsequent `require()` of that same resolved path returns the cached `module.exports` without re-running the file. Practical consequence: modules are singletons within a process — exported objects are shared references across every file that requires them, so mutations are visible everywhere, and module-level state (like a DB connection) persists across the app's lifetime.

**Q: What happens with circular require() calls in CommonJS?**
Node detects the cycle and, rather than looping infinitely, returns whatever partial `module.exports` the in-progress module has built up so far at the point the circular `require()` is hit. This means properties assigned after that point in the originating module won't be visible to the module that circularly required it back — a common source of `undefined` values that "should" have been defined, fixed by restructuring to avoid the cycle or deferring property access until after both modules finish loading.
