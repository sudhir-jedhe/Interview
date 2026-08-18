# App Structure and the Middleware Concept

An Express app is fundamentally a pipeline of middleware functions the request passes through in the exact order they were registered. Every middleware has the signature `(req, res, next)` — it receives the request/response objects and a `next` function that hands control to the next middleware in the chain. A middleware must either call `next()` (to continue the chain) or send a response (`res.send`/`res.json`/`res.end`) — doing neither hangs the request forever, exactly like forgetting `res.end()` in raw `http`.

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // MUST call this or the request hangs
});

app.get('/', (req, res) => {
  res.send('Hello Express');
});

app.listen(3000);
```

Route handlers themselves (`app.get(path, handler)`) are just middleware scoped to a specific method+path — they receive the same `(req, res, next)` signature, and can call `next()` to fall through to further matching handlers if needed.

## app.use() vs app.get()/app.post() etc.

| Aspect | app.use(path, fn) | app.get(path, fn) |
|---|---|---|
| Method matching | Any HTTP method | Only the specified method (GET, POST, ...) |
| Path matching | Prefix match (matches `/api` and `/api/anything`) | Exact match against the route pattern |
| Typical use | Global/cross-cutting middleware, mounting routers | Specific resource endpoints |

Use `app.use()` for middleware meant to apply broadly (logging, auth, parsing) or to mount a router at a prefix; use `app.get`/`app.post`/etc. for terminal, method-specific route logic. The common mistake is using `app.use('/users', handler)` expecting it to behave like an exact-match GET route — it will also match POST/DELETE/etc. to `/users` and to `/users/anything`.
