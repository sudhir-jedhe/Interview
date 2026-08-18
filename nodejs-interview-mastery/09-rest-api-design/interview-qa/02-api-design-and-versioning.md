# Interview Q&A: API Design and Versioning

**Q: How would you design pagination for a large, frequently-changing dataset?**
Use cursor-based pagination instead of offset/page-based pagination. Encode a pointer to the last-seen row (typically its ID or a compound sort key) and query `WHERE id > :cursor ORDER BY id LIMIT :n`. This uses an index instead of scanning-and-discarding rows via `OFFSET`, and it's stable against concurrent inserts/deletes, whereas offset pagination can skip or duplicate rows when the underlying data shifts between page requests.

**Q: How do you handle API versioning, and which approach do you prefer?**
Two mainstream approaches: put the version in the URL path (`/v1/users`) or negotiate it via headers (`Accept: application/vnd.api.v1+json`). URL versioning is easier to test, cache, and discover — you can see it in logs and curl it directly — which is why most public APIs (Stripe, GitHub) use it. Header versioning keeps the URL "canonical" per REST purism but adds friction for debugging and caching. In practice, I'd default to URL versioning unless there's an existing infrastructure reason (CDN/cache key strategy) to prefer headers.

**Q: Should resource URLs contain verbs? Give an example of a case that seems to need one, and how you'd handle it.**
Generally no — verbs belong in the HTTP method, not the URL. For actions that don't map cleanly to CRUD, like "cancel an order" or "send a password reset email," model the action as a sub-resource you create, e.g. `POST /orders/7/cancellation` or `POST /password-resets`, rather than `POST /orders/7/cancel`. This keeps the URL nominal (a "cancellation" is a resource being created) while still expressing an action-like operation.

**Q: Why should you validate requests at the API boundary rather than deeper in the business logic?**
Validating at the boundary (in middleware, before the handler's core logic runs) fails fast with a clear `400` and a specific error message, keeps malformed data out of the database and downstream services entirely, and centralizes the validation rules so they're not duplicated or inconsistently applied across different code paths that happen to touch the same resource.
