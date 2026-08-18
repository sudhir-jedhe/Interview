# Graceful 500 Handling for Synchronous Handler Errors

Wrapping handler logic in try/catch is the raw-`http` equivalent of a framework's automatic error-handling middleware.

```js
const http = require('http');

const server = http.createServer((req, res) => {
  try {
    if (req.url === '/boom') {
      throw new Error('Something broke');
    }
    res.writeHead(200).end('fine');
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

server.listen(3000);
```

Without the try/catch, a synchronous throw inside the handler would propagate up and could crash the process (raw `http.createServer` has no built-in per-request error boundary the way Express does).
