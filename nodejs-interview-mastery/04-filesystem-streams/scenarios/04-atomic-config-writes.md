# Your Service Needs to Write a Config File Atomically So a Crash Mid-Write Never Leaves a Corrupted File

A background process periodically rewrites a JSON config file that other processes read. If the process is killed (OOM, deploy restart) mid-write, readers can observe a truncated, unparseable JSON file.

**Approach:** Never write directly to the target path. Write to a temporary file in the same directory (same filesystem, so the subsequent rename is atomic), then use `fs.rename`/`fs.promises.rename` to atomically swap it into place — a rename on the same filesystem is a single atomic filesystem operation, so any concurrent reader either sees the fully-old file or the fully-new file, never a partial write:

```js
const fs = require('node:fs/promises');
const path = require('node:path');

async function writeConfigAtomically(targetPath, data) {
  const tmpPath = path.join(path.dirname(targetPath), `.${path.basename(targetPath)}.tmp-${process.pid}`);
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2));
  await fs.rename(tmpPath, targetPath); // atomic on the same filesystem
}
```

This pattern (write-to-temp, then rename) is the standard fix for "torn write" bugs across any language, not Node-specific — the key requirement is that the temp file lives on the *same filesystem/mount* as the target, since cross-filesystem renames aren't atomic and silently fall back to copy+delete. See `../theory/06-atomic-writes.md` for the full explanation.
