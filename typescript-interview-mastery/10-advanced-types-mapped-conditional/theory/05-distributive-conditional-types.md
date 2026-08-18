# Distributive Conditional Types

When a conditional type's checked type is a *naked type parameter* — the type parameter appears alone, not wrapped in an array, tuple, or object — and you instantiate it with a union, TypeScript applies the conditional to each union member separately and unions the results back together. This is called distribution, and it's on by default; it's not something you opt into, it's something you sometimes need to opt *out* of.

## Distribution in action

```typescript
type ToArray<T> = T extends any ? T[] : never;

type Result = ToArray<string | number>;
// Distributes as: ToArray<string> | ToArray<number>
// = string[] | number[]
// NOT (string | number)[]
```

Walk through it: TypeScript sees `T = string | number` being fed into `T extends any ? T[] : never` where `T` is naked. Instead of evaluating the conditional once against the whole union, it evaluates it once *per member*: `(string extends any ? string[] : never) | (number extends any ? number[] : never)`, which simplifies to `string[] | number[]`.

This is exactly why `Exclude<T, U> = T extends U ? never : T` works correctly on unions:

```typescript
type WithoutB = Exclude<"a" | "b" | "c", "b">;
// Distributes: ("a" extends "b" ? never : "a") | ("b" extends "b" ? never : "b") | ("c" extends "b" ? never : "c")
// = "a" | never | "c"
// = "a" | "c"
```

If `Exclude` were *not* distributive, `("a" | "b" | "c") extends "b"` would be checked as a single question (false, since the whole union isn't assignable to `"b"`), and the result would be the entire original union unfiltered — not the filtering behavior anyone actually wants.

## Opting out with `[T] extends [U]`

Sometimes you want the conditional evaluated against the union *as a whole*, not per-member. Wrapping both sides in a one-element tuple disables distribution, because the checked type (`[T]`) is no longer a naked type parameter — it's a tuple containing the parameter.

```typescript
type IsUnion<T, U = T> = T extends U ? ([U] extends [T] ? false : true) : never;

type IsNeverDistributive<T> = T extends never ? true : false;
type NonDistributive<T> = [T] extends [never] ? true : false;

type A = IsNeverDistributive<never>; // true — trivially, but distribution over an empty union of zero members yields `never` for ANY T, which is a classic gotcha
type B = NonDistributive<never>;     // true — evaluated as a single non-distributed check
type C = NonDistributive<string>;    // false
```

A more practical example: checking whether a type is exactly `any` versus checking membership per-union-member requires suppressing distribution, since `any` interacts specially with conditional types (a conditional type applied to `any` resolves to the union of both branches, distribution or not).

## The classic gotcha: distributing over `never`

`Exclude<T, T>` for any `T` correctly returns `never`, but if `T` itself is instantiated as `never`, distributing over a union with *zero* members produces `never` immediately, before the conditional even gets a chance to "run" — this is a common source of "why did my type resolve to `never` unexpectedly" bugs when a generic parameter can be inferred as `never` (e.g., from an empty array literal with no context).

## Why this matters

Distribution explains behavior that looks like a bug the first time you see it: `Exclude`, `Extract`, `NonNullable`, and many custom conditional types only work correctly *because* of distribution, but the same mechanism can surprise you when you want a conditional evaluated once against a whole union (e.g., "does this exact union type match this exact other union type") rather than member-by-member. Knowing the `[T] extends [U]` escape hatch is the standard answer interviewers look for when they ask "how do you turn off distribution."
