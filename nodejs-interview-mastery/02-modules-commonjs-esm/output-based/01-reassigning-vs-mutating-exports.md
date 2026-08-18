# Reassigning `exports` vs Mutating It

```js
// counter.cjs
exports.value = 1;
exports = { value: 2 };

// main.cjs
const c = require('./counter.cjs');
console.log(c.value);
```

**Answer:** `1`

**Why:** `exports` and `module.exports` initially point to the same object. `exports.value = 1` mutates that shared object, which is visible via `require()`. `exports = { value: 2 }` merely reassigns the local variable `exports` inside the module wrapper to a new object — it no longer points to `module.exports`, so the caller (which only ever receives `module.exports`) never sees `value: 2`.
