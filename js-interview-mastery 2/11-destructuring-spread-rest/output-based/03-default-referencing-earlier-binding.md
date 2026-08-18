# Output: Default value referencing an earlier binding in the same pattern

```js
function f({ x, y = x }) {
  console.log(x, y);
}
f({ x: 5 });
```

**Answer:** `5 5`

**Why:** Default values in destructuring can reference earlier-bound variables from the same pattern. Since `y` is missing (`undefined`), its default expression `x` is evaluated, and `x` is already bound to `5` at that point.
