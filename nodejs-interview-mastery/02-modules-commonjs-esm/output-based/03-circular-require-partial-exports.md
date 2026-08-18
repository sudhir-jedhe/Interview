# Circular require() and Partial Exports

```js
// a.cjs
console.log('a starting');
exports.done = false;
const b = require('./b.cjs');
console.log('in a, b.value is:', b.value);
exports.done = true;

// b.cjs
console.log('b starting');
const a = require('./a.cjs');
console.log('in b, a.done is:', a.done);
exports.value = 42;

// main.cjs
require('./a.cjs');
```

**Answer:**
```
a starting
b starting
in b, a.done is: false
in a, b.value is: 42
```

**Why:** `a.cjs` starts executing and requires `b.cjs` before setting `exports.done = true`. When `b.cjs` requires `a.cjs` back, Node returns the *currently* cached (incomplete) `module.exports` of `a` — at that point `done` is still `false`. `b.cjs` finishes fully, setting `value = 42`, and control returns to `a.cjs`, which now sees the completed `b.value`.
