# A Middleware That Never Calls next() Hangs the Chain

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log('middleware 1');
  next();
});

app.use((req, res, next) => {
  console.log('middleware 2');
});

app.get('/', (req, res) => {
  console.log('route handler');
  res.send('done');
});

app.listen(3000);
// Request: GET /
```

**Answer:** `middleware 1`, `middleware 2` — and that's it. The route handler never runs, and the client's request hangs forever.

**Why:** Middleware 2 never calls `next()` and never sends a response, so the chain stops dead. Every middleware must either call `next()` or terminate the response — omitting both is a hang bug, not a silent no-op.
