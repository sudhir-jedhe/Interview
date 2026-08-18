# Handling Multiple Content Types Based on the Accept Header

A minimal example of content negotiation: inspect the `Accept` header and respond with JSON or plain text accordingly.

```js
const http = require('http');

const server = http.createServer((req, res) => {
  const accept = req.headers['accept'] || '';
  const payload = { message: 'hello' };

  if (accept.includes('application/json')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(payload));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(payload.message);
  }
});

server.listen(3000);
```

Real content negotiation (as implemented by libraries like `accepts`) also handles quality values (`q=`) and multiple acceptable types in priority order — this snippet is the simplified single-check version.
