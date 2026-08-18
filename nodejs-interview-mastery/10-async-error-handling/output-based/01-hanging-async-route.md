# Output-Based: The Classic Hanging Async Route

```js
const express = require('express');
const app = express();

app.get('/boom', async (req, res) => {
  throw new Error('kaboom');
});

app.use((err, req, res, next) => {
  console.log('error middleware hit');
  res.status(500).json({ error: err.message });
});

// (Express 4) client sends GET /boom, then waits...
```

**Answer:** Nothing is logged, and the client's request hangs until it times out (no response is ever sent). `"error middleware hit"` never prints.

**Why:** Throwing inside an `async` function produces a *rejected promise*, not a synchronous throw that Express 4's routing layer can catch. Express doesn't attach a `.catch` to the promise returned by your handler, so the rejection goes nowhere — it doesn't even trigger `unhandledRejection` immediately in a way you'd notice per-request, and the response is simply never sent. (Express 5 fixes this by default.)
