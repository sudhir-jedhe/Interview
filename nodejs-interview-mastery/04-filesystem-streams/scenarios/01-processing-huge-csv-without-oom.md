# You Need to Process a 10GB CSV File Without Running Out of Memory

A nightly batch job needs to read a 10GB CSV, transform each row (currency conversion on a column), and write the result to a new file. `fs.readFileSync` on the input file crashes the process with `ERR_FS_FILE_TOO_LARGE` / out-of-memory.

**Approach:** Never load the whole file into memory — stream it. Use `fs.createReadStream` piped through `readline` (or a proper CSV Transform stream for quoted-field correctness) to process the file line by line, transforming and writing each row as it's read, so peak memory stays bounded to a small buffered window regardless of file size:

```js
const fs = require('node:fs');
const readline = require('node:readline');

async function convertCsv(inputPath, outputPath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputPath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });
  const out = fs.createWriteStream(outputPath);

  for await (const line of rl) {
    const [name, amountUsd] = line.split(',');
    const amountEur = (Number(amountUsd) * 0.92).toFixed(2);
    // write() returning false signals backpressure -- wait for 'drain' before continuing
    if (!out.write(`${name},${amountEur}\n`)) {
      await new Promise((resolve) => out.once('drain', resolve));
    }
  }
  out.end();
}
```

For a real production pipeline, prefer a proper streaming CSV parser (e.g. `csv-parse`) as a `Transform` stream composed with `pipeline()` instead of hand-rolled `readline` splitting, since naive `split(',')` breaks on quoted fields containing commas. The core lesson is the same either way: bounded memory comes from processing chunks/lines as they arrive, never from buffering the entire file. See `../theory/02-why-streams-exist.md` and `../theory/04-backpressure.md` for why the `'drain'` wait is necessary here.
