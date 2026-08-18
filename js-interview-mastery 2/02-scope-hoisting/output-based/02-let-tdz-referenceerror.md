# Accessing a `let` Variable in Its TDZ

```js
function test() {
  console.log(x);
  let x = 5;
}
test();
```

**Answer:** `ReferenceError: Cannot access 'x' before initialization`

**Why:** `let` declarations are hoisted to the top of their block but not initialized — they remain in the Temporal Dead Zone until the declaration line executes. Reading `x` before that line throws, rather than returning `undefined`.
