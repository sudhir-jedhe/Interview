# Scenario: Formatting currency correctly despite floating-point errors

You're building a shopping cart that sums line item prices (e.g., `19.99`, `5.50`, `3.33`) and displays a total. Users occasionally report totals that look like `$28.82000000000001` or off-by-a-cent totals. How do you fix this robustly?

**Approach:** The root problem is doing float arithmetic directly on decimal currency values. The fix is either to work in integer cents throughout the calculation and only convert to dollars for display, or to round consistently before display:

```js
function toCents(dollars) { return Math.round(dollars * 100); }
function toDollars(cents) { return (cents / 100).toFixed(2); }

const items = [19.99, 5.50, 3.33];
const totalCents = items.reduce((sum, price) => sum + toCents(price), 0);
console.log(`$${toDollars(totalCents)}`); // "$28.82"
```

Doing `.reduce((a, b) => a + b)` directly on the float dollar amounts and only calling `.toFixed(2)` at the very end also mostly works for *display*, but integer-cents arithmetic is safer because it avoids compounding rounding error across many additions before you ever round — critical if the total feeds into further calculations (tax, discounts) rather than just being displayed once. Edge case: `toFixed` rounds, it doesn't truncate, so `1.005.toFixed(2)` can actually give `"1.00"` due to how `1.005` is stored in floating point — another reason to prefer integer-cent math for anything beyond final display.
