Improving API performance using caching and database optimization requires addressing both the **application layer** (reducing redundant computations and database roundtrips) and the **data layer** (reducing query execution times and I/O bottlenecks).

Here is a systematic, production-proven guide to optimizing API performance across both domains.

---

# Part 1: Caching Strategies

Caching stores pre-computed or frequently accessed data in fast, in-memory stores (like Redis or Memcached) to bypass heavy disk I/O and expensive SQL/NoSQL execution paths.

### 1. Multi-Tier Caching Architecture

Implement caching at multiple layers of your application architecture:

* **Edge / CDN Caching:** Cache static assets and public, non-personalized API responses at the CDN level (e.g., Cloudflare, AWS CloudFront) using standard `Cache-Control` HTTP headers (`max-age`, `s-maxage`, `stale-while-revalidate`).
* **In-Memory Application Cache (L1):** Cache hot configuration keys, token validation signatures, or frequently accessed lookup metadata locally inside process memory using an LRU cache.
* **Distributed Cache (L2):** Use an in-memory data store like Redis or KeyDB shared across API pods to store session objects, user profiles, and query results.

---

### 2. Cache-Aside (Lazy Loading) Pattern

The most reliable caching pattern for read-heavy API endpoints:

```text
Client  ──► API Server ──► 1. Check Cache ──( Hit: Return Data )──► Client
                              │
                           ( Miss )
                              ▼
                       2. Query Database ──► 3. Populate Cache ──► Client

```

```javascript
async function getUserProfile(userId) {
  const cacheKey = `user:${userId}:profile`;

  // 1. Try fetching from Redis
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData); // Cache Hit
  }

  // 2. Fetch from Database on Cache Miss
  const user = await db.users.findById(userId);

  // 3. Store in Redis with TTL (Time-To-Live)
  if (user) {
    await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600); // 1 hour TTL
  }

  return user;
}

```

---

### 3. Cache Invalidation & TTL Strategies

Invalidation is famously one of the hardest problems in software engineering. Combine explicit invalidation with TTL safeguards:

* **Write-Through / Mutate-On-Write:** Whenever a resource is updated (`PUT`/`PATCH`/`DELETE`), explicitly delete or update the corresponding key in Redis:

```javascript
async function updateUserProfile(userId, updateData) {
  await db.users.update(userId, updateData);
  await redis.del(`user:${userId}:profile`); // Invalidate immediately
}

```

* **Always Enforce TTLs:** Never store keys infinitely. Attaching a TTL ensures that stale entries auto-expire even if an invalidation event fails.
* **Cache Stampede (Thundering Herd) Mitigation:** If a cache key expires under high traffic, thousands of concurrent requests will hit the DB simultaneously. Prevent this using:
* **Mutex Locking / Singleflight:** Allow only one worker to recompute the cache while others wait.
* **Probabilistic Early Expiration (XFetch):** Background worker recomputes the cache right before it actually expires.

---

# Part 2: Database Optimization

Database queries are usually the single largest contributor to high API latency. Optimizing schema design, indexing, and access patterns yields massive performance improvements.

### 1. Smart Indexing Strategies

Indexes allow the database engine to find data without performing costly full collection/table scans (`SEQSCAN` / `COLLSCAN`).

* **Follow the ESR Rule for Compound Indexes:**

1. **E**quality: Place fields matching exact values first (e.g., `status = 'active'`).
2. **S**ort: Place fields used for ordering second (e.g., `ORDER BY created_at DESC`).
3. **R**ange: Place fields used for range comparisons last (e.g., `created_at > '2026-01-01'`).

* **Covering Indexes:** Design indexes that include all fields specified in the query projection/selection so the database engine can fulfill the request directly from the index without reading disk rows.
* **Avoid Over-Indexing:** Indexes speed up reads but slow down `INSERT`, `UPDATE`, and `DELETE` queries due to index maintenance overhead.

---

### 2. Eliminating the N+1 Query Problem

The N+1 problem occurs when an application fetches 1 record, then executes N additional database queries in a loop to fetch related child records.

* **❌ Bad (N+1 Queries):**

```javascript
const posts = await db.query('SELECT * FROM posts LIMIT 10');
for (let post of posts) {
  // Executes 10 separate database roundtrips!
  post.author = await db.query('SELECT * FROM users WHERE id = ?', [post.author_id]);
}

```

* **✅ Good (1 Joined / Batched Query):**

```sql
-- Single SQL JOIN query
SELECT posts.*, users.name FROM posts 
JOIN users ON posts.author_id = users.id 
LIMIT 10;

```

*In ORMs/GraphQL, use batch loaders like **DataLoader** or `IN (...)` clauses.*

---

### 3. Read Replicas & Connection Pooling

* **Database Connection Pooling:** Database connection handshakes (TLS, auth) are expensive. Use connection pools (e.g., `pgBouncer` for PostgreSQL, built-in pools in Mongoose/Knex) to reuse existing open sockets.
* **Read-Write Splitting:** Route heavy read queries (`GET` requests) to secondary **Read Replicas**, leaving the primary database node dedicated solely to handle transactional writes (`POST`, `PUT`, `DELETE`).

```text
                ┌───► Primary DB (Writes: INSERT/UPDATE)
                │
API Servers ────┼───► Read Replica 1 (Reads: SELECT)
                │
                └───► Read Replica 2 (Reads: SELECT)

```

---

### 4. Efficient Pagination & Field Projection

* **Cursor-Based Pagination over Offset-Based:**
* **Avoid `OFFSET 10000`:** Offset forces the DB to scan and discard the first 10,000 rows before returning results ($O(N)$ time complexity).
* **Use Keyset / Cursor Pagination:** Filter directly using indexed keys (`WHERE id > last_seen_id LIMIT 20`), ensuring constant $O(1)$ query speed regardless of page depth.

* **Field Projection:** Select only the columns/fields needed by the client (`SELECT id, title, price`) rather than querying large text blobs or JSON columns via `SELECT *`.

---

# Summary Checklist

| Performance Layer  | Action Item                             | High-Impact Result                                             |
| ------------------ | --------------------------------------- | -------------------------------------------------------------- |
| **Caching**        | Redis Cache-Aside with strict TTLs      | Sub-5ms response times for hot endpoints                       |
| **Caching**        | CDN Edge Caching for static/public APIs | Removes traffic completely from application servers            |
| **Database**       | Add Compound Indexes (ESR Rule)         | Eliminates full table scans (`SEQSCAN` $\rightarrow$ `IXSCAN`) |
| **Database**       | Batch queries / Join data (Fix N+1)     | Reduces 100+ DB network hops down to 1 query                   |
| **Database**       | Cursor-based Keyset Pagination          | Keeps page 500 as fast as page 1                               |
| **Infrastructure** | Connection Pooling & Read Replicas      | Prevents connection exhaustion under high traffic              |
