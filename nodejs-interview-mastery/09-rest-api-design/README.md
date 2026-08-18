# REST API Design

REST is an architectural style for designing networked APIs around resources, standard HTTP verbs, and stateless request/response cycles. This topic covers how to design URLs and payloads that are predictable and easy to consume, how to keep responses consistent so clients don't have to special-case every endpoint, and the operational concerns (versioning, validation, idempotency, rate limiting) that separate a toy API from a production-grade one. Interviewers use this topic to check whether you can design an API from scratch, not just wire up routes.

## Folder structure

```
09-rest-api-design/
  theory/          Core concepts, one focused file per topic
  snippets/         Standalone, runnable code snippets with explanations
  output-based/     "What does this code print/return?" questions with answers
  scenarios/         Real-world problem scenarios with worked approaches
  interview-qa/     Themed Q&A pairs for verbal interview prep
  problems/          Practice problems with full worked solutions
  projects/todo-rest-api/  A genuine small multi-file REST API project
  assets/            Images/PDFs from original notes (placeholder)
```

## theory/
1. `01-resources-and-http-verbs.md` — Resources as nouns, HTTP verbs as CRUD, PUT vs PATCH
2. `02-statelessness-and-url-design.md` — Why REST is stateless, URL/nesting conventions
3. `03-pagination-strategies.md` — Offset vs cursor pagination, when to use which
4. `04-versioning.md` — URL vs header versioning
5. `05-validation-and-response-shapes.md` — Validating at the boundary, consistent envelopes
6. `06-idempotency-rate-limiting-hateoas.md` — Idempotency keys, rate limiting, HATEOAS

## snippets/
Seven standalone code snippets: basic CRUD routes, pagination/filtering/sorting, URL-based versioning, Zod request validation, response envelope helpers, the idempotency key pattern, and an in-memory rate limiter.

## output-based/
Eight "what does this print?" questions covering route matching order, the missing-`return` double-response bug, PUT/PATCH semantics, query param string types, async middleware ordering, content negotiation, idempotency key reuse with a different body, and error middleware placement.

## scenarios/
Five real-world scenarios with worked approaches: preventing duplicate payments on retry, versioning a breaking API change without disrupting existing mobile clients, rate-limiting an abusive partner, unifying inconsistent error formats, and fixing slow deep pagination at scale.

## interview-qa/
Twelve Q&A pairs grouped into three themed files: REST fundamentals & HTTP semantics, API design & versioning, and responses/rate limiting/HATEOAS.

## problems/
Three practice problems with full worked solutions: designing a paginated blog API, building consistent error-response middleware, and implementing a filter/sort query-param parser.

## projects/todo-rest-api/
A genuine small multi-file REST API for a todo list — real `app.js`, routes, an in-memory data layer, Zod validation, and centralized error handling. See its own README for how to run it.
