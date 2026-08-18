# Function Declaration Inside a Block (Annex B Legacy Behavior)

```js
if (true) {
  function greet() { console.log('hi'); }
}
console.log(typeof greet);
```

**Answer:** `'function'` in non-strict/sloppy mode (most REPLs/Node scripts), though behavior technically varies by environment

**Why:** Function declarations inside blocks are a historically messy area of the spec. In modern engines running non-strict code, block-scoped function declarations are hoisted to the function/global scope as a legacy compatibility behavior ("Annex B"), so `greet` is visible outside the `if` block. In strict mode (`'use strict'`, or inside ES modules/classes), the function is properly block-scoped and this would log `'undefined'` instead. This inconsistency is exactly why relying on function declarations inside blocks is discouraged — use a `let`/`const` function expression instead for predictable scoping.
