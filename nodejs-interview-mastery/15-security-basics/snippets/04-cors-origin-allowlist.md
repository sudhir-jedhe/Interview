# Snippet: CORS with an explicit origin allowlist

```js
const cors = require('cors');
const allowedOrigins = ['https://app.example.com', 'https://admin.example.com'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
```

**Explanation:** Instead of a wildcard or a blanket `origin: true` reflection, this checks the incoming request's `Origin` header against an explicit allowlist and only allows credentialed cross-origin requests from those origins. `!origin` allows non-browser requests (server-to-server calls, curl) that don't send an `Origin` header at all — a deliberate, common carve-out, not a bypass of the browser-enforced policy.
