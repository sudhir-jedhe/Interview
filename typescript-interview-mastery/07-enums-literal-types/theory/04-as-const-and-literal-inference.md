# as const and Literal Type Inference

By default, TypeScript widens literal values assigned to mutable bindings to their general type — a `const greeting = "hi"` variable is narrowed to the literal type `"hi"` only because `const` means it can never be reassigned, but object and array literals don't get this treatment automatically, because their *properties* remain mutable even if the outer binding is `const`.

```typescript
const status = "active";        // type: "active" (const binding, primitive — narrow)
const config = { env: "prod" }; // type: { env: string } (property is mutable — widened)

let level = "high";             // type: string (let, always widened)
```

## What `as const` does

Appending `as const` to an expression tells TypeScript to infer the *narrowest possible* type for everything inside it — every property becomes `readonly`, every string/number/boolean literal keeps its exact literal type instead of widening, and arrays become readonly tuples instead of mutable arrays.

```typescript
const config = { env: "prod" } as const;
// type: { readonly env: "prod" }

const rgb = [255, 0, 0] as const;
// type: readonly [255, 0, 0] — a fixed-length tuple, not number[]

config.env = "dev"; // Error: readonly property
rgb.push(10);         // Error: push doesn't exist on a readonly tuple
```

## Deriving a union type from an array with as const

A common pattern: declare a single source-of-truth array of allowed values with `as const`, then derive a literal union type from it using indexed access with `number` (or, for a tuple, `typeof array[number]` pulls the union of every element type out of the tuple).

```typescript
const ROLES = ["admin", "editor", "viewer"] as const;
// ROLES: readonly ["admin", "editor", "viewer"]

type Role = typeof ROLES[number];
// Role = "admin" | "editor" | "viewer"

function assignRole(role: Role): void {
  console.log(`Assigned role: ${role}`);
}

assignRole("editor"); // ok
assignRole("owner");  // Error: not assignable to "admin" | "editor" | "viewer"

// The array itself is also useful at runtime, e.g. for populating a <select>:
ROLES.forEach((r) => console.log(r));
```

Without `as const`, `ROLES` would be inferred as `string[]`, and `typeof ROLES[number]` would just be `string` — the entire technique depends on `as const` locking each element to its literal type rather than widening to the general `string`.

## The same pattern on object values

```typescript
const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
} as const;

type HttpMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS];
// HttpMethod = "GET" | "POST" | "DELETE"
```

`keyof typeof HTTP_METHODS` gets the key union (`"GET" | "POST" | "DELETE"`), and indexing the object type by that key union gets the value union — here they happen to match since keys and values are identical strings, but this same pattern works when values differ from keys too.

## Why this matters in interviews

"Derive a type from a runtime array/object without an enum" is a very common practical exercise, and `as const` + `typeof arr[number]` (or `typeof obj[keyof typeof obj]`) is the idiomatic modern answer. Interviewers want to see that you understand *why* `as const` is required — that without it, TypeScript's default widening behavior on mutable object/array literals would collapse everything down to `string`/`number`, destroying the literal information the whole technique depends on.
