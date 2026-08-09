```js
export const sumNumbers = (str) => {
  if (!str) return 0;

  const nums = str.split(",");

  return nums.reduce((acc, num) => acc + parseInt(num), 0);
};

sumNumbers(""); // Output: 0
sumNumbers("1,2,3,4,5"); // Output: 15
sumNumbers("0,0,1,2,2"); // Output: 5
sumNumbers("10,-20,30,-40,50"); // Output: 30
```

Your `sumNumbers` utility is clean and works as expected for basic comma-separated integer strings.

However, there are a few subtle bugs regarding **radix parsing**, **empty segments**, and **floating-point numbers** that can lead to unexpected results in production.

---

### Critical Issues & Edge Case Bugs

#### 1. Missing Radix in `parseInt`

Calling `parseInt(num)` without explicitly specifying base 10 (`parseInt(num, 10)`) can cause unexpected parsing:

* Strings with leading zeros like `"08"` or `"09"` used to be parsed as octal (`0`) in older engines or legacy strict mode fallbacks.
* Strings starting with `"0x"` will be parsed as Hexadecimal (e.g., `parseInt("0x10")` returns `16` instead of `0`).

#### 2. The Trailing/Empty Comma Bug (`"1,,2"` or `"1,2,"`)

If the string contains trailing or consecutive commas:

* `"1,2,".split(",")` $\rightarrow$ `["1", "2", ""]`
* `parseInt("")` $\rightarrow$ `NaN`
* Adding `NaN` in `.reduce()` breaks the entire accumulation and returns `NaN`.

#### 3. Handling Floating Point Numbers (`"1.5,2.5"`)

Because `parseInt("1.5")` truncates decimals and returns `1`, calling `sumNumbers("1.5,2.5")` evaluates to `3` instead of `4`. `Number()` or `parseFloat()` handles floats correctly.

---

### Refactored & Robust Implementation

Here is a production-safe version using `Number()` or unary `+` with a filter to drop empty/invalid segments:

```javascript
/**
 * Sums comma-separated numbers in a string.
 * 
 * @param {string} str - Comma-separated number string (e.g., "1, 2, 3")
 * @returns {number} Sum of all valid numbers
 */
export const sumNumbers = (str) => {
  if (!str || typeof str !== "string") return 0;

  return str
    .split(",")
    .reduce((acc, current) => {
      const trimmed = current.trim();
      
      // Skip empty segments (e.g. trailing or double commas)
      if (trimmed === "") return acc;

      const num = Number(trimmed);
      
      // Ignore NaN values if bad input is passed
      return Number.isNaN(num) ? acc : acc + num;
    }, 0);
};

// --- Test Matrix ---

console.log(sumNumbers(""));                 // 0
console.log(sumNumbers("1,2,3,4,5"));        // 15
console.log(sumNumbers("10,-20,30,-40,50")); // 30

// Edge Cases Handled Safely:
console.log(sumNumbers("1, 2, 3"));          // 6  (Handles whitespace)
console.log(sumNumbers("1,,2,"));            // 3  (Ignores empty trailing commas)
console.log(sumNumbers("1.5, 2.5"));         // 4  (Handles floating point decimals)
console.log(sumNumbers("1, foo, 2"));        // 3  (Safely skips non-numeric text)

```

---

### Comparison Summary

| Input         | Original Output | Refactored Output | Behavior Note                                               |
| ------------- | --------------- | ----------------- | ----------------------------------------------------------- |
| `"1,2,3"`     | `6`             | `6`               | Valid input                                                 |
| `"1, 2, 3"`   | `6`             | `6`               | `parseInt` ignored leading spaces; `Number` needs `.trim()` |
| `"1,,2,"`     | `NaN` ❌         | `3` ✅             | Refactored version ignores empty items                      |
| `"1.5, 2.5"`  | `3` (Truncated) | `4` ✅             | Handles decimals correctly                                  |
| `"1, abc, 2"` | `NaN` ❌         | `3` ✅             | Filters out invalid tokens safely                           |
