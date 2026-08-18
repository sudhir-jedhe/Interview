# Snippet: URL-Based API Versioning with Separate Routers

```js
const v1Router = express.Router();
const v2Router = express.Router();

v1Router.get('/users/:id', (req, res) => res.json({ id: req.params.id, name: 'Jed' }));
// v2 changes the response shape (breaking change) without touching v1 clients
v2Router.get('/users/:id', (req, res) => res.json({ data: { id: req.params.id, fullName: 'Jed' } }));

app.use('/v1', v1Router);
app.use('/v2', v2Router);
```

**Explanation:** Each API version gets its own `express.Router()` mounted under its own path prefix. Because the routers are completely independent, `v2` is free to change field names (`name` → `fullName`) or nest the response differently without breaking any client still calling `/v1/users/:id`. This is the simplest form of URL-based versioning — the routers can share underlying data-access code while differing only in how they shape the response.
