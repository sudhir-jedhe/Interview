# Problem: Implement a Custom Transform Stream That Uppercases Text Passing Through It

## Problem statement

Implement an `UppercaseTransform` stream class that converts any text passing through it to uppercase, correctly handling multi-byte UTF-8 characters that might be split across chunk boundaries, and usable both as a standalone CLI filter (`stdin` → uppercase → `stdout`) and composed into a larger `pipeline()`.

## Requirements

- Extend Node's `Transform` class properly (override `_transform`, and `_flush` if needed).
- Must not corrupt multi-byte UTF-8 characters that happen to be split across two incoming chunks.
- Must work correctly when composed with `pipeline()`, including proper error propagation.
- Provide a runnable CLI example: `cat file.txt | node uppercase-cli.js`.

## Solution

```js
const { Transform } = require('node:stream');

class UppercaseTransform extends Transform {
  constructor(options) {
    super(options);
    // Buffers a trailing partial multi-byte UTF-8 sequence between chunks,
    // since a chunk boundary can split a multi-byte character in half.
    this._incompleteChunk = Buffer.alloc(0);
  }

  _transform(chunk, encoding, callback) {
    try {
      const combined = Buffer.concat([this._incompleteChunk, chunk]);

      // Find how many trailing bytes might be an incomplete UTF-8 sequence
      // (a lead byte for a multi-byte char with not enough continuation bytes yet).
      let safeLength = combined.length;
      for (let i = 1; i <= 3 && i <= combined.length; i++) {
        const byte = combined[combined.length - i];
        if ((byte & 0b11000000) === 0b11000000) {
          // this byte starts a multi-byte sequence -- check if it's fully present
          const seqLength = byte >= 0b11110000 ? 4 : byte >= 0b11100000 ? 3 : 2;
          if (seqLength > i) {
            safeLength = combined.length - i;
          }
          break;
        }
      }

      const safeChunk = combined.subarray(0, safeLength);
      this._incompleteChunk = combined.subarray(safeLength);

      callback(null, safeChunk.toString('utf8').toUpperCase());
    } catch (err) {
      callback(err);
    }
  }

  _flush(callback) {
    // Emit whatever partial bytes are left at end-of-stream (best effort --
    // a genuinely truncated/invalid UTF-8 tail will just decode with replacement chars).
    if (this._incompleteChunk.length > 0) {
      callback(null, this._incompleteChunk.toString('utf8').toUpperCase());
    } else {
      callback();
    }
  }
}

module.exports = UppercaseTransform;

// --- standalone CLI usage: uppercase-cli.js ---
// process.stdin.pipe(new UppercaseTransform()).pipe(process.stdout);

// --- composed into a pipeline ---
// const fs = require('node:fs');
// const { pipeline } = require('node:stream/promises');
// await pipeline(
//   fs.createReadStream('input.txt'),
//   new UppercaseTransform(),
//   fs.createWriteStream('output.txt')
// );
```

**Key design points:**

- **`_transform` is the required override** for any `Transform` subclass — it receives each chunk and must call `callback(err, outputChunk)` to emit the transformed data (or `callback(err)` alone to signal an error for this chunk without emitting output).
- **UTF-8 boundary safety** is the subtle correctness requirement most naive uppercase-Transform implementations miss: if a multi-byte character (e.g., an accented letter or emoji) is split across two incoming `Buffer` chunks, calling `.toString('utf8')` on the first chunk alone would corrupt that trailing partial character. This implementation holds back any potentially-incomplete trailing bytes into `_incompleteChunk` and prepends them to the next chunk before decoding.
- **`_flush`** is called once after all input has been consumed (right before the stream ends) — used here to emit any bytes still held in `_incompleteChunk` so no trailing character is silently dropped.
- **Works transparently with `pipeline()`** because it correctly implements the `Transform` contract (calling `callback` exactly once per `_transform` invocation, propagating errors via `callback(err)`) — no special integration code needed beyond including it as one of the arguments to `pipeline()`.
