# Output: Loose vs strict equality and numeric parsing

```js
console.log("10" == 10);
console.log("10" === 10);
console.log(parseInt("10.5"));
console.log(parseFloat("10.5abc"));
```

**Answer:** `true`, `false`, `10`, `10.5`

**Why:** `==` coerces the string to a number before comparing, so `"10" == 10` is `true`; `===` requires matching types, so it's `false`. `parseInt` stops parsing at the decimal point since `.` isn't a valid integer digit, returning `10`. `parseFloat` understands decimal points and stops only at the first character that can't continue a valid number, returning `10.5` and ignoring the trailing `"abc"`.
