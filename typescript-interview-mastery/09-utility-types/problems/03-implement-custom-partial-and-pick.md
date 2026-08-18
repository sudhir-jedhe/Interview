# Problem 3: Implement Your Own Partial and Pick from Scratch

## Task

Before you're told they're built-in utility types, implement `MyPartial<T>` and `MyPick<T, K>` as custom mapped types, matching the exact behavior of TypeScript's `Partial` and `Pick`. Then verify your implementations against a test type.

Requirements:
1. `MyPartial<T>` makes every property of `T` optional.
2. `MyPick<T, K>` produces an object type containing only the keys in `K`, where `K` must be constrained to valid keys of `T`.
3. Verify both against the `Product` type below with a few usage examples that would fail to compile if the implementation were wrong.

```typescript
interface Product {
  sku: string;
  name: string;
  priceCents: number;
  inStock: boolean;
}
```

## Solution

```typescript
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// --- Verification ---

type ProductPatch = MyPartial<Product>;
const patch: ProductPatch = { priceCents: 1999 }; // valid — every field optional
// const badPatch: ProductPatch = { color: "red" }; // Error: 'color' does not exist on ProductPatch

type ProductCard = MyPick<Product, "sku" | "name" | "priceCents">;
const card: ProductCard = { sku: "SKU1", name: "Widget", priceCents: 999 }; // valid
// const missingField: ProductCard = { sku: "SKU1", name: "Widget" };
// Error: Property 'priceCents' is missing

// type Invalid = MyPick<Product, "sku" | "color">;
// Error: Type '"color"' does not satisfy the constraint 'keyof Product'
```

**Why this works:** `MyPartial` maps over every key of `T` and adds `?` — the mapped type modifier that marks a property optional — while leaving the value type `T[K]` untouched. `MyPick` maps over `K` (a constrained subset of `keyof T`, enforced by `K extends keyof T`) rather than all of `keyof T`, so only the requested keys appear in the result, each with its original value type `T[P]` preserved via indexed access.

**Reveal:** These are, character-for-character, how TypeScript's actual `Partial<T>` and `Pick<T, K>` are defined in `lib.es5.d.ts`. There's no special compiler magic — utility types are ordinary mapped types you could have written yourself, which is exactly why you can extend the pattern to build things the standard library doesn't ship, like `MyPickByValue<T, V>` (pick keys whose *value type* extends `V`) or a recursive `DeepMyPartial<T>`.
