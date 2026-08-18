# Problem: Implement a File-Copy Utility Using Streams That Reports Copy Progress

## Problem statement

Implement `copyFileWithProgress(src, dest, onProgress)` that copies a file from `src` to `dest` using streams (no `fs.readFileSync`/`fs.writeFileSync`), calling `onProgress(percent)` as the copy proceeds, and resolving a Promise when the copy completes.

## Requirements

- Must not load the whole file into memory at once — use streams throughout.
- `onProgress(percent)` should be called with an integer 0-100 as bytes are copied, based on the total file size known upfront.
- Errors on either the read or write side must reject the returned Promise and clean up both streams (no dangling file descriptors).
- Works correctly for files too large to fit comfortably in memory.

## Solution

```js
const fs = require('node:fs');
const { pipeline } = require('node:stream/promises');
const { Transform } = require('node:stream');

async function copyFileWithProgress(src, dest, onProgress) {
  const { size: totalBytes } = await fs.promises.stat(src);
  let copiedBytes = 0;
  let lastReportedPercent = -1;

  const progressTracker = new Transform({
    transform(chunk, encoding, callback) {
      copiedBytes += chunk.length;
      const percent = totalBytes === 0 ? 100 : Math.floor((copiedBytes / totalBytes) * 100);
      if (percent !== lastReportedPercent) {
        lastReportedPercent = percent;
        onProgress(percent);
      }
      callback(null, chunk); // pass the chunk through unmodified
    },
  });

  await pipeline(
    fs.createReadStream(src),
    progressTracker,
    fs.createWriteStream(dest)
  );
}

// --- usage ---
copyFileWithProgress('./huge-video.mp4', './backup/huge-video.mp4', (pct) => {
  process.stdout.write(`\rcopying... ${pct}%`);
})
  .then(() => console.log('\ncopy complete'))
  .catch((err) => console.error('\ncopy failed:', err.message));
```

**Key design points:**

- **`fs.promises.stat` upfront** gets the total file size so progress can be reported as a true percentage rather than just raw bytes copied — this must happen before starting the pipeline since the Transform needs `totalBytes` to compute percentages as chunks flow through.
- **A pass-through `Transform`** is the cleanest way to observe bytes flowing through a `pipeline()` without altering them — the `callback(null, chunk)` at the end passes the exact same chunk downstream unchanged, only using the transform as an observation point (same pattern as `../scenarios/02-file-upload-progress-reporting.md`).
- **Deduplicating progress calls** (`lastReportedPercent`) avoids flooding `onProgress` with redundant `50%, 50%, 50%...` calls when many small chunks map to the same rounded percentage — useful when `onProgress` does something relatively expensive like a UI repaint or a network call.
- **`pipeline()` over raw `.pipe()`** guarantees that if either the read or write stream errors (permission denied, disk full, source deleted mid-copy), the whole chain is torn down and the returned Promise rejects with the real error — no dangling file descriptors left on either the read or write side. See `../theory/03-stream-types-and-pipeline.md` for why raw `.pipe()` chains don't give this guarantee.
