# Minimal Express App with a Custom Logging Middleware

The smallest useful Express app: a logging middleware registered with `app.use`, plus one route.

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => res.send('Hello Express'));
app.listen(3000);
```

Every request, regardless of path, passes through the logging middleware first (since it's registered with no path, matching everything), then falls through to whichever route matches.
