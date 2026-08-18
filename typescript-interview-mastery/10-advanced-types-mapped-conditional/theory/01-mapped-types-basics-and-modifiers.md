# Mapped Types: Basics and Modifiers (+/-readonly, +/-?)

A mapped type produces a new object type by iterating over a union of keys and applying a transformation to each. The core syntax is `{ [K in Keys]: ValueExpr }`, where `Keys` is typically `keyof SomeType` and `ValueExpr` can reference `K` via indexed access.

## The basic form

```typescript
interface Coordinates {
  x: number;
  y: number;
  z: number;
}

type Stringified<T> = {
  [K in keyof T]: string;
};

type CoordinateLabels = Stringified<Coordinates>;
// { x: string; y: string; z: string }
```

Here `K` ranges over `"x" | "y" | "z"` (the result of `keyof Coordinates`), and every property's value type is replaced with `string`, regardless of what it was originally. If you want to preserve the original value type while transforming something else (like adding `readonly`), reference it with `T[K]`:

```typescript
type Duplicated<T> = {
  [K in keyof T]: T[K];
}; // identical shape to T — the "identity" mapped type
```

## Modifiers: `readonly` and `?`

Mapped types can add or remove two modifiers on each property: `readonly` and `?` (optional). By default, if the source type already has a modifier, it's preserved (this is called "homomorphic" mapping when `[K in keyof T]` is used directly over a type parameter `T`). You can force a modifier on or off explicitly:

```typescript
type MakeReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type MakeOptional<T> = {
  [K in keyof T]?: T[K];
};
```

## Removing modifiers with `-readonly` and `-?`

The `+`/`-` prefix syntax lets you explicitly add (`+`, the default, usually omitted) or strip (`-`) a modifier, even if the source type already has it:

```typescript
interface LockedConfig {
  readonly host: string;
  readonly port?: number;
}

type UnlockedConfig = {
  -readonly [K in keyof LockedConfig]: LockedConfig[K];
};
// { host: string; port?: number } — readonly stripped, optionality kept

type FullyRequiredConfig = {
  [K in keyof LockedConfig]-?: LockedConfig[K];
};
// { readonly host: string; readonly port: number } — optionality stripped, readonly kept

type PlainConfig = {
  -readonly [K in keyof LockedConfig]-?: LockedConfig[K];
};
// { host: string; port: number } — both stripped
```

This is exactly the mechanism behind `Required<T>` (`-?`) and a hypothetical `Mutable<T>` (`-readonly`) — there's no separate compiler feature for "un-readonly-ing" a type; it's the same modifier syntax used in reverse.

## Why this matters

Interviewers frequently ask you to write a mapped type live — often `DeepReadonly<T>` or a variant of `Partial`. The two things to internalize: (1) `[K in keyof T]` is how you iterate keys, and (2) `?`/`-?` and `readonly`/`-readonly` are the only two modifiers you can rewrite this way — everything else (renaming keys, filtering keys out, changing value types conditionally) requires key remapping with `as` or a conditional type nested inside the mapped type's value position, both covered in the next two files.
