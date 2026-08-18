# Extending Multiple Interfaces

An interface can extend more than one other interface at once, combining all their members into a single required shape — this is TypeScript's answer to "multiple inheritance" for types, though it's purely structural (no runtime behavior is inherited, only the shape requirement).

## Basic multi-extension

```typescript
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Identifiable {
  id: string;
}

interface Auditable {
  createdBy: string;
  updatedBy: string;
}

interface Invoice extends Timestamped, Identifiable, Auditable {
  amountCents: number;
  dueDate: Date;
}

const invoice: Invoice = {
  id: "INV-2026-001",
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "system",
  updatedBy: "system",
  amountCents: 45000,
  dueDate: new Date("2026-09-01"),
};
```

Every property from `Timestamped`, `Identifiable`, and `Auditable` becomes required on `Invoice`, in addition to `Invoice`'s own `amountCents` and `dueDate`. This is a common pattern for composing small, reusable "mixin" shapes (timestamps, audit fields, soft-delete flags) into concrete domain entities without duplicating field declarations across every entity interface.

## Conflicting members across extended interfaces

If two extended interfaces declare the same property name with *incompatible* types, TypeScript raises an error at the point where the child interface is declared — same eager-checking behavior as single-interface extension:

```typescript
interface HasStringId {
  id: string;
}

interface HasNumberId {
  id: number;
}

// interface Broken extends HasStringId, HasNumberId {}
// Error: Interface 'Broken' cannot simultaneously extend types 'HasStringId' and 'HasNumberId'.
// Named property 'id' of types 'HasStringId' and 'HasNumberId' are not identical.
```

If the property types are *compatible* (one is a subtype of the other, or they're structurally identical), no conflict occurs and the more specific type is not automatically chosen — they simply must already agree.

## Extending interfaces plus adding new required members

A common domain-modeling pattern: a narrow base interface extended by increasingly specific ones, each adding new required fields — modeling a permission hierarchy, for example:

```typescript
interface User {
  id: number;
  email: string;
}

interface Admin extends User {
  permissions: string[];
}

interface SuperAdmin extends Admin {
  canImpersonate: boolean;
}

function grantAccess(admin: Admin): void {
  console.log(`${admin.email} has permissions: ${admin.permissions.join(", ")}`);
}

const superAdmin: SuperAdmin = {
  id: 1,
  email: "root@example.com",
  permissions: ["*"],
  canImpersonate: true,
};

grantAccess(superAdmin); // ok — SuperAdmin structurally satisfies Admin (has all its fields, plus more)
```

Because TypeScript is structurally typed, `grantAccess(admin: Admin)` happily accepts a `SuperAdmin` value — it doesn't need to know about the `SuperAdmin` interface at all, it just checks that the value has every field `Admin` requires. This is the same structural-compatibility rule covered in `01-basic-types/theory/04-object-type-shorthand.md`, applied to interface hierarchies.

## Equivalent with type aliases

The same composition is expressed with intersections for type aliases:

```typescript
type InvoiceAlias = Timestamped & Identifiable & Auditable & {
  amountCents: number;
  dueDate: Date;
};
```

Functionally equivalent for well-behaved (non-conflicting) shapes; the key practical difference remains the eager-vs-lazy conflict detection covered in `02-declaration-merging-and-extension.md`.
