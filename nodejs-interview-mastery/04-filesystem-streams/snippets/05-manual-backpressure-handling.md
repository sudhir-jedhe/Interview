# Manually Handling Backpressure in a data-Event Loop

```js
const fs = require('node:fs');

function copyWithBackpressure(src, dest) {
  const readable = fs.createReadStream(src);
  const writable = fs.createWriteStream(dest);

  readable.on('data', (chunk) => {
    const ok = writable.write(chunk);
    if (!ok) {
      readable.pause();
      writable.once('drain', () => readable.resume());
    }
  });
  readable.on('end', () => writable.end());
}
```

This manually reimplements what `.pipe()`/`pipeline()` already do automatically (see `../theory/04-backpressure.md`) — included here to make the mechanism explicit rather than hidden. `writable.write(chunk)` returns `false` once its internal buffer exceeds `highWaterMark`; when that happens, the code pauses the readable source (`readable.pause()`) so it stops producing more chunks, and resumes it (`readable.resume()`) only once the writable emits `'drain'`, signaling its buffer has been flushed enough to accept more. Without this pause/resume pair, a fast source and a slow destination would let the writable's internal buffer grow without bound. In production code, prefer `pipeline()` over hand-rolling this — it's easy to get subtly wrong (e.g., forgetting to also propagate errors from both streams).
