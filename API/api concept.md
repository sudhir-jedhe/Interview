Here is a detailed breakdown of all 25 core API concepts shown in your infographic, grouped by category for easy reading:

---

## 1. Core Architecture & Basics

- **1. Endpoint**
- **What it is:** A specific, unique URL pointing to a particular resource on a server (e.g., `/v1/orders/42`).
- **Why it matters:** It serves as the "address" or contract that client apps code against to reach precise data.

- **2. HTTP Methods**
- **What it is:** Standard verbs like `GET` (read), `POST` (create), `PUT` (replace), `PATCH` (partially update), and `DELETE` (remove).
- **Why it matters:** They explicitly tell the server what action to perform on the target URL resource.

- **3. Request-Response Cycle**
- **What it is:** The foundational exchange pattern where a client sends a structured request and wait for the server's reply.
- **Why it matters:** Each round trip bundles HTTP headers, a status line, and optional payload data (like JSON).

- **4. Status Codes**
- **What it is:** Standardized 3-digit HTTP responses indicating standard outcomes:
- `2xx`: Success (e.g., `200 OK`, `201 Created`)
- `4xx`: Client errors (e.g., `404 Not Found`, `429 Too Many Requests`)
- `5xx`: Server errors (e.g., `500 Internal Server Error`)

- **Why it matters:** Provides instant programmatic feedback on whether the call worked or failed.

---

## 2. Security & Access Control

- **5. Authentication (AuthN)**
- **What it is:** The process of verifying _who_ is calling the API by validating credentials (passwords, keys, tokens).
- **Why it matters:** Confirms identity before executing any server-side logic.

- **6. Authorization (AuthZ)**
- **What it is:** The process of determining _what_ a verified identity is allowed to access or perform.
- **Why it matters:** Enforces permissions (e.g., a "reader" role can fetch data but cannot write/delete).

- **7. Access Tokens**
- **What it is:** Short-lived security strings (like JWTs) sent in the request header (e.g., `Bearer eyJ...`).
- **Why it matters:** Eliminates the need to send raw passwords on every request and limits exposure if leaked.

- **8. OAuth 2.0**
- **What it is:** An authorization framework allowing user consent for third-party access without revealing passwords.
- **Why it matters:** Powers secure, scoped single-sign-on (SSO) and delegated API permissions.

---

## 3. Traffic Control & Performance

- **9. Rate Limiting**
- **What it is:** Hard limits on how many requests a client can make within a specified time window (e.g., 100 req/min).
- **Why it matters:** Rejects excess traffic with a `429 Too Many Requests` code to protect system resources from abuse.

- **10. Throttling**
- **What it is:** Intentionally slowing down or queueing traffic instead of immediately rejecting requests outright.
- **Why it matters:** Smooths out sharp traffic bursts into a steady, manageable flow.

- **11. Pagination**
- **What it is:** Splitting massive datasets into smaller chunks or pages (e.g., `?page=1`, `?limit=20`).
- **Why it matters:** Prevents slow query times, massive payload transfers, and server memory exhaustion.

- **12. Caching**
- **What it is:** Storing recent API responses in fast-access memory (e.g., Redis or CDN) to serve duplicate requests instantly.
- **Why it matters:** Reduces database load and significantly decreases response latency.

---

## 4. Design & Integration Patterns

- **13. Idempotency**
- **What it is:** Ensuring that making the same request multiple times produces the exact same outcome as making it once.
- **Why it matters:** Prevents duplicate operations (like double-charging a credit card) when retrying failed requests.

- **14. Webhooks**
- **What it is:** Event-driven architecture where the API server pushes an HTTP `POST` to your server when an event happens.
- **Why it matters:** Eliminates constant, resource-heavy polling for status updates.

- **15. API Versioning**
- **What it is:** Structuring URLs or headers (e.g., `/v1/users` vs `/v2/users`) to introduce breaking changes.
- **Why it matters:** Lets newer features roll out without breaking older client integrations.

- **16. OpenAPI / Swagger**
- **What it is:** A machine-readable specification language (YAML/JSON) defining how an API behaves.
- **Why it matters:** Automatically generates interactive documentation, client SDKs, and mock testing servers.

---

## 5. Architectural Paradigms & Infrastructure

- **17. REST vs GraphQL**
- **REST:** Relies on multiple fixed endpoint URLs returning standardized data shapes.
- **GraphQL:** Uses a single endpoint where clients query for only the exact fields they need.

- **18. API Gateway**
- **What it is:** A centralized reverse-proxy routing layer sitting in front of backend services.
- **Why it matters:** Handles cross-cutting concerns like authentication, rate limiting, and request routing in one place.

- **19. Microservices Architecture**
- **What it is:** Decomposing applications into small, independently deployable services that communicate via APIs.
- **Why it matters:** Isolates system failures and lets teams scale individual components independently.

- **20. Error Handling**
- **What it is:** Returning standardized error responses containing consistent error shapes, codes, and context.
- **Why it matters:** Allows client applications to gracefully handle issues instead of guessing failure causes.

---

## 6. Protocols & Reliability Patterns

- **21. gRPC**
- **What it is:** A high-performance, contract-first RPC framework operating over HTTP/2 using Protocol Buffers.
- **Why it matters:** Delivers low-latency, low-bandwidth binary communication ideally suited for internal microservice traffic.

- **22. WebSockets & Server-Sent Events (SSE)**
- **What it is:** Persistent, open connections enabling immediate real-time data flow.
- **Why it matters:** Perfect for live updating dashboards, chat systems, and real-time feeds without repeated polling.

- **23. CORS (Cross-Origin Resource Sharing)**
- **What it is:** Browser security headers determining which external domains are allowed to call your API.
- **Why it matters:** Prevents unauthorized web apps from making requests on behalf of users in browser environments.

- **24. Retries & Exponential Backoff**
- **What it is:** Automatically re-sending failed requests with progressively increasing delays (and added jitter).
- **Why it matters:** Allows temporary network blips to resolve smoothly without overloading recovering servers.

- **25. Circuit Breaker**
- **What it is:** A design pattern that stops calling a struggling downstream service once a failure threshold is hit.
- **Why it matters:** Fails fast with fallback responses to prevent cascading system outages across microservices.
