# Output-Based: util.promisify with a Callback That Isn't Error-First

```js
const util = require('util');

function oddCallback(cb) {
  cb('not an error', 'some data'); // first arg isn't null on success!
}

const promisified = util.promisify(oddCallback);

promisified()
  .then((data) => console.log('resolved:', data))
  .catch((err) => console.log('rejected:', err));
```

**Answer:** `rejected: not an error`

**Why:** `util.promisify` blindly trusts the error-first convention: it treats the callback's first argument as the rejection reason whenever it's not `null`/`undefined`, and the second argument as the resolved value only when the first is falsy. Since `oddCallback` violates the convention by passing a truthy non-error string as the first arg on a "success" path, `promisify` interprets it as a failure — this is a real gotcha when promisifying older/nonstandard APIs.
