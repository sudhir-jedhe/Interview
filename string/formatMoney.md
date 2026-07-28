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
