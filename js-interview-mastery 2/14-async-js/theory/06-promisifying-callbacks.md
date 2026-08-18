# Promisifying a Callback API

Wrap the callback-based call in a `new Promise`, calling `resolve`/`reject` from inside the original callback:

```js
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
```

This works for any function following the common Node convention: the callback is the last argument, and its first parameter is an error (or `null`/`undefined` on success).

## Node's built-in shortcut

For the standard `fn(...args, (err, result) => {})` shape, `util.promisify` avoids writing this boilerplate by hand:

```js
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const data = await readFile('./config.json', 'utf8');
```

`util.promisify` only works cleanly for functions following the standard "error-first callback as last argument, single result value" convention — APIs with multiple callback result arguments or non-standard signatures still need manual wrapping (see `problems/02-promisify-utility.md` in this topic for a hand-rolled `promisify` implementation, including how to handle multiple result arguments).
