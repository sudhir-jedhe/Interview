# Problem: Implement a Naive `cat` CLI (Concatenate Multiple Files to stdout) Using Streams

## Problem statement

Implement a small CLI script, `mycat.js`, that takes one or more file paths as command-line arguments and writes their contents to `stdout`, concatenated in argument order — using streams throughout, not `fs.readFileSync`.

## Requirements

- `node mycat.js a.txt b.txt c.txt` should print the concatenated contents of all three files, in order, to stdout.
- Files must be streamed, not fully buffered in memory — must work correctly for files larger than available RAM.
- Files must be output strictly in the order given, with no interleaving, even though reading itself may be asynchronous.
- A missing/unreadable file should print a clear error to stderr and exit with a non-zero code, without corrupting output already written for earlier files.

## Solution

```js
#!/usr/bin/env node
// mycat.js
const fs = require('node:fs');
const { pipeline } = require('node:stream/promises');

async function catFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      // Sequential, one file fully piped to stdout before starting the next --
      // this is what guarantees strict order with no interleaving, since each
      // pipeline() call awaits full completion before the loop continues.
      // { end: false } is critical: it stops pipeline() from closing stdout
      // after this one file, since stdout must stay open for subsequent files.
      await pipeline(fs.createReadStream(filePath), process.stdout, { end: false });
    } catch (err) {
      process.stderr.write(`mycat: ${filePath}: ${err.code === 'ENOENT' ? 'No such file or directory' : err.message}\n`);
      process.exitCode = 1;
      return; // stop at the first failing file, like real `cat` does on a read error
    }
  }
}

const filePaths = process.argv.slice(2);
if (filePaths.length === 0) {
  process.stderr.write('usage: mycat.js <file...>\n');
  process.exit(1);
}

catFiles(filePaths);
```

**Key design points:**

- **Sequential `await`ed pipelines, not concurrent ones:** each file's `pipeline()` call is awaited before the loop moves to the next file. If instead all files were piped concurrently (e.g., via `Promise.all`), their chunks writing to the shared `stdout` stream would interleave unpredictably — exactly the ordering bug this requirement guards against. Streaming and ordering are separate concerns here: each individual file streams (bounded memory), but files as a whole are processed strictly in sequence.
- **`{ end: false }` on the pipeline options** is essential: by default, `pipeline()` (like `.pipe()`) calls `.end()` on the destination once the source finishes, which would close `stdout` after the *first* file — making every subsequent file's write fail silently or throw `ERR_STREAM_WRITE_AFTER_END`. Passing `{ end: false }` tells `pipeline()` to leave `stdout` open for reuse across the loop's remaining iterations.
- **Partial output on error is intentional and matches real `cat` behavior:** if `b.txt` doesn't exist, `a.txt`'s content (already fully written to stdout) stays visible — the function doesn't try to "undo" prior output, it simply reports the error for the failing file and stops processing further files, setting a non-zero exit code so shell scripts piping this command can detect the failure.
- **No `fs.readFileSync` anywhere:** every file is streamed via `fs.createReadStream`, so a multi-gigabyte log file passed as one of the arguments doesn't need to fit in memory — the same core lesson as `../theory/02-why-streams-exist.md`, applied to a CLI tool instead of a server.
