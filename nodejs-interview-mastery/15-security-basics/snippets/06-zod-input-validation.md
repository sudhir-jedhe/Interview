# Snippet: Input validation with `zod` before touching a database

```js
const { z } = require('zod');
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

app.post('/signup', (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.issues });
  res.status(201).json({ ok: true });
});
```

**Explanation:** `safeParse` validates `req.body` against the schema without throwing, returning a discriminated result (`success: true/false`) that's easy to branch on. This enforces the API contract (correct types, minimum password length) before any of that data reaches business logic or a database query — rejecting malformed requests early with a clear, structured error response.
