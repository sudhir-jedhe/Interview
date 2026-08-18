# Interview Q&A: Responses, Rate Limiting, and HATEOAS

**Q: What should a consistent error response look like, and why does consistency matter?**
Pick one envelope, e.g. `{ "error": { "code": "VALIDATION_FAILED", "message": "...", "details": [...] } }`, and use it for every error across every endpoint, paired with an appropriate HTTP status code (400 for validation, 401/403 for auth, 404 for missing resources, 409 for conflicts, 500 for unexpected server errors). Consistency lets client code write one generic error handler instead of special-casing the shape per endpoint, which is exactly the kind of thing frontend teams get burned by when every route was built by a different backend engineer.

**Q: What is HATEOAS and why is it rarely implemented in practice?**
Hypermedia As The Engine Of Application State — the idea that API responses include links describing what actions are available next (e.g. an order response includes a `cancel` link only if the order is still cancellable), so clients don't hardcode URL structure or business rules about what's currently allowed. It's rarely fully implemented because it adds real payload size and client complexity, and most client applications are built by the same team as the API and are perfectly happy hardcoding routes — the discoverability HATEOAS provides mostly matters for loosely-coupled, third-party-consumed APIs.

**Q: How would you design rate limiting for a public API?**
Key the limit by API key (or IP for unauthenticated endpoints), use a sliding-window or token-bucket algorithm backed by a shared store like Redis (so limits are enforced correctly across multiple server instances), and respond with `429 Too Many Requests` plus a `Retry-After` header and `RateLimit-*` headers so well-behaved clients can back off automatically. Consider tiered limits (different quotas per plan) and separate, stricter limits on expensive endpoints (e.g. search or export) versus cheap ones.

**Q: What's wrong with returning `200 OK` for every response and putting the real status in the JSON body (e.g. `{ "success": false, "message": "not found" }`)?**
It breaks every piece of standard HTTP tooling — caches, proxies, monitoring/alerting based on status codes, load balancer health checks, and generic HTTP client error handling (`fetch`/`axios` won't throw or reject) all assume the status code reflects the actual outcome. Clients are forced to parse every response body just to know if it succeeded, which defeats a core purpose of using HTTP semantics in the first place.
