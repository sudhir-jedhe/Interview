# What's the error here?

```typescript
interface Product {
  id: number;
  name: string;
  priceCents: number;
}

function createProduct(data: Product): Product {
  return data;
}

const laptop = createProduct({
  id: 1,
  name: "Laptop",
  priceCents: 129900,
  discountPercent: 10,
});
```

**Answer:** This fails to compile: `Object literal may only specify known properties, and 'discountPercent' does not exist in type 'Product'.`

**Why:** This is TypeScript's **excess property check**, which only applies to **fresh object literals** passed directly where a specific type is expected — not to structural compatibility in general. Structurally, an object with an extra `discountPercent` field would normally still satisfy `Product` (having more properties than required is fine under structural typing, as shown in `01-basic-types/theory/04-object-type-shorthand.md`). But when you write the object literal *inline* at the call site, TypeScript assumes any property not in the target type is likely a typo or a misunderstanding of the shape, and flags it eagerly. The check disappears if you assign the literal to a variable first: `const data = { id: 1, name: "Laptop", priceCents: 129900, discountPercent: 10 }; createProduct(data);` compiles fine, because `data` is no longer a "fresh" literal at the call site — it's a variable whose type is independently inferred and merely checked for structural compatibility (which passes, since it's a superset).
