# Minimal Raw HTTP Server

The smallest possible working Node HTTP server: create it, respond to every request the same way, and start listening.

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world');
});

server.listen(3000, () => console.log('listening on http://localhost:3000'));
```

Every request, regardless of method or path, gets the same `200 Hello world` response — there's no routing logic yet.
