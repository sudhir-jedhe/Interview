# Fixing a Flagged allocUnsafe Pattern Without Losing Performance

**Scenario:** Your service computes SHA-256 hashes of uploaded files to detect duplicates, but you're allocating a fresh unsafe buffer per request for a temp read buffer and a security audit flagged it. How do you fix the flagged pattern while keeping performance?

**Approach:** The audit is right to flag raw `allocUnsafe` usage that isn't immediately and fully overwritten. Since the buffer here is a reusable scratch buffer for reading in a loop, either switch to `Buffer.alloc` (simplest, safe) or keep `allocUnsafe` but guarantee it's fully overwritten by the read before use:

```js
const fs = require('fs');
const crypto = require('crypto');

async function hashFile(path) {
  const hash = crypto.createHash('sha256');
  const fh = await fs.promises.open(path, 'r');
  const readBuf = Buffer.allocUnsafe(64 * 1024); // scratch buffer, reused each iteration

  try {
    let bytesRead;
    do {
      ({ bytesRead } = await fh.read(readBuf, 0, readBuf.length));
      if (bytesRead > 0) {
        // only hash the portion actually written by fs.read — never the whole buffer
        hash.update(readBuf.subarray(0, bytesRead));
      }
    } while (bytesRead > 0);
  } finally {
    await fh.close();
  }
  return hash.digest('hex');
}
```

The key fix: only ever read/transmit `readBuf.subarray(0, bytesRead)`, never the full allocated buffer — that guarantees no stale bytes beyond what `fs.read` actually wrote are ever used.
