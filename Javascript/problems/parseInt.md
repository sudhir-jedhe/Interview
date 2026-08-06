The `parseInt()` function in JavaScript converts a string or number into an integer by parsing the value from left to right. It optionally takes a second argument, the `radix`, which specifies the base (like 10 for decimal, 16 for hexadecimal, etc.). If the radix is not provided, it defaults to base 10, but this can be influenced by the input string format.

Let's walk through the various cases in your code to understand what will happen:

### 1. `parseInt(" 1")`

- The `parseInt()` function parses the string `" 1"`, which has a leading whitespace, and ignores the whitespace.
- **Result**: `1`

### 2. `parseInt(" 00001")`

- Here, the input string `" 00001"` contains leading zeros. However, since no explicit radix is provided, it will be interpreted in base 10, and the leading zeros will be ignored.
- **Result**: `1`

### 3. `parseInt(" 0100")`

- The string `" 0100"` starts with a space and then has a leading zero. In JavaScript, a leading zero typically suggests an octal (base 8) in older versions of JavaScript, but in modern JavaScript engines, this is interpreted as base 10 (unless a radix is specified).
- **Result**: `100`

### 4. `parseInt(" 1e2 ")`

- The input string `" 1e2 "` contains a scientific notation (`1e2`), which represents the number `100`. The space is ignored, and the scientific notation is parsed as `100`.
- **Result**: `100`

### 5. `parseInt(0.00001)`

- The input is a floating-point number `0.00001`, but `parseInt()` only cares about the integer part of the number. It ignores the fractional part.
- **Result**: `0`

### 6. `parseInt(0.000001)`

- Similarly, `parseInt(0.000001)` is treated as `0`. The fractional part is ignored.
- **Result**: `0`

### 7. `parseInt(0.0000001)`

- Again, the integer part is `0`.
- **Result**: `0`

### 8. `parseInt("0x12")`

- The string `"0x12"` represents a hexadecimal number (`0x` is a common prefix for hex values). `parseInt()` automatically interprets this as base 16.
- `0x12` in hexadecimal is equal to `18` in decimal.
- **Result**: `18`

### 9. `parseInt("1e2")`

- The string `"1e2"` is interpreted as scientific notation, representing `100` in decimal (since `1e2` equals `1 * 10^2`).
- **Result**: `100`

### 10. `["0"].map(parseInt)`

This is a trickier case because of how `Array.prototype.map()` works. `map()` passes three arguments to the callback: the current element, the index, and the array itself.

In this case, the element is `"0"`, the index is `0`, and the array is `["0"]`. When `parseInt` is called inside `map()`, it receives the index as the second argument (`radix`).

- `parseInt("0", 0)` is equivalent to `parseInt("0", 10)`, so it parses `"0"` as base 10.
- **Result**: `[0]`

### 11. `["0", "1"].map(parseInt)`

Again, `map()` passes the index as the `radix` to `parseInt`. So, for each element in the array:

- `parseInt("0", 0)` → base 10, resulting in `0`
- `parseInt("1", 1)` → base 1, which is invalid because base 1 is not supported.
- **Result**: `[0, NaN]`

### 12. `["0", "1", "1"].map(parseInt)`

For each element in the array:

- `parseInt("0", 0)` → base 10, resulting in `0`
- `parseInt("1", 1)` → base 1, which is invalid.
- `parseInt("1", 2)` → base 2, so it parses `"1"` as binary (`1` in binary equals `1` in decimal).
- **Result**: `[0, NaN, 1]`

### 13. `["0", "1", "1", "1"].map(parseInt)`

For each element in the array:

- `parseInt("0", 0)` → base 10, resulting in `0`
- `parseInt("1", 1)` → base 1, which is invalid.
- `parseInt("1", 2)` → base 2, so it parses `"1"` as binary (`1` in binary equals `1` in decimal).
- `parseInt("1", 3)` → base 3, so it parses `"1"` as base 3 (`1` in base 3 equals `1` in decimal).
- **Result**: `[0, NaN, 1, 1]`

### Final Output:

```javascript
console.log(parseInt(" 1")); // 1
console.log(parseInt(" 00001")); // 1
console.log(parseInt(" 0100")); // 100
console.log(parseInt(" 1e2 ")); // 100

console.log(parseInt(0.00001)); // 0
console.log(parseInt(0.000001)); // 0
console.log(parseInt(0.0000001)); // 0
console.log(parseInt("0x12")); // 18
console.log(parseInt("1e2")); // 100

console.log(["0"].map(parseInt)); // [0]
console.log(["0", "1"].map(parseInt)); // [0, NaN]
console.log(["0", "1", "1"].map(parseInt)); // [0, NaN, 1]
console.log(["0", "1", "1", "1"].map(parseInt)); // [0, NaN, 1, 1]
```

### Summary:

- **`parseInt()`** is versatile but has some quirks, especially with how it handles numbers in different bases.
- It **ignores leading spaces** and **parses scientific notation** correctly.
- When used with **`map()`**, the **second argument (index)** becomes the `radix`, which can lead to unexpected results if you're not careful.

**`parseInt()`** is a built-in JavaScript function that parses a string argument and converts it into an integer of a specified radix (base).

---

## Syntax

```javascript
parseInt(string, radix);
```

- **`string`**: The value to parse. If it is not a string, JavaScript converts it to a string first (`String(value)`). Leading whitespace is ignored.
- **`radix`** _(Optional but strongly recommended)_: An integer between `2` and `36` representing the numeral system (base) to use.
- `10` = Decimal (standard 0-9)
- `2` = Binary (0-1)
- `16` = Hexadecimal (0-9, A-F)
- `8` = Octal (0-7)

---

## Basic Examples

```javascript
// Decimal parsing (Radix 10)
parseInt("42", 10); // 42
parseInt("42.99", 10); // 42 (Truncates decimals, does NOT round)
parseInt("   100  ", 10); // 100 (Strips leading/trailing whitespace)

// Non-decimal bases
parseInt("1010", 2); // 10 (Binary -> Decimal)
parseInt("FF", 16); // 255 (Hexadecimal -> Decimal)
parseInt("010", 8); // 8 (Octal -> Decimal)
```

---

## Important Rules & Quirks

### 1. Stops at the First Non-Digit Character

`parseInt` reads from left to right and stops as soon as it encounters a character that is invalid for the specified radix:

```javascript
parseInt("123hello", 10); // 123
parseInt("12px34", 10); // 12 (Stops at 'p')
parseInt("hello123", 10); // NaN (Starts with 'h', which is invalid)
```

### 2. Returns `NaN` if First Character Cannot Be Parsed

If the very first non-whitespace character cannot be converted to a number, it returns `NaN` (Not-a-Number):

```javascript
parseInt("abc", 10); // NaN
parseInt("", 10); // NaN
```

### 3. Always Specify the `radix`

If you omit the `radix` parameter, JavaScript guesses the base based on the string prefix:

- If the string starts with `"0x"` or `"0X"`, radix defaults to `16` (Hexadecimal).
- Otherwise, radix defaults to `10` (Decimal).

```javascript
parseInt("0x10"); // 16 (Interpreted as Hexadecimal)
parseInt("10"); // 10 (Interpreted as Decimal)

// Explicit radix prevents unexpected behavior:
parseInt("0x10", 10); // 0 (Stops at 'x')
```

---

## Common Pitfall: `Array.prototype.map`

Passing `parseInt` directly as a callback to `Array.prototype.map` is a famous JavaScript trap because `map` passes three arguments to its callback: `(element, index, array)`. `parseInt` interprets the `index` as the `radix`:

```javascript
["10", "10", "10", "10"].map(parseInt);
// Output: [10, NaN, 2, 3]

/* Explanation:
 * parseInt('10', 0) -> 10 (radix 0 defaults to base 10)
 * parseInt('10', 1) -> NaN (radix 1 is invalid)
 * parseInt('10', 2) -> 2   (base 2: '10' binary = 2)
 * parseInt('10', 3) -> 3   (base 3: '10' ternary = 3)
 */

// Fix: Wrap parseInt in an explicit function
["10", "10", "10", "10"].map((str) => parseInt(str, 10));
// Output: [10, 10, 10, 10]
```

---

## `parseInt` vs `Number()` vs `parseFloat()`

| Method                  | `"42px"` | `"42.99"` | `""`  | `null` | `true` |
| ----------------------- | -------- | --------- | ----- | ------ | ------ |
| **`parseInt(str, 10)`** | `42`     | `42`      | `NaN` | `NaN`  | `NaN`  |
| **`parseFloat(str)`**   | `42`     | `42.99`   | `NaN` | `NaN`  | `NaN`  |
| **`Number(str)`**       | `NaN`    | `42.99`   | `0`   | `0`    | `1`    |
