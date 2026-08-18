# `var` Redeclared Inside an `if` Block Is the Same Binding

```js
function scopeTest() {
  var a = 'function var';
  if (true) {
    var a = 'block var';
    console.log(a);
  }
  console.log(a);
}
scopeTest();
```

**Answer:** `'block var'` then `'block var'`

**Why:** Both `var a` declarations refer to the exact same function-scoped variable — there is no block scoping for `var`, so the second declaration simply reassigns the same binding created by the first. There's only ever one `a` in this function, and its final value after the `if` block runs is `'block var'`.
