# Stream 'end' vs 'finish' Event Confusion

```js
const fs = require('node:fs');
const writable = fs.createWriteStream('/tmp/end-finish-test.txt');

writable.on('finish', () => console.log('finish: all data flushed to the OS'));
writable.write('hello ');
writable.end('world');
console.log('end() called, still synchronous here');
```

**Answer:** `end() called, still synchronous here`, then (asynchronously) `finish: all data flushed to the OS`

**Why:** `writable.end()` schedules the final write and closes the stream but returns immediately — it doesn't block waiting for the underlying file write to complete. The `'finish'` event only fires once all buffered data has actually been flushed to the underlying resource, which happens on a later event loop iteration, after the synchronous code following `.end()` has already run.
