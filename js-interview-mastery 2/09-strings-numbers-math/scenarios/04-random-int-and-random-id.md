# Scenario: Generating a random alphanumeric ID and a random integer within a range

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
