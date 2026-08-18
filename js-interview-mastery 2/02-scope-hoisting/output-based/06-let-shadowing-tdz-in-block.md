# `let` Shadowing Triggers the TDZ Even With an Outer Variable Present

```js
let x = 'outer';
{
  console.log(x);
  let x = 'inner';
}
```

**Answer:** `ReferenceError: Cannot access 'x' before initialization`

**Why:** Even though an outer `x` exists, the inner block declares its own `x` with `let`, which shadows the outer one for the entire block — including before its own declaration line. Because the inner `x` is in the TDZ from the start of the block, referencing the identifier `x` inside the block hits the TDZ, not the outer variable.
