# Error-First Callbacks and Promisifying

Node's core APIs were built around a convention called the **error-first callback**: the first argument to a callback is always an error (or `null`), the second is the result.

```js
const fs = require('fs');

fs.readFile('./config.json', 'utf8', (err, data) => {
  if (err) return console.error('failed to read config:', err.message);
  console.log(JSON.parse(data));
});
```

This convention exists because callbacks can't `throw` and have it caught by surrounding synchronous code — by the time the callback fires, the call stack that invoked `readFile` is long gone. So errors have to be passed as data instead of thrown.

## Promisifying callback APIs

Modern code mostly wraps these callback APIs in promises so you can use `async/await`. Node ships `util.promisify` for exactly this, and most core modules now expose a `/promises` variant directly:

```js
const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);

// or, preferred for fs specifically:
const fsp = require('fs/promises');

async function loadConfig() {
  const data = await fsp.readFile('./config.json', 'utf8');
  return JSON.parse(data);
}
```
`promisify` only works cleanly on functions that follow the `(err, result)` callback convention — for anything else (callback fires more than once, multiple result args) you need to wrap it manually with `new Promise((resolve, reject) => {...})`.

```js
// manual promise-wrapping for a callback API that doesn't fit the (err, data) shape
function readLineFromStream(stream) {
  return new Promise((resolve, reject) => {
    stream.once('data', (chunk) => resolve(chunk.toString()));
    stream.once('error', reject);
    stream.once('end', () => reject(new Error('stream ended with no data')));
  });
}
```

## Error-first callbacks vs Promises vs async/await

| Aspect | Error-first callbacks | Promises (`.then/.catch`) | async/await |
|---|---|---|---|
| Error propagation | Manual — check `err` at every step | `.catch()` at the end of a chain | Native `try/catch`, reads like sync code |
| Composability | Poor — "callback hell" for sequential/parallel ops | Good — `Promise.all`, `.then` chaining | Best — sequential logic reads top-to-bottom |
| Common pitfall | Forgetting to check `err` before using `data` | Forgetting a `.catch()`, or "forgetting to return" inside `.then` | Forgetting `await`, causing a fire-and-forget rejected promise |

Use async/await for new code — it's the clearest to read and debug (stack traces are much better than promise chains). You'll still meet raw callbacks constantly in Node core APIs and older libraries, so know how to promisify them. The most common mistake is mixing styles inconsistently within the same function, which makes error handling unpredictable.
