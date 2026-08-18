# Snippet: Promisifying a Callback-Based API with util.promisify

```js
const util = require('util');
const dns = require('dns');

const lookup = util.promisify(dns.lookup);

async function resolveHost(hostname) {
  const { address } = await lookup(hostname);
  return address;
}

resolveHost('example.com').then(console.log).catch(console.error);
```

**Explanation:** `dns.lookup` follows the error-first callback convention (`(err, address, family)`), so `util.promisify` can wrap it automatically into a function returning a promise. The wrapped `lookup` resolves with the callback's *first non-error argument* (`address`) when there's a single result value — `promisify` doesn't need any manual glue code here because the source function is already well-behaved.
