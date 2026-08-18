# Adding Two Arrays with `+`

```js
console.log([1, 2] + [3, 4]);
```

**Answer:** `'1,23,4'`

**Why:** `+` on two objects (arrays are objects) triggers `ToPrimitive`, which calls each array's `toString()`. `[1,2].toString()` is `'1,2'` and `[3,4].toString()` is `'3,4'`. Since both operands are now strings, `+` concatenates them: `'1,2' + '3,4'` = `'1,23,4'`.
