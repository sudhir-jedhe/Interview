```typescript
// tsconfig: strict: false
interface Product {
  id: string;
  price: number;
}

function findProduct(id: string, products: Product[]): Product {
  return products.find((p) => p.id === id);
}

const p = findProduct("x1", []);
console.log(p.price.toFixed(2));
```

Does this compile under `strict: false`? What happens if it's run with `products = []`?

**Answer:** Yes, it compiles cleanly under `strict: false`. At runtime with an empty `products` array, `findProduct` returns `undefined`, and `p.price.toFixed(2)` throws `TypeError: Cannot read properties of undefined (reading 'price')`.

**Why:** `Array.prototype.find` has the real signature `(predicate) => T | undefined`. Without `strictNullChecks` (part of `strict`), TypeScript treats `undefined` as assignable to any type, including the declared return type `Product`, so the mismatched `return` statement produces no error. Enabling `strict: true` would report `Type 'Product | undefined' is not assignable to type 'Product'` directly on the `return` line, forcing you to either change the return type to `Product | undefined` and handle the missing case at every call site, or throw when nothing is found.
