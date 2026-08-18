# Declaration Merging and Extension

This is the sharpest, most interview-relevant distinction between `interface` and `type`: interfaces can be declared multiple times and automatically merge; type aliases cannot be redeclared at all. Extension (building a new shape on top of an existing one) is also spelled differently for each.

## Declaration merging (interfaces only)

If you declare an `interface` with the same name more than once in the same scope, TypeScript merges all the declarations' members into a single interface, rather than raising a duplicate-identifier error.

```typescript
interface Window {
  analyticsQueue: unknown[];
}

interface Window {
  featureFlags: Record<string, boolean>;
}

// The effective merged shape now requires BOTH properties wherever `Window` is used.
declare const win: Window;
win.analyticsQueue.push({ event: "page_view" });
win.featureFlags["newCheckout"];
```

This is exactly the mechanism behind "module augmentation" — extending a third-party library's types without modifying its source. A common real example is adding custom properties to Express's `Request`:

```typescript
// In a .d.ts file, augmenting an existing library interface:
declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: number; role: string };
    }
  }
}
```

## Type aliases cannot merge

```typescript
type Config = { env: string };
// type Config = { region: string }; // Error: Duplicate identifier 'Config'
```

Attempting this is always a compile error — there is no equivalent mechanism for type aliases. If you need to combine two type aliases, you do it explicitly with an intersection (`&`), producing a *new* named type rather than mutating the original one in place.

## Extending: `extends` (interfaces) vs `&` (type aliases)

Interfaces extend other interfaces with the `extends` keyword, which can also extend `type` aliases that resolve to object shapes:

```typescript
interface BaseEntity {
  id: number;
  createdAt: Date;
}

interface Product extends BaseEntity {
  name: string;
  priceCents: number;
}

const laptop: Product = {
  id: 1,
  createdAt: new Date(),
  name: "Laptop",
  priceCents: 129900,
};
```

Type aliases achieve the equivalent result with an intersection:

```typescript
type BaseEntityAlias = { id: number; createdAt: Date };
type ProductAlias = BaseEntityAlias & { name: string; priceCents: number };
```

## A subtle but real difference: conflicting members

`interface extends` will raise a compile error immediately if a child interface redeclares an inherited property with an incompatible type — this is checked eagerly and gives a clear error message. Type alias intersection (`&`) instead resolves a property present in both operands with conflicting primitive types to `never` for that property, which often surfaces confusingly later, at the point of *use*, rather than at the point of definition.

```typescript
interface A { value: string; }
// interface B extends A { value: number; } // Error immediately: Interface 'B' incorrectly extends interface 'A'

type C = { value: string };
type D = C & { value: number }; // No error here...
// const d: D = { value: "x" }; // ...but this fails: 'value' is type `never`, unsatisfiable
```

This is a genuine ergonomic advantage of `interface extends` for catching shape conflicts early, and is a common "gotcha" question in interviews.

## Practical rule of thumb

Use `interface` + `extends` when building layered domain models (base entity → specific entity types) where you want early, clear errors on incompatible overrides, and especially when the shape might need augmentation later (library types, ambient globals). Use `type` + `&` when combining several independent shapes into a composite, especially mixins that aren't meant to form a strict inheritance hierarchy.
