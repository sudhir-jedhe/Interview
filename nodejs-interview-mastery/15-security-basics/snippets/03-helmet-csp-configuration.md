# Snippet: Applying `helmet` with a custom Content-Security-Policy

```js
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'", 'trusted-cdn.com'] },
  })
);
```

**Explanation:** `helmet()` applies sane security-header defaults across the board (HSTS, `nosniff`, clickjacking protection, hiding `X-Powered-By`). The explicit `contentSecurityPolicy` call layers on a custom CSP restricting scripts to the app's own origin plus one trusted CDN — reducing the blast radius if an XSS payload ever does get injected, since the browser will refuse to execute a `<script>` from any other source.
