# A File Upload Handler Needs to Report Progress

Users uploading large files (video, archives) via an HTTP `multipart/form-data` endpoint want a progress bar, but the server only knows "upload complete" once the whole request body has been received and written to disk.

**Approach:** Track bytes received incrementally by listening to `'data'` events (or counting chunks in a custom `Transform`) as the request stream is piped to disk, and push progress updates to the client over a side channel (WebSocket, Server-Sent Events, or a polled `/upload-status/:id` endpoint) since the HTTP request itself has no way to talk back mid-upload:

```js
const fs = require('node:fs');
const { pipeline } = require('node:stream/promises');
const { Transform } = require('node:stream');

function createProgressTracker(totalBytes, onProgress) {
  let received = 0;
  return new Transform({
    transform(chunk, encoding, callback) {
      received += chunk.length;
      onProgress(Math.min(100, Math.round((received / totalBytes) * 100)));
      callback(null, chunk); // pass the chunk through unchanged
    },
  });
}

async function handleUpload(req, res, uploadId, contentLength) {
  const progress = createProgressTracker(contentLength, (pct) => {
    progressStore.set(uploadId, pct); // read by a polling /upload-status/:id route
  });
  await pipeline(req, progress, fs.createWriteStream(`/uploads/${uploadId}`));
  res.end('upload complete');
}
```

Using a `Transform` (rather than just an anonymous `'data'` listener) keeps the progress-tracking logic composable with the rest of the pipeline and ensures it participates correctly in backpressure — the pass-through transform doesn't buffer anything extra, it just observes chunk sizes as they flow through. See `../theory/03-stream-types-and-pipeline.md` for why `Transform` is the right stream type for a pass-through observer like this, and `../problems/01-file-copy-with-progress.md` for a similar progress-reporting pattern applied to a copy utility.
