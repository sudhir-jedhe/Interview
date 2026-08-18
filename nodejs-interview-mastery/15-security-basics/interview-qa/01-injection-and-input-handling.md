# Interview Q&A: Injection and Input Handling

**Q: What is SQL injection and how do parameterized queries prevent it?**

SQL injection happens when untrusted input is concatenated directly into a query string, letting an attacker inject SQL syntax (e.g., `' OR '1'='1`) that changes the query's logic. Parameterized queries send the query structure and the values as separate channels to the database driver — the driver never interprets a bound value as part of the SQL grammar, so injected syntax is treated as inert literal data instead of executable SQL.

**Q: How can NoSQL databases like MongoDB be vulnerable to injection, given there's no SQL string to concatenate?**

MongoDB queries are JS objects, and query operators (`$gt`, `$ne`, `$where`) are valid object keys. If a request body is passed straight into a query without validating that fields are the expected primitive type, an attacker can submit `{ "$ne": null }` instead of a plain string password, bypassing an intended equality check. The fix is validating input types before it reaches the query (or a sanitization middleware that strips `$`-prefixed keys).

**Q: What's the difference between input validation and sanitization, and why do you need both?**

Validation checks that input matches an expected type/shape and rejects it if not (e.g., "is this a valid email?"). Sanitization transforms input into a safe form for a specific context (e.g., stripping `<script>` tags before rendering as HTML). A string can pass validation (it's a well-formed string) while still containing a stored-XSS payload — sanitization (or context-aware output escaping) is what actually prevents that from executing.

**Q: Why is `eval()` on user input dangerous, and what's the equivalent risk in `child_process`?**

`eval()` executes arbitrary JavaScript with the full privileges of your process — any attacker-controlled string becomes code you're running. The `child_process` equivalent is `exec()` with unsanitized input, since `exec` passes its command through a shell; shell metacharacters like `;` or `&&` let an attacker chain additional commands. The fix in both cases is avoiding execution of untrusted strings — for shelling out, use `execFile`/`spawn` with an argument array instead of a shell-interpreted string.
