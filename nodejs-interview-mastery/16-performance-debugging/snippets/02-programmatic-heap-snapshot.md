# Snippet: Taking a heap snapshot programmatically

```js
const v8 = require('v8');
const fs = require('fs');
const filename = v8.writeHeapSnapshot();
console.log('Heap snapshot written to', filename);
```

**Explanation:** `v8.writeHeapSnapshot()` dumps the current V8 heap to a `.heapsnapshot` file on disk (auto-generated filename if none is given) without needing DevTools attached. This is useful for automated leak-hunting — e.g., a script that triggers a snapshot before and after a load test, so both files can be diffed offline in Chrome DevTools' Memory tab comparison view.
