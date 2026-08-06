The code you've provided is an excellent way to format currency values using the `Intl.NumberFormat` API, which is built into JavaScript for handling internationalization. Let's walk through your code and explain it step by step.

### Function: `formatCurrency`

```javascript
function formatCurrency(amount, currencyCode = "USD", locale = "en-US") {
  if (typeof amount !== "number") {
    throw new Error("Amount must be a number.");
  }

  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);

  return formattedAmount;
}
```

#### Parameters:

1. **`amount`**: The value to format, e.g., `12345.6789`.
2. **`currencyCode`**: A string representing the currency code, defaulting to `'USD'`. This is the ISO 4217 currency code (e.g., `'EUR'`, `'GBP'`, `'JPY'`, etc.).
3. **`locale`**: A string representing the locale for formatting the currency. It defaults to `'en-US'`, which will format the currency according to the conventions of the United States (e.g., `$12,345.68`).

#### Inside the Function:

1. **Type Checking**:
   The function first checks if the `amount` is a number. If not, it throws an error.

   ```javascript
   if (typeof amount !== "number") {
     throw new Error("Amount must be a number.");
   }
   ```

2. **Currency Formatting**:
   The `Intl.NumberFormat` object is used to format the number into a currency string. The options object specifies the `style: 'currency'` and the currency using `currency: currencyCode`.

   ```javascript
   const formattedAmount = new Intl.NumberFormat(locale, {
     style: "currency",
     currency: currencyCode,
   }).format(amount);
   ```

3. **Return**: The formatted currency string is returned.
   ```javascript
   return formattedAmount;
   ```

---

### Example Usage:

```javascript
const price = 12345.6789;
const formattedPrice = formatCurrency(price, "USD", "en-US");
console.log(formattedPrice); // Output: $12,345.68
```

- In this example, you are passing a price of `12345.6789`, and formatting it as USD (`'USD'`) using the locale `'en-US'`.
- The result is `$12,345.68`, which is the expected format for US dollars.

---

### Edge Cases:

1. **Invalid Amount**:
   If you pass a non-numeric value as `amount`, the function will throw an error. For example:

   ```javascript
   formatCurrency("not-a-number"); // Throws error: Amount must be a number.
   ```

2. **Different Currency and Locale**:
   You can use different currencies and locales. For example:

   ```javascript
   const formattedPriceEuro = formatCurrency(price, "EUR", "de-DE");
   console.log(formattedPriceEuro); // Output: 12.345,68 €
   ```

   This formats the same amount for the Euro currency (`'EUR'`) and the German locale (`'de-DE'`), resulting in the format `12.345,68 €`.

3. **Rounding**:
   The formatter automatically handles rounding to two decimal places for currencies. In the case of `'USD'`, it will round to `2` decimals. You can change this behavior by modifying the `minimumFractionDigits` or `maximumFractionDigits` options if needed.

---

### Summary:

This is a clean and efficient way to format currency values in JavaScript. The `Intl.NumberFormat` API is powerful and supports different locales, currencies, and various formatting options, making it ideal for internationalization. Your function covers the basics and ensures proper type handling for the `amount` parameter.
