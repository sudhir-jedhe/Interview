# Generic Functions

A generic function is a function whose types are parameterized rather than fixed. Instead of writing a function for `string`, another for `number`, and another for `User`, you write it once with a type variable that the compiler fills in based on how the function is called. The convention is to name the type parameter `T` (and `K`, `V`, `U` for additional ones), though any identifier works — descriptive names like `TItem` are common in larger codebases.

```typescript
function identity<T>(x: T): T {
  return x;
}

const a = identity(42);        // T inferred as number, a: number
const b = identity("hello");   // T inferred as string, b: string
const c = identity<boolean>(true); // explicit type argument, rarely needed here
```

The key thing happening in `identity` is that the *return type is linked to the input type* through `T`. That link is the entire value proposition of generics — it lets the compiler carry type information through a function call instead of collapsing it to `any` or widening it to a union of everything the function could plausibly accept.

## Inference vs explicit type arguments

Most of the time you never write `<T>` at the call site — TypeScript infers `T` from the arguments you pass, the same way it infers the type of a variable from its initializer. You only supply an explicit type argument when inference can't figure it out on its own, typically because the type parameter doesn't appear in any parameter position.

```typescript
function firstOf<T>(items: T[]): T | undefined {
  return items[0];
}

const nums = firstOf([1, 2, 3]);         // T inferred as number
const empty = firstOf<string>([]);       // nothing to infer from, must be explicit
```

## Generic functions with multiple parameters

A function can reference the same type parameter across several arguments, which is how you express "these two things must be the same type" without hardcoding what that type is.

```typescript
function pair<T>(first: T, second: T): [T, T] {
  return [first, second];
}

pair(1, 2);           // ok, T = number
pair("a", "b");       // ok, T = string
pair(1, "b");         // Error: T is inferred as `string | number`,
                       // but TS still checks each argument against the unified T
```

In practice, TypeScript will unify `T` to the best common type (here `string | number`) rather than immediately erroring, so it's worth testing edge cases like this rather than assuming a hard failure — the guarantee generics give you is *consistency*, not automatic rejection of mixed types unless you constrain `T` more tightly.

## Arrow function syntax

Generic arrow functions work the same way, but in a `.tsx` file the `<T>` syntax is ambiguous with JSX, so you either add a trailing comma (`<T,>`) or use `<T extends unknown>`.

```typescript
const wrapInArray = <T,>(value: T): T[] => [value];

const tags = wrapInArray("typescript"); // string[]
```

## Why this matters in interviews

Interviewers commonly ask you to write `identity` or a similarly trivial generic function to check that you understand the difference between a type parameter and a value parameter — many candidates confuse `<T>` (compile-time, erased at runtime) with a regular function argument. Be ready to explain that generics exist purely for the type checker: at runtime, `identity<number>(5)` and `identity<string>("x")` compile to the exact same JavaScript function with no trace of `T` left behind.
