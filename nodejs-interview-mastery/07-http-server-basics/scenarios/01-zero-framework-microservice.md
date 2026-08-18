# Structuring a Zero-Dependency Health/JSON Microservice

**Scenario:** You're building an internal microservice with zero framework dependencies (just `http`) that needs to serve a health check, a JSON API endpoint, and reject unsupported methods with the right status codes. How do you structure it?

**Approach:** Build a small router table keyed by method+path, with a fallback for 404 and explicit 405 handling for known paths hit with the wrong method.

```js
const http = require('http');
const { URL } = require('url');

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === '/health') {
    if (req.method !== 'GET') return res.writeHead(405, { Allow: 'GET' }).end();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }

  if (pathname === '/echo') {
    if (req.method !== 'POST') return res.writeHead(405, { Allow: 'POST' }).end();
    try {
      const body = await readJson(req);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(body));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(3000);
```

Setting the `Allow` header on 405 responses is a spec-compliant nicety that helps API consumers self-diagnose.
