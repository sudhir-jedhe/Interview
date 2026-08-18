# Validation and Consistent Response Shapes

## Validation at the boundary

Never trust input. Validate as early as possible — before it touches business logic or the database — using a schema library like `zod` or `joi`:

```js
const { z } = require('zod');

const createUserSchema = z.object({
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

app.post('/users', (req, res, next) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Invalid payload', details: parsed.error.issues } });
  }
  // parsed.data is now typed and safe to use
  res.status(201).json({ data: parsed.data });
});
```

Validating in middleware (before the handler's core logic runs) fails fast with a clear `400`, keeps malformed data out of the database entirely, and centralizes rules so they're not duplicated or inconsistently applied across code paths touching the same resource.

## Consistent response shapes

Pick one envelope and use it everywhere — e.g. `{ data, meta }` for success and `{ error: { message, code } }` for failure. Clients should never have to guess whether a field is at the top level or nested, and a UI's global error handler can rely on one shape across every endpoint instead of special-casing each route.

```js
function ok(res, data, meta) {
  return res.json(meta ? { data, meta } : { data });
}
function fail(res, status, message, code) {
  return res.status(status).json({ error: { message, code } });
}

app.get('/products/:id', (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) return fail(res, 404, 'Product not found', 'PRODUCT_NOT_FOUND');
  ok(res, product);
});
```

A related trap: returning `200 OK` for every response and putting the real status in the JSON body (`{ success: false, message: 'not found' }`). This breaks caches, proxies, monitoring based on status codes, load balancer health checks, and generic HTTP client error handling (`fetch`/`axios` won't throw or reject) — always let the HTTP status code reflect the actual outcome.
