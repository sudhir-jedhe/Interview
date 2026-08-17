# Scenario Questions: Strings, Numbers & Math

## 1. Formatting currency correctly despite floating-point errors

You're building a shopping cart that sums line item prices (e.g., `19.99`, `5.50`, `3.33`) and displays a total. Users occasionally report totals that look like `$28.82000000000001` or off-by-a-cent totals. How do you fix this robustly?

**Approach:** The root problem is doing float arithmetic directly on decimal currency values. The fix is either to work in integer cents throughout the calculation and only convert to dollars for display, or to round consistently before display:

```js
function toCents(dollars) { return Math.round(dollars * 100); }
function toDollars(cents) { return (cents / 100).toFixed(2); }

const items = [19.99, 5.50, 3.33];
const totalCents = items.reduce((sum, price) => sum + toCents(price), 0);
console.log(`$${toDollars(totalCents)}`); // "$28.82"
```

Doing `.reduce((a, b) => a + b)` directly on the float dollar amounts and only calling `.toFixed(2)` at the very end also mostly works for *display*, but integer-cents arithmetic is safer because it avoids compounding rounding error across many additions before you ever round — critical if the total feeds into further calculations (tax, discounts) rather than just being displayed once. Edge case: `toFixed` rounds, it doesn't truncate, so `1.005.toFixed(2)` can actually give `"1.00"` due to how `1.005` is stored in floating point — another reason to prefer integer-cent math for anything beyond final display.

## 2. Validating and parsing user-entered numeric input from a form

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

## 3. Truncating long user-generated text safely without cutting words mid-character

You need to truncate a post preview to roughly 100 characters, adding an ellipsis, but must avoid cutting in the middle of a word or, worse, in the middle of a multi-byte emoji (which would render as a broken character). How do you implement this?

**Approach:** Use `slice` for the raw truncation, then trim back to the last full word boundary, and use array-based (code-point-aware) splitting for emoji safety:

```js
function truncate(text, maxLength = 100) {
  const chars = Array.from(text); // splits by Unicode code point, not UTF-16 code unit
  if (chars.length <= maxLength) return text;
  let truncated = chars.slice(0, maxLength).join("");
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.7) truncated = truncated.slice(0, lastSpace);
  return truncated + "…";
}

console.log(truncate("The quick brown fox jumps over the lazy dog", 15));
// "The quick…" (cut at word boundary, not mid-word)
```

Edge case: plain `str.slice(0, 100)` operates on UTF-16 code units, so it can split a surrogate pair (like many emoji, which are 2 code units) right down the middle, producing an invalid/garbled character at the cut point. `Array.from(str)` iterates by Unicode code point (it uses the string's iterator, which is surrogate-pair aware), so slicing the resulting array is safe even with emoji-heavy text.

## 4. Generating a random alphanumeric ID and a random integer within a range

You need two utilities: a random integer in an inclusive range (for test data generation) and a random alphanumeric ID of a given length (for temporary keys, not cryptographic security). How do you implement both correctly?

**Approach:**

```js
function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomId(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

console.log(randomInt(1, 10));  // integer, 1 through 10 inclusive
console.log(randomId(6));       // e.g. "aZ3kQ9"
```

Edge cases: `Math.ceil`/`Math.floor` on `min`/`max` guard against callers passing non-integer bounds. The `+1` in `randomInt` is essential — without it the range would be exclusive of `max`, a classic off-by-one. Explicitly flag that `Math.random()` is not cryptographically secure — for anything security-sensitive (tokens, password reset codes) you'd need `crypto.getRandomValues()` instead, which is a common interview follow-up.
