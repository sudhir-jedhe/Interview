# Floating-Point Addition Precision

```js
console.log(0.1 + 0.2 === 0.3);
```

**Answer:** `false`

**Why:** Numbers in JS are IEEE-754 doubles, which can't represent 0.1 or 0.2 exactly in binary. `0.1 + 0.2` actually evaluates to `0.30000000000000004`, which is not strictly equal to `0.3`. This is a floating-point limitation shared by nearly every language that uses this standard, not a JS-specific bug.
