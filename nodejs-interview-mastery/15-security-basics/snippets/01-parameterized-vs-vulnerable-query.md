# Snippet: Parameterized query vs vulnerable string concatenation

```js
function findUserSafe(db, email) {
  return db.query('SELECT * FROM users WHERE email = ?', [email]); // safe
}
function findUserVulnerable(db, email) {
  return db.query(`SELECT * FROM users WHERE email = '${email}'`); // never do this
}
```

**Explanation:** `findUserSafe` passes `email` as a bound parameter — the driver sends the query structure and value separately, so the database never interprets `email`'s contents as SQL syntax, no matter what it contains. `findUserVulnerable` interpolates the raw value directly into the query string, so a value like `' OR '1'='1` changes the query's logic entirely.
