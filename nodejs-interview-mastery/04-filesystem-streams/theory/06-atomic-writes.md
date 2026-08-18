# Atomic File Writes

A subtle but important filesystem pattern: writing directly to a target file (via `fs.writeFile` or a write stream opened straight at the destination path) risks leaving a truncated, corrupted file if the process is killed mid-write — readers checking the file at that moment see a partial, unparseable result.

The standard fix, independent of Node specifically, is **write-to-temp-then-rename**: write the new content to a temporary file in the *same directory* (same filesystem/mount), then use `fs.rename`/`fs.promises.rename` to atomically swap it into place. A rename within the same filesystem is a single atomic operation at the OS level — any concurrent reader either sees the fully-old file or the fully-new file, never a partial write.

```js
const fs = require('node:fs/promises');
const path = require('node:path');

async function writeConfigAtomically(targetPath, data) {
  const tmpPath = path.join(path.dirname(targetPath), `.${path.basename(targetPath)}.tmp-${process.pid}`);
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2));
  await fs.rename(tmpPath, targetPath); // atomic on the same filesystem
}
```

The key requirement is that the temp file lives on the *same filesystem/mount* as the target — cross-filesystem renames aren't atomic and silently fall back to copy+delete, reintroducing the exact torn-write window this pattern exists to eliminate. See `../scenarios/04-atomic-config-writes.md` for the full incident this fixes.
