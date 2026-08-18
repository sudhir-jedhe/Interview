# Forgetting res.end() Hangs the Request

```js
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  console.log('handler ran');
});
server.listen(3000);
// A client makes a GET request to http://localhost:3000/
```

**Answer:** `handler ran` logs, but the client's request hangs forever (never receives a response).

**Why:** `res.end()` was never called. Setting headers with `writeHead` alone doesn't flush a response — the connection stays open until `end()` is called (or the client times out). This is one of the most common raw-HTTP bugs: forgetting `res.end()` on an early-return code path.
