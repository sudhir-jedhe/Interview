Here is a detailed, side-by-side comparison of the **Token Bucket** and **Sliding Window Counter** algorithms—the two most popular choices for building production rate limiters in distributed systems.

---

### Key Difference at a Glance

* **Token Bucket** focuses on **traffic shaping**: it permits sudden bursts of requests while enforcing a smooth average rate over time.
* **Sliding Window Counter** focuses on **strict quota enforcement**: it ensures that the total request count inside *any rolling time window* never strictly exceeds a specified threshold, keeping memory usage minimal.

---

### 1. Feature Comparison Matrix

| Dimensional Attribute         | Token Bucket                                                                                | Sliding Window Counter                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Primary Goal**              | Smooth out traffic spikes; allow bursts up to bucket capacity.                              | Strict quota enforcement over rolling time windows.                                      |
| **Burst Handling Capacity**   | **High:** Allows controlled bursts up to $B$ requests instantly if tokens have accumulated. | **Low / Smoothed:** Prevents sudden bursts that exceed the sliding window capacity.      |
| **Memory Footprint per Key**  | **$\approx 2$ fields** (Last Refill Timestamp, Current Token Count).                        | **$\approx 2$ fields** (Current Window Count, Previous Window Count).                    |
| **Accuracy**                  | 100% accurate for burst shaping and token consumption.                                      | $\approx 99.7\%$ accuracy (uses weighted linear approximation across window boundaries). |
| **Time Complexity (Redis)**   | $O(1)$ constant time execution.                                                             | $O(1)$ constant time execution.                                                          |
| **Implementation Complexity** | Medium (Requires lazy refill calculation on every read/write).                              | Low (Uses standard timestamp math and simple `INCR` operations).                         |

---

### 2. Burst Capacity Trade-Offs

#### Token Bucket (Burst-Friendly)

In Token Bucket, tokens accumulate continuously at a fill rate $R$ up to a maximum bucket capacity $B$.

* **Scenario:** A user hasn't made a request in 10 minutes. Their bucket is full ($B = 50$ tokens).
* **Behavior:** The user can instantly dispatch **50 requests in 1 second**. Once the bucket empties, subsequent requests are throttled down to the continuous refill rate (e.g., 2 tokens/sec).
* **Ideal For:** APIs where legitimate users naturally perform bursty actions (e.g., uploading a batch of files or rendering a complex dashboard with multiple concurrent parallel fetch calls).

```text
Full Bucket (50 Tokens)  ──[ Burst of 50 Requests ]──►  Empty Bucket (0 Tokens)
                                                               │
                                         Refills at 2 Tokens/sec

```

#### Sliding Window Counter (Strict Quota)

Sliding Window Counter checks the weighted request volume over rolling time windows (e.g., max 100 requests per 60 seconds).

* **Scenario:** Limit is set to 100 req/min.
* **Behavior:** A user cannot fire 100 requests in 1 second if they already made 20 requests in the previous 45 seconds. The weighted formula accounts for past activity and actively throttles requests to preserve the strict rolling ceiling.
* **Ideal For:** Protecting downstream services (like databases or paid third-party APIs) against sudden load spikes, and protecting auth endpoints against brute-force attempts.

---

### 3. Redis Implementation Mechanics

#### A. Token Bucket Implementation (Lazy Refill)

In Redis, you do **not** run background timers/cron jobs to continuously add tokens. Instead, you calculate token refills **lazily** whenever a request arrives:

1. Read `tokens` and `last_refill_timestamp` from Redis.
2. Calculate time elapsed: $\Delta t = \text{now} - \text{last\_refill\_timestamp}$.
3. Calculate new tokens added: $\text{added\_tokens} = \Delta t \times \text{refill\_rate}$.
4. Update `tokens = min(capacity, tokens + added_tokens)`.
5. If `tokens >= 1`, decrement `tokens` by 1 and approve request; otherwise, deny.

```lua
-- Redis Lua Script: Token Bucket
-- KEYS[1]: Rate limit key (e.g., "tb:user_123")
-- ARGV[1]: Bucket Capacity (B)
-- ARGV[2]: Refill Rate per second (R)
-- ARGV[3]: Current Timestamp (seconds)
-- ARGV[4]: Requested Tokens (usually 1)

local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = tonumber(ARGV[4])

-- 1. Fetch current bucket state
local data = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(data[1])
local lastRefill = tonumber(data[2])

if tokens == nil then
    -- Initial state: Start with a full bucket
    tokens = capacity
    lastRefill = now
else
    -- 2. Calculate lazy refill
    local delta = math.max(0, now - lastRefill)
    local tokensToAdd = delta * refillRate
    tokens = math.min(capacity, tokens + tokensToAdd)
    lastRefill = now
end

-- 3. Evaluate request
if tokens >= requested then
    tokens = tokens - requested
    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', lastRefill)
    redis.call('EXPIRE', key, math.ceil(capacity / refillRate) * 2)
    return { 1, math.floor(tokens) } -- Allowed
else
    redis.call('HMSET', key, 'tokens', tokens, 'last_refill', lastRefill)
    return { 0, math.floor(tokens) } -- Throttled
end

```

---

#### B. Sliding Window Counter Implementation (Weighted Windows)

Instead of tracking tokens, it tracks integer counts in two fixed bucket windows:

1. Identify `current_window` key and `previous_window` key using timestamps.
2. Compute the weight of the previous window:

$$\text{Weight} = \frac{\text{Window Size} - \text{Time Elapsed in Current Window}}{\text{Window Size}}$$

1. Estimate current rate: $\text{Estimated} = (\text{Previous Count} \times \text{Weight}) + \text{Current Count}$.
2. If $\text{Estimated} < \text{Limit}$, increment `current_window` key via `INCR` and approve.

---

### Which One Should You Choose?

* Choose **Token Bucket** if:
* You want to allow users to make quick bursts of requests without hitting `429 Too Many Requests` right away.
* You are building a general-purpose public API (e.g., Stripe, GitHub).

* Choose **Sliding Window Counter** if:
* You need strict memory efficiency ($< 99\%$ memory compared to Sorted Set logs).
* You want to protect database infrastructure from sudden traffic spikes.
* You need strict rate limits across fixed time windows (e.g., payment processing or email sending).
