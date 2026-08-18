# Output-Based: the CORS wildcard + credentials trap

```js
const cors = require('cors');
const options = { origin: '*', credentials: true };
console.log(JSON.stringify(options));
```

**Answer:** `{"origin":"*","credentials":true}` — but a real browser will refuse to expose the response to client JS when the server actually responds with `Access-Control-Allow-Origin: *` alongside `Access-Control-Allow-Credentials: true`.

**Why:** The `cors` middleware will happily construct these headers if configured this way, but the CORS *specification* forbids combining a wildcard origin with credentialed requests — browsers block it client-side. The real bug is that developers sometimes work around this by dynamically reflecting the request's `Origin` header back (`origin: true`), which technically satisfies the spec but defeats the entire purpose of an origin allowlist.
