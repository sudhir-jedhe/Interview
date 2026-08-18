# Scenario: Validating and parsing user-entered numeric input from a form

You have a text input where users type a quantity, and you need to convert it to a number for calculations, rejecting garbage input like `"12abc"`, `""`, or `"  "` rather than silently treating it as a valid number. How do you implement this validation?

**Approach:** Use `Number()` (or unary `+`) rather than `parseInt`/`parseFloat`, specifically because they require the *entire* string to be numeric and won't silently accept partial matches like `"12abc"`:

```js
function parseQuantity(input) {
  const trimmed = input.trim();
  if (trimmed === "") return { valid: false, error: "Quantity is required" };
  const value = Number(trimmed);
  if (Number.isNaN(value)) return { valid: false, error: "Not a valid number" };
  if (!Number.isInteger(value) || value <= 0) return { valid: false, error: "Must be a positive whole number" };
  return { valid: true, value };
}

parseQuantity("12abc");  // { valid: false, error: "Not a valid number" }
parseQuantity("  ");     // { valid: false, error: "Quantity is required" }
parseQuantity("3");      // { valid: true, value: 3 }
```

Edge cases: `Number("")` returns `0`, not `NaN`, which is why the empty-string check must happen before the numeric parse. `Number("  ")` (whitespace only) also returns `0` due to trimming behavior in the numeric coercion algorithm, so trimming and checking for emptiness explicitly first avoids both traps.
