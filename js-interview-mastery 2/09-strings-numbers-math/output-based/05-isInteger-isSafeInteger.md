# Output: Number.isInteger and Number.isSafeInteger

```js
console.log(Number.isInteger(5.0));
console.log(Number.isInteger("5"));
console.log(Number.isSafeInteger(2 ** 53));
console.log(Number.isSafeInteger(2 ** 53 - 1));
```

**Answer:** `true`, `false`, `false`, `true`

**Why:** `5.0` is stored identically to the integer `5` (there's only one numeric type in JS), so `Number.isInteger` returns `true`. Unlike the legacy global `isFinite`/`isNaN`, `Number.isInteger` does not coerce strings, so `"5"` returns `false` outright. `Number.isSafeInteger` checks the value is within `±(2^53 - 1)`; `2^53` itself is just outside that safe range (it's the first integer that can collide with `2^53 + 1` due to precision loss), while `2^53 - 1` is exactly the boundary and still safe.
