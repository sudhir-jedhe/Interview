# Streaming a File Response Instead of Loading It Fully into Memory

`fs.createReadStream(...).pipe(res)` streams the file straight to the socket, with Node handling backpressure automatically.

```js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'large-file.txt');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const stream = fs.createReadStream(filePath);
  stream.pipe(res); // backpressure-aware streaming straight to the socket
  stream.on('error', () => {
    res.writeHead(500);
    res.end('Error reading file');
  });
});

server.listen(3000);
```

Memory usage stays constant regardless of file size, since `pipe` only reads more of the file as the client's socket buffer has room — unlike `fs.readFile` followed by `res.end(data)`, which loads the entire file into memory before sending anything.
