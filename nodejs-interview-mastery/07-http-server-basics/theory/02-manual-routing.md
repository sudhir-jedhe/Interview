# Manual Routing

Without a framework, you route by hand-parsing `req.method` and `req.url`. The built-in `url` module (or the global `URL` class) helps parse query strings and pathnames cleanly:

```js
const { URL } = require('url');

function handler(req, res) {
  const parsed = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = parsed;

  if (req.method === 'GET' && pathname === '/users') {
    const active = searchParams.get('active'); // "true" or null
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ active }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}
```

This is exactly the mental model frameworks like Express automate: matching method + path patterns to handler functions, extracting params, and short-circuiting once a match is found. See `problems/03-basic-request-routing.md` for a from-scratch router that also supports path params like `/users/:id`.
