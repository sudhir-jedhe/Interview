# Security Basics — Injection Attacks

## SQL injection

Classic SQL injection happens when user input is concatenated directly into a query string. The fix is always parameterized queries (prepared statements) — the driver sends the query structure and the values separately, so user input can never be interpreted as SQL syntax.

```js
// VULNERABLE — string concatenation
db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`);
// input: ' OR '1'='1  →  returns every row

// SAFE — parameterized query
db.query('SELECT * FROM users WHERE email = ?', [req.body.email]);
```

## NoSQL injection

The same idea in different syntax. MongoDB queries built from raw request bodies are vulnerable to *operator injection*: if `req.body.password` is an object like `{ "$gt": "" }` instead of a string, it can bypass an equality check entirely.

```js
// VULNERABLE — attacker sends { email: "a@b.com", password: { "$gt": "" } }
db.collection('users').findOne({ email: req.body.email, password: req.body.password });

// SAFE — coerce/validate types before querying, and sanitize keys starting with '$'
if (typeof req.body.password !== 'string') return res.status(400).end();
```

Libraries like `express-mongo-sanitize` strip `$`-prefixed keys from request objects to close this class of bug automatically.

## Command injection via `eval`/`child_process`

`eval(userInput)` executes arbitrary JavaScript with full access to your process — never do this with any input you don't fully control. The `child_process` equivalent is shelling out with unsanitized input via `exec()` (covered in depth in topic 13): use `execFile`/`spawn` with an argument array instead of a shell-interpreted string.

```js
// VULNERABLE
eval(req.query.expr);
exec(`ping ${req.query.host}`); // host = "8.8.8.8; rm -rf /" is catastrophic

// SAFE
execFile('ping', [req.query.host]); // args array, no shell parsing
```

The unifying idea across all three variants: never let untrusted input be interpreted as *syntax* (SQL, a MongoDB query operator, JavaScript, or a shell command) — only ever as *data*.
