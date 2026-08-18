# Output: Strict mode turns an accidental global into a `ReferenceError`

```js
"use strict";
function assign() {
  leaked = "value";
}
try {
  assign();
} catch (e) {
  console.log(e.constructor.name);
}
```

**Answer:**
```
ReferenceError
```

**Why:** In strict mode, assigning to an undeclared identifier (`leaked = "value"` with no `let`/`const`/`var`) throws a `ReferenceError` instead of silently creating a property on the global object. This is one of strict mode's protections specifically against the accidental-global memory leak pattern.
