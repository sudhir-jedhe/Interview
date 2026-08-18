# Security Basics — Input Validation and Sanitization

## Validation vs sanitization

Validation confirms input matches an expected shape/type (reject if not); sanitization transforms input to a safe form (e.g., stripping HTML tags). Both matter — validation alone doesn't stop stored XSS if you accept a "bio" field but never escape it on render. Use a schema library (`zod`, `joi`, `express-validator`) rather than ad hoc `if` checks scattered through handlers.

```js
const { z } = require('zod');
const schema = z.object({ email: z.string().email(), age: z.number().int().min(0) });
const result = schema.safeParse(req.body);
if (!result.success) return res.status(400).json(result.error);
```

| Aspect | Validation | Sanitization |
|---|---|---|
| Goal | Reject input that doesn't match expected shape/type | Transform input into a safe form |
| Example | Reject a signup if `email` isn't a valid email format | Strip `<script>` tags from a free-text "bio" field before storing/rendering |
| Failure mode if skipped | Malformed/malicious data reaches business logic or the DB | Otherwise "valid" input (a well-formed string) still carries a stored-XSS payload |

Use validation to enforce your API contract (correct types, required fields, ranges) and sanitization specifically for freeform content that will later be rendered as HTML or interpreted in another context. The common mistake is validating input (confirming it's *a string*) and assuming that's sufficient — a syntactically valid string can still contain `<script>` or SQL-meaningful characters that need separate handling at the point they're used.
