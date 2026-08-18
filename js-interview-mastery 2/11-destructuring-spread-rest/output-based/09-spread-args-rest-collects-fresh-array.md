# Output: Spreading args in; rest collects into a fresh array

```js
function log(a, ...rest) {
  rest.push('added');
  console.log(a, rest);
}
const arr = ['x', 'y'];
log(...arr);
```

**Answer:** `x [ 'y', 'added' ]`

**Why:** `...arr` spreads the array into two positional arguments (`'x'`, `'y'`). Inside `log`, `a` binds `'x'` and the rest parameter collects everything else into a *fresh* array `['y']`, independent of `arr`. Pushing to `rest` never mutates the original `arr`.
