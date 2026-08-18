# Snippet: Intersecting two object shapes

Shows two small interfaces combined with `&` into a single required shape.

```typescript
interface HasId {
  id: string;
}

interface HasName {
  name: string;
}

type NamedEntity = HasId & HasName;

const product: NamedEntity = { id: "p-1", name: "Wireless Mouse" };
console.log(`${product.id}: ${product.name}`);
```
