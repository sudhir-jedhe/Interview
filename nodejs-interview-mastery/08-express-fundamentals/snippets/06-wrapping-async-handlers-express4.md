# Wrapping Async Route Handlers So Rejected Promises Reach Error Middleware (Express 4)

On Express 4, a rejected promise from an `async` handler is not automatically forwarded to error middleware — this small wrapper fixes that.

```js
const express = require('express');
const app = express();

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/data', asyncHandler(async (req, res) => {
  const data = await fetchDataThatMightReject();
  res.json(data);
}));

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(3000);

async function fetchDataThatMightReject() {
  throw new Error('DB unavailable');
}
```

`Promise.resolve(fn(...))` normalizes the return value (whether `fn` returns a promise or not) so `.catch(next)` reliably forwards any rejection into Express's error pipeline. See `problems/02-catch-async-wrapper.md` for a fuller writeup, including the exact hang/crash bug this wrapper prevents.
