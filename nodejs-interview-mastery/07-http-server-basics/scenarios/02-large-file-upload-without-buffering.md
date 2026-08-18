# Accepting Large File Uploads Without Buffering the Whole Body in Memory

**Scenario:** Your raw HTTP server needs to accept large file uploads (up to 500MB) via POST without crashing the process under memory pressure when several uploads happen concurrently. How do you avoid buffering the entire body in memory?

**Approach:** Stream the request body directly to disk with `fs.createWriteStream`, using `pipe` so Node's stream backpressure naturally throttles the TCP socket instead of buffering unbounded data in JS memory. Also enforce a hard size cap by tracking bytes and destroying the connection if exceeded.

```js
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

const MAX_BYTES = 500 * 1024 * 1024;

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/upload') {
    return res.writeHead(404).end();
  }

  const dest = `/tmp/upload-${crypto.randomUUID()}.bin`;
  const writeStream = fs.createWriteStream(dest);
  let received = 0;

  req.on('data', (chunk) => {
    received += chunk.length;
    if (received > MAX_BYTES) {
      req.destroy();          // abort the connection
      writeStream.destroy();  // stop writing, discard partial file
      fs.unlink(dest, () => {});
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Payload too large' }));
    }
  });

  req.pipe(writeStream);

  writeStream.on('finish', () => {
    if (!res.writableEnded) {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ path: dest, bytes: received }));
    }
  });

  writeStream.on('error', (err) => {
    if (!res.writableEnded) res.writeHead(500).end();
  });
});

server.listen(3000);
```

Piping (rather than collecting chunks in an array) keeps memory usage constant regardless of file size, since `pipe` respects backpressure between the socket and the disk write stream.
