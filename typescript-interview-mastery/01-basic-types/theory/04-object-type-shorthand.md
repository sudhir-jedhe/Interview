# Object Type Shorthand

TypeScript lets you describe the shape of an object inline, without declaring a named `interface` or `type` first. This "object type literal" syntax is what you'll reach for constantly for one-off parameters, local variables, and quick prototyping before promoting a shape to a reusable named type.

## Inline object types

```typescript
function printUser(user: { id: number; name: string; email: string }): void {
  console.log(`${user.name} <${user.email}>`);
}

printUser({ id: 1, name: "Sudhir", email: "jedhesudhir@gmail.com" });
```

Every property listed is required and must match exactly by name and type (structurally — see below). Separate properties with `;` or `,` — both are accepted, but `;` is the more common convention and matches interface syntax.

## Optional and readonly modifiers work the same as in interfaces

```typescript
function createOrder(order: {
  readonly id: string;
  total: number;
  notes?: string;
}): void {
  // order.id = "new-id"; // Error: Cannot assign to 'id' because it is a read-only property
}

createOrder({ id: "ORD-1", total: 49.99 }); // notes omitted — fine, it's optional
```

## Nested object shorthand

Object types nest naturally — there's no special syntax needed, just more object literals:

```typescript
function shipPackage(payload: {
  destination: { city: string; zip: string };
  weightKg: number;
}): void {
  console.log(`Shipping ${payload.weightKg}kg to ${payload.destination.city}`);
}
```

For anything nested more than one level deep, or reused across multiple functions, extract it into a named `interface`/`type` instead — inline shapes that sprawl become unreadable and can't be reused or exported.

## Structural typing: shape matters, not the declared name

TypeScript's type system is **structural**, not nominal. An object satisfies a type if it has the required properties with compatible types — it doesn't matter what type (if any) it was originally declared with.

```typescript
interface Point2D {
  x: number;
  y: number;
}

function distanceFromOrigin(p: Point2D): number {
  return Math.sqrt(p.x ** 2 + p.y ** 2);
}

const point3D = { x: 3, y: 4, z: 5 };
distanceFromOrigin(point3D); // ok! `z` is extra, but all required fields are present

// Even a plain literal with more fields works — as long as it's not a *fresh object literal*
// passed directly (see excess property checks in output-based/03).
```

This is fundamentally different from languages like Java or C#, where a class must explicitly implement an interface. In TypeScript, "if it walks like a duck and quacks like a duck" is the rule — any value with a compatible shape is assignable, regardless of its declared origin.

## Index signatures for dynamic shapes

When property names aren't known ahead of time, object type shorthand supports index signatures inline too:

```typescript
function summarize(counts: { [key: string]: number }): number {
  return Object.values(counts).reduce((sum, n) => sum + n, 0);
}

summarize({ apples: 3, oranges: 5 }); // any string key works
```

(Index signatures are covered in depth in `02-interfaces-type-aliases`, since they're more commonly declared on named types.)

## When to use inline shapes vs named types

Use inline object type shorthand for: function parameters used in exactly one place, quick local variables, and generic constraints. Promote to a named `interface` or `type` alias as soon as the shape is reused more than once, exported across module boundaries, or complex enough that a name improves readability. There's no functional difference in the emitted JavaScript either way — it's purely a matter of code organization and error message clarity (named types produce cleaner compiler error messages than deeply nested inline literals).
