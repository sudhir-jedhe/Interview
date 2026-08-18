# Snippet: Basic interface with optional and readonly fields

Shows a `Product` interface with a mix of required, optional, and readonly properties.

```typescript
interface Product {
  readonly sku: string;
  name: string;
  priceCents: number;
  description?: string;
}

const mouse: Product = {
  sku: "SKU-001",
  name: "Wireless Mouse",
  priceCents: 2999,
};

console.log(`${mouse.name}: $${(mouse.priceCents / 100).toFixed(2)}`);
```
