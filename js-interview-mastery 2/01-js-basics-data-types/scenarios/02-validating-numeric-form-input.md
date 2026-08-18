# Validating Numeric Form Input

**Scenario:** You're validating a numeric form input from the user before submitting it to an API. How do you correctly detect invalid ("not a number") input, and what are the trap cases?

**Approach:** Don't reach for global `isNaN` — it coerces its argument, producing false positives/negatives. Convert deliberately, then check with `Number.isNaN`:

```js
function isValidNumberInput(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return false;
  const n = Number(raw);
  return !Number.isNaN(n) && Number.isFinite(n);
}

isValidNumberInput('42');       // true
isValidNumberInput('  42  ');   // true — Number() trims whitespace
isValidNumberInput('');         // false — Number('') is 0, but we reject empty explicitly
isValidNumberInput('abc');      // false
isValidNumberInput('Infinity'); // false — Number.isFinite catches this
isValidNumberInput(null);       // false — wrong type entirely
```

Edge cases: `Number('')` returns `0`, not `NaN`, so an empty field would silently pass unless you check for empty strings separately. `Number('Infinity')` is a valid finite-looking string but not a valid form value, hence the `Number.isFinite` check. Also watch for `Number('  ')` (whitespace-only) — it also becomes `0`, so trimming and checking emptiness first is essential.
