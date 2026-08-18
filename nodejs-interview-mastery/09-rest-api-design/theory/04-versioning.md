# API Versioning

Two common approaches: URL path (`/v1/users`) and header-based (`Accept: application/vnd.myapi.v1+json` or a custom `X-API-Version` header). The real interview point is knowing *why* you version at all: so you can change a resource's shape without breaking existing clients.

## URL versioning vs Header versioning

| Aspect | URL versioning (`/v1/users`) | Header versioning (`Accept: application/vnd.api.v1+json`) |
|---|---|---|
| Discoverability | Very high — visible in browser, logs, docs, curl | Low — invisible unless you inspect headers |
| Caching | Trivial (URL is the cache key) | Needs `Vary: Accept` support from caches/CDNs |
| "RESTful purity" | Arguably violates the idea that a URL identifies one resource | Considered more "correct" by REST purists — same URI, different representation |

Use URL versioning for public/partner APIs where simplicity and debuggability matter most (Stripe, GitHub v3 do this); use header versioning if you have strict caching/CDN infrastructure and value keeping URLs canonical. The common mistake is switching schemes mid-project — pick one at the start and document it, since migrating versioning strategy itself is a breaking change.

## Implementation pattern (URL versioning)

```js
const v1Router = express.Router();
const v2Router = express.Router();

v1Router.get('/users/:id', (req, res) => res.json({ id: req.params.id, name: 'Jed' }));
// v2 changes the response shape (breaking change) without touching v1 clients
v2Router.get('/users/:id', (req, res) => res.json({ data: { id: req.params.id, fullName: 'Jed' } }));

app.use('/v1', v1Router);
app.use('/v2', v2Router);
```

Keep the old version's router running untouched while the new version stabilizes, and only remove it once traffic against it has dropped to near zero (verified from access logs) — ideally after warning remaining clients with a `Sunset` response header.
