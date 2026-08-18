# Interview Q&A: REST Fundamentals and HTTP Semantics

**Q: What makes an API "RESTful"?**
An API that treats data as resources identified by URLs, manipulates them through standard HTTP verbs (GET/POST/PUT/PATCH/DELETE), and is stateless — each request carries all the context needed to process it, with no reliance on server-side session state tied to a connection. In practice, most APIs called "RESTful" are really just clean HTTP/JSON APIs that follow these conventions without implementing the full constraint set from Fielding's dissertation (like HATEOAS).

**Q: Why is statelessness important in REST, and what's an example of violating it?**
Statelessness lets any server instance handle any request, which is what makes horizontal scaling and load balancing straightforward — there's no "sticky session" requirement. An example violation: storing "the current step of a multi-step form" in server memory keyed by connection, instead of passing a token/ID in each request that identifies where the client is in the flow.

**Q: What's the difference between PUT and PATCH?**
`PUT` replaces the entire resource with the representation sent in the request body — any field omitted is effectively cleared. `PATCH` applies a partial update, only touching the fields included in the request. `PUT` is idempotent by design; `PATCH` may or may not be, depending on what the patch expresses (e.g. "increment by 1" isn't idempotent).

**Q: Which HTTP methods are idempotent, and why does that matter?**
`GET`, `PUT`, `DELETE`, `HEAD`, and `OPTIONS` are idempotent — calling them once has the same effect (and, for safe methods, no effect) as calling them multiple times. `POST` and, generally, `PATCH` are not. This matters for retry logic: a client (or a proxy, or a browser) can safely retry an idempotent request after a timeout without worrying about duplicate side effects, but retrying a `POST` blindly can create duplicate resources (e.g. double-charging a customer) unless you add an idempotency key.
