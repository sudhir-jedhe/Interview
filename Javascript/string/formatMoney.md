```js
formatMoney(123); // Output: $123.00
formatMoney(0); // Output: $0.00
formatMoney(12.23); // Output: $12.23
formatMoney(123.4123); // Output: $123.41
formatMoney(100000000); // Output: $100,000,000.00

export const formatMoney = (amount) => {
  return (
    "$" +
    amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};
```

Your `formatMoney` function is clean, functional, and leverages JavaScript's native `toLocaleString()` method well.

However, there are **two key improvements** you should consider for production: using `Intl.NumberFormat` directly to handle currency symbols automatically, and handling non-numeric edge cases (`NaN`, `null`, `undefined`, negative numbers).

---

### 1. The Modern & Canonical Way (`Intl.NumberFormat`)

Instead of hardcoding `"$"`, `Intl.NumberFormat` allows you to format currency natively according to any locale and currency standard:

```javascript
/**
 * Formats a number as a currency string.
 * @param {number} amount - The amount to format.
 * @param {string} currency - ISO 4217 currency code (default: 'USD').
 * @param {string} locale - BCP 47 language tag (default: 'en-US').
 * @return {string} Formatted money string.
 */
export const formatMoney = (amount, currency = 'USD', locale = 'en-US') => {
  const num = Number(amount);
  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// --- Tests ---
console.log(formatMoney(123));       // Output: "$123.00"
console.log(formatMoney(0));         // Output: "$0.00"
console.log(formatMoney(12.23));     // Output: "$12.23"
console.log(formatMoney(123.4123));  // Output: "$123.41"
console.log(formatMoney(100000000)); // Output: "$100,000,000.00"

```

---

### 2. Performance Optimization for High-Frequency Calls

Constructing a new `Intl.NumberFormat` instance inside the function body on every single call can be slow if you format thousands of numbers (e.g., in table rows or large lists).

**Optimization:** Re-use a single `Intl.NumberFormat` instance outside the function scope:

```javascript
const USDFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatMoneyFast = (amount) => {
  const num = Number(amount);
  return isNaN(num) ? '$0.00' : USDFormatter.format(num);
};

```

---

### Handling Edge Cases

| Input                    | Your Code           | `Intl.NumberFormat` (Fixed) | Reason                                                       |
| ------------------------ | ------------------- | --------------------------- | ------------------------------------------------------------ |
| **`-123.45`**            | `"$-123.45"`        | `"-$123.45"`                | Currency symbol should follow the negative sign in US format |
| **`"123"` (String)**     | `"$123.00"`         | `"$123.00"`                 | Safely coerced via `Number(amount)`                          |
| **`null` / `undefined**` | Error (`TypeError`) | `"$0.00"`                   | Safe fallback for missing data                               |
| **`NaN`**                | `"$NaN"`            | `"$0.00"`                   | Graceful fallback                                            |
