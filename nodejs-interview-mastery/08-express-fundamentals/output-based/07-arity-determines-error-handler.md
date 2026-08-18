# Function Arity, Not Naming, Determines Error-Handler Status

```js
const express = require('express');
const app = express();

function mw(err, req, res, next) { // note: named to look like an error handler
  console.log('is this an error handler?');
  next();
}

app.use(mw);
app.get('/', (req, res) => res.send('ok'));
app.listen(3000);
// Request: GET /
```

**Answer:** `mw` never runs at all for a normal request; `GET /` responds with `"ok"` directly.

**Why:** Express determines whether a middleware is an "error handler" purely by counting its declared parameters (`fn.length === 4`), regardless of naming or intent. Since no error was ever passed via `next(err)`, this 4-arg function is registered as error-only middleware and is simply skipped during normal (non-error) request processing.
