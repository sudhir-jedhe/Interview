# Parameter properties shorthand

```typescript
// TS auto-declares and assigns fields flagged in the constructor signature
class Product {
  constructor(
    public readonly sku: string,
    private price: number
  ) {}

  getPrice(): number {
    return this.price;
  }
}

const p = new Product("SKU-1", 29.99);
console.log(p.sku, p.getPrice());
```
