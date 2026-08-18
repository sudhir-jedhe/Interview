# Built-in vs Third-Party vs Custom Middleware

- **Built-in**: ships with Express itself. `express.json()` parses JSON bodies into `req.body`; `express.urlencoded()` parses form bodies; `express.static(dir)` serves static files from a directory.
- **Third-party**: separate npm packages that plug into the same `(req, res, next)` contract. `cors` handles CORS headers; `helmet` sets security-related HTTP headers; `morgan` logs requests.
- **Custom**: middleware you write yourself for app-specific concerns — auth checks, request ID tagging, custom logging.

```js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());               // third-party: security headers
app.use(cors());                 // third-party: CORS
app.use(express.json());         // built-in: parses JSON body -> req.body
app.use(express.static('public')); // built-in: serves files from ./public

app.use((req, res, next) => {    // custom: request timing
  req.startTime = Date.now();
  next();
});
```

Order matters here too: `express.json()` must run before any route handler that reads `req.body`, and `express.static` short-circuits (sends the file and doesn't call `next()`) for matching paths, so route handlers registered after it for the same path never run for those requests.

## At a glance

| Aspect | Built-in (express.json, express.static) | Third-party (cors, helmet, morgan) | Custom |
|---|---|---|---|
| Source | Ships inside the express package | Separate npm dependency | Written by your team |
| Maintenance burden | None (Express core team) | Low, but you track upstream updates | Full ownership |
| Typical use | Body parsing, static file serving | Cross-cutting concerns (security, CORS, logging) | App-specific logic (auth, request ID, tenant resolution) |

Reach for built-in middleware first since it's zero-dependency and well-tested; use third-party for well-solved cross-cutting problems (don't hand-roll CORS or security headers); write custom middleware only for logic specific to your domain. The common mistake is reinventing something like CORS handling by hand instead of using `cors`, missing edge cases (preflight OPTIONS requests) the library already handles.
