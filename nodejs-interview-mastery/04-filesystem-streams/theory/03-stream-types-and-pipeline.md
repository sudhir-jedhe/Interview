# The Four Stream Types, and pipe() vs pipeline()

## The four stream types

- **Readable** — a source of data you consume (`fs.createReadStream`, an HTTP request body, `process.stdin`).
- **Writable** — a destination you write data to (`fs.createWriteStream`, an HTTP response, `process.stdout`).
- **Duplex** — both readable and writable, independently (a TCP socket — you can read and write on the same connection).
- **Transform** — a Duplex stream where output is a computed function of input, passing through a processing step (`zlib.createGzip()`, a CSV parser, a custom Transform that uppercases text).

```js
const { Transform } = require('node:stream');
const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});
```

### Readable vs Writable vs Duplex vs Transform

| Aspect | Readable | Writable | Duplex | Transform |
|---|---|---|---|---|
| Direction | Source you consume from | Destination you write to | Both, independently | Both, but output is derived from input |
| Key method to implement | `_read()` | `_write()` | Both `_read()` and `_write()` | `_transform()` (and optionally `_flush()`) |
| Typical example | `fs.createReadStream`, HTTP request body, `process.stdin` | `fs.createWriteStream`, HTTP response, `process.stdout` | A TCP socket (read and write are unrelated data flows) | `zlib.createGzip()`, a CSV parser, a custom uppercase filter |

Reach for `Transform` whenever the output is a function of the input passing through a single conceptual pipeline stage — it composes naturally with `pipe()`/`pipeline()`. Reach for `Duplex` only when read and write sides are genuinely unrelated data flows, like a socket. The common mistake is implementing a custom `Duplex` when what's actually needed is a `Transform` — if your "read" output is supposed to be a processed version of your "write" input, you almost always want `Transform`. See `../problems/02-custom-uppercase-transform.md` for a hands-on Transform implementation.

## pipe() vs pipeline()

`.pipe()` connects a readable to a writable, automatically managing backpressure, but it has a well-known flaw: if the source or an intermediate stream emits an `'error'` event, `.pipe()` does **not** automatically destroy/clean up the other streams in the chain, leading to memory leaks, dangling file descriptors, or silently hung processes. You'd have to manually attach `'error'` listeners to every stream in the chain and call `.destroy()` on each.

```js
// Fragile: an error on gzip or the write stream doesn't clean up the read stream
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('output.txt.gz'));
```

`pipeline()` (from `node:stream` callback-based, or `node:stream/promises` for async/await) fixes this: it forwards errors from any stream in the chain, and guarantees every stream is properly destroyed/cleaned up when the pipeline finishes or fails.

```js
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function compressFile(input, output) {
  await pipeline(
    fs.createReadStream(input),
    zlib.createGzip(),
    fs.createWriteStream(output)
  );
  // resolves only after the entire chain completes AND all streams are cleaned up;
  // rejects with the actual error and still cleans up on failure
}
```

### .pipe() vs pipeline()

| Aspect | .pipe() | pipeline() (`node:stream/promises` or callback form) |
|---|---|---|
| Backpressure handling | Automatic | Automatic (same underlying mechanism) |
| Error propagation across the chain | No — an error on one stream doesn't destroy the others | Yes — an error anywhere destroys every stream in the chain |
| Cleanup on failure | Manual — you must attach `'error'` listeners and call `.destroy()` yourself on each stream | Automatic |
| Recommended for | Quick scripts, exploratory REPL use | Production code, anything unattended |

**Always prefer `pipeline()` over raw chained `.pipe()` calls in production code.** The common mistake is chaining several `.pipe()` calls in server code and assuming an error on the write stream (e.g., disk full) will also stop the read stream — it won't, and the read stream keeps holding its file descriptor open indefinitely, which under sustained traffic exhausts the process's file descriptor limit.

## 'finish' vs 'end' events

`'finish'` is emitted by a Writable stream once all data passed to `.end()` has been flushed to the underlying resource — it signals "writing is done." `'end'` is emitted by a Readable stream once there's no more data to be consumed. They're symmetric opposites on the two stream directions, not interchangeable:

```js
const writable = fs.createWriteStream('/tmp/test.txt');
writable.on('finish', () => console.log('finish: all data flushed to the OS'));
writable.write('hello ');
writable.end('world');
console.log('end() called, still synchronous here');
// Output order: "end() called, still synchronous here" THEN (async) "finish: all data flushed..."
```

`writable.end()` schedules the final write and closes the stream but returns immediately — it doesn't block waiting for the underlying file write to complete, so the synchronous log line after it always prints first.
