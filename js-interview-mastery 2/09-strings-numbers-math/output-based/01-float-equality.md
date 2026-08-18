# Output: Float equality and addition

```js
console.log(0.1 + 0.2 === 0.3);
console.log(0.1 + 0.7);
```

**Answer:** `false` then `0.7999999999999999`

**Why:** Neither `0.1`, `0.2`, `0.3`, nor `0.7` can be represented exactly in IEEE-754 binary floating point, so arithmetic on them accumulates tiny rounding error. `0.1 + 0.2` actually evaluates to `0.30000000000000004`, which is not strictly equal to the literal `0.3`. This is a hardware/spec-level limitation shared by nearly every language using binary floats, not a JavaScript-specific bug.
