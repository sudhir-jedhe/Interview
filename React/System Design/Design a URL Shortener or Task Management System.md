Here is an end-to-end System Design for a production-grade **URL Shortener** (like Bitly or TinyURL) built to handle heavy read traffic, high concurrency, and sub-10ms redirects.

---

# 1. Requirements & System Constraints

### Functional Requirements

1. **URL Shortening:** Given a long URL, the service generates a unique 7-character short URL (e.g., `[https://short.ly/aBc123X](https://short.ly/aBc123X)`).
2. **Redirection:** Accessing the short URL redirects the user to the original long URL with an **HTTP 302 (Found)** or **301 (Moved Permanently)** status code.
3. **Custom Aliases (Optional):** Users can optionally supply a custom short link alias (e.g., `[https://short.ly/my-custom-link](https://short.ly/my-custom-link)`).
4. **Link Expiration (TTL):** Links can optionally expire after a user-defined duration.

### Non-Functional Requirements

* **High Availability & Low Latency:** Read requests (redirects) must respond in $<10\text{ms}$.
* **Read-Heavy System:** $100:1$ Read-to-Write ratio (100 redirects for every 1 link generated).
* **Uniqueness & Non-Predictability:** Short links must be unique and difficult to guess/enumerate.

---

# 2. Capacity Estimation & Scale

* **Write Traffic (New URLs):** $10 \text{ million new links / day} \approx 115 \text{ writes/sec}$.
* **Read Traffic (Redirects):** $100 \times 115 = 11,500 \text{ reads/sec}$.
* **Storage Requirement (10 Years):**
* $10 \text{ million/day} \times 365 \text{ days} \times 10 \text{ years} = 36.5 \text{ billion records}$.
* Average link payload size $\approx 500 \text{ bytes}$ (Long URL + Short Code + Metadata).
* $36.5 \text{ billion} \times 500 \text{ bytes} \approx \mathbf{18.25 \text{ TB}}$.

* **RAM Requirement (Caching):**
* Following the 80/20 rule (20% of hot links generate 80% of traffic):
* $11,500 \text{ reads/sec} \times 86,400 \text{ sec/day} \approx 1 \text{ billion daily reads}$.
* Cache 20% of daily requests: $0.20 \times 1 \text{ billion} \times 500 \text{ bytes} \approx \mathbf{100 \text{ GB RAM}}$.

---

# 3. High-Level Architecture Diagram

```text
                               ┌─────────────────┐
                               │   API Gateway   │
                               │  (Rate Limit)   │
                               └────────┬────────┘
                                        │
                       ┌────────────────┴────────────────┐
                       ▼                                 ▼
             ┌──────────────────┐              ┌──────────────────┐
             │ Write Service    │              │ Read Service     │
             │ (URL Creator)    │              │ (Redirector)     │
             └────────┬─────────┘              └────────┬─────────┘
                      │                                 │
           ┌──────────┴──────────┐                      │
           ▼                     ▼                      │
  ┌─────────────────┐   ┌──────────────────┐            │
  │ Key Generation  │   │ Mongo / Postgres │            │
  │ Service (KGS)   │   │  (Persistent DB) │◄───────────┤
  └─────────────────┘   └──────────────────┘            │
                                 ▲                      │
                                 │                      ▼
                        ┌────────┴──────────────────────────┐
                        │      Redis Cache (L1 / L2)        │
                        └───────────────────────────────────┘

```

---

# 4. Data Storage & Schema Design

Since the system handles tens of billions of independent lookup records with simple key-value relationships, a NoSQL Document/Key-Value store like **MongoDB**, **Cassandra**, or **DynamoDB** is ideal.

### Data Schema (`urls` collection / table)

```json
{
  "_id": "aBc123X",                // Indexed Short Hash (Primary Key)
  "originalUrl": "https://www.example.com/long/path/product/123",
  "userId": "usr_998811",           // Optional owner
  "createdAt": "2026-08-05T03:15:20Z",
  "expiresAt": "2027-08-05T03:15:20Z", // TTL Index
  "clickCount": 1042
}

```

---

# 5. Core Algorithmic Tradeoffs: Encoding vs. Key Generator Service (KGS)

How do we generate a unique 7-character string using **Base62** (`a-z`, `A-Z`, `0-9` $\rightarrow 62^7 \approx 3.52 \text{ trillion combination capacity}$)?

### Approach A: Hashing (MD5 / SHA-256) + Base62

1. Take $MD5(\text{originalUrl})$.
2. Convert hash to Base62 string and pick the first 7 characters.
3. **Problem:** Hash collisions! If two URLs produce the same first 7 characters, handling collisions requires appended counters and multiple DB checks, causing latency spikes under load.

### Approach B: Key Generation Service (KGS) — *Recommended*

Instead of encoding the URL on the fly, a standalone **Key Generation Service (KGS)** pre-generates random, unique 7-character Base62 strings in advance and stores them in memory/DB.

1. **Pre-generation:** Background workers create unique 7-character Base62 strings and write them to a `key_buffer` table.
2. **In-Memory Buffering:** KGS loads blocks of keys (e.g., 5,000 keys) into worker RAM.
3. **$O(1)$ Assignment:** When a request arrives, the write service simply grabs a key instantly from memory and assigns it to the target URL.
4. **Collision Elimination:** Eliminates hash collisions completely.
5. **Concurrency Safety:** KGS keeps two key arrays in memory (Active and Standby). Once a key block is allocated, it is marked as used to prevent duplicate distribution across instances.

---

# 6. Low-Latency Redirect Engine & Caching Strategy

```javascript
// Pseudocode for Read / Redirect Path
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  // 1. Check Redis Cache
  let originalUrl = await redis.get(`short:${shortCode}`);

  if (!originalUrl) {
    // 2. Cache Miss: Query Database
    const record = await db.urls.findOne({ _id: shortCode });

    if (!record) {
      return res.status(404).send('Short URL not found');
    }

    // Check expiration
    if (record.expiresAt && new Date() > new Date(record.expiresAt)) {
      return res.status(410).send('Link expired');
    }

    originalUrl = record.originalUrl;

    // 3. Populate Redis Cache with LRU Eviction Policy
    await redis.set(`short:${shortCode}`, originalUrl, 'EX', 86400); // 24h TTL
  }

  // 4. Return HTTP 302 Found (Allows metric tracking without permanent client browser cache)
  return res.redirect(302, originalUrl);
});

```

### HTTP 301 vs. HTTP 302

* **HTTP 301 (Moved Permanently):** Browsers cache the redirect locally. Subsequent requests bypass our servers entirely. *Pros:* Reduces server load. *Cons:* Prevents accurate click analytics/tracking.
* **HTTP 302 (Found):** Forces the browser to route through our service on every click. *Pros:* Enables precise real-time analytics and link revoking. *Cons:* Higher read traffic on our servers. **(Standard choice for Bitly/TinyURL style systems)**.

---

# 7. Scalability & Advanced Bottlenecks

1. **Database Sharding:** Shard MongoDB / DynamoDB by `shortCode` hash partition keys to distribute read/write operations evenly across database nodes.
2. **Rate Limiting:** Protect the generation API using Redis Token Bucket rate-limiting middleware (e.g., max 100 URL shortening requests per minute per IP).
3. **Asynchronous Click Analytics:** Incrementing click counts directly on the read path degrades latency. Instead, publish click events to **Apache Kafka**, and worker processes update analytics counters asynchronously in batches.
