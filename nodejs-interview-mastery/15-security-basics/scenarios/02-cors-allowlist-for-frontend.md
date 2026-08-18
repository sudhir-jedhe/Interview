# Scenario: Your Express API needs to accept requests from your React frontend on a different domain, but not from anywhere else

You're building an API at `api.example.com` consumed by a frontend at `app.example.com`, using cookie-based sessions. A security review flags that CORS is currently wide open.

**Approach:** Replace a wildcard/reflected origin with an explicit allowlist, and only enable credentials for that allowlisted origin:

```js
const cors = require('cors');

const allowedOrigins = ['https://app.example.com'];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow no-origin requests (server-to-server, curl) but restrict browser origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
```

Also confirm the session cookie itself has `sameSite: 'lax'` (or `'none'` with `secure: true` if the frontend and API are genuinely cross-site) so the cookie is included appropriately without opening a CSRF hole.
