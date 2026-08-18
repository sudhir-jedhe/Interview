# What happens if `PaymentState` gains a new member?

```typescript
type PaymentState =
  | { status: "pending" }
  | { status: "authorized"; authCode: string }
  | { status: "captured"; capturedAt: Date };

function describe(state: PaymentState): string {
  switch (state.status) {
    case "pending":
      return "Awaiting authorization";
    case "authorized":
      return `Authorized: ${state.authCode}`;
    case "captured":
      return `Captured at ${state.capturedAt.toISOString()}`;
    default: {
      const check: never = state;
      return check;
    }
  }
}

// Now suppose PaymentState is updated elsewhere to add:
// | { status: "refunded"; refundedAt: Date }
// without touching the switch above. Does `describe` still compile?
```

**Answer:** No — once `PaymentState` gains the `"refunded"` member without a corresponding `case "refunded":` added to the `switch`, the line `const check: never = state;` fails to compile: `Type '{ status: "refunded"; refundedAt: Date; }' is not assignable to type 'never'.`

**Why:** After the three existing `case`s are handled, the `default` branch's `state` is narrowed by elimination to whatever's left in the union — previously that was genuinely nothing (`never`), since every member had a matching case. Once a fourth member (`"refunded"`) is added to `PaymentState` but no matching `case` is added to the `switch`, the `default` branch's `state` narrows to exactly that leftover member instead of `never`, and assigning a non-`never` value to a variable explicitly typed `never` is a type error. This is the exhaustiveness-check mechanism from `theory/03-discriminated-unions.md` working exactly as intended — it converts "someone added a new state and forgot to handle it in this switch" from a silent runtime gap (the function would return `undefined` for `"refunded"` inputs) into an immediate, precise compile error at the exact `switch` that needs updating.
