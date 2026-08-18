# Why Streams Exist

Reading an entire file into memory (see `01-fs-api-styles.md`) works fine for small files, but for a 4GB video file or a request body of unknown size, `fs.readFile` would try to allocate the whole thing in memory at once — risking out-of-memory crashes and adding latency (nothing happens until the *entire* file is read). Streams solve this by processing data in **chunks**, only holding a small buffered window in memory at any time, and letting downstream consumers start processing before the source has finished producing.

```js
const fs = require('node:fs');
// Loads the whole file into memory:
const buf = fs.readFileSync('huge-video.mp4'); // could be gigabytes, all at once

// Processes in ~64KB chunks by default, bounded memory:
const stream = fs.createReadStream('huge-video.mp4');
stream.on('data', (chunk) => { /* process chunk, e.g. write to HTTP response */ });
```

This is the same reasoning behind processing a 10GB CSV file line-by-line instead of loading it whole — see `../scenarios/01-processing-huge-csv-without-oom.md` for a full worked example.

## Consuming a stream: for-await vs 'data' events

```js
async function processFile(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 64 * 1024 });
  let totalBytes = 0;
  for await (const chunk of stream) {
    totalBytes += chunk.length; // for-await automatically respects backpressure
  }
  return totalBytes;
}
```

A raw `'data'` event listener fires as fast as the source can produce chunks, regardless of whether your handler has finished processing the previous one. `for await...of` pulls one chunk at a time, only requesting the next chunk once the current loop iteration's body completes, which naturally respects backpressure (see `04-backpressure.md`) without any manual pause/resume calls — generally the more ergonomic modern pattern when you're not composing into a larger pipe/pipeline chain.
