# express.static() Short-Circuits a Later Dynamic Route

```js
const express = require('express');
const app = express();

app.use(express.static('public'));
app.get('/index.html', (req, res) => {
  console.log('handler reached');
  res.send('dynamic version');
});

app.listen(3000);
// public/index.html exists on disk, request: GET /index.html
```

**Answer:** `handler reached` never logs; the client receives the static file contents from disk, not "dynamic version".

**Why:** `express.static` is registered first and, upon matching a file on disk, sends the response and does not call `next()` — it short-circuits the chain entirely. Any route handler registered afterward for that same path is never reached. Registration order determines precedence.
