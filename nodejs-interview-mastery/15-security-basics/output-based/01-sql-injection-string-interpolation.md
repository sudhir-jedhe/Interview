# Output-Based: SQL injection via string interpolation

```js
function buildQuery(email) {
  return `SELECT * FROM users WHERE email = '${email}'`;
}
console.log(buildQuery("' OR '1'='1"));
```

**Answer:** `SELECT * FROM users WHERE email = '' OR '1'='1'`

**Why:** String interpolation doesn't escape SQL metacharacters, so the attacker-supplied quote closes the string literal early, and `OR '1'='1'` turns the `WHERE` clause into an always-true condition, returning every row instead of matching a single user. This is textbook SQL injection — the fix is a parameterized query, not more string escaping.
