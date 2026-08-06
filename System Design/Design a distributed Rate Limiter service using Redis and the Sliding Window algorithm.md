Here is a complete, production-grade System Design and implementation for a **Distributed Rate Limiter** using **Redis** and the **Sliding Window Log / Sliding Window Counter** algorithm.

---

# 1. System Requirements & Goals

### Functional Requirements

1. **Configurable Limits:** Support rate limits per IP, User ID, or API key across different endpoints (e.g., `100 req/min` for `/api/v1/search`, `5 req/min` for `/api/v1/checkout`).
2. **Deterministic Response:** Return standard HTTP rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) and an `HTTP 429 Too Many Requests` status code on violation.

### Non-Functional Requirements

* **Sub-Millisecond Latency:** Rate limiting sits on the critical path of every incoming API request; checks must take $< 2\text{ms}$.
* **High Availability & Horizontal Scalability:** The limiter must handle millions of requests/sec across distributed API Gateway nodes without single points of failure.
* **Accuracy:** Mitigate edge bursts across window boundaries (a common flaw in Fixed Window algorithms).
* **Race Condition Free:** Prevent concurrency bugs (check-then-act race conditions) when multiple API pods query Redis simultaneously.

---

# 2. Algorithm Comparison: Why Sliding Window Log / Counter?

| Algorithm                  | Pros                                 | Cons                                                           | Verdict                                           |
| -------------------------- | ------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------- |
| **Token Bucket**           | Allows controlled burstiness         | State tracking can get complex across instances                | Good, but complex to reset accurately             |
| **Fixed Window**           | Low memory, very simple              | **2x Burst Leak:** Allows $2\times$ quota on window boundaries | ❌ Rejected for strict APIs                        |
| **Sliding Window Log**     | **100% accurate**, no boundary leaks | High memory cost (stores timestamp per request)                | Perfect for low-to-medium volume strict endpoints |
| **Sliding Window Counter** | Memory efficient, near 100% accurate | Approximates overlapping window                                | **Best for high-throughput distributed systems**  |

Below, we implement the **Sliding Window Log using Redis Sorted Sets (`ZSET`)**, which offers exact accuracy and sub-millisecond execution when wrapped in an **atomic Redis Lua Script**.

---

# 3. Distributed Architecture Diagram

```text
                  ┌──────────────────────────────┐
                  │         API Gateway          │
                  │  (Kong / Envoy / Custom Express)
                  └──────────────┬───────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           ▼                     ▼                     ▼
     ┌───────────┐         ┌───────────┐         ┌───────────┐
     │  API Pod  │         │  API Pod  │         │  API Pod  │
     │  Instance │         │  Instance │         │  Instance │
     └─────┬─────┘         └─────┬─────┘         └─────┬─────┘
           │                     │                     │
           └─────────────────────┼─────────────────────┘
                                 │
                    1. Execute Atomic Lua Script
                    2. Check ZSET Timestamp Log
                                 │
                                 ▼
                     ┌──────────────────────┐
                     │ Redis Cluster / KeyDB│
                     │   (In-Memory DB)     │
                     └──────────────────────┘

```

---

# 4. Core Algorithm Logic: Redis Sorted Set (`ZSET`)

### How the Sliding Window Log Works in Redis

1. Every user request is stored as a element in a Redis `ZSET`.
2. **Score** = Timestamp (in milliseconds).
3. **Value** = Unique request identifier (UUID / nanosecond string).

For every incoming request at timestamp `now`:

1. **Remove old entries:** Delete all scores in the range `[0, now - windowSize]`.
2. **Count remaining entries:** Fetch total count of items remaining in `[now - windowSize, now]`.
3. **Evaluate Limit:**

* If `count < maxLimit`: Add the current request timestamp to the `ZSET` and approve the request.
* If `count >= maxLimit`: Deny request (`HTTP 429`).

1. **Set TTL:** Expire the key automatically after `windowSize` to clean up inactive users.

---

# 5. Production Implementation (Atomic Redis Lua Script)

To prevent **race conditions** (where two requests read the count simultaneously before either writes their timestamp), the entire sequence must execute **atomically inside Redis using a Lua Script**.

### A. The Redis Lua Script (`rateLimiter.lua`)

```lua
-- KEYS[1]: Rate limit key (e.g., "ratelimit:usr_1234:api_search")
-- ARGV[1]: Current timestamp in milliseconds
-- ARGV[2]: Window size in milliseconds (e.g., 60000 for 1 minute)
-- ARGV[3]: Maximum allowed requests in window
-- ARGV[4]: Unique request ID (UUID)

local key = KEYS[1]
local now = tonumber(ARGV[1])
local windowSize = tonumber(ARGV[2])
local maxLimit = tonumber(ARGV[3])
local requestId = ARGV[4]

local windowStart = now - windowSize

-- 1. Remove old timestamps outside the current sliding window
redis.call('ZREMRANGEBYSCORE', key, 0, windowStart)

-- 2. Count current requests inside the active window
local currentRequestCount = redis.call('ZCARD', key)

-- 3. Check if limit is exceeded
if currentRequestCount < maxLimit then
    -- Add current request timestamp to ZSET
    redis.call('ZADD', key, now, requestId)
    -- Set key expiration to auto-cleanup memory
    redis.call('PEXPIRE', key, windowSize)
    
    -- Return: Allowed (1), Remaining requests, Retry After (0)
    return { 1, maxLimit - currentRequestCount - 1, 0 }
else
    -- Limit exceeded! Calculate time until oldest request expires
    local oldestRequests = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
    local retryAfterMs = 0
    if #oldestRequests > 0 then
        local oldestTimestamp = tonumber(oldestRequests[2])
        retryAfterMs = math.ceil((oldestTimestamp + windowSize) - now)
    end
    
    -- Return: Denied (0), Remaining (0), Retry After in MS
    return { 0, 0, math.max(0, retryAfterMs) }
end

```

---

### B. Node.js / Express Middleware Integration

```typescript
import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// 1. Initialize Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.connect().catch(console.error);

// 2. Load Lua Script into Memory
const luaScriptPath = path.join(__dirname, 'rateLimiter.lua');
const luaScript = fs.readFileSync(luaScriptPath, 'utf8');

interface RateLimiterOptions {
  windowSizeInSec: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

/**
 * Express Middleware Factory for Sliding Window Rate Limiting
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const windowSizeMs = options.windowSizeInSec * 1000;
  const maxLimit = options.maxRequests;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Determine Identifier (e.g., User ID, API Key, or Client IP)
    const identifier = options.keyGenerator 
      ? options.keyGenerator(req) 
      : req.ip || req.headers['x-forwarded-for'] || 'anonymous';

    const redisKey = `ratelimit:${req.path}:${identifier}`;
    const now = Date.now();
    const requestId = `${now}:${crypto.randomBytes(4).toString('hex')}`;

    try {
      // Execute Atomic Lua Script in Redis
      const result = (await redisClient.eval(luaScript, {
        keys: [redisKey],
        arguments: [
          now.toString(),
          windowSizeMs.toString(),
          maxLimit.toString(),
          requestId,
        ],
      })) as [number, number, number];

      const [isAllowed, remaining, retryAfterMs] = result;

      // Populate Standard HTTP Rate Limit Headers
      res.setHeader('X-RateLimit-Limit', maxLimit);
      res.setHeader('X-RateLimit-Remaining', remaining);

      if (isAllowed === 1) {
        return next();
      }

      // 429 Too Many Requests
      const retryAfterSec = Math.ceil(retryAfterMs / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${retryAfterSec} seconds.`,
        retryAfterMs,
      });

    } catch (error) {
      console.error('Rate Limiter Error (Failing Open):', error);
      // Fall open strategy: Allow request to proceed if Redis fails
      return next();
    }
  };
}

// --- EXAMPLE USAGE ---
// app.use('/api/v1/search', createRateLimiter({ windowSizeInSec: 60, maxRequests: 100 }));

```

---

# 6. Advanced Bottlenecks & Production Considerations

### 1. Memory Optimization for Extreme Scale

* **Problem:** Storing timestamps inside a `ZSET` consumes $\approx 64\text{ bytes}$ per request. Storing $10,000 \text{ req/sec}$ for millions of users will saturate RAM quickly.
* **Optimization (Sliding Window Counter):** Instead of storing raw timestamps, split windows into smaller sub-buckets (e.g., 1-minute window split into six 10-second buckets using simple `INCR` counters). The current window count is calculated by weighting the previous bucket count plus current bucket count:

$$\text{Count} = \text{Count}_{\text{current\_bucket}} + \left( \text{Count}_{\text{previous\_bucket}} \times \left(1 - \frac{\text{time\_into\_current\_bucket}}{\text{bucket\_size}}\right) \right)$$

This reduces memory overhead by **$99\%$** with an accuracy error rate of $< 0.05\%$.

### 2. High Availability & Fault Tolerance ("Fail-Open" vs. "Fail-Closed")

* If the Redis Cluster becomes unreachable, **Fail-Open** (allow requests through while logging alerts). Failing closed under a Redis outage takes down your entire production platform.

### 3. Synchronization & Time Drift Across Nodes

* Ensure API Pods synchronize system clocks using **NTP (Network Time Protocol)** to prevent timestamp mismatch issues when populating Redis `ZSET` scores.

### 4. Distributed Redis Architecture

* Deploy **Redis Cluster** using **Hash Tags** (e.g., `{ratelimit:usr_1234}:path`) to ensure all data keys for a specific user land on the exact same Redis shard, enabling multi-key Lua scripts to execute without cross-slot error limitations.

The **Sliding Window Counter** algorithm solves the high memory usage of Sorted Sets (`ZSET`) by combining two **Fixed Window Counters** and calculating a weighted estimate of the current sliding window.

Instead of storing individual timestamps (which take $\approx 64\text{ bytes}$ per request in a `ZSET`), it uses simple integer counters (`INCR`) in Redis. This reduces memory footprint from **MBs down to a few bytes per user** while maintaining $>99.9\%$ accuracy.

---

### How the Algorithm Works

When a request arrives at time $T$:

1. Determine the **Current Window Key** and **Previous Window Key** based on the window size (e.g., 60 seconds).
2. Read the counts from both keys: $C_{\text{current}}$ and $C_{\text{previous}}$.
3. Calculate how far along the current window we are (e.g., if 15 seconds have passed in a 60-second window, we are $25\%$ into the current window).
4. Compute the **Weighted Request Estimate**:

$$\text{Estimated Count} = C_{\text{previous}} \times \left(1 - \frac{\text{Time Elapsed in Current Window}}{\text{Window Size}}\right) + C_{\text{current}}$$

1. If $\text{Estimated Count} < \text{Max Limit}$, increment $C_{\text{current}}$ (`INCR`) and approve the request.

---

### Memory Comparison: `ZSET` vs. `Counter`

| Metric                        | Sliding Window Log (`ZSET`)          | Sliding Window Counter (`HASH` / `STRING`) |
| ----------------------------- | ------------------------------------ | ------------------------------------------ |
| **Data Stored**               | Timestamp + Request UUID per hit     | 2 Simple Integers                          |
| **Memory for 1,000 requests** | $\approx 64 \text{ KB}$ per user key | $\approx 200 \text{ bytes}$ per user key   |
| **Memory Reduction**          | Baseline                             | **$\approx 99.7\%$ Memory Savings**        |
| **Time Complexity**           | $O(\log N + M)$ to clean and count   | $O(1)$ constant time execution             |

---

### 1. Atomic Redis Lua Script (`slidingWindowCounter.lua`)

To avoid race conditions between calculating weights and incrementing counters, execute the entire logic atomically in Redis.

```lua
-- KEYS[1]: Current window key (e.g., "ratelimit:usr_1234:2839210")
-- KEYS[2]: Previous window key (e.g., "ratelimit:usr_1234:2839209")
-- ARGV[1]: Window size in seconds (e.g., 60)
-- ARGV[2]: Max requests allowed in window (e.g., 100)
-- ARGV[3]: Current timestamp in seconds (e.g., 1700000015)

local currentKey = KEYS[1]
local previousKey = KEYS[2]
local windowSize = tonumber(ARGV[1])
local maxLimit = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

-- 1. Fetch current and previous window counts
local currentCount = tonumber(redis.call('GET', currentKey) or "0")
local previousCount = tonumber(redis.call('GET', previousKey) or "0")

-- 2. Calculate time elapsed inside the current window
local timeIntoCurrentWindow = now % windowSize
local previousWindowWeight = (windowSize - timeIntoCurrentWindow) / windowSize

-- 3. Calculate weighted sliding estimate
local estimatedCount = math.floor(previousCount * previousWindowWeight + currentCount)

-- 4. Check if request is within limits
if estimatedCount < maxLimit then
    -- Increment current window counter
    local newCount = redis.call('INCR', currentKey)
    
    -- If this is the first request in the current window, set TTL (2x window size for safety)
    if newCount == 1 then
        redis.call('EXPIRE', currentKey, windowSize * 2)
    end
    
    local remaining = maxLimit - (estimatedCount + 1)
    -- Return: Allowed (1), Remaining requests, Retry After (0)
    return { 1, math.max(0, remaining), 0 }
else
    -- Rate limit exceeded!
    local retryAfterSec = windowSize - timeIntoCurrentWindow
    -- Return: Denied (0), Remaining (0), Retry After in Seconds
    return { 0, 0, retryAfterSec }
end

```

---

### 2. Node.js / Express Middleware Integration

```typescript
import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import fs from 'fs';
import path from 'path';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});
redisClient.connect().catch(console.error);

// Load Lua script once at startup
const luaScriptPath = path.join(__dirname, 'slidingWindowCounter.lua');
const luaScript = fs.readFileSync(luaScriptPath, 'utf8');

interface RateLimiterOptions {
  windowSizeInSec: number;
  maxRequests: number;
  keyGenerator?: (req: Request) => string;
}

export function slidingWindowCounter(options: RateLimiterOptions) {
  const windowSizeSec = options.windowSizeInSec;
  const maxLimit = options.maxRequests;

  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = options.keyGenerator 
      ? options.keyGenerator(req) 
      : req.ip || 'anonymous';

    const nowSec = Math.floor(Date.now() / 1000);
    
    // Determine window bucket numbers (e.g. timestamp / 60)
    const currentWindowBucket = Math.floor(nowSec / windowSizeSec);
    const previousWindowBucket = currentWindowBucket - 1;

    const currentKey = `rl:{${identifier}:${req.path}}:${currentWindowBucket}`;
    const previousKey = `rl:{${identifier}:${req.path}}:${previousWindowBucket}`;

    try {
      // Execute Atomic Lua Script in Redis
      const result = (await redisClient.eval(luaScript, {
        keys: [currentKey, previousKey],
        arguments: [
          windowSizeSec.toString(),
          maxLimit.toString(),
          nowSec.toString(),
        ],
      })) as [number, number, number];

      const [isAllowed, remaining, retryAfterSec] = result;

      // Set standard headers
      res.setHeader('X-RateLimit-Limit', maxLimit);
      res.setHeader('X-RateLimit-Remaining', remaining);

      if (isAllowed === 1) {
        return next();
      }

      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please try again in ${retryAfterSec} seconds.`,
      });

    } catch (error) {
      console.error('Rate Limiter Error (Failing Open):', error);
      return next(); // Fail open on Redis failure
    }
  };
}

```

---

### Mathematical Visual Walkthrough

Assume a limit of **100 requests per 60 seconds**:

```text
Previous Window [00:00 - 01:00]      Current Window [01:00 - 02:00]
      Count = 80                           Count = 30
┌──────────────────────────────┐     ┌───────────────┬──────────────┐
│                              │     │  15s elapsed  │ 45s remaining│
└──────────────────────────────┘     └───────────────┴──────────────┘
                                     ▲
                               Request arrives at 01:15

```

1. **Time Elapsed in Current Window:** $15\text{s}$ ($25\%$ of window elapsed).
2. **Weight of Previous Window:** $100\% - 25\% = 75\%$ ($0.75$).
3. **Estimated Count:**

$$\text{Estimated} = (80 \times 0.75) + 30 = 60 + 30 = \mathbf{90 \text{ requests}}$$

1. **Decision:** $90 < 100 \rightarrow$ **Approve request** and increment current window counter to $31$.
