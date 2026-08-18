# Output: reassigning .prototype after instances already exist

```js
function Foo() {}
Foo.prototype.value = 1;
const a = new Foo();
Foo.prototype = { value: 2 };
const b = new Foo();
console.log(a.value, b.value);
```

**Answer:** `1 2`

**Why:** `a` was created while `Foo.prototype` pointed to the original object, so `a`'s internal `[[Prototype]]` still links to that original object (`value: 1`) even after `Foo.prototype` is reassigned. `b` is created after the reassignment, so it links to the new object (`value: 2`). Reassigning `.prototype` never retroactively changes already-created instances.
