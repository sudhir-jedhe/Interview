# express.json() Populating req.body, Plus Route + Query Params Together

Demonstrates all three sources of request data in a single handler: path params, query string, and JSON body.

```js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/users/:id/notes', (req, res) => {
  const { id } = req.params;             // from URL path
  const { verbose } = req.query;         // from query string
  const { text } = req.body;             // from JSON body
  res.status(201).json({ id, verbose: verbose === 'true', text });
});

app.listen(3000);
// POST /users/42/notes?verbose=true  body: { "text": "hi" }
```

`verbose === 'true'` is required because query params are always strings — Express never coerces `"true"` to the boolean `true` automatically.
