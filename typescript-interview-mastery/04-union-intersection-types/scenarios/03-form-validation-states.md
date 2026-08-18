# Scenario: Modeling form field validation states

You're building a form library where each field can be in one of three validation states: untouched (no validation run yet), valid (with the parsed value), or invalid (with an error message and the raw invalid input, for redisplay). You want the UI rendering code to be forced to handle all three states, and you want the `value` field only accessible when the state is actually `"valid"`.

**Approach:** Model the states as a discriminated union on a `kind` field, and write a rendering function with an exhaustive switch — exactly the pattern that prevents a common real bug class in form libraries: accidentally rendering a stale/invalid value as if it were valid.

```typescript
type FieldState<T> =
  | { kind: "untouched" }
  | { kind: "valid"; value: T }
  | { kind: "invalid"; rawInput: string; errorMessage: string };

function renderField<T>(fieldName: string, state: FieldState<T>): string {
  switch (state.kind) {
    case "untouched":
      return `${fieldName}: (not yet filled in)`;
    case "valid":
      return `${fieldName}: ${JSON.stringify(state.value)} ✓`;
    case "invalid":
      return `${fieldName}: "${state.rawInput}" — ${state.errorMessage}`;
    default: {
      const exhaustiveCheck: never = state;
      throw new Error(`Unhandled field state: ${JSON.stringify(exhaustiveCheck)}`);
    }
  }
}

const ageField: FieldState<number> = { kind: "valid", value: 30 };
const emailField: FieldState<string> = {
  kind: "invalid",
  rawInput: "not-an-email",
  errorMessage: "Must be a valid email address",
};
const nameField: FieldState<string> = { kind: "untouched" };

console.log(renderField("age", ageField));
console.log(renderField("email", emailField));
console.log(renderField("name", nameField));
```

The key modeling decision is that `value: T` only exists on the `"valid"` branch — there's no way to accidentally read a stale or absent `value` from an `"invalid"` or `"untouched"` state, because the type simply doesn't have that property outside the `"valid"` branch. A weaker design (`{ value?: T; error?: string; touched: boolean }`) would compile just as easily but would allow nonsensical states at the type level (e.g. both `value` and `error` set simultaneously, or `touched: false` with a stale `value` left over from a previous valid state) — the discriminated union encodes the actual state machine directly into the type system, making invalid combinations literally unrepresentable.
