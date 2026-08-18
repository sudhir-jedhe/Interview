# Problem: Implement a Simple Line-by-Line File Reader Using readline + Streams

## Problem statement

Implement `readLines(filePath, onLine)` that reads a file line by line using `readline` over a `fs.createReadStream`, calling `onLine(line, lineNumber)` for each line, and returning a Promise that resolves with the total line count once done. Also provide an async-generator variant, `linesOf(filePath)`, that lets callers `for await` over lines directly.

## Requirements

- Must stream the file rather than reading it whole (works for files larger than available memory).
- Line numbers must be 1-indexed.
- Handle files with or without a trailing newline correctly (no off-by-one on the last line).
- The async-generator variant must be usable with `for await...of` and support early `break` (closing the underlying stream when the consumer stops iterating early).

## Solution

```js
const fs = require('node:fs');
const readline = require('node:readline');

// --- callback-style variant ---
function readLines(filePath, onLine) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: 'utf8' }),
      crlfDelay: Infinity, // treat \r\n as a single line break, not two
    });

    let lineNumber = 0;

    rl.on('line', (line) => {
      lineNumber++;
      onLine(line, lineNumber);
    });

    rl.on('close', () => resolve(lineNumber));
    rl.on('error', reject);
  });
}

// --- async-generator variant ---
async function* linesOf(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let lineNumber = 0;
  try {
    for await (const line of rl) {
      lineNumber++;
      yield { line, lineNumber };
    }
  } finally {
    // Ensures the underlying file descriptor is released even if the consumer
    // `break`s out of a `for await` loop early -- readline.close() stops
    // reading, and closing the generator (via `finally`) propagates that.
    rl.close();
    stream.destroy();
  }
}

module.exports = { readLines, linesOf };

// --- usage: callback style ---
readLines('./access.log', (line, num) => {
  if (line.includes('ERROR')) console.log(`line ${num}: ${line}`);
}).then((total) => console.log(`read ${total} lines total`));

// --- usage: async-generator style, with early exit ---
async function findFirstError(filePath) {
  for await (const { line, lineNumber } of linesOf(filePath)) {
    if (line.includes('ERROR')) {
      return { line, lineNumber }; // early return -- triggers the generator's `finally` cleanup
    }
  }
  return null;
}
```

**Key design points:**

- **`crlfDelay: Infinity`** tells `readline` to always treat `\r\n` as a single line-ending, regardless of how much time passes between receiving the `\r` and `\n` bytes (they can arrive in separate stream chunks) — without this, Windows-style line endings can occasionally be misdetected as two separate line breaks.
- **`readline`'s `'line'` event / async-iteration already correctly handles the trailing-newline edge case**: whether or not the file ends with a final `\n`, every actual line of content produces exactly one `'line'` event / yielded value, with no empty trailing "line" for a final newline and no dropped last line when there isn't one.
- **The `finally` block in `linesOf`** is what makes early termination via `break` safe — when a `for await...of` loop consuming an async generator exits early (via `break`, `return`, or an uncaught exception in the loop body), the generator's `return()` method is called, which resumes execution at the point it's suspended (inside the inner `for await`) as if a `return` statement ran there, triggering the `finally` block and closing both `readline` and the underlying file stream — otherwise the file descriptor would stay open until GC, which is unpredictable timing to rely on.
- Both variants stream the file (never call `fs.readFileSync` or buffer the whole content), so they scale to arbitrarily large files with bounded memory use — the same principle from `../theory/02-why-streams-exist.md`.
