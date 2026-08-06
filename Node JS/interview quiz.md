These topics align well with your experience using **Node.js, Express, MongoDB, Git, and AWS** in projects described in your resumes. [\[Sudhir_Jed..._Optimized \| Word\]](https://persistentsystems-my.sharepoint.com/personal/sudhir_jedhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7B6D62BFD5-1C8F-43D9-B7DD-A310E3955486%7D&file=Sudhir_Jedhe_3Page_Recruiter_Optimized.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Sudhir Jedhe 2 \| Word\]](https://persistentsystems-my.sharepoint.com/personal/sudhir_jedhe_persistent_com/_layouts/15/Doc.aspx?sourcedoc=%7BF58C5747-96DD-4F3E-BB6A-900C2EBA385C%7D&file=Sudhir%20Jedhe%202.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

# JavaScript / Node.js

### 1. What is the primary function of Node.js?

Node.js is a JavaScript runtime built on the V8 engine that allows JavaScript to run on servers and build backend applications.

***

### 2. What does bcrypt hash function do?

Used for:

```text
Password Hashing
Password Verification
```

Example:

```javascript
bcrypt.hash(password, 10);
bcrypt.compare(password, hash);
```

***

### 3. What is Object.freeze()?

Prevents modification of an object.

```javascript
const user = { name: "Sudhir" };

Object.freeze(user);

user.name = "John";

console.log(user.name);
```

Output:

```javascript
Sudhir
```

***

### 4. Purpose of Symbol?

Creates unique values.

```javascript
const id1 = Symbol();
const id2 = Symbol();

console.log(id1 === id2);
```

Output:

```javascript
false
```

Used for unique object keys.

***

### 5. Output of typeof null?

```javascript
typeof null
```

Output:

```javascript
"object"
```

This is a historical JavaScript bug.

***

### 6. What does npm install do?

```bash
npm install
```

Installs dependencies listed in:

```json
package.json
```

***

### 7. What is a callback function?

A function passed as an argument to another function.

```javascript
function greet(cb) {
  cb();
}

greet(() =>
  console.log("Hello")
);
```

***

### 8. What does NaN === NaN return?

```javascript
NaN === NaN
```

Output:

```javascript
false
```

Correct check:

```javascript
Number.isNaN(value)
```

***

### 9. Purpose of WeakMap?

Stores object keys weakly.

Benefits:

```text
Memory Efficient
Garbage Collection Friendly
```

```javascript
const wm = new WeakMap();
```

***

### 10. What does Express.js provide?

```text
Routing
Middleware
REST APIs
Request Handling
```

***

### 11. Purpose of Middleware?

Processes requests before reaching routes.

Examples:

```text
Auth
Logging
Validation
Error Handling
```

***

### 12. How do you protect routes in Express?

Authentication middleware.

```javascript
app.get(
  "/admin",
  authMiddleware,
  controller
);
```

***

### 13. Module used for JWT authentication?

Popular libraries:

```bash
jsonwebtoken
passport-jwt
```

***

### 14. What is JWT?

JWT (JSON Web Token) is a signed token used for stateless authentication.

Structure:

```text
Header.Payload.Signature
```

***

### 15. What does JWT Payload contain?

Contains claims.

Example:

```json
{
  "userId": 101,
  "role": "ADMIN",
  "exp": 123456789
}
```

***

# MongoDB

### 16. Which strategies combine documents?

Common approaches:

```text
$lookup
$unionWith
```

***

### 17. What does $unwind do?

Converts array elements into separate documents.

Example:

```javascript
{
 tags: ["A","B"]
}
```

Becomes:

```javascript
{ tags:"A" }
{ tags:"B" }
```

***

### 18. Purpose of $merge and $out?

### $merge

Writes output into existing collection.

### $out

Creates/replaces a collection.

***

### 19. Advantage of WiredTiger?

```text
Compression
Better Concurrency
Improved Performance
```

***

### 20. What does $size do?

Returns array length.

```javascript
{
 tags: {
   $size: 3
 }
}
```

***

### 21. Purpose of $facet?

Runs multiple pipelines simultaneously.

```javascript
{
  $facet: {
    products: [...],
    categories: [...]
  }
}
```

***

### 22. What does $bucket do?

Groups documents into ranges.

Example:

```javascript
0-100
101-500
501-1000
```

Useful for analytics.

***

### 23. Difference between $in and $nin?

### $in

```javascript
{
 status: {
   $in: ["A","B"]
 }
}
```

Match included values.

***

### $nin

```javascript
{
 status: {
   $nin: ["A","B"]
 }
}
```

Match excluded values.

***

### 24. Which operator matches values in array?

```javascript
$in
```

Example:

```javascript
{
 tags: {
   $in: ["React"]
 }
}
```

***

# SQL

### 25. Which clause filters records?

```sql
WHERE
```

Example:

```sql
SELECT *
FROM users
WHERE age > 18;
```

***

# Git

### 26. What does .gitignore do?

Specifies files Git should ignore.

Example:

```text
node_modules

.env

dist
```

***

### 27. Change latest commit message?

```bash
git commit --amend -m "New Message"
```

***

### 28. Primary purpose of Git?

```text
Version Control
Source Code Tracking
Collaboration
```

***

# AWS

### 29. Primary function of Elastic Beanstalk?

PaaS service that automatically deploys and manages applications.

Supports:

```text
Node.js
Java
Python
.NET
PHP
```

***

### 30. Benefits of Elastic Beanstalk?

```text
Auto Scaling
Load Balancing
Easy Deployment
Monitoring
Infrastructure Management
```

***

### 31. Purpose of S3 Versioning?

Keeps multiple versions of objects.

Benefits:

```text
Recovery
Accidental Delete Protection
Rollback Support
```

***

### 32. Purpose of Lifecycle Policies?

Automatically move or delete objects.

Example:

```text
30 Days → Glacier

365 Days → Delete
```

***

### 33. How does Intelligent-Tiering reduce cost?

Automatically moves objects between access tiers based on usage patterns.

```text
Frequently Accessed

Infrequently Accessed

Archive
```

No manual intervention.

***

### 34. Difference Between Storage Classes

| Storage              | Retrieval Speed  | Cost    |
| -------------------- | ---------------- | ------- |
| S3 Standard          | Milliseconds     | Highest |
| Glacier              | Minutes to Hours | Lower   |
| Glacier Deep Archive | Up to 12 hours   | Lowest  |

Use cases:

```text
Standard → Active Files

Glacier → Backups

Deep Archive → Compliance Data
```

***

### 35. What is AWS KMS?

AWS Key Management Service.

Used for:

```text
Encryption Keys
Data Encryption
Secrets Protection
Key Rotation
```

Example Services:

```text
S3
RDS
EBS
Lambda
Secrets Manager
```

### Interview Answer

> AWS KMS is a managed encryption service used to create, rotate, and manage cryptographic keys. It integrates with AWS services such as S3, RDS, and EBS to encrypt data at rest and helps organizations meet security and compliance requirements.

## Most Important Interview Questions From This List

```text
✅ JWT & Authentication

✅ bcrypt

✅ Middleware

✅ WeakMap

✅ Object.freeze()

✅ MongoDB Aggregation ($lookup, $facet, $unwind)

✅ Git (.gitignore, amend)

✅ Elastic Beanstalk

✅ S3 Storage Classes

✅ KMS

✅ npm

✅ Callback Functions
```

These are the questions most frequently asked in Senior Full Stack (React + Node.js + MongoDB + AWS) interviews.

7 Node.js Backend Interview Questions Every Backend Engineer Should Practice (Production-Focused)

If you're preparing for Node.js Backend Developer interviews, don't just revise Express.js APIs or CRUD operations.

Most mid-level and senior interviews now revolve around real production scenarios—how you troubleshoot outages, improve performance, scale services, and design reliable systems.

Here are 32 frequently discussed production-focused Node.js interview questions worth practicing.

⚡ Performance & Scalability

1. An API latency jumps from 100ms to 2 seconds in production. How would you diagnose it?

2. Your service suddenly receives 10K+ requests/second. How would you scale it?

3. During peak traffic, the Node.js application stops responding. What would you investigate first?

4. How do you detect Event Loop blocking in a production environment?

5. CPU-intensive operations are slowing every request. What architectural changes would you make?

🗄 Database Optimization

1. Your database connection pool is exhausted. How do you identify the root cause?

2. A MongoDB query becomes significantly slower overnight. What would you check?

3. Database CPU utilization suddenly reaches 90%. How would you troubleshoot it?

4. How do you detect and eliminate N+1 query issues?

5. Which database optimization techniques have improved performance in your projects?

⚡ Caching

 1. Users receive outdated data after updates while Redis is enabled. What might be causing it?

 2. How would you design an effective cache invalidation strategy?

 3. When is caching not the right solution?

🔗 Microservices

 1. Service A depends on Service B, but Service B is unavailable. How do you prevent cascading failures?

 2. What is the Circuit Breaker pattern, and why is it useful?

 3. How do you improve resilience between microservices?

 4. How do you handle retries, timeouts, and fallback mechanisms?

📩 Queues & Asynchronous Processing

 1. Why should emails and notifications be processed asynchronously?

 2. A message queue backlog keeps growing. How would you investigate it?

 3. What is a Dead Letter Queue (DLQ), and when would you use one?

 4. How do you ensure messages aren't processed multiple times?

🧠 Memory & Debugging

 1. Memory usage keeps increasing until the application crashes. How would you debug it?

 2. What approaches help identify memory leaks in production?

 3. Which tools have you used for heap dumps, profiling, and performance analysis?

🔒 Security

 1. What steps would you take to secure a production Node.js API?

 2. How would you defend login endpoints against brute-force attacks?

 3. How do you mitigate SQL Injection and NoSQL Injection vulnerabilities?

Here are concise, production-ready answers for these key Node.js backend interview questions.

---

### ⚡ Performance & Scalability

#### 1. API latency jumps from 100ms to 2s. How would you diagnose it?

* **APM & Distributed Tracing:** Check Application Performance Monitoring (APM) tools like Datadog or New Relic to break down transaction traces into database query times, external HTTP calls, and internal CPU execution.
* **Database & Dependencies:** Check for slow queries, missing indexes, connection pool exhaustion, or downstream microservice latencies.
* **Event Loop Health:** Measure event loop delay (`perf_hooks`) to see if synchronous, un-offloaded operations are blocking the single thread.

#### 2. Service receives 10K+ requests/sec. How would you scale it?

* **Horizontal Scaling & Clustering:** Deploy multiple instances across CPU cores using Node.js `cluster` or PM2, and scale horizontally using Kubernetes pods behind a Layer 7 Load Balancer (Nginx/ALB).
* **Caching & Offloading:** Place a Redis cache layer in front of the database for hot read paths, and handle heavy write tasks asynchronously using queues (BullMQ/Kafka).
* **Rate Limiting & CDNs:** Put Cloudflare/AWS CloudFront in front of static assets and implement rate-limiting middleware to drop malicious or unthrottled burst traffic.

#### 3. During peak traffic, Node.js stops responding. What to investigate first?

* **Event Loop Blocking:** Inspect CPU usage metrics to check if synchronous operations (e.g., heavy `JSON.parse`, Regex backtracking, sync encryption) are starving the event loop.
* **Memory & Garbage Collection (GC):** Check if frequent GC pauses ("GC thrashing") are freezing execution due to low memory or heap limits.
* **Connection Pool / Socket Limits:** Verify if open database connections, downstream HTTP client connections, or file descriptors (`ulimit`) are maxed out.

#### 4. How to detect Event Loop blocking in production?

* **Node.js `perf_hooks`:** Monitor `eventLoopUtilization()` (ELU) or measure delay with `monitorEventLoopDelay()`.
* **APM Monitoring:** Enable Event Loop metrics in APM tools (e.g., Datadog, Prometheus `nodejs_eventloop_lag_seconds`).
* **Tooling:** Use lightweight production diagnostics like `blocked-at` in staging or continuous profilers (Datadog Profiler, Clinic.js).

#### 5. CPU-intensive operations slow every request. What architectural changes to make?

* **Worker Threads:** Offload CPU-bound tasks (like image processing or crypto hashing) to Node.js `worker_threads` to keep the main event loop responsive.
* **Background Job Queues:** Offload non-blocking heavy tasks completely to standalone worker processes via message queues (BullMQ/RabbitMQ).
* **Microservices / Native Addons:** Extract CPU-heavy logic into dedicated services built in Go/Rust, or compile C++ native addons.

---

### 🗄 Database Optimization

#### 6. Database connection pool is exhausted. How to identify root cause?

* **Unclosed Connections:** Look for unhandled errors or missing `finally` blocks where connections/transactions aren't properly released back to the pool.
* **Slow Long-Running Queries:** Identify slow queries holding onto connections while executing or waiting for locks.
* **Inadequate Pool Sizing / Scaling:** Check if the application pool size is too small relative to the number of concurrent pods or if database connection limits need adjustment.

#### 7. MongoDB query becomes slow overnight. What to check?

* **Index Fragmentation / Drops:** Check `db.collection.explain("executionStats")` to see if an index was dropped, un-utilized, or if a `COLLSCAN` (collection scan) is occurring.
* **Data Growth & Working Set:** Verify if the index size now exceeds available RAM, forcing MongoDB to read from disk.
* **Locking & Write Contention:** Inspect system metrics for high document locking or heavy background indexing jobs running overnight.

#### 8. Database CPU reaches 90%. How to troubleshoot?

* **Identify Top Queries:** Inspect database slow-query logs (`pg_stat_statements` in Postgres, Profiler in MongoDB).
* **Missing / Unused Indexes:** Add indexes for high-frequency `WHERE`, `JOIN`, and `SORT` clauses.
* **Over-Fetching:** Check if queries are running `SELECT *` or returning thousands of un-paginated rows instead of using projection and pagination.

#### 9. How to detect and eliminate N+1 query issues?

* **Detection:** Use ORM query loggers (Prisma, TypeORM, Mongoose) or APM tracing to spot repeated single-item queries inside loops.
* **Elimination:** Replace loop-based queries with bulk fetching using SQL `JOIN`s, `WHERE id IN (...)`, or batching tools like Dataloader.

#### 10. Database optimization techniques that improve performance

* **Indexing Strategies:** Adding composite, partial, or covering indexes.
* **Read-Replicas & Connection Pooling:** Routing read queries to replicas and using PgBouncer/ProxySQL.
* **Pagination & Projection:** Implementing cursor-based pagination (keyset pagination) and projecting only needed fields.

---

### ⚡ Caching

#### 11. Users receive outdated data after updates with Redis enabled. Why?

* **Missing Cache Invalidation:** The write/update endpoint succeeded in the database but failed to delete/update the corresponding Redis key.
* **TTL Configuration:** Cache entries lack an expiration time (TTL) or have an excessively long TTL without active invalidation.
* **Race Conditions / Cache Stamps:** Concurrent writes updated the database while an older read re-populated Redis with stale data.

#### 12. How to design an effective cache invalidation strategy?

* **Write-Through / Cache-Aside:** Use **Cache-Aside** (Lazy Loading): Read from Redis $\rightarrow$ on miss, fetch from DB and populate Redis. On mutation, explicitly invalidate (`DEL`) or update the cache key.
* **Keyspace Patterns:** Use predictable hierarchical keys (`user:123:profile`) so dependent keys can be invalidated or pattern-matched easily.
* **TTL Safeguards:** Always attach reasonable TTLs to prevent dirty cache entries from persisting indefinitely.

#### 13. When is caching NOT the right solution?

* **High-Frequency Dynamic Writes:** Data that changes constantly (e.g., real-time stock prices or live location tracking) causes cache invalidation overhead to exceed the database read cost.
* **Transactional / Financial Data:** Strict consistency requirements where serving slightly stale data leads to business/security failures.
* **Low-Read / High-Cardinality Data:** Single-use data that is rarely re-read.

---

### 🔗 Microservices

#### 14. Service B is unavailable. How to prevent cascading failures in Service A?

* **Short Timeouts:** Set aggressive request timeouts so Service A doesn't hold open connections waiting indefinitely.
* **Circuit Breaker:** Fail fast immediately when error thresholds are crossed without sending extra traffic to Service B.
* **Graceful Degradation:** Fall back to cached data, default values, or queue the request for asynchronous retry.

#### 15. What is the Circuit Breaker pattern and why is it useful?

* **Mechanism:** Wraps remote calls in a state machine (**Closed** $\rightarrow$ **Open** $\rightarrow$ **Half-Open**). If consecutive failures cross a threshold, the circuit opens, failing calls immediately without hitting the downstream service.
* **Benefit:** Gives failing downstream services room to recover and prevents thread/connection pool exhaustion in the upstream service.

#### 16. How to improve resilience between microservices?

* **Asynchronous Event-Driven Architecture:** Replace direct HTTP REST calls with message brokers (Kafka/RabbitMQ) for non-blocking workflows.
* **Health Checks & Auto-Healing:** Expose `/healthz` endpoints for Kubernetes readiness and liveness probes.
* **Idempotency:** Ensure all retried operations use unique request/idempotency keys.

#### 17. How to handle retries, timeouts, and fallback mechanisms?

* **Retries with Exponential Backoff + Jitter:** Avoid thundering herd problems by adding randomized delays between retry attempts.
* **Strict Timeouts:** Set network-level timeouts (e.g., 2000ms) on HTTP clients (Axios, Fetch, gRPC).
* **Fallbacks:** Provide degraded responses (e.g., returning cached user data or static fallbacks) when downstream endpoints fail.

---

### 📩 Queues & Asynchronous Processing

#### 18. Why process emails/notifications asynchronously?

* **Latency Reduction:** Sending emails involves slow third-party API calls (e.g., SendGrid, SES). Offloading them allows the HTTP response to return to the user instantly.
* **Fault Tolerance:** If the email provider is down, the job remains safe in the queue to be retried later without failing the user's HTTP request.

#### 19. Message queue backlog keeps growing. How to investigate?

* **Consumer Bottleneck:** Check if consumer processing is slower than the producer publishing rate (e.g., unindexed DB operations inside consumers).
* **Consumer Crash / Errors:** Verify if consumers are crashing due to unhandled exceptions or memory leaks.
* **Scaling:** Check if auto-scaling rules should trigger more consumer instances to process partitions concurrently.

#### 20. What is a Dead Letter Queue (DLQ) and when to use it?

* **Definition:** A dedicated queue where messages that repeatedly fail processing (exceeding max retry limits) are moved.
* **Use Case:** Prevents "poison pill" messages from blocking the main queue indefinitely, allowing developers to inspect, fix, and replay failed jobs manually.

#### 21. How to ensure messages aren't processed multiple times?

* **Idempotency Keys:** Include a unique `messageId` or transaction ID in the payload.
* **Deduplication Store:** Before executing a job, consumers check Redis/DB (`SETNX messageId`) to confirm if the ID has already been processed.

---

### 🧠 Memory & Debugging

#### 22. Memory usage keeps increasing until application crashes. How to debug?

* **Reproduce Locally:** Take baseline and post-load heap snapshots using `--inspect` in Chrome DevTools or Node Inspector.
* **Identify Growing Retainers:** Inspect memory diffs to find objects (un-cleared event listeners, global arrays, open socket handlers) that are not being garbage collected.

#### 23. Approaches to identify memory leaks in production?

* **Heap Snapshot Diffs:** Take periodic heap snapshots using `v8.getHeapSnapshot()` when memory usage crosses threshold alerts.
* **Continuous Profiling:** Use tools like Datadog Continuous Profiler or AWS CodeGuru.
* **Monitoring Metrics:** Track `process.memoryUsage().heapUsed` and `rss` over time.

#### 24. Tools used for heap dumps, profiling, and performance analysis

* **Node.js Built-ins:** `--inspect`, `v8`, `perf_hooks`, `--trace-warnings`.
* **Browser DevTools:** Chrome DevTools Memory & Performance tabs (via Node inspect mode).
* **Profiling Tools:** Clinic.js (Bubbleprof, Doctor, Flame), Datadog APM, New Relic, Flamegraphs.

---

### 🔒 Security

#### 25. Steps to secure a production Node.js API

* **HTTP Headers:** Use `helmet` to set secure HTTP headers (`HSTS`, `X-Content-Type-Options`, `CSP`).
* **Rate Limiting & CORS:** Enforce strict CORS origins and rate limits (`express-rate-limit`).
* **Input Validation & Sanitization:** Validate all incoming request bodies and query params using schemas (Zod, Joi).
* **Dependency Auditing:** Run `npm audit` or use Snyk/Dependabot in CI/CD pipelines to catch vulnerable packages.

#### 26. Defend login endpoints against brute-force attacks

* **IP & Account Rate Limiting:** Apply rate limiters based on IP address and targeted email/username (e.g., using Redis rate limiters).
* **Account Lockout / Delay:** Implement progressive delays or temporary account lockouts after consecutive failed attempts.
* **CAPTCHA & Multi-Factor Authentication (MFA):** Trigger CAPTCHA challenges after multiple failed login attempts.

#### 27. Mitigate SQL Injection and NoSQL Injection vulnerabilities

* **SQL Injection:** Always use parameterized queries or ORMs/query builders (Knex, Prisma) rather than concatenating raw strings into SQL.
* **NoSQL Injection (MongoDB):** Sanitize input keys using libraries like `express-mongo-sanitize` to strip out operators like `$gt`, `$ne`, or `$where` passed in `req.body` or `req.query`.
