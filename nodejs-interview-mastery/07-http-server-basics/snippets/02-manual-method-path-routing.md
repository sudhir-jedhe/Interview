# Manual Method + Path Routing with URL Parsing

A lookup table keyed by `"METHOD path"` is a simple, readable way to route without a framework.

```js
const http = require('http');
const { URL } = require('url');

const routes = {
  'GET /': (req, res) => res.end('home'),
  'GET /health': (req, res) => res.end('ok'),
};

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const key = `${req.method} ${pathname}`;
  const handler = routes[key];

  res.writeHead(handler ? 200 : 404, { 'Content-Type': 'text/plain' });
  if (handler) handler(req, res);
  else res.end('Not Found');
});

server.listen(3000);
```

This approach only handles exact path matches — no `:id`-style params. See `problems/03-basic-request-routing.md` for a router that also supports path parameters.
