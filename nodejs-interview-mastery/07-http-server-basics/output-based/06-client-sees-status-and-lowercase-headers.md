# Client Sees the Server's Status Code and Lowercased Header Names

```js
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
});
server.listen(3000, () => {
  http.get('http://localhost:3000', (res) => {
    console.log(res.statusCode);
    console.log(res.headers['content-type']);
  });
});
```

**Answer:** `200`, then `application/json`.

**Why:** The client's `http.get` callback receives the response object with `statusCode` reflecting what the server sent via `writeHead`, and `headers` reflecting exactly the headers set — `content-type` keys are always normalized to lowercase in Node's `IncomingMessage.headers`.
