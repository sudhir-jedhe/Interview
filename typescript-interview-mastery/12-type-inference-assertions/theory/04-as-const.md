# `as const`: Deep Readonly + Literal Narrowing

`as const` is a special assertion that tells TypeScript to infer the *narrowest possible* type for an expression, rather than the widened, general type it would normally pick. It has two combined effects: it converts literal values to their literal types (instead of widening them), and it makes the whole structure deeply `readonly`.

## Primitives: locking in the literal type

```typescript
let a = "left";        // widened to: string
const b = "left" as const; // type: "left" (literal)

let dir = "left" as const; // still "left" — as const wins regardless of let/const
```

Compare to plain `const` (see `02-type-widening.md`): `const b = "left"` already infers `"left"` for a bare string, so `as const` looks redundant there. It becomes essential once you're inside an object or array, where widening happens per-property regardless of the outer binding.

## Objects: deep readonly + literal properties

```typescript
const config = {
  mode: "production",
  retries: 3,
} as const;

// config: { readonly mode: "production"; readonly retries: 3 }

config.mode = "development"; // Error: Cannot assign to 'mode' because it is a read-only property
```

Without `as const`, `config.mode` would be `string` and `config.retries` would be `number` — both widened, both mutable. With `as const`, every property becomes `readonly` and every literal value keeps its exact type. This is the idiomatic way to define configuration objects, route tables, or option maps that should be validated against an interface but never mutated.

## Arrays: readonly tuples instead of mutable arrays

```typescript
const point = [10, 20];         // number[]
const pointFixed = [10, 20] as const; // readonly [10, 20]

function move(p: readonly [number, number]) {}
move(pointFixed); // OK — exact tuple shape
move(point);      // Error: number[] is not assignable to readonly [number, number]
```

This is why `as const` is the standard fix for custom hooks that need to return a tuple (see `14-typescript-with-react`'s hook-return problem) — without it, an array literal returned from a function widens to `T[]`, losing positional typing entirely.

## Nested structures

`as const` applies recursively to every level of nesting:

```typescript
const routes = {
  home: { path: "/", auth: false },
  admin: { path: "/admin", auth: true },
} as const;

// routes.admin.path: "/admin" (literal, readonly)
// routes.admin.auth: true (literal, readonly)

type RouteKey = keyof typeof routes; // "home" | "admin"
```

Combining `as const` with `keyof typeof` is a common pattern for deriving a union type directly from runtime data, avoiding the duplication of maintaining a separate `type RouteKey = "home" | "admin"` by hand.

## `as const` vs. `Object.freeze`

`Object.freeze` is a *runtime* guarantee (throws or silently fails on mutation attempts in strict-mode JS); `as const` is a *compile-time-only* guarantee that's erased at build. They're complementary, not redundant — use `as const` for the type system and `Object.freeze` if you also need runtime immutability enforcement (e.g., against code that ignores TS errors or plain JS consumers).

## Interview angle

`as const` questions test whether you understand that TypeScript's widening behavior is opt-out, not opt-in — and `as const` is the primary opt-out mechanism, distinct from writing an explicit type annotation because it derives the narrowest type *from the value itself* rather than requiring you to spell out every literal by hand.
