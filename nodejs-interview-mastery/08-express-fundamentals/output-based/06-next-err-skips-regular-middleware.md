# next(err) Skips All Remaining Regular Middleware

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  next(new Error('early failure'));
});

app.get('/', (req, res) => {
  console.log('never runs?');
  res.send('ok');
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(3000);
// Request: GET /
```

**Answer:** `never runs?` is never logged; the client receives `{"error":"early failure"}` with status 500.

**Why:** Calling `next(err)` with any argument makes Express skip all remaining regular (non-error) middleware and route handlers, jumping directly to the nearest error-handling middleware (identified by its 4-argument signature). The normal route handler is bypassed entirely.
