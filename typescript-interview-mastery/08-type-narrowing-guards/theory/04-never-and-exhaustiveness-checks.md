# The never Type as an Exhaustiveness-Check Tool

`never` is the type of a value that can never actually occur — a function that always throws has return type `never`, an infinite loop has type `never`, and, most usefully for narrowing, the *type of a variable after every member of a union has been ruled out* is `never`. This last case is what makes `never` a practical compile-time safety tool, not just a theoretical curiosity.

## The exhaustiveness-check pattern

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      return assertNever(shape); // shape: never here, if all cases above are exhaustive
  }
}
```

Inside `default`, if every `case` above has correctly handled one member of the `Shape` union, TypeScript has narrowed `shape` down to `never` — there's nothing left it could be. Passing that `never`-typed value to `assertNever(value: never)` compiles cleanly, because `never` is assignable to everything (it's the bottom type).

## What happens when a new variant is added and forgotten

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number }
  | { kind: "square"; side: number }; // added, but no case below handles it

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      return assertNever(shape);
      // Error: Argument of type '{ kind: "square"; side: number }'
      // is not assignable to parameter of type 'never'.
  }
}
```

Because the `"square"` case was never handled, `shape` inside `default` is narrowed to `{ kind: "square"; side: number }`, not `never` — and that type is not assignable to `assertNever`'s `never` parameter, so the compiler rejects the code at exactly the right spot, immediately flagging the missing case. This turns a class of bug that would otherwise only surface at runtime (a `square` silently falling through to a default branch, or worse, no default at all and `area` returning `undefined`) into a build failure caught before the code ships.

## Why not just omit the default branch?

A `switch` with no `default` and no exhaustiveness check will compile even with a missing case — TypeScript's control-flow analysis alone doesn't force every switch to handle every union member unless `strict` mode's function-return checking happens to catch it (e.g., if every branch returns a value and the function's declared return type would be violated by an implicit `undefined` fall-through). The `assertNever` pattern is explicit and reliable regardless of those conditions, which is why it's the standard idiom rather than relying on incidental compiler behavior.

## Why this matters in interviews

The `assertNever` / exhaustiveness-check pattern is one of the highest-value idioms to know cold — it directly demonstrates that you understand `never`, discriminated unions, and how to make future code changes fail loudly and early instead of quietly. Interviewers frequently ask you to add a new variant to an existing discriminated union specifically to see whether you know this pattern exists and can explain why the compile error appears exactly where it does.
