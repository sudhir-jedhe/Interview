# Order of Async fs.readFile Callback vs Synchronous Code

```js
const fs = require('node:fs');

console.log('1');
fs.readFile(__filename, () => console.log('2: readFile callback'));
console.log('3');
```

**Answer:** `1`, `3`, `2: readFile callback`

**Why:** `fs.readFile` delegates the actual read to the libuv thread pool and returns immediately, letting synchronous code (`3`) continue running. The callback only fires once the event loop reaches the poll phase and the thread pool signals completion — always after all currently synchronous code has finished.
