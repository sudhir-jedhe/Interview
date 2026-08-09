React Server Components (RSC) integrate natively with **`<Suspense>`** and **HTTP streaming** (specifically using the HTML `Transfer-Encoding: chunked` header) to achieve **progressive page rendering**.

Instead of waiting for every API request or database query on the server to finish before sending HTML to the browser, the server streams shell markup immediately and streams slow UI components down the wire as soon as their data resolves.

---

## How HTTP Streaming Works under RSC

When a user requests a page, the server breaks page generation into independent streaming chunks:

```
[ Request Starts ]
       │
       ├── 1. Instant Response: Server streams Initial HTML Shell + <Suspense> Fallbacks
       │      (Navigation bar, layout, skeleton loaders render in browser immediately)
       │
       ├── 2. Background Processing: Slow Server Components continue fetching data on server
       │
       └── 3. Progressive Stream: As component data resolves, HTML chunks + inline scripts 
              are pushed down the open HTTP connection to replace fallbacks in real-time.

```

---

## Code Example: Progressive Page Rendering

Here is a complete example of a product detail page containing fast data (product details) and slow data (reviews and recommendations).

### 1. Slow Server Components

These components execute data fetches directly on the server:

```tsx
// Reviews.tsx (Server Component — Takes 2 seconds)
import { db } from '@/lib/db';

export async function Reviews({ productId }: { productId: string }) {
  // Simulate slow database query
  await new Promise((res) => setTimeout(res, 2000));
  const reviews = await db.reviews.findMany({ where: { productId } });

  return (
    <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
      <h3>Customer Reviews ({reviews.length})</h3>
      {reviews.map((r) => (
        <p key={r.id}><strong>{r.author}:</strong> {r.comment}</p>
      ))}
    </div>
  );
}

// Recommendations.tsx (Server Component — Takes 3.5 seconds)
export async function Recommendations({ category }: { category: string }) {
  // Simulate slow third-party API request
  await new Promise((res) => setTimeout(res, 3500));

  return (
    <div style={{ background: '#f8fafc', padding: '16px', marginTop: '16px' }}>
      <h3>Recommended Products</h3>
      <p>Related items in {category}...</p>
    </div>
  );
}

```

---

### 2. Parent Layout wrapping Components in `<Suspense>`

By wrapping slow Server Components in `<Suspense>`, we tell React **not to block the entire page render**.

```tsx
// ProductPage.tsx (Server Component)
import { Suspense } from 'react';
import { Reviews } from './Reviews';
import { Recommendations } from './Recommendations';
import { SkeletonLoader } from './SkeletonLoader';

export default async function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* ⚡ Instant Shell: Renders in 0ms */}
      <h1>Wireless Headphones</h1>
      <p style={{ fontSize: '1.2rem', color: '#16a34a' }}>$199.99 — In Stock</p>
      <button style={{ padding: '10px 20px', fontSize: '1rem' }}>Buy Now</button>

      <hr style={{ margin: '24px 0' }} />

      {/* ⏳ Stream Chunk 1: Reviews load in 2s */}
      <Suspense fallback={<SkeletonLoader title="Loading Reviews..." />}>
        <Reviews productId={params.id} />
      </Suspense>

      {/* ⏳ Stream Chunk 2: Recommendations load in 3.5s */}
      <Suspense fallback={<SkeletonLoader title="Loading Recommendations..." />}>
        <Recommendations category="audio" />
      </Suspense>
    </main>
  );
}

function SkeletonLoader({ title }: { title: string }) {
  return (
    <div style={{ padding: '16px', background: '#f1f5f9', borderRadius: '8px', opacity: 0.7 }}>
      <p style={{ color: '#64748b' }}>⏳ {title}</p>
    </div>
  );
}

```

---

## What Happens Over the Wire (The HTML Stream)

### Step 1: Initial Chunk (Time: 0ms)

The server immediately sends the static shell HTML along with placeholder template tags for the suspended regions:

```html
<!-- Sent immediately over HTTP response stream -->
<main>
  <h1>Wireless Headphones</h1>
  <p>$199.99 — In Stock</p>
  <button>Buy Now</button>

  <!-- Fallback content rendered in browser -->
  <div id="S:1"><div class="skeleton">⏳ Loading Reviews...</div></div>
  <div id="S:2"><div class="skeleton">⏳ Loading Recommendations...</div></div>
</main>

```

### Step 2: Second Chunk (Time: 2000ms)

When `Reviews` finishes fetching on the server, React pushes a new HTML snippet down the **same open HTTP stream**, accompanied by a inline script that replaces fallback `S:1`:

```html
<!-- Streamed down the same HTTP connection at 2s mark -->
<div hidden id="B:1">
  <div class="reviews-box">
    <h3>Customer Reviews (2)</h3>
    <p><strong>Alice:</strong> Great battery life!</p>
  </div>
</div>
<script>
  // Inlined React runtime replaces skeleton S:1 with content B:1
  $RC('S:1', 'B:1');
</script>

```

### Step 3: Final Chunk (Time: 3500ms)

When `Recommendations` finishes, the server streams the last chunk and closes the HTTP connection:

```html
<!-- Streamed at 3.5s mark -->
<div hidden id="B:2">
  <div class="recommendations">...</div>
</div>
<script>$RC('S:2', 'B:2');</script>

```

---

## Benefits of RSC Streaming vs. Traditional Data Fetching

| Metric                           | Traditional SSR                                  | Client-Side Fetch (`useEffect`)                    | RSC + Suspense Streaming                                                |
| -------------------------------- | ------------------------------------------------ | -------------------------------------------------- | ----------------------------------------------------------------------- |
| **Time To First Byte (TTFB)**    | Slow (blocked by slowest DB query).              | Fast (returns blank HTML shell).                   | **Fast** (streams shell instantly).                                     |
| **First Contentful Paint (FCP)** | Delayed until all data finishes.                 | Fast, but shows blank screen.                      | **Instant** (header, title, layout visible immediately).                |
| **Layout Shifts (CLS)**          | Low.                                             | High (spinners pop in on client, shifting layout). | **Zero** (placeholders preserve space during streaming).                |
| **Client JS Bundle**             | Includes data fetching libraries and components. | Large bundle (fetching logic + components).        | **Minimal** (components stay on server; only HTML/RSC payload streams). |
