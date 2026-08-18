# emit() Does Not Wait for an Async Listener

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.on('go', async () => {
  console.log('listener start');
  await Promise.resolve();
  console.log('listener end');
});

ee.emit('go');
console.log('after emit');
```

**Answer:** `listener start`, `after emit`, `listener end`.

**Why:** `emit()` calls the async listener, which runs synchronously up to its first `await`. The `await` yields control back to `emit()`, which returns immediately (`emit` does not wait for the returned promise). `console.log('after emit')` then runs synchronously, and the microtask queue flushes `listener end` afterward.
