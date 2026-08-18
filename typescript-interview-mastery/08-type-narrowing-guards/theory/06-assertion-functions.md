# Assertion Functions

An assertion function is a close cousin of a type guard: instead of returning a boolean that you check in an `if`, it *throws* if a condition fails and, if it returns normally, tells the compiler that a narrowing has been established for the rest of the enclosing scope — no `if` block required around the call site.

## The `asserts x is Type` syntax

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected a string");
  }
}

function process(input: unknown): void {
  assertIsString(input);
  console.log(input.toUpperCase()); // input: string, narrowed after the assertion call
}
```

Unlike `isString(value): value is string`, which you'd use inside an `if (isString(input)) { ... }`, `assertIsString` narrows `input` for the rest of the function simply by having been called — the compiler trusts that if execution continues past that line, the assertion held, because the function's contract says it throws otherwise.

## A simpler variant: `asserts x` without a specific type

You can also assert a general condition (like Node's `assert` module) without narrowing to a specific type — this is useful for narrowing away falsy values or enforcing invariants.

```typescript
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function divide(a: number, b: number): number {
  assert(b !== 0, "Division by zero");
  return a / b;
}
```

`asserts condition` (no `is Type`) tells the compiler "if this function returns, treat `condition` as truthy from here on" — useful for narrowing out `null`/`undefined` or enforcing arbitrary runtime invariants inline.

## Same trust boundary as regular type guards

Exactly like `x is Type` predicates, `asserts x is Type` is a promise the compiler takes on faith — it does not verify the function body genuinely throws in every case where the assertion would be false. An assertion function with a buggy or incomplete check will still narrow the variable afterward, potentially masking a real bug behind a false sense of type safety.

```typescript
function badAssertIsNumber(value: unknown): asserts value is number {
  // bug: forgot to actually throw on failure
  if (typeof value !== "number") {
    console.warn("not a number"); // logs a warning but doesn't throw
  }
}

function useIt(x: unknown) {
  badAssertIsNumber(x);
  console.log(x.toFixed(2)); // compiles, but crashes at runtime if x wasn't a number
}
```

## When to prefer an assertion function over a type guard

Reach for an assertion function when the "invalid" case is genuinely exceptional and should stop execution (input validation at a function's entry point, invariant checks, `assertNever`-style exhaustiveness helpers) rather than a normal, expected branch your code should handle gracefully — a type guard used inside `if`/`else` is more appropriate when both the true and false cases are legitimate, expected outcomes your code needs to handle.

## Why this matters in interviews

Assertion functions are less commonly used day-to-day than plain type guards, so being able to write correct `asserts x is Type` syntax and explain when it's the better choice (input validation / invariants vs. branching logic) signals a deeper, more complete understanding of TypeScript's narrowing model than knowing `x is Type` alone.
