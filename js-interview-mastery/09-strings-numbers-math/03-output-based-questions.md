# Output-Based Questions: Strings, Numbers & Math

## 1.

```js
console.log(0.1 + 0.2 === 0.3);
console.log(0.1 + 0.7);
```

**Answer:** `false` then `0.7999999999999999`

**Why:** Neither `0.1`, `0.2`, `0.3`, nor `0.7` can be represented exactly in IEEE-754 binary floating point, so arithmetic on them accumulates tiny rounding error. `0.1 + 0.2` actually evaluates to `0.30000000000000004`, which is not strictly equal to the literal `0.3`. This is a hardware/spec-level limitation shared by nearly every language using binary floats, not a JavaScript-specific bug.

## 2.

```js
console.log(parseInt("07"));
console.log(parseInt("08"));
console.log(Number("08"));
```

**Answer:** `7`, `8`, `8`

**Why:** Modern `parseInt` (ES5+) always defaults to base 10 unless the string has a `0x`/`0X` prefix, so `"07"` and `"08"` both parse as decimal `7` and `8` — there's no legacy octal-prefix confusion anymore (older engines used to guess octal for leading zeros, which is why explicitly passing a radix is still a defensive habit). `Number("08")` also parses as decimal `8` since `Number()` has never done octal auto-detection.

## 3.

```js
console.log("5" + 3);
console.log("5" - 3);
console.log("5" * "2");
```

**Answer:** `"53"`, `2`, `10`

**Why:** `+` is overloaded — if either operand is a string, it performs string concatenation. `-` and `*` (and `/`) are never overloaded for strings; they always coerce both operands to numbers first, so `"5" - 3` becomes `5 - 3 = 2` and `"5" * "2"` becomes `5 * 2 = 10`. `+` is the one arithmetic-looking operator that behaves completely differently depending on operand types.

## 4.

```js
console.log("abc".slice(-2));
console.log("abc".substring(-2));
console.log("abc".slice(1, -1));
```

**Answer:** `"bc"`, `"abc"`, `"b"`

**Why:** `slice` interprets a negative index as counting from the end of the string, so `-2` means "start 2 characters before the end," giving `"bc"`. `substring` clamps any negative argument to `0`, so `-2` becomes `0` and it returns the whole string. `slice(1, -1)` starts at index 1 and ends 1 character before the end, extracting just `"b"` from `"abc"`.

## 5.

```js
console.log(Number.isInteger(5.0));
console.log(Number.isInteger("5"));
console.log(Number.isSafeInteger(2 ** 53));
console.log(Number.isSafeInteger(2 ** 53 - 1));
```

**Answer:** `true`, `false`, `false`, `true`

**Why:** `5.0` is stored identically to the integer `5` (there's only one numeric type in JS), so `Number.isInteger` returns `true`. Unlike the legacy global `isFinite`/`isNaN`, `Number.isInteger` does not coerce strings, so `"5"` returns `false` outright. `Number.isSafeInteger` checks the value is within `±(2^53 - 1)`; `2^53` itself is just outside that safe range (it's the first integer that can collide with `2^53 + 1` due to precision loss), while `2^53 - 1` is exactly the boundary and still safe.

## 6.

```js
console.log(Math.max());
console.log(Math.min());
console.log(Math.max(1, "2", 3));
```

**Answer:** `-Infinity`, `Infinity`, `3`

**Why:** `Math.max` with no arguments returns `-Infinity` (the identity element for maximum — any real number is greater than it) and `Math.min` returns `Infinity` for the symmetric reason. `Math.max(1, "2", 3)` coerces `"2"` to the number `2` before comparing, so the result is the ordinary numeric max, `3`.

## 7.

```js
const arr = [1, 2, 3];
console.log(`Values: ${arr}`);
console.log(`Sum: ${arr.reduce((a, b) => a + b)}`);
```

**Answer:** `"Values: 1,2,3"` then `"Sum: 6"`

**Why:** Template literal interpolation coerces any expression to a string via the same mechanism as string concatenation; arrays convert to strings by joining their elements with commas (equivalent to calling `.join(",")`), so `arr` becomes `"1,2,3"`. `reduce` without an initial value uses the first element (`1`) as the starting accumulator and sums the rest, giving `6`, which then interpolates normally as a number-turned-string.

## 8.

```js
console.log("10" == 10);
console.log("10" === 10);
console.log(parseInt("10.5"));
console.log(parseFloat("10.5abc"));
```

**Answer:** `true`, `false`, `10`, `10.5`

**Why:** `==` coerces the string to a number before comparing, so `"10" == 10` is `true`; `===` requires matching types, so it's `false`. `parseInt` stops parsing at the decimal point since `.` isn't a valid integer digit, returning `10`. `parseFloat` understands decimal points and stops only at the first character that can't continue a valid number, returning `10.5` and ignoring the trailing `"abc"`.
