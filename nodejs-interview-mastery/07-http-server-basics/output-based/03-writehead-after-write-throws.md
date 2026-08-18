# Calling writeHead After write() Throws

```js
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.write('first ');
  res.writeHead(201); // attempt to change status after write
  res.end('second');
});
server.listen(3000);
```

**Answer:** Node throws `Error: Cannot set headers after they are sent to the client` (or similar `ERR_HTTP_HEADERS_SENT`), typically crashing the request or logging an error depending on how it's handled.

**Why:** Once `res.write()` is called after `writeHead()`, the headers are flushed to the socket immediately — you can no longer change the status code or headers afterward. Status/headers must be fully decided before the first byte of the body is sent.
