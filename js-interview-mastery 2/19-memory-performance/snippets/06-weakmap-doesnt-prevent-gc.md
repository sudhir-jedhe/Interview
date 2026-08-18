# Snippet: WeakMap doesn't prevent its key from being garbage collected

```js
const metadata = new WeakMap();
let session = { id: "abc123" };
metadata.set(session, { createdAt: Date.now() });

console.log(metadata.has(session)); // true
session = null;
// The `session` object is now eligible for garbage collection because WeakMap
// holds only a weak reference to it -- the entry disappears automatically.
// (You can't observe the exact moment; there's no synchronous way to prove
// the collection happened, but no strong reference remains anywhere.)
```
