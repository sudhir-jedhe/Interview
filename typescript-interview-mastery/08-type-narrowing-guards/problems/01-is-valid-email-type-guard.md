# Write a user-defined type guard isValidEmail(x: unknown): x is string

## Problem

Implement `isValidEmail(x: unknown): x is string` that returns `true` only when `x` is a `string` *and* matches a reasonable email pattern, so that a caller narrowing on it can safely treat the value as a validated email string, not just any string.

## Solution

```typescript
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(x: unknown): x is string {
  return typeof x === "string" && EMAIL_PATTERN.test(x);
}
```

## Usage

```typescript
function subscribeToNewsletter(input: unknown): string {
  if (!isValidEmail(input)) {
    throw new Error("A valid email address is required");
  }
  // input: string here, and — by contract, not by the type system —
  // known to have passed the email pattern check
  return `Subscribed: ${input.toLowerCase()}`;
}

console.log(subscribeToNewsletter("user@example.com")); // "Subscribed: user@example.com"
subscribeToNewsletter(12345);         // throws
subscribeToNewsletter("not-an-email"); // throws
```

## Discussion

The predicate's declared type, `x is string`, only tells the compiler "this is a `string`" — it can't express "this is a `string` that also matches an email pattern," because TypeScript's type system has no built-in concept of regex-validated string subtypes without a much heavier branded-type setup. This is an important limitation to call out explicitly in an interview: after narrowing, `input` is typed as plain `string`, and nothing statically distinguishes it from any other string — the "is a valid email" guarantee lives entirely in the runtime check inside `isValidEmail`'s body, trusted by the compiler but not verified by it. If you need the type system itself to track "this specific string has been validated," the common technique is a branded/nominal type (e.g., `type Email = string & { __brand: "Email" }`), with `isValidEmail` narrowing to `x is Email` instead of `x is string` — a reasonable follow-up to raise if asked how to make the guarantee stronger.
