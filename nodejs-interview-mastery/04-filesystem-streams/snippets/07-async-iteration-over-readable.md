# Async Iteration Over a Readable Stream (Modern Alternative to 'data' Events)

```js
const fs = require('node:fs');

async function processFile(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 64 * 1024 });
  let totalBytes = 0;
  for await (const chunk of stream) {
    totalBytes += chunk.length; // for-await automatically respects backpressure
  }
  return totalBytes;
}
```

`for await...of` treats any Readable stream as an async iterable, pulling one chunk at a time and only requesting the next chunk once the current loop body's `await`-able work (if any) finishes — this means backpressure is respected implicitly, without any manual `.pause()`/`.resume()`/`'drain'` bookkeeping like the pattern in `05-manual-backpressure-handling.md`. `highWaterMark: 64 * 1024` here sets a 64KB internal buffer per chunk (the default), controlling how much is held in memory between iterations. See `../theory/02-why-streams-exist.md` and `../theory/04-backpressure.md` for the underlying mechanics.
