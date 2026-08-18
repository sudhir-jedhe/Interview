# How Utility Types Work Under the Hood

Every built-in utility type covered in this topic is not a compiler primitive — it's ordinary TypeScript, defined in `lib.es5.d.ts` (and adjacent lib files) using the same mapped-type and conditional-type syntax available to you. Understanding this demystifies utility types: there's no magic, only composition of a small set of type-system features.

## The two building blocks

Everything here is built from two constructs:

1. **Mapped types** — `{ [K in keyof T]: T[K] }` iterates over a union of keys and produces a new object type, optionally rewriting modifiers (`?`, `readonly`) or the value type per key.
2. **Conditional types** — `T extends U ? X : Y`, often combined with `infer` to pull a type out of a structural position (a return type, a promise's payload, a parameter list).

```typescript
// Mapped type family — reshaping modifiers
type Partial<T>  = { [K in keyof T]?: T[K] };
type Required<T> = { [K in keyof T]-?: T[K] };
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };

// Conditional type family — filtering and extracting
type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never;
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T extends (...a: any) => any> = T extends (...a: any) => infer R ? R : any;
```

`Omit` and `Record` are composites: `Omit<T, K> = Pick<T, Exclude<keyof T, K>>`, and `Record<K, V> = { [P in K]: V }` is a mapped type over a caller-supplied key union rather than `keyof T`.

## Why this matters in interviews

Interviewers ask "how would you implement `Partial` yourself?" not to test memorization, but to check that you understand mapped types are a general mechanism, not a fixed list of 12 utilities. Once you can write `MyPartial`, you can also write things the standard library doesn't ship — a `DeepPartial<T>` that recurses into nested objects, a `Mutable<T>` that strips `readonly`, or a `PickByValue<T, V>` that selects keys whose *value type* matches `V`. That generalization is exactly what topic 10 builds on.

## A worked generalization: `Mutable<T>`

The standard library doesn't ship a "remove readonly" utility, but it follows directly from the modifier-rewriting pattern:

```typescript
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

interface FrozenPoint {
  readonly x: number;
  readonly y: number;
}

type Point = Mutable<FrozenPoint>; // { x: number; y: number }

function translate(p: Point, dx: number, dy: number): void {
  p.x += dx; // legal — readonly was stripped
  p.y += dy;
}
```

The `-readonly` prefix removes the modifier the same way `-?` removes optionality in `Required`. This symmetry — `?`/`-?` and `readonly`/`-readonly` — is exactly the modifier syntax mapped types expose, and it's what lets you invert any of the shape-transforming utilities in this file with a single character change.

## Takeaway

If you can recite the four lines of `Partial`, `Pick`, `Exclude`, and `ReturnType` from memory and explain *why* each line works, you've effectively memorized the mechanism behind all twelve utilities in this topic — because they're all just different arrangements of the same two features.
