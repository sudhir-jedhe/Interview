# A Throw Inside setTimeout Is Never Caught by Express

```js
const express = require('express');
const app = express();

app.get('/risky', (req, res, next) => {
  setTimeout(() => {
    throw new Error('async throw inside setTimeout');
  }, 10);
  res.send('will this even matter?');
});

app.use((err, req, res, next) => {
  console.log('error handler:', err.message);
  res.status(500).end();
});

app.listen(3000);
```

**Answer:** The response `"will this even matter?"` is sent successfully. The error handler never logs — instead, the thrown error inside `setTimeout` becomes an uncaught exception that can crash the Node process.

**Why:** Express's automatic error catching only covers synchronous code within the request-handling call stack (and, in Express 5, rejected promises from async handlers). An error thrown inside a `setTimeout` callback happens on a completely separate, later tick — Express has no way to associate it with the original request/response cycle, so it's not routed to `next(err)` at all.
