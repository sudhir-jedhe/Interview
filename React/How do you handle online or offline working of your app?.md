Handling online and offline capabilities effectively requires a **three-tier architecture**: **State Detection**, **Offline Storage & Caching**, and **Background Synchronization / Conflict Resolution**.

---

### 1. Reliable Network Detection (Beyond `navigator.onLine`)

Relying solely on `navigator.onLine` causes false positives because it only checks if the device is connected to a local network (e.g., a router or Wi-Fi AP), not whether the internet is actually reachable (the "lie-fi" problem).

* **Combine Window Events with Health Checks**:
Listen to native events, but verify actual connectivity with a tiny, non-cached `HEAD` request (pinging a health endpoint or favicon).

```javascript
// useNetworkStatus.js
import { useState, useEffect, useCallback } from 'react';

export function useNetworkStatus(pingUrl = '/api/health-check', intervalMs = 15000) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const checkConnectivity = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }
    try {
      // Bust cache to avoid 304 Not Modified
      const response = await fetch(`${pingUrl}?t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
      });
      setIsOnline(response.ok);
    } catch {
      setIsOnline(false);
    }
  }, [pingUrl]);

  useEffect(() => {
    const handleOnline = () => checkConnectivity();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic heartbeat check
    const interval = setInterval(checkConnectivity, intervalMs);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnectivity, intervalMs]);

  return isOnline;
}

```

---

### 2. The Storage Hierarchy

Split static assets from dynamic application data across appropriate browser storage mechanisms:

| Layer                                   | Storage Engine                                            | What to Store                                | Strategy                                                                               |
| --------------------------------------- | --------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Static Shell (HTML, JS, CSS, Icons)** | **Service Worker + Cache Storage**                        | Bundle files, fonts, layout HTML             | Pre-cache on install; serve **Cache-First** or **Stale-While-Revalidate** via Workbox. |
| **Read Cache (GET requests)**           | **IndexedDB** (via TanStack Query / RTK Query / Dexie.js) | Dashboard records, user feeds, catalog items | Persist query cache to disk so previous responses render instantly offline.            |
| **Write Outbox (Mutations)**            | **IndexedDB**                                             | Pending POST, PUT, DELETE operations         | FIFO mutation queue holding unsynced actions with client-generated UUIDs.              |

---

### 3. Read Strategy: Cache Persistence

Use query clients (like **TanStack Query** or **RTK Query**) configured with an IndexedDB persister:

* On network failure, serve the local snapshot immediately.
* Do not blow away the UI with a full-screen offline error; instead, render the stale data alongside an informative banner: `"Working offline. Showing cached data from 10:45 AM."`

```javascript
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createIDBPersister } from './idbPersister'; // IndexedDB wrapper

// Automatically syncs the query cache to IndexedDB
persistQueryClient({
  queryClient,
  persister: createIDBPersister(),
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days retention
});

```

---

### 4. Write Strategy: The Offline Outbox & Optimistic Updates

When a user performs an action offline (e.g., editing a profile or adding a task):

1. **Optimistic UI Update**: Update the in-memory React state immediately so the interface feels instantaneous.
2. **Enqueue into IndexedDB Outbox**: Add the mutation payload to an offline queue.
3. **Dispatch Sync on Reconnect**: Flush the queue sequentially once the connection returns.

```javascript
// offlineSyncQueue.js
import { openDB } from 'idb';

const DB_NAME = 'app_offline_store';
const QUEUE_STORE = 'mutation_outbox';

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        db.createObjectStore(QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

// 1. Add write operations to the outbox
export async function enqueueMutation(url, method, body) {
  const db = await getDB();
  await db.add(QUEUE_STORE, {
    clientMutationId: crypto.randomUUID(),
    url,
    method,
    body,
    timestamp: Date.now(),
  });
}

// 2. Process all queued mutations when back online
export async function flushMutationQueue() {
  const db = await getDB();
  const tx = db.transaction(QUEUE_STORE, 'readwrite');
  const store = tx.objectStore(QUEUE_STORE);
  const mutations = await store.getAll();

  for (const item of mutations) {
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Mutation-ID': item.clientMutationId, // Idempotency key
        },
        body: JSON.stringify(item.body),
      });

      if (res.ok || res.status === 409) {
        // Remove completed or already-handled items
        await db.delete(QUEUE_STORE, item.id);
      } else if (res.status >= 400 && res.status < 500) {
        // Irrecoverable client error; drop or log to dead-letter queue
        await db.delete(QUEUE_STORE, item.id);
      } else {
        // 5xx Server Error or Network dropped again; halt queue execution
        break;
      }
    } catch {
      // Lost connection mid-flush; abort loop and wait for next online event
      break;
    }
  }
}

```

---

### 5. Conflict Resolution Strategies

When multiple clients modify the same record while disconnected, pick a defined resolution policy:

* **Idempotency Keys (`X-Client-Mutation-ID`)**: Every queued request sends a client-generated UUID. If a retry fires multiple times, the backend recognizes the UUID and ignores duplicate executions.
* **Last-Write-Wins (LWW)**: Compare client-side `timestamp` vs. server-side `updated_at`. Simpler, but risks overwriting remote edits.
* **Optimistic Concurrency Control (ETags / Version Numbers)**:
* The client sends the record with `version: 3` (or `If-Match: "version-3"`).
* If the server is already at `version: 4`, it responds with `409 Conflict`.
* The client pulls the server version, displays a manual diff modal (*"Your changes conflict with recent server updates. Choose which version to keep"*), or executes a deterministic three-way merge.

---

### 6. Service Worker Workbox Strategy (App Shell)

For complete offline capability, register a Service Worker that precaches the application shell:

```javascript
// service-worker.js (Workbox)
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Precaches index.html, main.js, main.css emitted by bundler
precacheAndRoute(self.__WB_MANIFEST);

// API caching strategy: Network-First with fallback to cache
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/dashboard'),
  new NetworkFirst({
    cacheName: 'api-dashboard-cache',
    networkTimeoutSeconds: 3, // Fallback to cache quickly if network stalls
  })
);

```

---

### Production Checklist

* **Degrade Gracefully**: Disable actions that strictly require online authorization (e.g., checkout/payment processing) with clear tooltips instead of letting them fail silently.
* **Background Sync API**: Where supported (`self.registration.sync.register('sync-outbox')`), use the native browser Background Sync API to replay requests even if the user closes the tab before reconnecting.
* **Visual Status Indicators**: Give users a persistent, non-intrusive status pill (e.g., yellow dot for "Offline (changes saved locally)", green dot for "Synced").
