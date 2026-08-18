# Error Inside a Raw .pipe() Chain — Does the Source Get Cleaned Up?

```js
const fs = require('node:fs');
const { Transform } = require('node:stream');

const failingTransform = new Transform({
  transform(chunk, encoding, cb) {
    cb(new Error('boom'));
  },
});

const src = fs.createReadStream(__filename);
src.pipe(failingTransform).pipe(fs.createWriteStream('/tmp/out.txt'));
failingTransform.on('error', (err) => console.log('caught:', err.message));
```

**Answer:** Logs `caught: boom`, but `src` (the read stream) is **not** automatically destroyed/closed — its file descriptor can remain open, and the write stream is also left dangling since `.pipe()` doesn't propagate destruction on error.

**Why:** `.pipe()` only forwards `'data'` and handles backpressure; it does not listen for `'error'` on upstream/downstream streams and automatically unpipe/destroy everything, which is the well-documented flaw `pipeline()` was built to fix.
