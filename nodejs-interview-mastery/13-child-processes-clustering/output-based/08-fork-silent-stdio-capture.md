# Output-Based: `fork()` with `{ silent: true }` captures stdio

```js
const { fork } = require('child_process');
const child = fork(__filename, [], { silent: true });
// (imagine __filename, when run as a plain child with no special flags, does: console.log('hi from child'))
child.stdout.on('data', (d) => console.log('captured:', d.toString().trim()));
```

**Answer:** `captured: hi from child`

**Why:** By default, `fork()`'s child inherits the parent's stdio (so child output goes straight to the terminal, bypassing `child.stdout`, which is `null`). Passing `{ silent: true }` pipes the child's stdout/stderr back through `child.stdout`/`child.stderr` streams instead, letting the parent programmatically capture output rather than it going directly to the console.
