# Discriminated Union Narrowing

A discriminated union (also called a tagged union) is a union of object types that all share one common property — the discriminant — typed as a distinct literal in each member. Checking the discriminant's value narrows the *entire* object, not just that one field, which makes discriminated unions the most ergonomic way to model "one of several distinct shapes" in TypeScript. (This builds directly on the union-type modeling covered in topic 04 — this file focuses specifically on how narrowing interacts with the discriminant.)

```typescript
interface LoadingState {
  status: "loading";
}
interface SuccessState {
  status: "success";
  data: string[];
}
interface ErrorState {
  status: "error";
  message: string;
}

type FetchState = LoadingState | SuccessState | ErrorState;

function render(state: FetchState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Loaded ${state.data.length} items`; // state: SuccessState
    case "error":
      return `Error: ${state.message}`;             // state: ErrorState
  }
}
```

The `switch (state.status)` check is what makes this work — inside each `case`, TypeScript narrows `state` to the specific member of the union whose `status` literal matches, giving you access to `data` in the `"success"` branch and `message` in the `"error"` branch with no casting anywhere.

## Why the discriminant must be a literal, not a general type

The mechanism depends entirely on each branch declaring `status` as a specific string literal (`"loading"`, `"success"`, `"error"`), not as the general type `string`. If any member declared `status: string`, the union would collapse to something the compiler can't distinguish between branches for, and narrowing would fail silently — every case would still see the full union type.

```typescript
// Broken: status typed too widely
interface BadSuccessState {
  status: string; // should be "success"
  data: string[];
}
```

## Narrowing also works with if/else chains, not just switch

```typescript
function render2(state: FetchState): string {
  if (state.status === "loading") {
    return "Loading...";
  } else if (state.status === "success") {
    return `Loaded ${state.data.length} items`;
  } else {
    return `Error: ${state.message}`; // narrowed by elimination to ErrorState
  }
}
```

## Nested discriminants

Discriminated unions compose — a field of a discriminated union member can itself be a discriminated union, and narrowing the outer discriminant doesn't automatically narrow the inner one; each level needs its own check.

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rectangle": return shape.width * shape.height;
  }
}
```

## Why this matters in interviews

Discriminated unions plus `switch`-based narrowing is the standard, idiomatic pattern for modeling variant data (API response states, form field types, AST nodes) in TypeScript, and it's the setup almost every "exhaustiveness check with `never`" interview question is built on top of — covered next.
