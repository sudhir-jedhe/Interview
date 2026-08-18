# Backpressure: write() Return Value Ignored

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
```

**Answer:** `wrote chunk-0, write() returned: true`, then `wrote chunk-1` through `chunk-4` all logging `write() returned: false` (exact cutoff can vary slightly by Node version/timing, but subsequent calls return `false` once the tiny highWaterMark of 1 is exceeded).

**Why:** Once the internal buffer exceeds `highWaterMark`, `.write()` returns `false` to signal backpressure — but the loop ignores that signal and keeps calling `.write()` synchronously anyway, so all five chunks get buffered in memory regardless of the destination's actual processing speed. This demonstrates why ignoring `.write()`'s return value defeats the whole point of backpressure.
