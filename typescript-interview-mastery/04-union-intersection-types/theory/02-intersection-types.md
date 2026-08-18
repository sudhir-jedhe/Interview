# Intersection Types

An intersection type (`A & B`) describes a value that must satisfy **all** of the combined types simultaneously — for object shapes, this means the resulting type has every property from every operand, merged into one flat requirement. Where unions represent "one of several alternatives," intersections represent "all of these requirements at once."

## Basic object intersection

```typescript
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Identifiable {
  id: string;
}

type AuditableRecord = Timestamped & Identifiable;

const record: AuditableRecord = {
  id: "rec-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

Every property from both `Timestamped` and `Identifiable` is required on `AuditableRecord` — the intersection merges the member sets rather than picking one or the other.

## Intersecting more than two types

Intersections chain naturally with `&`, combining any number of operands:

```typescript
interface SoftDeletable {
  deletedAt: Date | null;
}

type FullEntity = Timestamped & Identifiable & SoftDeletable;

const entity: FullEntity = {
  id: "rec-2",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
```

This "mixin composition" pattern — small, single-purpose object types combined via `&` — is the type-alias equivalent of `interface extends` with multiple base interfaces (see `02-interfaces-type-aliases/theory/05-extending-multiple-interfaces.md`), and is especially common for expressing cross-cutting concerns shared across many otherwise-unrelated entities.

## Conflicting primitive properties resolve to `never`

When two intersected object types declare the same property name with incompatible primitive types, the resulting property type is the intersection of those primitives — which, for genuinely incompatible types like `string & number`, has no possible value and resolves to `never`.

```typescript
type WithStringCode = { code: string };
type WithNumberCode = { code: number };

type Conflict = WithStringCode & WithNumberCode;
// Conflict is `{ code: never }` — code cannot be satisfied by any real value

// const bad: Conflict = { code: "x" }; // Error: Type 'string' is not assignable to type 'never'
```

This doesn't error at the point the intersection type is *declared* — only later, when you try to construct or assign a value of the conflicting type (covered in depth in `output-based/`).

## Intersecting primitives directly (not through objects)

Intersecting two genuinely incompatible primitive types directly also produces `never`, since no value can be both:

```typescript
type Impossible = string & number; // never
```

Intersecting compatible types (a literal with its general type) is more useful and produces the narrower literal:

```typescript
type ExactlyFive = number & 5; // effectively `5` — 5 is already a subtype of number
```

## Intersections of unions distribute

Intersecting a union with another type distributes the intersection across each union member — `(A | B) & C` becomes `(A & C) | (B & C)`. This matters when composing a union-typed value with an additional required shape, such as adding a shared `requestId` field to every possible API response variant, and is closely related to the discriminated-union patterns covered next.

```typescript
type Response = { status: "ok"; data: string } | { status: "error"; message: string };
type TrackedResponse = Response & { requestId: string };
// equivalent to:
// | { status: "ok"; data: string; requestId: string }
// | { status: "error"; message: string; requestId: string }
```
