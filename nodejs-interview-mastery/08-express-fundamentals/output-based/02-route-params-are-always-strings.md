# Route Params Are Always Strings

```js
const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  console.log(typeof req.params.id);
  res.send(req.params.id);
});

app.listen(3000);
// Request: GET /users/42
```

**Answer:** `string`.

**Why:** Express route params are always extracted from the URL path as strings, never automatically coerced to numbers, booleans, etc. `req.params.id` is `"42"`, not `42` — comparing it with `===` against a number requires explicit conversion (`Number(req.params.id)`).
