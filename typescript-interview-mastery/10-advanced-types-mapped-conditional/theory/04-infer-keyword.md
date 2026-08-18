# The `infer` Keyword

`infer` lets a conditional type *capture* a piece of a type's structure into a new type variable, rather than just testing assignability. It only appears inside the `extends` clause of a conditional type, and only makes sense when the type being checked has some internal structure to pull a piece out of.

## Extracting an array's element type

```typescript
type ElementType<T> = T extends (infer E)[] ? E : never;

type A = ElementType<string[]>; // string
type B = ElementType<number[]>; // number
type C = ElementType<boolean>;  // never — boolean isn't an array
```

Reading this: "if `T` matches the shape `(infer E)[]` — an array of *something* — capture that something as `E` and return it; otherwise return `never`." TypeScript compares `T` structurally against the pattern `(infer E)[]`, and if it matches, it solves for what `E` must be to make the match work.

## Extracting a Promise's resolved type

```typescript
type Unwrap<T> = T extends Promise<infer V> ? V : T;

type A = Unwrap<Promise<number>>; // number
type B = Unwrap<string>;          // string — not a Promise, returned unchanged
```

This is the core of `Awaited<T>` (topic 09), though the real `Awaited` also recurses to handle nested promises and thenables.

## Extracting a function's return type or parameters

```typescript
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

function greet(name: string, times: number): string[] {
  return Array(times).fill(`Hello, ${name}`);
}

type Greeting = MyReturnType<typeof greet>; // string[]
type GreetArgs = MyParameters<typeof greet>; // [name: string, times: number]
```

Note `infer P` here captures the *entire parameter list* as a tuple type, not a single type — `infer` can bind to a tuple position just as easily as a single type position.

## Multiple `infer` in one pattern

You can infer more than one type variable in a single conditional, useful for pulling apart a structure with several pieces:

```typescript
type FirstAndRest<T> = T extends [infer First, ...infer Rest] ? { first: First; rest: Rest } : never;

type Result = FirstAndRest<[string, number, boolean]>;
// { first: string; rest: [number, boolean] }
```

## Why this matters

`infer` is what makes conditional types capable of *destructuring* types instead of merely branching on them. Every "pull X out of a wrapper type" utility — unwrapping promises, arrays, function signatures, or custom generic wrapper types you define yourself — goes through `infer`. It's also the single most common thing interviewers ask candidates to write live, usually framed as "implement `UnwrapPromise`" or "get the element type of an array type."
