# Problem: Implement a type-safe `assertNever` exhaustiveness-check helper

## Problem statement

Implement a reusable `assertNever` helper that, when placed in the `default` branch of a `switch` over a union type, causes a **compile-time error** if any union member is left unhandled, and throws a descriptive runtime error if it's ever actually reached (which should only happen if new data slips past the type system, e.g. from an external API).

## Requirements

- `function assertNever(value: never): never`
- Must actually throw at runtime (not just satisfy the type checker).
- Demonstrate it catching an unhandled case: add a new member to a union and show the resulting compile error conceptually (as a comment, since we can't leave broken code in the final file).
- Must compile under `strict: true`.

## Solution

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

type PaymentStatus = "pending" | "authorized" | "captured" | "refunded";

function describePaymentStatus(status: PaymentStatus): string {
  switch (status) {
    case "pending":
      return "Payment is pending";
    case "authorized":
      return "Payment authorized, not yet captured";
    case "captured":
      return "Payment captured successfully";
    case "refunded":
      return "Payment was refunded";
    default:
      // At this point, every member of PaymentStatus has been handled above,
      // so `status` has been narrowed by the compiler to type `never`.
      return assertNever(status);
  }
}

console.log(describePaymentStatus("captured")); // "Payment captured successfully"

// --- What happens if PaymentStatus grows a new member? ---
//
// type PaymentStatus = "pending" | "authorized" | "captured" | "refunded" | "disputed";
//
// Without adding a `case "disputed":` above, `status` inside the `default` branch
// would now be narrowed to `"disputed"` (not `never`, since one member is unhandled).
// Calling `assertNever(status)` with a `"disputed"` argument then fails to compile:
//
//   Argument of type '"disputed"' is not assignable to parameter of type 'never'.
//
// This turns "forgot to handle a new status" into a build failure at the exact call
// site that needs updating, instead of a silent runtime gap discovered in production.
```

### Why this is the correct approach

`assertNever`'s parameter type `never` is the entire mechanism: it can only be called with a value TypeScript has proven is impossible to reach given exhaustive handling above it. As soon as the union gains a new member, the narrowing in the `default` branch no longer produces `never` for the leftover case, and passing that non-`never` value to `assertNever` becomes a type error — caught during development, at the exact call site, rather than surfacing as a missing `case` bug discovered by a user in production. The runtime `throw` is a defensive backstop for cases where the type system's guarantee doesn't hold — e.g. data arriving from `JSON.parse` on an external API payload that claims to be `PaymentStatus` but isn't actually validated.
