# Security Basics — `helmet.js` and Security Headers

## What `helmet()` actually does

`helmet` is not magic — it's a bundle of small middleware functions that each set one security-related HTTP response header, with sane defaults. Key ones: `Strict-Transport-Security` (forces HTTPS on future visits), `X-Content-Type-Options: nosniff` (stops browsers from MIME-sniffing responses into executing as something other than declared), `X-Frame-Options`/`frame-ancestors` (clickjacking protection by controlling framing), and a configurable `Content-Security-Policy` (restricts what scripts/styles/resources a page may load, mitigating XSS impact). It also removes the `X-Powered-By: Express` header by default (via its `hidePoweredBy` middleware), which otherwise fingerprints your server stack to attackers.

```js
const express = require('express');
const helmet = require('helmet');
const app = express();
app.use(helmet()); // apply sane header defaults; customize CSP per app
```

## What it doesn't do

`helmet()` alone doesn't prevent XSS or injection — CSP reduces the *impact* of certain attack classes (e.g., blocking inline script execution even if an XSS payload gets injected), but you still must escape/sanitize output and validate input at the source. It's not a firewall, and it's not a substitute for the actual fixes covered elsewhere in this topic (parameterized queries, output escaping, input validation).
