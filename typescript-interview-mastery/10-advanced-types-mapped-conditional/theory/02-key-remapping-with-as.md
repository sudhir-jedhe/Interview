# Key Remapping with `as` in Mapped Types

Modifiers (`readonly`, `?`) let you change *how* a property behaves, but not its *name*, and they can't filter keys out entirely. Key remapping — the `as` clause inside a mapped type, introduced in TypeScript 4.1 — solves both: `{ [K in keyof T as NewKeyExpr]: ValueExpr }`.

## Renaming keys

```typescript
interface Person {
  name: string;
  age: number;
}

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number }
```

`K` still ranges over `"name" | "age"` as before, but the property that ends up in the result type is named by the template literal expression after `as`, not by `K` itself. `Capitalize<string & K>` turns `"name"` into `"Name"`; the `string &` intersection is needed because `K` is typed as `string | number | symbol` (the general `keyof` result) and `Capitalize` only accepts `string`.

## Filtering keys out with `never`

If the expression after `as` evaluates to `never` for a given key, that key is dropped from the resulting mapped type entirely — this is the standard technique for building "pick keys matching a condition" utilities.

```typescript
interface Mixed {
  id: string;
  isActive: boolean;
  retryCount: number;
  label: string;
}

type OnlyStringKeys<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type StringFields = OnlyStringKeys<Mixed>;
// { id: string; label: string } — isActive and retryCount dropped
```

For each key `K`, the conditional `T[K] extends string ? K : never` checks the *value type*, not the key name. When the value is a `string`, the key expression evaluates to `K` itself (keep it, unrenamed); when it isn't, it evaluates to `never` (drop it). This pattern — conditional key expression that resolves to either the original key or `never` — is how you build "pick by value type" utilities that plain `Pick<T, K>` can't express, since `Pick`'s `K` only ever operates on key *names*, not value types.

## Combining rename and filter

Both techniques compose in a single mapped type:

```typescript
type EventHandlerNames<T> = {
  [K in keyof T as K extends `on${string}` ? K : never]: T[K];
};
```

## Why this matters

Key remapping is the feature that turns mapped types from "reshape modifiers on the same keys" into a general-purpose type-level transformation tool — renaming, filtering, and even merging keys are all expressible. It shows up in real codebases in Redux-style action-creator generators, ORM query builders that expose `whereX`/`orderByX` methods derived from a model's fields, and validation libraries that derive error-key maps from a schema.
