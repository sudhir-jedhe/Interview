# Demonstrating the libuv Thread Pool with Concurrent fs/crypto Calls

The libuv thread pool (default size 4) is what actually runs async `crypto`/`fs`/`dns.lookup`/`zlib` calls off the main thread. Firing more concurrent calls than the pool size causes the excess to queue.

```js
const crypto = require('crypto');

console.time('4 pbkdf2 calls');
let done = 0;
for (let i = 0; i < 4; i++) {
  crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', () => {
    if (++done === 4) console.timeEnd('4 pbkdf2 calls');
  });
}
// With default UV_THREADPOOL_SIZE=4 these run in parallel;
// a 5th concurrent call would queue behind these.
```

With the default `UV_THREADPOOL_SIZE=4`, all four `pbkdf2` calls run truly concurrently on separate OS threads, so the total time is close to a single call's duration, not four times as long. Add a fifth concurrent call and it has to wait for one of the four in-flight threads to free up before it even starts — this is the practical symptom described in `../scenarios/02-hashing-passwords-serial-throughput.md`, where increasing `UV_THREADPOOL_SIZE` relieves the bottleneck. See `../theory/01-v8-libuv-architecture.md` for the full thread pool model.
