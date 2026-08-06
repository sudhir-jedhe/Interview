Troubleshooting an unresponsive Node.js server under peak traffic requires a methodical approach. In Node.js, unresponsiveness usually stems from one of three culprits: **Event Loop Blockage** (CPU starvation), **Memory Leaks / Excessive Garbage Collection Pauses**, or **Resource/Connection Exhaustion** (downstream I/O blocking or socket limits).

Here is a step-by-step production troubleshooting guide.

---

# Phase 1: Triage & Immediate Isolation

Before digging into code, quickly assess cluster health to protect active users:

1. **Check Health Metrics (CPU vs. RAM vs. Network):**

* **100% CPU on Node processes:** Indicates synchronous code blocking the Single-Threaded Event Loop or heavy Garbage Collection.
* **High RAM / Sawtooth memory usage:** Indicates a Memory Leak causing the V8 engine to spend all its time running GC passes (GC pause freeze).
* **Low CPU & Low RAM:** Points to **Connection Starvation**—the server is waiting on downstream database socket pools, slow HTTP calls, or exhausted OS file descriptors (`EMFILE`).

1. **Isolate the Affected Instances:**

* Is it a single instance or all pods across the cluster? If autoscaling is adding pods that immediately become unresponsive, traffic must be shed or rate-limited temporarily at the API Gateway level.

---

# Phase 2: Diagnostic Execution & Root Cause Identification

### 1. Diagnosing Event Loop Blockages (CPU Starvation)

Because Node.js handles I/O asynchronously on a single thread, any heavy synchronous CPU operation blocks all subsequent incoming HTTP requests.

* **Metric to inspect:** `Event Loop Delay` (using `perf_hooks` or APM tool like Datadog/New Relic).
* **Common Culprits:**
* Synchronous operations (`fs.readFileSync`, `JSON.parse` or `JSON.stringify` on massive 50MB payloads).
* ReDoS (Regular Expression Denial of Service)—unoptimized regex patterns triggering exponential backtracking on user inputs.
* Heavy synchronous array operations (`.map()`, `.filter()`, `.sort()`) over tens of thousands of items inside request handlers.

* **How to debug live:** Take a CPU profile using `clinic doctor` or Node's inspector:

```bash
# Generate a 30-second CPU profile from a running pod
node --inspect=0.0.0.0:9229 app.js

```

Connect Chrome DevTools (`chrome://inspect`) to inspect the CPU Flamegraph and find the exact function occupying the main thread.

---

### 2. Diagnosing Memory Leaks & Garbage Collection Thrashing

If V8 memory reaches near `--max-old-space-size` limits (default $\approx 2\text{GB}$ to $4\text{GB}$), V8 initiates full "Stop-The-World" Garbage Collection cycles, freezing the Event Loop for seconds at a time until the process crashes with `Out of Memory (OOM)`.

* **Common Culprits:**
* Global arrays or caches growing indefinitely without TTL/eviction policies.
* Unhandled stream listeners or event emitters (e.g., missing `.on('close')` or `.destroy()` handlers on client disconnects).
* Closures retaining large scope variables.

* **How to debug:** Take two Heap Snapshots using the `heapdump` module or Node inspector at different intervals under load and diff them in Chrome DevTools to locate retained objects.

---

### 3. Diagnosing Connection & Socket Exhaustion (I/O Starvation)

If CPU and Memory are low but requests time out, Node.js is stuck waiting on external resources.

* **Common Culprits:**
* **Database Connection Pool Saturation:** All database connections (e.g., max 10 connections in pool) are busy executing slow queries, forcing 500 incoming requests to queue in memory.
* **Unbounded HTTP Client Calls:** Outbound requests to external microservices missing timeouts (`timeout: 5000`), holding connections open indefinitely.
* **Node.js `uv_threadpool` Exhaustion:** Node uses `libuv`'s internal thread pool (default size = 4) for tasks like DNS resolution (`dns.lookup`), crypto, and file I/O. If threadpool size is saturated, all new disk or DNS tasks stall.

---

# Phase 3: Short-Term Fixes & Long-Term Prevention

### Short-Term Fixes (Emergency Mitigation)

* **Increase Threadpool Size:** Expand `UV_THREADPOOL_SIZE` from 4 to 128 in environment variables:

```bash
export UV_THREADPOOL_SIZE=128

```

* **Offload Event Loop Tasks:** Convert synchronous calls to asynchronous variants (`fs.readFile`) or offload CPU tasks to Node.js `Worker Threads`.
* **Implement Timeouts:** Enforce explicit HTTP request timeouts (`server.headersTimeout`, `server.requestTimeout`) and client timeouts so hung connections drop fast instead of piling up.
* **Restart Workers Automatically:** Configure PM2 or Kubernetes Liveness Probes (`/healthz`) to restart unresponsive worker pods once Event Loop delay exceeds $1000\text{ms}$.

### Long-Term Architectural Fixes

1. **Asynchronous Queues:** Offload heavy write/processing operations to background workers via **BullMQ/Kafka**.
2. **Circuit Breakers:** Implement circuit breakers (e.g., using `opossum`) on external HTTP/DB dependencies so slow downstream services fail fast rather than locking up API pods.
3. **Cluster & Load Balancing:** Run Node.js in Cluster mode or across horizontal Kubernetes pods behind an NGINX/ALB load balancer with health checks.
