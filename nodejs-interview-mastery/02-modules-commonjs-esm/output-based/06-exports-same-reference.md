# exports.foo vs module.exports.foo — Same Underlying Object

```js
// same.cjs
console.log(exports === module.exports); // logged before any reassignment
module.exports.foo = 'bar';
console.log(exports.foo);
```

**Answer:** `true`, then `bar`

**Why:** At the start of module execution, `exports` is literally the same object reference as `module.exports` (it's the wrapper function's parameter, pre-set to point to it). Since neither was reassigned, mutating via `module.exports.foo` is visible through `exports.foo` too.
