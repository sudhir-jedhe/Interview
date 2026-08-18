# 204 No Content Must Not Have a Body

```js
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(204, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'this should not appear' }));
});
server.listen(3000, () => {
  http.get('http://localhost:3000', (res) => {
    let data = '';
    res.on('data', (c) => (data += c));
    res.on('end', () => console.log(JSON.stringify(data)));
  });
});
```

**Answer:** Behavior is spec-ambiguous/inconsistent across HTTP clients, but per the HTTP spec, a `204 No Content` response **must not** include a body — well-behaved clients will report an empty body (`""`) even though the server technically wrote bytes.

**Why:** 204 explicitly forbids a message body by the HTTP specification. Node's raw `http` module doesn't enforce this on the server (it will happily write the bytes you give it), but this is a bug — the correct fix is calling `res.writeHead(204).end()` with no body at all when returning this status.
