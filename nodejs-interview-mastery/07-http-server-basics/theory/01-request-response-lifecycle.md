# createServer and the Request/Response Lifecycle

`http.createServer(handler)` returns a server that invokes `handler(req, res)` for every incoming request. `req` is an `http.IncomingMessage` and `res` is an `http.ServerResponse`. Crucially, **`req` is a readable stream** — the request body doesn't arrive pre-loaded as a property; you must consume it via `'data'`/`'end'` events or async iteration, exactly like reading a file stream.

```js
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.method, req.url); // e.g. "GET /users?active=true"
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello world');
});

server.listen(3000, () => console.log('listening on 3000'));
```

`req.headers` is available synchronously (headers arrive before the body), but the body itself streams in asynchronously as TCP packets arrive — this is why every raw Node HTTP body-reading example uses stream events rather than reading `req.body` directly (that property doesn't exist without a framework populating it).

## Response methods

- `res.writeHead(statusCode, headers)` — sets the status line and headers. Must be called before any body is written (headers can't be sent after the body starts flushing, unless you use `res.setHeader` beforehand and let Node send them implicitly on first `write`/`end`).
- `res.write(chunk)` — writes a chunk of the body; can be called multiple times to stream a response.
- `res.end([data])` — signals the response is complete, optionally writing final data. **Nothing is sent to the client until `end()` (or enough buffered `write` calls) flushes** — forgetting to call `end()` hangs the request forever.

```js
// Streaming a large response instead of buffering it all in memory
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  let i = 0;
  const interval = setInterval(() => {
    res.write(`chunk ${i++}\n`);
    if (i > 5) {
      clearInterval(interval);
      res.end();
    }
  }, 200);
});
```
