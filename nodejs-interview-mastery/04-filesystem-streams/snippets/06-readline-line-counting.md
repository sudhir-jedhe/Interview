# Reading a Large JSON-Lines File Line by Line with readline + a Stream

```js
const fs = require('node:fs');
const readline = require('node:readline');

async function countLines(filePath) {
  const rl = readline.createInterface({ input: fs.createReadStream(filePath) });
  let count = 0;
  for await (const _line of rl) count++;
  return count;
}
```

`readline.createInterface` wraps a Readable stream (here, a file read stream) and splits its incoming chunks on newlines, exposing an async-iterable interface over complete lines rather than raw byte chunks — so you never have to manually handle a line that gets split across two underlying stream chunks. Because the source is a stream, not a whole-file read, this counts lines in a multi-gigabyte file using only a small bounded buffer, regardless of file size. See `../problems/03-line-by-line-file-reader.md` for a fuller line-reading utility, and `../scenarios/01-processing-huge-csv-without-oom.md` for this pattern applied to CSV transformation.
