# Backpressure

Backpressure occurs when a writable destination can't consume data as fast as the readable source produces it. Every writable stream has an internal buffer with a configurable `highWaterMark`; when you call `.write(chunk)` and the internal buffer exceeds that threshold, `.write()` returns `false`, signaling "stop pushing data at me until I drain." If you ignore this signal and keep writing anyway (common in naive manual `.on('data', chunk => dest.write(chunk))` loops without pausing), the writable's internal buffer grows unbounded — a memory leak under sustained load, since Node buffers writes in memory regardless of what `.write()` returned unless you respect the signal.

```js
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  if (!canContinue) {
    readable.pause(); // stop producing until writable catches up
    writable.once('drain', () => readable.resume());
  }
});
```

`.pipe()` and `pipeline()` handle this automatically — they pause the source when `.write()` returns `false` and resume it on `'drain'`. This is the strongest practical argument for using `.pipe()`/`pipeline()` over manual `'data'`-event loops: manual backpressure handling is easy to get wrong and easy to forget entirely.

## What highWaterMark controls

`highWaterMark` sets the internal buffer threshold (in bytes for binary streams, or object count for object-mode streams) at which a Readable stops requesting more data from its source, or a Writable's `.write()` starts returning `false`. A very low value means more frequent, smaller chunk callbacks and more finely-granular backpressure signaling, at the cost of more per-chunk overhead. A very high value buffers more in memory before backpressure kicks in, reducing overhead per chunk but increasing peak memory usage — a tunable tradeoff, not a hard limit that's ever strictly enforced.

```js
const { Writable } = require('node:stream');

const slowWritable = new Writable({
  highWaterMark: 1,
  write(chunk, encoding, callback) {
    setTimeout(callback, 50); // simulate a slow destination
  },
});

for (let i = 0; i < 5; i++) {
  const ok = slowWritable.write(`chunk-${i}`);
  console.log(`wrote chunk-${i}, write() returned:`, ok);
}
// wrote chunk-0, write() returned: true
// wrote chunk-1 through chunk-4: write() returned: false (once the tiny highWaterMark of 1 is exceeded)
```

Once the internal buffer exceeds `highWaterMark`, `.write()` returns `false` to signal backpressure — but if a loop ignores that signal and keeps calling `.write()` synchronously anyway, all chunks get buffered in memory regardless of the destination's actual processing speed. This demonstrates why ignoring `.write()`'s return value defeats the whole point of backpressure. See `../scenarios/02-file-upload-progress-reporting.md` for a real pipeline that must respect this signal correctly.
