# `var` Hoisting: `undefined` Before Assignment

```js
console.log(a);
var a = 1;
console.log(a);
```

**Answer:** `undefined` then `1`

**Why:** During the creation phase, `var a` is hoisted to the top of its scope and initialized to `undefined`. The assignment `a = 1` only happens when execution reaches that line, so the first log sees the hoisted-but-unassigned value.
