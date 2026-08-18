# Conditional Types: `T extends U ? X : Y`

A conditional type picks between two types based on whether one type is assignable to another. The syntax mirrors JavaScript's ternary operator but operates entirely at the type level, evaluated by the compiler, not at runtime.

## Basic form

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false
```

`T extends U` here doesn't mean "T is a subtype of U" in a strict OOP sense — it means "every value describable by T is also describable by U," which for literal types like `"hello"` extending `string` is straightforwardly true.

## Conditional types with generics

Conditional types become genuinely useful when the branch taken depends on a type parameter supplied at a call site, letting a single type alias behave differently for different inputs:

```typescript
type ApiResult<T> = T extends { error: string } ? { ok: false; error: string } : { ok: true; data: T };

type SuccessCase = ApiResult<{ userId: string }>;
// { ok: true; data: { userId: string } }

type ErrorCase = ApiResult<{ error: string }>;
// { ok: false; error: string }
```

## Chaining conditional types

Conditional types can be chained to emulate a switch statement over types:

```typescript
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

type T1 = TypeName<string>;   // "string"
type T2 = TypeName<() => void>; // "function"
type T3 = TypeName<{ a: 1 }>; // "object"
```

Each `extends` check is evaluated top to bottom, and the first branch that matches wins — later branches are never checked once an earlier one is satisfied, exactly like a chain of `if`/`else if`.

## Conditional types in constraints

A common pattern is using a conditional type to validate or constrain a generic parameter based on another parameter's shape, often combined with `never` to signal "this combination is invalid" in a way that surfaces as a type error at the call site rather than deep inside an implementation:

```typescript
type RequireField<T, K extends keyof T> = T & { [P in K]-?: T[P] };

interface Draft {
  title?: string;
  body?: string;
}

type PublishableDraft = RequireField<Draft, "title">;
// title becomes required; body remains optional
```

## Why this matters

Conditional types are the mechanism behind nearly every "smart" utility type — `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Awaited` are all conditional types, several combined with `infer` (the next file). The two things interviewers probe: whether you understand `extends` as "is assignable to" rather than "is a subclass of," and whether you know conditional types distribute over unions when the checked type is a bare type parameter — covered in the distributive conditional types file.
