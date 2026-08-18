# Calling res.end() Twice

```js
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/a') {
    res.end('A');
    res.end('B'); // called twice
  }
});
server.listen(3000);
```

**Answer:** The client receives only `"A"`. The second `res.end('B')` triggers a warning/error (`ERR_STREAM_WRITE_AFTER_END`) logged server-side but does not send additional data.

**Why:** Once `res.end()` is called, the response stream is finished — the underlying socket write side is closed for that response. Calling `end()` (or `write()`) again on an already-ended response throws/errors rather than sending more data.
