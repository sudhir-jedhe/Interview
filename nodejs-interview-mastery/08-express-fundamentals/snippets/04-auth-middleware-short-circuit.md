# Custom Auth Middleware That Short-Circuits Without Calling next()

When a middleware decides the request should go no further, it sends a response directly instead of calling `next()`.

```js
const express = require('express');
const app = express();

function requireAuth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Missing token' }); // no next() — chain stops here
  }
  req.user = { id: 'user-1' }; // attach parsed identity for downstream handlers
  next();
}

app.get('/profile', requireAuth, (req, res) => {
  res.json({ userId: req.user.id });
});

app.listen(3000);
```

Passing `requireAuth` as a second argument to `app.get` registers it as route-specific middleware — it only runs for `GET /profile`, not for every route in the app.
