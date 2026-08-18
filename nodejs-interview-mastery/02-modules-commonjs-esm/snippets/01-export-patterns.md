# CommonJS Export Patterns: module.exports vs exports Mutation

Shows the safe way to add exports incrementally by mutating the shared `module.exports`/`exports` object, and the unsafe pattern that silently breaks.

```js
// file: greet.cjs
module.exports.hello = (name) => `Hello, ${name}!`;
exports.bye = (name) => `Bye, ${name}!`; // safe: mutating the same shared object
// exports = { oops: true } would NOT be visible to require() callers
```

Both `module.exports.hello = ...` and `exports.bye = ...` mutate the exact same underlying object, so a caller doing `require('./greet.cjs')` sees both `hello` and `bye`. If a third line reassigned `exports = { oops: true }`, that would rebind only the local `exports` variable inside this module's wrapper function — `module.exports` (what `require()` actually returns) would be completely unaffected. See `../theory/01-commonjs-require-and-wrapper.md` for why this happens.
