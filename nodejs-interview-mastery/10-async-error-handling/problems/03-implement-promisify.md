# Problem: Implement util.promisify From Scratch for a Simple Error-First Callback Function

## Problem statement

Implement a minimal version of `util.promisify` — a function that takes an error-first callback-style function and returns a new function that returns a promise instead of accepting a callback.

## Requirements

- The returned function accepts the same positional arguments as the original, minus the callback
- On success (`err` is `null`/`undefined`), the returned promise resolves with the callback's result argument
- On failure (`err` is truthy), the returned promise rejects with `err`
- Must preserve `this` binding, since some callback-style APIs are called as methods (e.g. `someObject.method(cb)`)
- Bonus: support callbacks that pass multiple result arguments (like Node's real `util.promisify`, which resolves with an array when there's more than one result argument)

## Worked solution

```js
// utils/myPromisify.js
function myPromisify(fn) {
  return function promisified(...args) {
    const self = this; // preserve `this` in case fn is called as a method

    return new Promise((resolve, reject) => {
      fn.call(self, ...args, (err, ...results) => {
        if (err) {
          return reject(err);
        }
        // if there's exactly one result value, resolve with it directly;
        // if there are multiple, resolve with an array (mirrors util.promisify's behavior)
        resolve(results.length <= 1 ? results[0] : results);
      });
    });
  };
}

module.exports = myPromisify;
```

```js
// example: a simple error-first callback function
function readConfigValue(key, cb) {
  const config = { port: 3000, host: 'localhost' };
  setTimeout(() => {
    if (!(key in config)) {
      return cb(new Error(`Unknown config key: ${key}`));
    }
    cb(null, config[key]);
  }, 10);
}

const readConfigValueAsync = myPromisify(readConfigValue);

async function main() {
  const port = await readConfigValueAsync('port');
  console.log('port:', port); // port: 3000

  try {
    await readConfigValueAsync('missing');
  } catch (err) {
    console.log('caught:', err.message); // caught: Unknown config key: missing
  }
}

main();
```

```js
// example demonstrating multiple result arguments
function divideWithRemainder(a, b, cb) {
  if (b === 0) return cb(new Error('division by zero'));
  cb(null, Math.floor(a / b), a % b); // two result args: quotient, remainder
}

const divideAsync = myPromisify(divideWithRemainder);

divideAsync(17, 5).then(([quotient, remainder]) => {
  console.log(quotient, remainder); // 3 2
});
```

**Why `fn.call(self, ...)` matters:** if the original callback-style function is a method that reads `this` internally (e.g. a database driver's `client.query(sql, cb)` reading `this.connection`), simply doing `fn(...args, cb)` without preserving the receiver would break it once wrapped and detached from its object (`const q = myPromisify(client.query); q(sql)` would lose `this`). Capturing and forwarding `this` makes the wrapper behave correctly in both free-function and method-call contexts — the same design choice Node's real `util.promisify` makes.
