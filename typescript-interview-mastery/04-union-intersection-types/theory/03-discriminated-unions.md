# Discriminated Unions

A discriminated union (also called a "tagged union") is a union of object shapes that all share a common property — the **discriminant** — whose type is a distinct literal for each member. This single pattern is arguably the most important practical technique covered in this entire topic: it's how TypeScript models "one of several distinct, mutually exclusive states" with full compile-time exhaustiveness checking, and it comes up constantly in real interview questions.

## Anatomy of a discriminated union

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
```

Each member has a `status` property with a unique literal value (`"loading"`, `"success"`, `"error"`) — this shared, uniquely-valued property is the discriminant.

## Narrowing with a switch on the discriminant

Once you check the discriminant's value (via `switch` or `if`), TypeScript automatically narrows the entire object to the matching union member — every other property on that specific shape becomes accessible, and properties unique to *other* members become inaccessible, without any additional type guard needed.

```typescript
function renderState(state: FetchState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Loaded ${state.data.length} items`; // state narrowed to SuccessState — .data is accessible
    case "error":
      return `Error: ${state.message}`; // narrowed to ErrorState — .message is accessible
  }
}
```

This is dramatically more ergonomic than a union without a discriminant, where you'd need `"data" in state` checks or similar structural probing to figure out which shape you actually have.

## Exhaustiveness checking

Combined with the `never` type, discriminated unions let the compiler catch a missing case the moment a new state is added — this is the single strongest argument for using them over loosely-typed alternatives (a status `string` plus a set of optional fields).

```typescript
function renderStateExhaustive(state: FetchState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Loaded ${state.data.length} items`;
    case "error":
      return `Error: ${state.message}`;
    default: {
      const exhaustiveCheck: never = state; // errors if a new FetchState member is added
      throw new Error(`Unhandled state: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}
```

If `FetchState` later gains a fourth member, e.g. `{ status: "idle" }`, without an accompanying `case "idle":` above, the `default` branch's `state` is no longer narrowed to `never` — it becomes `{ status: "idle" }` — and the assignment to `exhaustiveCheck: never` fails to compile, flagging the gap immediately.

## Why "one shared literal tag" beats "a bag of optional fields"

A common anti-pattern is modeling the same states with a single interface and a mix of optional fields (`{ status: string; data?: string[]; message?: string }`). This loses two guarantees the discriminated union provides for free: (1) the compiler cannot verify that `data` is only accessed when `status === "success"` — nothing stops you from writing `state.data.length` when `status` is `"error"`, since `data` being optional doesn't correlate with `status`'s value in the type system at all; and (2) there's no way to get an exhaustiveness error for a missing case, since there's no finite set of "members" to exhaust — just one shape with loosely-related optional fields. Discriminated unions encode the actual domain invariant ("exactly one of these mutually exclusive states, each with its own required fields") directly into the type.
