Designing a pure React 19 micro-frontend (MFE) runtime architecture using React Server Components (RSC) without Next.js requires decoupling the core React 19 Flight/RSC server and client runtimes from framework abstractions.

In this architecture, independent MFE server services stream RSC payload chunks over HTTP, and a lightweight Shell orchestrates and reconciles these streams on the client.

---

## 1. High-Level Architecture

The system consists of three main tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SHELL CLIENT (Browser)                          │
│  - React 19 Client Runtime (`react-dom/client`)                        │
│  - MFE Orchestrator (`createFromFetch` / Flight Client deserializer)   │
│  - Shared Module Registry (Import Maps / Module Federation)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / Streaming RSC Payload
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│  MFE A (RSC) │             │  MFE B (RSC) │             │  MFE C (RSC) │
│ Header/Nav   │             │ Product Feed │             │ Cart/Checkout│
└──────────────┘             └──────────────┘             └──────────────┘

```

1. **Host Shell (Client/Browser):** Manages layout, routing, shared client dependencies (e.g., React instance, global UI primitives), and RSC stream decoding.
2. **Independent MFE RSC Servers:** Microservice endpoints running node/edge HTTP servers (`Hono`, `Express`, or `Fastify`) leveraging `react-server-dom-webpack/server` (or Node streams) to render JSX trees into RSC payloads.
3. **Shared Asset CDN:** Serves compiled Client Component bundles (`'use client'`) used across MFEs.

---

## 2. Shared Client Component Resolution (Module Sharing)

To prevent downloading multiple copies of React or client components across MFEs, use **Native HTML Import Maps** or **Module Federation v2** as the shared module registry.

### Import Map Definition in `index.html` (Shell)

```html
<script type="importmap">
{
  "imports": {
    "react": "https://cdn.example.com/npm/react@19/esm/react.js",
    "react-dom": "https://cdn.example.com/npm/react-dom@19/esm/react-dom.js",
    "react-dom/client": "https://cdn.example.com/npm/react-dom@19/esm/react-dom-client.js",
    "@mfe/shared-ui": "https://cdn.example.com/mfes/shared-ui/index.js"
  }
}
</script>

```

---

## 3. Micro-Frontend RSC Server Implementation

Each MFE runs its own lightweight server instance using `react-server-dom-webpack/server` (or `react-server-dom-esm`) to convert Server Component trees into the Flight payload format.

### MFE Service Example (`mfe-products/server.js`)

```javascript
import { Hono } from 'hono';
import { renderToReadableStream } from 'react-server-dom-webpack/server';
import { ProductFeed } from './components/ProductFeed.js';

const app = new Hono();

// Client Component Manifest mapping IDs to CDN URLs
const clientManifest = {
  './src/ProductCard.client.js': {
    id: 'https://cdn.example.com/mfes/products/ProductCard.js',
    chunks: ['ProductCard'],
    name: 'ProductCard',
  },
};

app.get('/rsc/products', async (c) => {
  const query = c.req.query('q') || '';

  // Render Server Component tree to RSC Flight Stream
  const stream = renderToReadableStream(
    <ProductFeed query={query} />,
    clientManifest
  );

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/x-component',
      'Access-Control-Allow-Origin': '*',
      'Transfer-Encoding': 'chunked',
    },
  });
});

export default app;

```

---

## 4. Shell Runtime & Remote Component Loader

The Shell orchestrates loading remote MFE streams using `createFromFetch` from `react-server-dom-webpack/client`. It converts incoming HTTP Flight streams into renderable React nodes.

### Remote MFE Loader Hook (`useRemoteServerComponent.ts`)

```tsx
import { use, useMemo } from 'react';
import { createFromFetch } from 'react-server-dom-webpack/client';

// Cache for in-flight or completed MFE Flight Promises
const mfeCache = new Map<string, Promise<any>>();

export function fetchRemoteRSC(mfeUrl: string) {
  if (!mfeCache.has(mfeUrl)) {
    const fetchPromise = fetch(mfeUrl, {
      headers: { Accept: 'text/x-component' },
    });

    // Deserializes RSC Payload stream into a React Element tree
    const rscTreePromise = createFromFetch(fetchPromise, {
      // Map Flight module references to native dynamic ESM imports
      async callServer(id, args) {
        // Option to delegate Server Actions to specific MFE endpoints
        return fetch(`${mfeUrl}/action/${id}`, {
          method: 'POST',
          body: JSON.stringify(args),
        }).then((res) => res.json());
      },
    });

    mfeCache.set(mfeUrl, rscTreePromise);
  }

  return mfeCache.get(mfeUrl)!;
}

// React Component Wrapper for Remote RSC
export function RemoteMFE({ url }: { url: string }) {
  const rscPromise = useMemo(() => fetchRemoteRSC(url), [url]);
  // Suspends component until Flight stream payload resolves
  const remoteRscTree = use(rscPromise);

  return remoteRscTree;
}

```

---

## 5. Main Shell Application Integration

The Shell renders remote RSC Micro-Frontends inside `<Suspense>` boundaries, allowing MFEs to stream into the UI independently without blocking each other.

```tsx
// ShellApp.tsx (Client Runtime)
import React, { Suspense, useState } from 'react';
import { RemoteMFE } from './useRemoteServerComponent';

export function ShellApp() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="shell-container">
      {/* Remote Header MFE */}
      <Suspense fallback={<div className="header-skeleton">Loading Header...</div>}>
        <RemoteMFE url="http://mfe-header.internal/rsc/nav" />
      </Suspense>

      <main className="content-layout">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Remote Product Feed MFE */}
        <Suspense fallback={<div className="feed-skeleton">Streaming Products...</div>}>
          <RemoteMFE url={`http://mfe-products.internal/rsc/products?q=${searchQuery}`} />
        </Suspense>
      </main>

      {/* Remote Cart Drawer MFE */}
      <Suspense fallback={null}>
        <RemoteMFE url="http://mfe-cart.internal/rsc/drawer" />
      </Suspense>
    </div>
  );
}

```

---

## 6. Handling Cross-MFE Mutations (Remote Server Actions)

Server Actions across MFEs require routing the POST mutation request back to the owning MFE service:

1. **Server Action Registration:** When an MFE exports a Server Action (`'use server'`), its build system registers the function ID in its manifest.
2. **Client Dispatch:** When invoked from a `'use client'` component rendered inside the Shell, the custom `callServer` handler inside `createFromFetch` intercepts the call and posts the payload to the originating MFE (`[http://mfe-cart.internal/action/id](http://mfe-cart.internal/action/id)`).
3. **Cache Invalidation:** Once the Server Action finishes, the Shell invalidates the corresponding entry in `mfeCache` and triggers a re-fetch of the affected remote MFE endpoint.

---

## Key Advantages of this Architecture

| Architectural Area     | Pure RSC Micro-Frontend                                                                                | Traditional Client-Only MFE                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **JS Bundle Overhead** | **0 KB added per MFE for Server Components.** Only client components are downloaded.                   | High (Each MFE downloads dependencies and component logic).       |
| **Data Fetching**      | DB/Microservice access happens directly on each MFE server.                                            | Client fetches data via API routes (Multiple network waterfalls). |
| **Streaming UI**       | Independent MFE subtrees stream concurrently via `<Suspense>`.                                         | Whole MFE bundle must load and execute before mounting.           |
| **State Preservation** | The Shell maintains client state (e.g., input focus) while streaming fresh MFE Server Component trees. | Unmounting/re-mounting MFEs often resets client state.            |
