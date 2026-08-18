# Two Files require() the Same "config" Module and Mutate It, Causing Cross-Request Bugs

You have `config.cjs` exporting a plain object, and multiple route handlers mutate fields on it directly (e.g., `config.currentUser = req.user`) assuming each request gets a fresh copy.

**Approach:** `require()` caches modules by resolved path and returns the **same object reference** every time — it's a singleton, not a fresh copy per `require()` call. Mutating shared state on it from concurrent request handlers causes race-condition-like bugs (request A's data leaking into request B's response) since Node processes requests interleaved on the event loop. Fix by never storing per-request state on a shared module-level object — pass request-scoped data explicitly through function parameters or `AsyncLocalStorage` for implicit per-request context:

```js
const { AsyncLocalStorage } = require('node:async_hooks');
const requestContext = new AsyncLocalStorage();

app.use((req, res, next) => {
  requestContext.run({ user: req.user }, next);
});

function getCurrentUser() {
  return requestContext.getStore()?.user; // safe, request-scoped
}
```

Reserve genuinely shared singletons (DB connection pools, loggers) for things that *should* be process-wide, and make that intent explicit in naming/docs. See `../theory/02-module-caching-and-circular-requires.md` for why `require()` behaves this way.
