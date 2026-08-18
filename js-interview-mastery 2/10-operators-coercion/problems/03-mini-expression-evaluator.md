# Problem: Implement a small expression evaluator for `+`, `-`, `*` with correct coercion

Implement `evaluate(a, operator, b)` that applies `+`, `-`, or `*` to two operands that may be strings or numbers, correctly replicating JavaScript's real coercion behavior for each operator (not just blindly calling `Number()` on everything).

## Requirements

- `+` concatenates if either operand is a string; otherwise adds numerically.
- `-` and `*` always coerce both operands to numbers first, regardless of type — there's no string subtraction or string multiplication in JS.
- Invalid numeric coercion for `-`/`*` should propagate as `NaN`, matching real JS behavior, not throw.

## Solution

```js
function evaluate(a, operator, b) {
  switch (operator) {
    case "+":
      // + is the one overloaded operator: string wins if either side is a string
      if (typeof a === "string" || typeof b === "string") {
        return String(a) + String(b);
      }
      return Number(a) + Number(b);

    case "-":
      return Number(a) - Number(b);

    case "*":
      return Number(a) * Number(b);

    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// --- Verification against real JS operators ---
console.log(evaluate("5", "+", 3), "5" + 3);       // "53" "53"
console.log(evaluate("5", "-", 3), "5" - 3);       // 2 2
console.log(evaluate("5", "*", "2"), "5" * "2");   // 10 10
console.log(evaluate(1, "+", 2), 1 + 2);           // 3 3
console.log(evaluate("abc", "-", 1), "abc" - 1);   // NaN NaN
console.log(evaluate(true, "+", 1), true + 1);     // 2 2 — boolean coerces to number for +, since neither side is a string
console.log(evaluate("5", "+", true), "5" + true); // "5true" "5true" — string wins because "5" is a string
```

## Why it works

The `+` branch is the only place where a string check happens *before* any numeric coercion — this mirrors the real spec, where `+`'s behavior depends on whether either operand's `ToPrimitive` result is a string, and only falls back to numeric addition if neither side is. `-` and `*` skip that check entirely and always call `Number()` on both operands unconditionally, exactly like the real operators, which is also why non-numeric strings (`"abc"`) correctly propagate to `NaN` instead of throwing — `Number("abc")` is `NaN`, and arithmetic with `NaN` just produces `NaN`, it never errors.

The `true + 1` case demonstrates why order of checks matters: booleans are not strings, so the `+` branch's string check is `false` for both operands, and it falls through to `Number(true) + Number(1)` = `1 + 1` = `2` — correctly distinguishing "boolean present" from "string present."

## Edge cases worth testing

```js
console.log(evaluate(null, "+", 1));    // 1 — Number(null) is 0, so 0 + 1
console.log(evaluate(undefined, "-", 1)); // NaN — Number(undefined) is NaN
console.log(evaluate("10", "*", "abc"));  // NaN — Number("abc") is NaN, propagates through *
```

A more complete evaluator would tokenize and parse a full string expression (e.g. `"5 + 3 * 2"`) with operator precedence, rather than taking `a`, `operator`, `b` as three separate arguments — this implementation intentionally scopes down to just the coercion behavior of a single binary operation, which is the interview-relevant part.
