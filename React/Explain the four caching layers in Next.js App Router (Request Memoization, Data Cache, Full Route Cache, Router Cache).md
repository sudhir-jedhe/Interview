The Next.js App Router relies on **four distinct, interlocking caching layers** to minimize network roundtrips, reduce database queries, and deliver pre-rendered HTML/RSC payloads instantly.

Understanding where each cache lives, what it stores, and how to revalidate it is essential for building scalable Next.js applications.

---

### Overview of the 4 Caching Layers

```text
               CLIENT BROWSER
  ┌─────────────────────────────────────┐
  │ 1. Router Cache (In-Memory)        │ ◄── Stores RSC Payload by Route Segment
  └──────────────────┬──────────────────┘
                     │ Network Request (Cache Miss)
                     ▼
               NEXT.JS SERVER
  ┌─────────────────────────────────────┐
  │ 2. Full Route Cache (Server Disk)   │ ◄── Stores Static HTML & RSC Payload
  └──────────────────┬──────────────────┘
                     │ Execution Miss / Dynamic Render
                     ▼
  ┌─────────────────────────────────────┐
  │ 3. Request Memoization (Memory)     │ ◄── Deduplicates fetch() calls per render
  └──────────────────┬──────────────────┘
                     │ Cache Miss
                     ▼
  ┌─────────────────────────────────────┐
  │ 4. Data Cache (Persistent Server)   │ ◄── Stores HTTP fetch() responses across requests
  └──────────────────┬──────────────────┘
                     │ Cache Miss
                     ▼
             DATABASE / EXTERNAL API

```

---

### 1. Request Memoization (Server React Component Tree)

Request Memoization is a feature of **React (not Next.js specifically)**. During a single render pass on the server, if multiple components call the exact same `fetch()` URL and options, React re-uses the result of the first request instead of making duplicate HTTP calls.

* **Where it lives:** Server memory.
* **Lifetime:** Lasts only for the **duration of a single request/render lifecycle**. It is automatically cleared once the server finishes rendering the component tree.
* **Scope:** Per-request, per-render pass.
* **How to opt out:** Use `AbortController` or pass non-cacheable parameters, or pass custom arguments to non-`fetch` functions using React's `cache()` function:

```typescript
import { cache } from 'react';
import db from '@/lib/db';

// Memoize custom database queries or functions during a single render
export const getUser = cache(async (id: string) => {
  return await db.user.findUnique({ where: { id } });
});

```

---

### 2. Data Cache (Persistent Server Cache)

The Data Cache is a **Next.js server-side HTTP response cache**. Unlike Request Memoization (which lasts only for one render), the Data Cache **persists across multiple incoming requests and user sessions**.

When you call `fetch()` inside a Server Component, Next.js intercepts the request and checks the Data Cache before reaching out to the external API or database.

* **Where it lives:** Persistent server storage (filesystem, S3, or Redis depending on deployment/hosting).
* **Lifetime:** Persists indefinitely until explicitly revalidated or opted out.
* **Scope:** Shared globally across all users and incoming requests.

#### How to manage Data Cache

```typescript
// 1. Time-based Revalidation (ISR)
fetch('https://api.example.com/products', { next: { revalidate: 3600 } }); // 1 hour

// 2. On-Demand Revalidation by Tag
fetch('https://api.example.com/posts', { next: { tags: ['posts'] } });

// In a Server Action or Route Handler:
import { revalidateTag, revalidatePath } from 'next/cache';
revalidateTag('posts');      // Invalidate by tag
revalidatePath('/blog');     // Invalidate all fetches under /blog

// 3. Opting Out (No Caching)
fetch('https://api.example.com/user', { cache: 'no-store' });

```

---

### 3. Full Route Cache (Server HTML & RSC Payload)

At build time or during Incremental Static Regeneration (ISR), Next.js automatically pre-renders static routes into **HTML** and the **RSC Flight Payload**. The Full Route Cache stores these pre-rendered files on the server disk.

* **Where it lives:** Server disk / CDN edge nodes.
* **Lifetime:** Persists across requests until the underlying Data Cache is revalidated or a new deployment occurs.
* **Scope:** Shared globally across all users for static routes.

#### Static vs. Dynamic Routes

* **Static Routes (Cached):** Routes that do not use dynamic functions (`cookies()`, `headers()`, `searchParams`) or un-cached data requests (`cache: 'no-store'`). Next.js caches these in the Full Route Cache.
* **Dynamic Routes (Skipped):** If a route uses dynamic functions or `no-store` fetches, Next.js skips the Full Route Cache and renders the route dynamically on every request (though the Data Cache can still be used for individual `fetch` calls!).

---

### 4. Router Cache (In-Memory Client Browser Cache)

The Router Cache is a **client-side, in-memory cache** inside the user's browser. As users navigate around your Next.js application, Next.js stores the rendered RSC Flight Payload of visited and pre-fetched route segments in the browser's memory.

* **Where it lives:** Browser memory (JS runtime memory).
* **Lifetime:** Resets on full page refreshes / browser reloads. Persists across client-side SPA navigations.
* **Scope:** Per-user browser session.

#### Default Stale Times

* **Dynamic Routes:** Cached for **30 seconds**.
* **Static Routes:** Cached for **5 minutes**.
* **Prefetched Routes (`<Link href="...">`):** Automatically prefetched when links enter the viewport and stored in the Router Cache.

#### How to Invalidate the Router Cache

* Call `router.refresh()` from `useRouter()` inside a Client Component.
* Trigger a Server Action that calls `revalidatePath()` or `revalidateTag()`.

---

### Summary Comparison Table

| Cache Layer             | Location          | What it Caches                        | Lifetime                                | Scope               |
| ----------------------- | ----------------- | ------------------------------------- | --------------------------------------- | ------------------- |
| **Request Memoization** | Server Memory     | Duplicate `fetch()` calls in 1 render | Single request / render pass            | Single Request      |
| **Data Cache**          | Server Storage    | `fetch()` HTTP responses              | Persistent (until revalidated)          | Shared (All Users)  |
| **Full Route Cache**    | Server Disk / CDN | Pre-rendered HTML & RSC Payload       | Persistent (tied to Data Cache/Build)   | Shared (All Users)  |
| **Router Cache**        | Browser Memory    | RSC Payload by route segment          | Session-based (30s dynamic / 5m static) | Single User Session |
