```typescript
// types/assets.d.ts
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const width: number;
  export const dimensions: { width: number; height: number };
}
```

```typescript
// component.ts
import logo, { dimensions } from "./logo.png";

console.log(logo.toUpperCase()); // (1)
console.log(dimensions.width);   // (2)
```

**Answer:** This compiles. Line (1) compiles (`logo` is typed `string`, and `.toUpperCase()` exists on `string`), and line (2) also compiles (`dimensions` is typed `{ width: number; height: number }`). Both `declare module "*.png"` blocks merge, contributing `default` and `dimensions` respectively to the same virtual module shape.

**Why:** Wildcard ambient module declarations (`"*.png"`) match any import specifier ending in `.png`, and like named ambient modules, repeated `declare module` blocks targeting the *same pattern string* merge their exports together rather than conflicting — exactly like the namespace-merging and class+namespace examples elsewhere in this topic. This is a real pattern in bundler-oriented `.d.ts` setups: different plugins or config files might contribute different pieces of a wildcard module's shape (one describing the default string export, another adding named metadata exports), and TypeScript combines them as long as both declarations are visible to the compiler. Note that the unused local `const width: number;` inside the second block has no effect outside its own declaration scope — only the `export`ed members (`dimensions`) become part of the module's public shape.
