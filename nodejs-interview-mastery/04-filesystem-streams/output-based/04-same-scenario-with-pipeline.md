# Same Scenario Using pipeline() Instead

```js
const fs = require('node:fs');
const { Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const failingTransform = new Transform({
  transform(chunk, encoding, cb) {
    cb(new Error('boom'));
  },
});

try {
  await pipeline(fs.createReadStream(__filename), failingTransform, fs.createWriteStream('/tmp/out2.txt'));
} catch (err) {
  console.log('pipeline failed:', err.message);
}
```

**Answer:** Logs `pipeline failed: boom`, and all three streams (read, transform, write) are properly destroyed and their resources released.

**Why:** `pipeline()` attaches error handling across every stream in the chain — when any stream errors, it destroys the others automatically and rejects the returned promise with that error, guaranteeing no dangling file descriptors or hung processes, unlike raw `.pipe()`.
