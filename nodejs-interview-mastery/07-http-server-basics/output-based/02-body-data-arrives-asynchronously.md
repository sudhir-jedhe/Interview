# Request Body Data Arrives Asynchronously

```js
const http = require('http');
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  console.log('body so far:', JSON.stringify(body));
  res.end('done');
});
server.listen(3000);
// Client sends POST with body "hello"
```

**Answer:** `body so far: ""` (empty string) — logged before any data actually arrives.

**Why:** `req` is a stream; `'data'` events fire asynchronously as TCP packets arrive, but `console.log` right after registering the listener runs synchronously, immediately — before the event loop has delivered any data events. The body is only fully available inside the `'end'` handler, not synchronously after attaching listeners.
