# Three Ways to Read a File — Sync, Callback, and Promise-Based

```js
const fs = require('node:fs');
const fsp = require('node:fs/promises');

const syncData = fs.readFileSync('./package.json', 'utf8'); // blocks the thread
fs.readFile('./package.json', 'utf8', (err, data) => {       // callback style
  if (err) throw err;
});
const asyncData = await fsp.readFile('./package.json', 'utf8'); // promise style
```

All three read the exact same file and produce the same string content, but with very different runtime behavior: `readFileSync` blocks the current thread until the read completes; `fs.readFile` delegates to the libuv thread pool and reports the result via callback once the event loop's poll phase picks it up; `fsp.readFile` does the same thread-pool delegation but returns a Promise, letting the surrounding `async` function `await` it. See `../theory/01-fs-api-styles.md` for when to use each.
