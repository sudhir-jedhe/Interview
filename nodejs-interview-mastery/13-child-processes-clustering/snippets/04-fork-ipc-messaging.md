# Snippet: `fork()` — parent/child Node processes over IPC

```js
const { fork } = require('child_process');

if (!process.env.IS_CHILD) {
  const child = fork(__filename, [], { env: { ...process.env, IS_CHILD: '1' } });
  child.send({ cmd: 'square', value: 6 });
  child.on('message', (msg) => {
    console.log('result from child:', msg); // 36
    child.kill();
  });
} else {
  process.on('message', (msg) => {
    if (msg.cmd === 'square') process.send(msg.value * msg.value);
  });
}
```

**Explanation:** This file is self-contained — it re-forks itself, using an environment variable to tell the child branch apart from the parent branch. `fork()` automatically opens an IPC channel between parent and child, so `.send()`/`.on('message', ...)` gives you structured message passing without building your own protocol over raw stdio.
