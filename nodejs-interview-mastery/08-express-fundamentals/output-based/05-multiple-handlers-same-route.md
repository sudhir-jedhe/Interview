# Multiple Handlers for the Same Route, Chained via next()

```js
const express = require('express');
const app = express();

app.get('/a', (req, res, next) => {
  console.log('handler A');
  next();
});

app.get('/a', (req, res) => {
  console.log('handler B');
  res.send('from B');
});

app.listen(3000);
// Request: GET /a
```

**Answer:** `handler A`, then `handler B`, and the client receives `"from B"`.

**Why:** Multiple `app.get()` calls for the same path register multiple handlers in sequence. Since the first handler calls `next()` instead of sending a response, Express continues to the next matching route handler in registration order — this is how you can chain multiple handlers for one route (also achievable by passing an array of handlers to a single `app.get` call).
