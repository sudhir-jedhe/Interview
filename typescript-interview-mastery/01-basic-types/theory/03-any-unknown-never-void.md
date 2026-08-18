# any vs unknown vs never vs void

These four types are heavily tested because they look similar ("special" non-concrete types) but serve completely different purposes. Confusing them is one of the most common sources of runtime bugs that slip past the compiler.

## any: opt out of type checking entirely

`any` disables type checking for that value. You can call any method, access any property, assign it to or from anything, with zero compiler complaints. It is effectively a trapdoor back to plain JavaScript.

```typescript
function processAny(input: any) {
  input.toUpperCase();  // no error, even though input might be a number
  input();               // no error, even though input might not be callable
  const n: number = input; // no error — any is assignable to everything
}

processAny(42); // compiles fine, crashes at runtime: input.toUpperCase is not a function
```

`any` is "contagious" — once a value is `any`, everything derived from it becomes `any` too, silently erasing type safety downstream. Legitimate uses are narrow: quick prototyping, gradually migrating a JS codebase, or interfacing with a genuinely untyped third-party value you'll immediately validate.

## unknown: the type-safe any

`unknown` also accepts any value, but you cannot *use* an `unknown` value until you narrow it to something more specific. It is the correct type for "I don't know what this is yet" — API responses, JSON.parse results, catch-block errors.

```typescript
function processUnknown(input: unknown) {
  // input.toUpperCase(); // Error: Object is of type 'unknown'

  if (typeof input === "string") {
    input.toUpperCase(); // ok — narrowed to string
  }
}

let value: unknown = 42;
// const n: number = value; // Error: Type 'unknown' is not assignable to type 'number'
if (typeof value === "number") {
  const n: number = value; // ok, narrowed
}
```

Rule of thumb: **prefer `unknown` over `any`** for anything entering your program from the outside world (network responses, user input, `JSON.parse`). It forces every caller to prove the shape before using it, which is exactly the safety net `any` throws away.

## never: values that cannot occur

`never` is the type of a value that will never exist — a function that always throws, an infinite loop, or the impossible remainder after every case of a union has been narrowed away. It is the "empty set" of types: nothing is assignable to `never` except `never` itself, but `never` is assignable to *everything* (since there's no value that could violate the assignment).

```typescript
function fail(message: string): never {
  throw new Error(message);
}

function withdraw(status: "pending" | "shipped") {
  if (status === "pending") return "waiting";
  if (status === "shipped") return "on the way";
  // status is narrowed to `never` here — every case handled
  const exhaustive: never = status;
  return exhaustive;
}
```

`never` is the backbone of exhaustiveness checking (see the `assertNever` problem in `problems/`): assigning a narrowed value to a `never`-typed variable causes a compile error the moment a new union member is added and not yet handled anywhere.

## void: "the return value is irrelevant"

`void` describes a function's return value as "not meant to be used" — typically a function that performs a side effect (logging, mutating, dispatching) and returns nothing meaningful. It differs from `undefined`: a `void`-returning function can, at the JavaScript level, actually return a value, and TypeScript will still allow it if used as a callback (see `output-based/06-void-return-still-value.md` for the exact rule).

```typescript
function logEvent(name: string): void {
  console.log(`Event: ${name}`);
  // no return statement — implicitly returns undefined
}

const handler: () => void = () => {
  return 42; // allowed! the return value is simply ignored by the void contract
};
```

## Summary table

| Type | Accepts any value in? | Usable without narrowing? | Assignable to other types? |
|---|---|---|---|
| `any` | yes | yes | yes (to anything) |
| `unknown` | yes | no | only to `any`/`unknown` |
| `never` | n/a (no values) | n/a | yes (to everything) |
| `void` | n/a (describes returns) | n/a | only `undefined` fits explicitly |

The interview-safe answer: **default to `unknown` at boundaries, narrow explicitly, reserve `any` for genuine escape hatches, use `never` for exhaustiveness and unreachable code, and use `void` for side-effecting function return types.**
