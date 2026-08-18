**Time to First Byte (TTFB)** measures the duration between the browser initiating a request for the document and receiving the very first byte of the response. For a "Good" user experience, Google's Core Web Vitals targets a **$\text{TTFB} \le 800\text{ms}$** (ideally $< 200\text{ms}$ on cached edge hits).

$$\text{TTFB} = \text{DNS} + \text{TCP Handshake} + \text{TLS Negotiation} + \text{Request Upload} + \text{Server/CDN Processing} + \text{First Byte Transit}$$

---

### Step 1: Diagnose Where the Time Is Spent

#### A. Break Down Network vs. Server Time in Chrome DevTools

1. Open DevTools $\rightarrow$ **Network** tab $\rightarrow$ select the main document (`index.html` or root `/`).
2. Click the **Timing** tab to inspect the breakdown:

| Phase                           | What It Measures              | Target           | High Metric Indicates                                           |
| ------------------------------- | ----------------------------- | ---------------- | --------------------------------------------------------------- |
| **DNS Lookup**                  | Resolving domain name to IP   | $< 20\text{ms}$  | Slow DNS provider or missing DNS prefetch.                      |
| **Initial Connection / SSL**    | TCP 3-way handshake + TLS 1.3 | $< 60\text{ms}$  | Distance to nearest server/POP, missing TLS session resumption. |
| **Waiting for Server Response** | Edge + Origin compute time    | $< 100\text{ms}$ | Origin database queries, SSR blocking, or CDN cache MISS.       |

#### B. Inspect CDN Cache Headers

Check the document's response headers to determine if the CDN served the page or fell back to the origin:

* **Cloudflare:** `cf-cache-status: HIT` vs `DYNAMIC` / `MISS` / `BYPASS`
* **Fastly / Varnish:** `x-cache: HIT` vs `MISS`
* **AWS CloudFront:** `x-cache: Hit from cloudfront` vs `Miss from cloudfront`
* **Edge Processing Time:** Look for the `Server-Timing` header:

```http
Server-Timing: cdn-cache;desc=HIT, edge;dur=2.4, origin;dur=312.8

```

#### C. Instrument the Origin with `Server-Timing`

To surface backend latency directly in browser DevTools and RUM tools, emit the `Server-Timing` header from your Node.js, Go, or Java backend:

```typescript
// Fastify / Express Middleware Example
app.addHook('onSend', async (request, reply, payload) => {
  const dbTime = reply.getHeader('x-db-time') || 0;
  const renderTime = reply.getHeader('x-render-time') || 0;
  const total = reply.getResponseTime();

  reply.header(
    'Server-Timing',
    `db;dur=${dbTime};desc="Database", ssr;dur=${renderTime};desc="React SSR", total;dur=${total};desc="Total Origin"`
  );
});

```

---

### Step 2: Reduce TTFB at the CDN & Edge Layer

#### 1. Implement Edge HTML Caching with `stale-while-revalidate`

Never block users on origin regeneration for public or semi-static pages:

```http
Cache-Control: public, s-maxage=300, stale-while-revalidate=86400

```

* **How it works:** The CDN serves the cached page from the nearest edge POP immediately ($< 50\text{ms}$). If older than 5 minutes (`s-maxage=300`), the edge serves the stale version while refreshing the cache in the background.

#### 2. Upgrade to HTTP/3 (QUIC) & TLS 1.3

* **0-RTT Resumption:** TLS 1.3 and HTTP/3 support Zero Round-Trip Time resumption, eliminating connection handshake latency for returning visitors.
* **Head-of-Line Blocking Elimination:** Packet drops on cellular connections do not stall other streams.

#### 3. Enable 103 Early Hints at the Edge

Instruct the CDN edge to stream a `103 Early Hints` response immediately while the origin backend is still generating the HTML document. The browser starts downloading critical CSS and LCP images during the TTFB wait window:

```http
HTTP/1.1 103 Early Hints
Link: </styles.css>; rel=preload; as=style
Link: </hero.webp>; rel=preload; as=image; fetchpriority=high

```

#### 4. Route Through Edge Workers for User-Personalized HTML

Instead of routing personalized traffic all the way back to a centralized origin database:

* Run auth checks and geolocation routing on Cloudflare Workers, Fastly Compute, or Vercel Edge Middleware located within $10\text{ms}$ of the user.
* Stitch static layout templates (cached at the edge) with personalized user fragments fetched from edge stores (Cloudflare KV, Upstash Redis).

---

### Step 3: Reduce TTFB at the Origin Server Layer

#### 1. Stream Server-Side Rendered HTML (React 18/19 `renderToPipeableStream`)

Avoid waiting for the complete component tree and all API queries to resolve before sending the first byte. Stream the HTML `<head>` and critical layout skeleton immediately:

```typescript
// Node.js Express / Fastify with React SSR
import { renderToPipeableStream } from 'react-dom/server';

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      // First byte sent immediately once shell/head is rendered!
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      pipe(res);
    },
    onError(error) {
      console.error(error);
    },
  });
});

```

#### 2. Eliminate Database & Microservice Bottlenecks

* **Enable Internal HTTP Keep-Alive & Connection Pooling:** Reuse existing TCP/TLS sockets when making upstream microservice calls from the backend (`keepAlive: true`, `maxSockets: 100`).
* **Cache Database Queries at the Origin:** Cache read-heavy queries in Redis or local memory (LRU cache) with invalidation hooks on write mutations.
* **Eliminate N+1 Queries:** Use Dataloader or SQL joins to batch database queries into a single round-trip before rendering.

---

### Summary Checklist: TTFB Optimization Matrix

```
[Incoming User Request]
         │
         ├──► DNS & TLS ──────────► Enable Anycast DNS, HTTP/3, TLS 1.3, TLS Session Resumption
         │
         ├──► CDN Edge Cache ─────► Serve via s-maxage + stale-while-revalidate (HIT: < 50ms)
         │                          Emit 103 Early Hints for critical CSS/LCP assets
         │
         └──► Origin Processing ──► Stream SSR (renderToPipeableStream) to flush <head> instantly
                                    Add Redis query caching & persistent HTTP connection pools

```
