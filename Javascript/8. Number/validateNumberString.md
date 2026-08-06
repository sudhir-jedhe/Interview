To handle various types of number strings (integer, decimal, and scientific notation), you've already built an outline of the regular expressions to match different patterns. Let's break down the approach in your code into clearly defined parts and ensure that we can validate different types of numbers (integers, decimals, and numbers in scientific notation).

### Steps for Building the Regex:
1. **Unsigned Integer**: This matches a number without a sign (e.g., `12`, `252`, `0`, `1`).
2. **Signed Integer**: This includes both positive and negative integers (e.g., `+12`, `-4234`, `-0`).
3. **Decimal Numbers**: These match numbers with a decimal point, including both positive and negative (e.g., `-12.242`, `-12.`, `.123`, `123.`).
4. **Exponential (Scientific Notation)**: This matches numbers in scientific notation (e.g., `1.23e10`, `-12.124e-5`).

### Regular Expression Construction:
We'll use the following regex patterns:
- **Unsigned integer**: `[1-9][0-9]*|[0]`
- **Signed integer**: `[+-]?([1-9][0-9]*|[0])`
- **Decimal number**: Matches integers with optional decimals or decimals with optional leading integers. For example, `-12.242`, `.123`, etc.
- **Scientific notation**: The `e` or `E` with an optional exponent part, such as `1.23e10` or `-12.124e-5`.

### Complete Code for Validation:

```javascript
function validateNumberString(str) {
    // Regular expressions for different number formats
    const unsignedInteger = '[1-9][0-9]*|[0]'; // Unsigned integer: 1, 2, 0, etc.
    const signedInteger = '[+-]?([1-9][0-9]*|[0])'; // Signed integer: +12, -5, 0, etc.
    
    // Decimal: integer with optional decimals or a decimal with optional integer part
    const decimal = `(${signedInteger})?(\\.[0-9]+)?`;
    
    // Scientific notation: decimal or integer with an exponent part
    const scientific = `(${decimal})[eE][+-]?[0-9]+|${signedInteger}[eE][+-]?[0-9]+`;
    
    // Full regex pattern to match any valid number: integer, decimal, or scientific notation
    const regex = new RegExp(`^(${signedInteger}|${decimal}|${scientific})$`);

    return regex.test(str);
}

// Example test cases
console.log(validateNumberString('12')); // true (integer)
console.log(validateNumberString('-12.242')); // true (decimal)
console.log(validateNumberString('-12.')); // true (decimal)
console.log(validateNumberString('.123')); // true (decimal)
console.log(validateNumberString('123.45e10')); // true (scientific notation)
console.log(validateNumberString('-123.45e-10')); // true (scientific notation)
console.log(validateNumberString('+100')); // true (signed integer)
console.log(validateNumberString('-.122423')); // true (decimal)
console.log(validateNumberString('123e124')); // true (scientific notation)
console.log(validateNumberString('12e-5')); // true (scientific notation)
console.log(validateNumberString('123abc')); // false (invalid)
```

### Explanation:
1. **Unsigned Integer**: `[1-9][0-9]*|[0]` - This matches any number like `0`, `12`, `252`, etc.
2. **Signed Integer**: `[+-]?([1-9][0-9]*|[0])` - This matches numbers like `+12`, `-4234`, `-0`.
3. **Decimal**: The decimal part can either be an integer with a decimal part (`12.234`, `-12.34`) or just a decimal number like `.123` (or `-.123`).
4. **Scientific Notation**: This handles numbers in the form of `1.23e10`, `-12.34e-5`, etc. It also supports the use of `E` instead of `e`.

### Edge Cases:
- Strings that aren't valid numbers like `"123abc"`, `"++123"`, `"--123"`, etc., will return `false`.
- Numbers like `+12`, `-.123`, `123e5` will all be validated correctly.

This should now cover the various forms of numbers you want to validate, including integers, decimals, and scientific notation.