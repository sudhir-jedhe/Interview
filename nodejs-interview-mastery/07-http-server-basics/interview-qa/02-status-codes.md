# Interview Q&A — Status Codes

**Q: What's the difference between 401 and 403 status codes?**
401 Unauthorized means the client is not authenticated — the server doesn't know who's making the request, typically due to a missing or invalid credential. 403 Forbidden means the client is authenticated but doesn't have permission to perform the action. A common naming trap: "Unauthorized" (401) is really about authentication, not authorization.

**Q: When should you use 422 instead of 400?**
400 Bad Request signals the request itself is malformed (bad JSON syntax, missing required structure). 422 Unprocessable Entity signals the request was syntactically valid and understood, but the semantic content failed validation (e.g., an email field with an invalid format, or a business rule violation). Not every API distinguishes them strictly, but it's a meaningful distinction to know.

**Q: What's the difference between 502 and 503?**
502 Bad Gateway means a server acting as a proxy/gateway received an invalid response from an upstream server it was trying to fulfill the request through. 503 Service Unavailable means the server itself is temporarily unable to handle the request (overloaded, in maintenance, or a dependency is down) — 503 often comes with a `Retry-After` header.
