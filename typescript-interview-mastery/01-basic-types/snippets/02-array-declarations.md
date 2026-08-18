# Snippet: Array declaration styles

Shows `T[]`, `Array<T>`, and `readonly` arrays side by side to demonstrate they're interchangeable except for mutability.

```typescript
const tags: string[] = ["electronics", "sale"];
const ratings: Array<number> = [4.5, 3.8, 5.0];
const frozenCategories: readonly string[] = ["books", "toys"];

tags.push("clearance");        // fine — mutable
// frozenCategories.push("x"); // Error: Property 'push' does not exist on type 'readonly string[]'

const total = ratings.reduce((sum, r) => sum + r, 0);
console.log(total, tags, frozenCategories);
```
