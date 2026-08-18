# Mixed `+` and `-` Coercion

```js
console.log(1 + '1');
console.log(1 - '1');
console.log('5' + 3 - 2);
```

**Answer:** `'11'`, `0`, `51`

**Why:** `+` triggers string concatenation when either operand is a string, so `1 + '1'` becomes `'1' + '1'` = `'11'`. `-` has no string meaning, so it always coerces both operands to numbers: `1 - '1'` becomes `1 - 1` = `0`. In the third line, operators run left-to-right: `'5' + 3` concatenates first (since `'5'` is a string) giving `'53'`, then `'53' - 2` coerces `'53'` to the number `53` and subtracts, giving `51`. This demonstrates why mixing `+` and `-` with strings is error-prone — the result depends entirely on operator order.
