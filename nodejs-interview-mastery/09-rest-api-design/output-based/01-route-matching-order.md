# Output-Based: Route Matching Order

```js
const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => res.json({ handler: 'byId', id: req.params.id }));
app.get('/users/me', (req, res) => res.json({ handler: 'me' }));

// client requests GET /users/me
```

**Answer:** `{ "handler": "byId", "id": "me" }`

**Why:** Express matches routes in registration order, top to bottom. `/users/:id` is registered first and `:id` matches any segment including the literal string `"me"`, so it wins the match before Express ever reaches the `/users/me` route. The fix is to register the more specific literal route (`/users/me`) *before* the parameterized one.
