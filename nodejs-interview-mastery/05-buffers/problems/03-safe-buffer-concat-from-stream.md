# Problem: Safely Concatenate Buffers from a Stream of Chunks

## Problem Statement

Implement a `collectStream(readable, options)` function that safely concatenates all `Buffer` chunks from a Node readable stream into a single `Buffer`, while guarding against the pitfalls of naive concatenation: unbounded memory growth from a malicious/huge stream, string coercion corrupting binary data, and inefficient repeated `Buffer.concat` calls.

## Requirements

- Accepts any Node `Readable` stream emitting `Buffer` chunks (not string chunks).
- Enforces a configurable `maxBytes` limit, rejecting (destroying the stream and throwing) if exceeded — prevents memory-exhaustion DoS from an oversized or infinite stream.
- Never uses string `+=` concatenation on chunks (which would corrupt non-UTF8-safe binary data).
- Only calls `Buffer.concat` once at the end (not once per chunk), to avoid O(n²) copying behavior on long streams.
- Properly propagates stream `'error'` events as a rejected promise.

## Approach

Accumulate chunks in a plain array (cheap — just pushes a reference, no copying) and track a running byte count. Reject early the moment the running total exceeds the limit, without waiting for the stream to fully drain. Only perform the actual byte-copying `Buffer.concat` once, after the stream ends, using the known total length so Node can pre-allocate the result buffer in one shot.

## Solution

```js
function collectStream(readable, { maxBytes = 10 * 1024 * 1024 } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;
    let settled = false;

    const cleanup = () => {
      readable.off('data', onData);
      readable.off('end', onEnd);
      readable.off('error', onError);
    };

    const fail = (err) => {
      if (settled) return;
      settled = true;
      cleanup();
      readable.destroy();
      reject(err);
    };

    function onData(chunk) {
      if (!Buffer.isBuffer(chunk)) {
        // Guard against streams in "object mode" or with an encoding set, where
        // chunks would arrive as strings — concatenating those with binary data corrupts it.
        return fail(new TypeError('Expected Buffer chunks; stream may have an encoding set'));
      }

      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        return fail(new Error(`Stream exceeded maxBytes limit of ${maxBytes}`));
      }

      chunks.push(chunk); // cheap: stores a reference, copies nothing yet
    }

    function onEnd() {
      if (settled) return;
      settled = true;
      cleanup();
      // Single concat at the end, with totalBytes known upfront so Node allocates
      // the result buffer exactly once instead of resizing repeatedly.
      resolve(Buffer.concat(chunks, totalBytes));
    }

    function onError(err) {
      fail(err);
    }

    readable.on('data', onData);
    readable.on('end', onEnd);
    readable.on('error', onError);
  });
}

module.exports = { collectStream };

// --- verification ---
const { Readable } = require('stream');

async function main() {
  const ok = await collectStream(Readable.from([Buffer.from('a'), Buffer.from('b'), Buffer.from('c')]));
  console.log(ok.toString()); // "abc"

  try {
    await collectStream(Readable.from([Buffer.alloc(5), Buffer.alloc(5)]), { maxBytes: 6 });
  } catch (err) {
    console.log(err.message); // "Stream exceeded maxBytes limit of 6"
  }
}

main();
```

**Why this works:** pushing chunk references into an array and deferring the actual byte copy to a single terminal `Buffer.concat(chunks, totalBytes)` call is the efficient pattern — repeatedly calling `Buffer.concat` inside the `'data'` handler would re-copy all previously accumulated bytes on every chunk, turning an O(n) stream read into O(n²). The `maxBytes` check runs incrementally as data arrives (not after the fact), so a hostile stream is aborted as soon as it crosses the limit rather than after it has already exhausted memory.
