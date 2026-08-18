# Reading and Parsing a JSON Request Body Manually

Collects the raw body as it streams in, then parses it once the full body has arrived.

```js
const http = require('http');

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (err) { reject(err); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/echo') {
    try {
      const body = await readJsonBody(req);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  } else {
    res.writeHead(404).end();
  }
});

server.listen(3000);
```

Malformed JSON rejects the promise, which the route handler catches and turns into a `400` response rather than letting the exception crash the request.
