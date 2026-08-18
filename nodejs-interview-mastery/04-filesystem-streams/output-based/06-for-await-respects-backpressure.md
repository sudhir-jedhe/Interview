# for-await-of Over a Readable Respecting Backpressure Automatically

```js
const { Readable } = require('node:stream');

async function* generate() {
  for (let i = 0; i < 3; i++) {
    yield `item-${i}`;
  }
}
const readable = Readable.from(generate());

for await (const item of readable) {
  console.log('got', item);
}
console.log('done');
```

**Answer:** `got item-0`, `got item-1`, `got item-2`, `done`

**Why:** `for await...of` on a Readable stream automatically pulls one chunk at a time, only requesting the next chunk once the loop body for the current one completes — this naturally respects backpressure without any manual `.pause()`/`.resume()` calls, unlike a raw `'data'` event listener which fires as fast as the source can produce.
