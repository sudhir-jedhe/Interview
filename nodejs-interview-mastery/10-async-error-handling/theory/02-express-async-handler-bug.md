# The Classic Express Async Handler Bug

Express 4's built-in error handling only catches **synchronous** throws and errors passed via `next(err)`. If you `throw` inside an `async` route handler, Express has no idea — the rejection happens asynchronously, after Express has already returned control from the handler function.

```js
// BUG: this hangs the request forever if getUser throws/rejects
app.get('/users/:id', async (req, res) => {
  const user = await getUser(req.params.id); // throws if not found
  res.json(user);
});
```
The promise rejects, nothing is listening for it inside Express's routing layer (in Express 4), and the client never gets a response — the request just hangs until it times out client-side. This is a very common interview question because it's a very common production bug.

## Fix 1: try/catch and next(err)

```js
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (err) {
    next(err); // hands off to centralized error middleware
  }
});
```

## Fix 2: a wrapper (most common in real codebases)

```js
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id);
  res.json(user);
}));
```
Note: **Express 5** (currently in wide adoption) fixes this natively — async handler rejections are automatically forwarded to `next(err)`. But you'll be asked about this on Express 4 codebases (still the majority in production) for a while yet.

## try/catch with await vs .then().catch()

| Aspect | `try/catch` with `await` | `.then().catch()` |
|---|---|---|
| Readability | Sequential, mirrors synchronous control flow | Chained, can get deeply nested with conditional logic |
| Granularity | Easy to wrap just one `await` in its own try/catch for fine-grained handling | Requires splitting into multiple `.then` handlers for the same effect |
| Catching sync errors too | Yes — a `try/catch` around `await` also catches synchronous throws in the same block | `.catch()` only catches promise rejections, not synchronous throws elsewhere in the function |

Prefer `try/catch` with `await` for route handlers and business logic — it uniformly handles both sync and async errors in one construct. `.then/.catch` chains still show up for genuinely parallel work (`Promise.all(...).then(...)`) or in codebases that predate wide async/await adoption. The common mistake is wrapping an entire multi-step async function in one giant try/catch and losing the ability to distinguish *which* step failed — catch closer to the operation when you need to react differently to different failures.
