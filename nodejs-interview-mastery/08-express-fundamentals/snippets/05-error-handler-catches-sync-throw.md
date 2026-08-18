# Error-Handling Middleware Registered Last, Catching a Synchronous Throw

Express automatically catches synchronous throws inside a route handler and forwards them to error-handling middleware — no manual `try/catch` needed for this case.

```js
const express = require('express');
const app = express();

app.get('/risky', (req, res) => {
  throw new Error('Synchronous failure'); // Express 4/5 both catch sync throws automatically
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000);
```

This only works for synchronous throws. If the same `throw` happened inside a `setTimeout` callback or an unguarded `async` function (on Express 4), it would not be caught automatically — see `theory/04-error-handling-middleware.md` and `problems/02-catch-async-wrapper.md`.
