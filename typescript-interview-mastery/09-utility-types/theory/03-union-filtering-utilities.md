# Exclude\<T, U\>, Extract\<T, U\>, NonNullable\<T\>

These three operate on *unions*, not object shapes. They filter members in or out of a union type based on assignability to another type.

## `Exclude<T, U>`

`Exclude<T, U>` removes from union `T` every member that is assignable to `U`. Think of it as "subtract these variants."

```typescript
type Status = "pending" | "active" | "cancelled" | "archived" | "deleted";

type VisibleStatus = Exclude<Status, "archived" | "deleted">;
// "pending" | "active" | "cancelled"

function renderBadge(status: VisibleStatus) {
  // only ever called with statuses the UI actually shows
}
```

A common real use case: narrowing an event union to the subset a particular handler cares about, or removing `null`/`undefined`/error variants from a discriminated union after you've already handled them in an earlier branch.

## `Extract<T, U>`

`Extract<T, U>` is the mirror image: it keeps only the members of `T` that *are* assignable to `U`. Use it to pull a sub-union out of a larger one, especially with discriminated unions.

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "triangle"; base: number; height: number };

type PolygonShape = Extract<Shape, { kind: "square" | "triangle" }>;
// { kind: "square"; side: number } | { kind: "triangle"; base: number; height: number }
```

`Extract` is frequently used to grab "just the error variants" or "just the success variant" out of a result union without hand-writing the member types again.

## `NonNullable<T>`

`NonNullable<T>` removes `null` and `undefined` from `T`. It's the targeted version of `Exclude<T, null | undefined>` and is used constantly after a runtime check has already ruled out nullish values but the compiler hasn't narrowed automatically (e.g., across function boundaries).

```typescript
interface FormField {
  value: string | null;
}

function assertPresent<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Expected a value but got null/undefined");
  }
  return value as NonNullable<T>;
}

function getTrimmedValue(field: FormField): string {
  const value: NonNullable<FormField["value"]> = assertPresent(field.value);
  return value.trim();
}
```

`NonNullable` is also what powers optional chaining patterns in generic helper functions where you can't rely on control-flow narrowing because the value passes through a generic parameter.

## Implementation sketch

```typescript
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;
type MyNonNullable<T> = T extends null | undefined ? never : T;
```

All three rely on **distributive conditional types**: when `T` is a naked type parameter and the union is fed in, TypeScript applies the conditional to each member of the union separately and unions the results back together. That's why `Exclude<"a" | "b" | "c", "b">` doesn't just evaluate once — it evaluates as `("a" extends "b" ? never : "a") | ("b" extends "b" ? never : "b") | ("c" extends "b" ? never : "c")`, which collapses to `"a" | "c"`. Distributive conditional types are covered in full in topic 10.
