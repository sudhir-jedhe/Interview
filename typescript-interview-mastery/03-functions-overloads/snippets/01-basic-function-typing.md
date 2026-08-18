# Snippet: Basic parameter and return type annotations

Shows a standalone function and an equivalent arrow function with explicit annotations.

```typescript
function calculateTotal(priceCents: number, quantity: number): number {
  return priceCents * quantity;
}

const calculateTax = (total: number, rate: number): number => total * rate;

const subtotal = calculateTotal(1999, 3);
const tax = calculateTax(subtotal, 0.08);

console.log(`Subtotal: ${subtotal}, Tax: ${tax.toFixed(2)}`);
```
