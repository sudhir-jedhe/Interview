# Output-Based: missing `helmet()` leaks the `X-Powered-By` header

```js
const helmet = require('helmet');
const express = require('express');
const app = express();
// helmet() NOT applied here
app.get('/', (req, res) => res.send('<h1>hi</h1>'));
app.listen(3000, () => {
  const http = require('http');
  http.get('http://localhost:3000', (res) => {
    console.log('X-Powered-By' in res.headers);
  });
});
```

**Answer:** `true`

**Why:** Express sets an `X-Powered-By: Express` header by default, which fingerprints your server stack to attackers (helping them target known Express-specific vulnerabilities). `helmet()` (specifically its `hidePoweredBy` middleware, on by default) removes this header — without it applied, the header leaks framework info on every response.
