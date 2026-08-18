# Problem: Implement a number formatter with thousands separators (no `toLocaleString`)

Implement `formatNumber(num, separator = ",")` that inserts a separator every three digits in the integer part, correctly handles negative numbers and decimals, without using `Number.prototype.toLocaleString` or `Intl.NumberFormat`.

## Requirements

- `formatNumber(1234567)` → `"1,234,567"`
- `formatNumber(-1234567.891)` → `"-1,234,567.891"`
- `formatNumber(999)` → `"999"` (no separator needed)
- `formatNumber(1000, " ")` → `"1 000"` (custom separator)

## Solution

```js
function formatNumber(num, separator = ",") {
  const isNegative = num < 0;
  const [integerPart, decimalPart] = Math.abs(num).toString().split(".");

  let formattedInteger = "";
  for (let i = 0; i < integerPart.length; i++) {
    const positionFromEnd = integerPart.length - i;
    formattedInteger += integerPart[i];
    // insert a separator after this digit if there are more digits left
    // and we've just completed a group of 3 counting from the end
    if (positionFromEnd > 1 && (positionFromEnd - 1) % 3 === 0) {
      formattedInteger += separator;
    }
  }

  const sign = isNegative ? "-" : "";
  const decimals = decimalPart ? `.${decimalPart}` : "";
  return `${sign}${formattedInteger}${decimals}`;
}

console.log(formatNumber(1234567));           // "1,234,567"
console.log(formatNumber(-1234567.891));      // "-1,234,567.891"
console.log(formatNumber(999));               // "999"
console.log(formatNumber(1000, " "));         // "1 000"
console.log(formatNumber(0));                 // "0"
console.log(formatNumber(100000000));         // "100,000,000"
```

## Why it works

- `Math.abs(num)` strips the sign so the grouping logic doesn't have to think about `-`; the sign is re-added at the very end from a separately-tracked `isNegative` flag.
- Splitting on `"."` separates the integer part (which gets grouped) from the decimal part (which is never grouped — thousands separators only apply to the whole-number portion).
- The loop walks the integer-part string left to right, and after appending each digit it checks `positionFromEnd`: the number of digits *including this one* still remaining from the current position to the end. A separator goes in whenever that count is a multiple of 3 and there's at least one more digit still to come (`positionFromEnd > 1` prevents a trailing separator after the very last digit).
- Building the string digit-by-digit avoids needing to `reverse()` a string (JS strings have no built-in reverse — you'd have to go through an array anyway), so this approach is arguably simpler than the common "reverse, group, reverse back" technique.

## Alternative: regex-based (no explicit loop)

```js
function formatNumberRegex(num, separator = ",") {
  const isNegative = num < 0;
  const [integerPart, decimalPart] = Math.abs(num).toString().split(".");
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return `${isNegative ? "-" : ""}${grouped}${decimalPart ? "." + decimalPart : ""}`;
}

console.log(formatNumberRegex(1234567)); // "1,234,567"
```

`\B(?=(\d{3})+(?!\d))` finds every position that is *not* a word boundary (`\B`, i.e. strictly between two digits) where the remaining digits ahead form complete groups of three (`(?=(\d{3})+(?!\d))`), and inserts the separator there — a common but denser one-liner worth recognizing in interviews even if the explicit loop above is easier to explain live.
