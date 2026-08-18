# Primitive Types

TypeScript's primitive types map directly onto JavaScript's runtime primitives: `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, and `symbol`. Each one is a lowercase keyword in type position — this matters because `String`, `Number`, and `Boolean` (capitalized) are also valid types in TypeScript, but they refer to the boxed wrapper objects, not the primitives, and using them is almost always a mistake that linters flag.

## string, number, boolean

These three are the ones you'll use constantly. TypeScript doesn't distinguish integers from floats — there's just `number` for anything numeric, including `NaN` and `Infinity`.

```typescript
const username: string = "jhesudhir";
const retryCount: number = 3;
const isActive: boolean = true;

// Template literals are still `string`
const greeting: string = `Hello, ${username}!`;
```

## null and undefined

Under `strict` mode (specifically `strictNullChecks`), `null` and `undefined` are their own distinct types and are NOT automatically assignable to other types. This is one of the biggest practical differences between idiomatic TypeScript and loosely-typed JavaScript.

```typescript
let middleName: string | undefined;
middleName = "Ray";     // ok
middleName = undefined; // ok
middleName = null;      // Error: Type 'null' is not assignable to type 'string | undefined'

let deletedAt: Date | null = null; // explicit "no value yet" state
```

Convention in most codebases: use `undefined` for "not provided" (optional params, missing object properties) and `null` for "explicitly cleared" (a value that existed and was intentionally set to empty), though TypeScript itself doesn't enforce this — it's a team convention.

## bigint

`bigint` represents arbitrary-precision integers, useful for values that exceed `Number.MAX_SAFE_INTEGER` (2^53 - 1), such as database snowflake IDs or financial ledger totals in the smallest currency unit.

```typescript
const orderId: bigint = 9007199254740993n; // note the `n` suffix
const total = 100n + 250n; // bigint arithmetic — cannot mix with `number` directly

// const bad = 100n + 5; // Error: Cannot mix BigInt and other types
```

`bigint` requires a target of ES2020+ (or `esnext`) in `tsconfig.json`; on older targets, TypeScript will error on the literal syntax.

## symbol

`symbol` represents a unique, immutable value typically used as an object property key to avoid naming collisions (e.g., defining a well-known protocol member without clashing with user-defined properties).

```typescript
const ROLE_KEY: unique symbol = Symbol("role");

interface TaggedUser {
  name: string;
  [ROLE_KEY]: "admin" | "member";
}

const admin: TaggedUser = { name: "Sudhir", [ROLE_KEY]: "admin" };
```

Use the `unique symbol` type (not just `symbol`) when you need the exact symbol identity preserved in the type system, such as for nominal typing patterns or `Symbol.iterator`-style protocol keys.

## Why this matters in interviews

Interviewers often probe whether you understand that `strictNullChecks` fundamentally changes how `null`/`undefined` behave — without it, every type implicitly includes both, which defeats most of TypeScript's safety guarantees. Always assume `strict: true` unless told otherwise; it's the modern default and the only configuration worth mastering for production code and interviews alike.
