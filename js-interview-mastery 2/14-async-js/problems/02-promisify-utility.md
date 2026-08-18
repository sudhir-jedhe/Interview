# Problem: Implement `promisify(fn)`

**Goal:** Convert a Node-style error-first callback function into a function that returns a Promise, similar to `util.promisify`.

## Implementation

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  };
}
```

## Usage

```js
const fs = require('fs');
const readFile = promisify(fs.readFile);

async function main() {
  try {
    const data = await readFile('./config.json', 'utf8');
    console.log(JSON.parse(data));
  } catch (err) {
    console.error('failed to read config:', err.message);
  }
}
```

## Handling callbacks with multiple result arguments

The standard `util.promisify` convention assumes a single success value, but some Node APIs (like `fs.read`) call back with multiple results (`(err, bytesRead, buffer)`). A more complete version detects this and resolves with an array (or object) instead of a single value:

```js
function promisifyMulti(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, ...results) => {
        if (err) reject(err);
        else resolve(results.length <= 1 ? results[0] : results);
      });
    });
  };
}
```

## Key implementation details interviewers probe for

- **`this` binding**: using `fn.call(this, ...)` preserves the receiver, so `promisify` works correctly when the original function relies on being called as a method (e.g., `obj.method(cb)`).
- **Error-first convention**: the callback's first argument is always checked for truthiness and treated as the rejection reason — this is the entire contract the utility relies on, and it silently breaks on APIs that don't follow it.
- **Not reusable for callback-registration APIs**: `promisify` only makes sense for "fire once, callback once" functions — it should not be used on APIs like `on('data', cb)` that invoke the callback repeatedly, since a Promise can only settle once.
