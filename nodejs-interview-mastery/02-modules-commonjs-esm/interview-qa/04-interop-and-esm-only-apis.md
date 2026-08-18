# Interview Q&A: Interop & ESM-Only Node APIs

**Q: Why can't you require() an ES Module?**
`require()` is synchronous by design — it returns a value immediately. Loading an ES module is inherently asynchronous in the spec because Node must fetch, parse, and link the module's entire dependency graph (which can include network-fetched or top-level-await-blocked modules) before it can be evaluated. There's no synchronous way to unwrap that process, so Node throws `ERR_REQUIRE_ESM` rather than offering broken partial support. The fix is a dynamic `import()`, which is Promise-based.

**Q: How do you import a CommonJS module from an ES Module?**
Directly, via a default import — Node's interop layer exposes the CJS module's entire `module.exports` object as the ESM default export: `import pkg from './legacy.cjs'`. Named imports (`import { thing } from './legacy.cjs'`) can also work if Node's static analysis (cjs-module-lexer) can detect simple, statically-shaped exports, but this isn't guaranteed for dynamically constructed exports objects, so default import is the more reliable pattern.

**Q: How do you get __dirname and __filename equivalents in an ES Module?**
They aren't injected into ESM files the way they are in the CJS wrapper. Use `import.meta.url` (the module's own URL) combined with Node's `url` and `path` modules:

```js
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```
