# Diagnosing Subtly Corrupted Uploaded Images

**Scenario:** You're building a file upload service that streams uploaded files to disk. Users report that occasionally an uploaded image is subtly corrupted at certain byte offsets. What's going wrong and how do you fix it?

**Approach:** The most likely culprit is that somewhere in the pipeline, buffer chunks are being decoded to/from strings (e.g., accidentally calling `.toString()` on binary chunks before writing them, or concatenating with `+` instead of `Buffer.concat`). String concatenation on non-UTF8-safe binary data corrupts bytes that don't form valid UTF-16 sequences. The fix is to keep the data in Buffer form the entire way through the pipeline:

```js
const fs = require('fs');

function handleUpload(req, res) {
  const writeStream = fs.createWriteStream('/uploads/output.bin');
  req.pipe(writeStream); // stays as raw Buffer chunks, no string conversion
  writeStream.on('finish', () => res.end('uploaded'));
  writeStream.on('error', (err) => res.destroy(err));
}
```

If you must inspect or transform the data manually, collect chunks as Buffers and use `Buffer.concat`, never string `+=`.
