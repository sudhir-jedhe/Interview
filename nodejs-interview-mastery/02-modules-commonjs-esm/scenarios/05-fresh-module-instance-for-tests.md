# Your Test Suite Needs a Fresh Module Instance Between Test Cases

A module keeps internal singleton state (e.g., a rate limiter with an internal counter), and your tests need every test case to start from a clean slate without restarting the whole test process.

**Approach:** Delete the module's entry from `require.cache` before re-requiring it, using `require.resolve()` to get the exact cache key:

```js
function freshRequire(modulePath) {
  const resolved = require.resolve(modulePath);
  delete require.cache[resolved];
  return require(modulePath);
}

// in each test
const rateLimiter = freshRequire('../src/rateLimiter.cjs');
```

Note this only clears the direct module's cache entry, not its transitive dependencies — if those also hold state you need reset, delete their cache entries too, or restructure the module to export a factory function (`createRateLimiter()`) instead of a stateful singleton, which is the cleaner long-term fix and avoids cache-hacking in tests entirely. In ESM, there's no equivalent `require.cache` mechanism — the standard workaround is a cache-busting query string on the dynamic import (`import(url + '?t=' + Date.now())`), which is less clean, reinforcing that factory-function exports are the more portable pattern. See `../theory/02-module-caching-and-circular-requires.md` for how the cache works.
