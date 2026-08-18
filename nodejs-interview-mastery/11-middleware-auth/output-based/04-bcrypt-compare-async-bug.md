# Output-Based: bcrypt.compare Is Async — A Common Bug

```js
const bcrypt = require('bcrypt');

function login(plainPassword, hash) {
  let result;
  bcrypt.compare(plainPassword, hash).then((match) => { result = match; });
  return result; // returned before the promise resolves
}

console.log(login('secret123', someHash));
```

**Answer:** `undefined`

**Why:** `bcrypt.compare` is asynchronous and returns a promise; the `.then` callback that assigns `result` runs on a later microtask, after `return result` has already executed with `result` still at its initial `undefined` value. This is a classic async-await-forgetting bug — the function needs to be `async` and `return await bcrypt.compare(...)`, or return the promise itself and let the caller await it.
