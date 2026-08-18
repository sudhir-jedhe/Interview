**You inherited a legacy Node.js module that reads a config file using the old `fs.readFile(path, callback)` API, and it's littered throughout a codebase that has since moved to `async`/`await` everywhere else. How do you promisify it cleanly, and are there built-in shortcuts?**

**Approach:**
Manual promisification wraps the callback API in a `new Promise`:

```js
function readConfig(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

async function loadConfig() {
  const config = await readConfig('./config.json');
  return config;
}
```
For the common Node.js convention of `fn(...args, (err, result) => {})`, Node's built-in `util.promisify` avoids writing this boilerplate by hand:

```js
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const data = await readFile('./config.json', 'utf8');
```
`util.promisify` only works cleanly for functions following the standard "error-first callback as last argument, single result value" convention — APIs with multiple callback result arguments or non-standard signatures still need manual wrapping (see `problems/02-promisify-utility.md`).
