# Snippet: Request Validation with Zod, Rejecting Bad Payloads Before Business Logic

```js
const { z } = require('zod');

const createOrderSchema = z.object({
  userId: z.number().int().positive(),
  items: z.array(z.object({ sku: z.string(), qty: z.number().int().positive() })).min(1),
});

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: { message: 'Validation failed', details: result.error.issues } });
    }
    req.body = result.data;
    next();
  };
}

app.post('/orders', validateBody(createOrderSchema), (req, res) => {
  res.status(201).json({ data: { id: 1, ...req.body } });
});
```

**Explanation:** `validateBody` is a reusable middleware factory — pass it any Zod schema and it returns middleware that validates `req.body` against it before the route handler ever runs. `safeParse` (as opposed to `parse`) doesn't throw; it returns a `{ success, data | error }` result you can branch on cleanly. On success, `req.body` is reassigned to the *parsed* data, which is both validated and coerced to the schema's declared types — the handler downstream can trust its shape completely.
