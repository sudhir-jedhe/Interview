# Output-Based: `fork()` IPC message ordering

```js
const { fork } = require('child_process');
const child = fork('./echo.js');
child.send('hello');
child.send('world');
child.on('message', (m) => console.log('parent got:', m));
// echo.js: process.on('message', (m) => process.send(m.toUpperCase()));
```

**Answer:** `parent got: HELLO` then `parent got: WORLD` (in send order)

**Why:** IPC messages between a parent and forked child are delivered in order over a single channel — Node guarantees FIFO ordering for `.send()` calls on the same channel, even though each message is processed asynchronously by the child.
