# Streaming a Large File to an HTTP Response Without Loading It All Into Memory

```js
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream/promises');

http.createServer(async (req, res) => {
  try {
    await pipeline(fs.createReadStream('./large-file.bin'), res);
  } catch (err) {
    res.destroy(err);
  }
}).listen(3000);
```

Rather than reading the whole file into a Buffer with `fs.readFile` and then calling `res.end(buffer)` (which would hold the entire file in memory and delay the first byte sent to the client until the read finishes), this pipes the file directly to the HTTP response as chunks arrive from disk. `pipeline()` (see `../theory/03-stream-types-and-pipeline.md`) ensures that if the client disconnects mid-transfer (which manifests as an error on the response stream) the read stream is automatically destroyed too, rather than continuing to read a file nobody is receiving anymore.
