When an app works on high-speed low-latency office Wi-Fi but degrades on real 3G, the issue is almost always driven by **high round-trip latency (RTT ~200–500ms)**, **low throughput (1–2 Mbps)**, **packet loss/retransmissions**, or **device CPU throttling** on low-end hardware.

Here is the systematic diagnostic checklist, ordered from highest impact to lowest.

---

### 1. Network Waterfall & Request Waterfalls (The Round-Trip Multiplier)

On a 300ms RTT network, serial requests destroy performance.

* **Sequential API Chaining:** Check if the frontend fires Request A $\rightarrow$ waits $\rightarrow$ fires Request B $\rightarrow$ waits $\rightarrow$ fires Request C. (3 sequential round-trips = 1+ seconds of pure idle network waiting).
* **Render-Blocking Critical Path:** Inspect the HTML `<head>` for blocking CSS/JS chunks and font files that block First Contentful Paint (FCP).
* **Missing HTTP/2 or HTTP/3 Multiplexing:** Check if assets are opening multiple blocking TCP connections instead of streaming over a single multiplexed connection.

---

### 2. Payload Sizes, Assets & Compression

Throughput on 3G is constrained; large assets saturate the channel and queue critical API calls.

* **Transfer Sizes vs. Uncompressed Sizes:** Check if text responses (JS, CSS, JSON APIs) are compressed with **Brotli** or **Gzip**.
* **Over-Fetching in API Responses:** Check JSON payloads for large unpaginated arrays, embedded debug fields, or unused nested entities.
* **Unoptimized Media & Images:**
* Ensure images use modern formats (`WebP`/`AVIF`) with responsive `srcset`.
* Ensure off-screen images have `loading="lazy"`.

* **JavaScript Bundle Bloat:** Check total parsed JS size. On 3G, downloading a 3MB bundle takes 10+ seconds, and parsing it on mid/low-tier mobile CPUs freezes the main thread.

---

### 3. Connection & Transport Layer Overhead

Setting up connections on mobile networks has substantial latency overhead.

* **Connection Handshakes:** Check DNS lookup + TCP handshake + TLS negotiation times in the DevTools Network Timing tab.
* **Origin Sprawl (Too Many Third-Party Domains):** Connecting to 10 different domains (analytics, CDNs, ad trackers, multiple microservices) forces 10 separate DNS + TLS handshakes.
* **Resource Hints:** Check if `dns-prefetch`, `preconnect`, or `preload` tags are in place for critical API origins and CDNs.

---

### 4. Caching & Stale Data Strategies

An app on 3G should avoid hitting the network whenever possible.

* **HTTP Cache Headers:** Check for missing or misconfigured `Cache-Control`, `ETag`, or `Last-Modified` headers on static assets and repeatable GET queries.
* **Client-Side Cache (SWR / React Query / IndexedDB):** Check whether the UI blocks on loading spinners or serves cached data immediately while revalidating in the background.
* **Service Worker / Offline Caching:** Verify whether core app shell assets are cached locally via CacheStorage.

---

### 5. Client-Side CPU Contention & Long Tasks

Mobile devices operating on 3G frequently throttle CPU to manage thermal limits and battery life.

* **JavaScript Parse & Compile Time:** Measure Total Blocking Time (TBT) and Long Tasks (>50ms) during initial boot.
* **Excessive Polling / WebSockets:** Check if frequent background polling requests are saturating the single radio interface.

---

### Triage Matrix

| Metric                    | Wi-Fi Baseline | Real 3G Reality | Primary Fix                                                     |
| ------------------------- | -------------- | --------------- | --------------------------------------------------------------- |
| **Round Trip Time (RTT)** | 5–20ms         | 200–500ms       | Batch requests (BFF/GraphQL), eliminate serial fetch waterfalls |
| **Bandwidth**             | 100+ Mbps      | 0.5–2 Mbps      | Compress payloads (Brotli), code-split JS, resize images        |
| **Connection Setup**      | 30ms           | 600–1200ms      | Consolidate domains, add `preconnect`, leverage HTTP/2/3        |
| **Packet Loss Rate**      | ~0%            | 2–5%            | Aggressive client-side caching (stale-while-revalidate)         |
