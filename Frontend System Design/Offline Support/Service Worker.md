## 1. What is Offline Support in Frontend System Design?

**Offline Support** refers to a web application's ability to remain functional, fast, and accessible even when the device loses network connectivity, experiences intermittent connections ("lie-fi"), or has high latency.

### Why it Matters

* **User Experience (UX):** Eliminates the default browser "No Internet Connection" screen, replacing it with cached content or custom offline views.
* **Data Integrity:** Prevents data loss when users submit forms or trigger actions while losing connection.
* **Performance:** Served assets directly from a local cache load significantly faster.

### Core Architecture Components

1. **Asset Caching:** Storing static files (HTML, CSS, JS, images) using the `Cache Storage API`.
2. **Data Storage:** Storing user data and mutation queues locally using `IndexedDB`.
3. **Network Interception:** Managing and proxying network requests via **Service Workers**.
4. **Data Synchronization:** Syncing queued local mutations with the backend server once connectivity is restored.

---

## 2. What is a Service Worker?

A **Service Worker** is a specialized, event-driven Web Worker that acts as a client-side network proxy between the web browser, the network, and the cache storage.

```
                 +-------------------+
                 |    Main Thread    |
                 |  (DOM / React)    |
                 +--------+----------+
                          |
                   Fetch Request
                          |
                          v
                 +-------------------+
                 |  Service Worker   | <--- Intercepts Requests
                 +----+---------+----+
                      |         |
           Cache Hit  |         | Cache Miss / Sync
                      v         v
                +-------+     +---------+
                | Cache |     | Network |
                +-------+     +---------+

```

### Key Characteristics

* **Separate Thread:** Runs in a background thread independent of the DOM and main JavaScript execution thread.
* **Non-Blocking:** Operates asynchronously without impacting UI rendering or blocking page interactions.
* **Network Proxy:** Can intercept, inspect, modify, or mock incoming and outgoing HTTP/HTTPS requests.
* **Independent Lifecycle:** Can wake up and execute background tasks (like sync or push notifications) even when the main website tab is closed.
* **Security:** Requires an HTTPS secure context (or `localhost` for development).

---

## 3. How to Enable Offline Functionality using Service Workers

Offline support is built in three phases: **Registration**, **Caching Strategy Implementation**, and **Fetch Interception**.

### Step 1: Register the Service Worker (Main App Thread)

```javascript
// main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registered with scope:', registration.scope);
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
    }
  });
}

```

### Step 2: Cache Critical Shell Assets (Inside Service Worker)

```javascript
// sw.js
const CACHE_NAME = 'app-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html'
];

// Install Event: Pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

```

### Step 3: Intercept Fetch Requests with a Strategy

```javascript
// sw.js
// Stale-While-Revalidate Caching Strategy Example
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match('/offline.html')); // Fallback on complete network failure

      return cachedResponse || fetchPromise;
    })
  );
});

```

---

## 4. Background Synchronization for Frontend Applications

The **Background Synchronization API** defers user actions (e.g., sending a message, submitting a form) when offline and automatically executes them in the background as soon as network connectivity is restored — even if the user has navigated away or closed the tab.

```
User Action (Offline) ---> Save Payload to IndexedDB ---> Register Sync ('sync-outbox')
                                                                  |
                                                         Network Restored
                                                                  |
                                                                  v
Backend DB <--- Execute API Fetch Request <--- SW Handles 'sync' Event

```

### Implementation Steps

#### 1. Save Failed Requests to Local Storage (`IndexedDB`) & Register Sync

When the user submits data while offline:

```javascript
// main.js - Called when submitting a form
async function sendData(data) {
  if (navigator.onLine) {
    try {
      await fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) });
      return;
    } catch (err) {
      console.log('Network failed, switching to offline fallback...');
    }
  }

  // 1. Persist payload locally in IndexedDB
  await saveToIndexedDB('outboxQueue', data);

  // 2. Register a sync event with the Service Worker
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-outbox');
    console.log('Sync registered successfully!');
  } else {
    // Fallback logic for unsupported browsers
  }
}

```

#### 2. Handle the `sync` Event inside the Service Worker

When the network returns, the browser triggers the `sync` event:

```javascript
// sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-outbox') {
    // Keep the service worker alive until the async operations resolve
    event.waitUntil(flushOutboxQueue());
  }
});

async function flushOutboxQueue() {
  const pendingItems = await getItemsFromIndexedDB('outboxQueue');

  for (const item of pendingItems) {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload)
      });

      if (response.ok) {
        // Remove successfully processed item from IndexedDB
        await removeItemFromIndexedDB('outboxQueue', item.id);
      }
    } catch (err) {
      // Re-throw error to signal browser that sync failed
      // The browser will retry automatically when connection stabilizes
      throw err;
    }
  }
}

```

---

## Technical Summary Matrix

| Strategy / API          | Use Case                                                 | Storage Mechanism        | Lifecycle Scope                   |
| ----------------------- | -------------------------------------------------------- | ------------------------ | --------------------------------- |
| **Cache Storage API**   | Static assets, shell HTML, CSS, client-side JS           | `CacheStorage`           | Controlled by SW Lifecycle        |
| **IndexedDB**           | Unsent form payload queues, JSON API responses, app data | Browser DB (`IndexedDB`) | Persistent                        |
| **Background Sync API** | Retrying queued mutations once connection returns        | `SyncManager` Queue      | Active until sync completes/fails |

What are the common conflict resolution strategies in frontend system design when syncing offline data back to the server?

When multiple clients edit the same data while offline, or when local modifications collide with server updates that occurred during network absence, synchronization conflict occurs.

Resolving these conflicts requires deliberate strategy selection based on data complexity, domain rules, and user experience requirements.

---

## 1. Primary Conflict Resolution Strategies

### 1. Last Write Wins (LWW) / Timestamp-Based

* **How it Works:** The server compares incoming local mutation timestamps against current server timestamps. The write with the latest timestamp overwrites all previous states.
* **Pros:** Simple to implement, low overhead, deterministic.
* **Cons:** Prone to **data loss**. Clock skew between user client devices and servers can overwrite more recent intent with stale data if device clocks aren't synchronized (e.g., via Network Time Protocol).
* **Best Used For:** Simple status updates, settings/preferences toggles, or single-user applications where concurrent multi-device editing is rare.

---

### 2. Client-Wins vs. Server-Wins (Static Strategy)

* **Server-Wins:** The server rejects incoming offline mutations if the underlying resource version has changed since the client went offline. Local client state is overwritten by current server state.
* **Client-Wins:** Local mutations force-overwrite server records without checking resource revision states.
* **Pros:** Standardized rules; easy to reason about programmatically.
* **Cons:** One side always loses data completely without nuanced merging.
* **Best Used For:**
* *Server-Wins:* Critical financial records, stock inventory, or permission systems where server authority is absolute.
* *Client-Wins:* Draft posts, personal workspace updates, or user profile bio fields.

---

### 3. Manual / Interactive User Resolution

* **How it Works:** When a mutation conflict occurs, the system preserves both client-side and server-side states. The client UI renders a two-way or three-way diff modal, forcing the user to manually choose which values to retain.
* **Pros:** Zero unexpected data loss; gives complete control to the human user.
* **Cons:** Poor user experience if conflicts occur frequently; interrupts workflow.
* **Best Used For:** High-value text documents (e.g., Git merge conflicts), complex form submissions, or multi-field records where field-by-field selection is necessary.

---

### 4. Operational Transformation (OT)

* **How it Works:** Deconstructs edits into sequence operations (e.g., `insert(index, text)`, `delete(index, length)`). Operations from the client and server are mathematically transformed against each other so that both apply cleanly without invalidating positional indices.
* **Pros:** Real-time collaboration support; preserves intent for sequential character/array manipulations.
* **Cons:** High algorithmic complexity; requires a centralized server to order incoming operations.
* **Best Used For:** Collaborative rich text editors (e.g., Google Docs).

---

### 5. Conflict-free Replicated Data Types (CRDTs)

* **How it Works:** Uses specialized client-side data structures (such as State-based or Operation-based CRDTs) that mathematically guarantee convergence across nodes regardless of network delay, out-of-order execution, or concurrent modifications.
* **Pros:** Entirely decentralized; resolves conflicts automatically without centralized lockouts or user prompts; ideal for offline-first design.
* **Cons:** Memory footprint overhead (requires metadata tracking for deletions/tombstones and operation history); steep learning curve.
* **Best Used For:** Offline-first collaborative tools (e.g., Figma canvas, Yjs/Automerge document trees, local-first note-taking apps).

---

## 2. Structural Patterns for Detection & Resolution

### Version Vectors & Optimistic Locking

To reliably detect whether a conflict actually occurred before choosing a strategy, applications use revision tokens:

```
Client Payload Syncing back to Server:
{
  "id": "doc_123",
  "data": { "title": "Updated Title" },
  "baseVersion": 4  // Version the client had when it went offline
}

```

1. The server checks `baseVersion` against current DB `version`.
2. **If DB `version` == `baseVersion` (No Conflict):** Apply updates, bump DB `version` to 5, return HTTP `200 OK`.
3. **If DB `version` > `baseVersion` (Conflict Detected):** Reject write with HTTP `409 Conflict`, returning the latest server record (Version 5).

---

## Summary Matrix

| Strategy            | Complexity | UX Impact                   | Risk of Data Loss          | Primary Use Cases                |
| ------------------- | ---------- | --------------------------- | -------------------------- | -------------------------------- |
| **Last Write Wins** | Low        | Seamless                    | High                       | Preferences, single-user apps    |
| **Server-Wins**     | Low        | High disruption if rejected | High (Client changes lost) | Inventory, permissions, finance  |
| **User Resolution** | Medium     | Medium (Interrupts flow)    | None                       | High-value docs, complex forms   |
| **OT**              | Very High  | Excellent                   | Low                        | Centralized collaborative text   |
| **CRDTs**           | High       | Excellent                   | None                       | Local-first, decentralized tools |

How do you implement Version Vectors / Optimistic Locking in a frontend application using React and IndexedDB?

Implementing Version Vectors or Optimistic Locking in an offline-first React application involves tracking resource versions across three layers: **React UI State**, **IndexedDB (Local Outbox/Cache)**, and the **Backend Database**.

---

## 1. Core Architecture

```
[ React Component ]
       │
  1. Trigger Mutation (Updates UI + Stores baseVersion)
       ▼
[ IndexedDB Outbox ] ── (Stores payload + baseVersion)
       │
  2. Network Restored: Background Worker Syncs Request
       ▼
[ REST / GraphQL API ]
       │
  3. Validates: Payload.baseVersion === DB.version?
       ├─ YES ──> Commits write, increments version to baseVersion + 1
       └─ NO  ──> Returns 409 Conflict with Current Server State

```

---

## 2. Implementation Step-by-Step

### Step 1: IndexedDB Setup with `idb`

Set up an IndexedDB store with two object stores: `items` (local cache) and `outbox` (pending requests waiting to sync).

```javascript
// db.js
import { openDB } from 'idb';

export const initDB = async () => {
  return openDB('OfflineAppDB', 1, {
    upgrade(db) {
      // Store cached items: { id, data, version }
      if (!db.objectStoreNames.contains('items')) {
        db.createObjectStore('items', { keyPath: 'id' });
      }
      // Store outbox queue: { id, itemId, payload, baseVersion, timestamp }
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

```

---

### Step 2: Optimistic UI Hook & Local Commit

This custom React hook optimistically updates local IndexedDB storage and queues mutations with the resource's current `version`.

```javascript
// useOptimisticMutation.js
import { initDB } from './db';

export function useOptimisticMutation() {
  const saveItem = async (itemId, newData, currentVersion) => {
    const db = await initDB();

    const updatedItem = {
      id: itemId,
      data: newData,
      version: currentVersion, // Preserve current base version locally
      syncState: 'pending',
    };

    const outboxEntry = {
      itemId,
      payload: newData,
      baseVersion: currentVersion, // Token used for optimistic locking on server
      createdAt: Date.now(),
    };

    // Transactionally update local view and append to queue
    const tx = db.transaction(['items', 'outbox'], 'readwrite');
    await tx.objectStore('items').put(updatedItem);
    await tx.objectStore('outbox').add(outboxEntry);
    await tx.done;

    // Trigger sync process if online
    if (navigator.onLine) {
      triggerBackgroundSync();
    }
  };

  return { saveItem };
}

```

---

### Step 3: Background Sync Handler & 409 Conflict Handling

The sync processor reads from the `outbox` queue and sends payloads containing the `baseVersion` to the server. If the server detects a version discrepancy, it returns `409 Conflict`.

```javascript
// syncService.js
import { initDB } from './db';

export async function triggerBackgroundSync() {
  const db = await initDB();
  const pendingItems = await db.getAll('outbox');

  for (const item of pendingItems) {
    try {
      const response = await fetch(`/api/items/${item.itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: item.payload,
          baseVersion: item.baseVersion, // Optimistic concurrency token
        }),
      });

      if (response.status === 200) {
        const updatedRecord = await response.json();

        // Server update successful: Update local cache with server's new version
        const tx = db.transaction(['items', 'outbox'], 'readwrite');
        await tx.objectStore('items').put({
          id: updatedRecord.id,
          data: updatedRecord.data,
          version: updatedRecord.version, // Server incremented version
          syncState: 'synced',
        });
        await tx.objectStore('outbox').delete(item.id);
        await tx.done;

      } else if (response.status === 409) {
        // CONFLICT DETECTED: Server has newer changes
        const serverState = await response.json();
        await handleConflictResolution(item, serverState);
      }
    } catch (err) {
      console.warn('Sync delayed. Will retry when connection stabilizes.', err);
      break;
    }
  }
}

async function handleConflictResolution(outboxItem, serverState) {
  const db = await initDB();
  
  // Strategy: Store conflict state locally to prompt user in UI
  const conflictRecord = {
    id: outboxItem.itemId,
    localData: outboxItem.payload,
    serverData: serverState.currentData,
    baseVersion: outboxItem.baseVersion,
    serverVersion: serverState.currentVersion,
    syncState: 'conflict',
  };

  const tx = db.transaction(['items', 'outbox'], 'readwrite');
  await tx.objectStore('items').put(conflictRecord);
  await tx.objectStore('outbox').delete(outboxItem.id); // Remove failed entry from outbox
  await tx.done;
}

```

---

### Step 4: Conflict Resolution UI Component

When a `409 Conflict` status updates IndexedDB state to `syncState: 'conflict'`, render a resolution UI for the user.

```jsx
// ItemEditor.jsx
import React, { useEffect, useState } from 'react';
import { initDB } from './db';

export function ItemEditor({ itemId }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function loadItem() {
      const db = await initDB();
      const record = await db.get('items', itemId);
      setItem(record);
    }
    loadItem();
  }, [itemId]);

  const resolveConflict = async (chosenData, targetVersion) => {
    const db = await initDB();
    
    // Replace local record with resolved data and update version to latest server version
    await db.put('items', {
      id: itemId,
      data: chosenData,
      version: targetVersion,
      syncState: 'synced',
    });

    // Queue fresh write back to server using the updated serverVersion
    // (This ensures next request will pass optimistic locking checks)
    setItem(null);
  };

  if (!item) return <div>Loading...</div>;

  if (item.syncState === 'conflict') {
    return (
      <div className="conflict-modal">
        <h3>Version Conflict Detected</h3>
        <p>This item was modified on another device while you were offline.</p>
        
        <div className="diff-view">
          <div>
            <h4>Your Local Changes</h4>
            <pre>{JSON.stringify(item.localData, null, 2)}</pre>
            <button onClick={() => resolveConflict(item.localData, item.serverVersion)}>
              Keep My Version
            </button>
          </div>

          <div>
            <h4>Server Version (v{item.serverVersion})</h4>
            <pre>{JSON.stringify(item.serverData, null, 2)}</pre>
            <button onClick={() => resolveConflict(item.serverData, item.serverVersion)}>
              Accept Server Version
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div>Item Content: {JSON.stringify(item.data)}</div>;
}

```

---

## Technical Summary

1. **Base Version Capture:** Always attach the current known `version` tag to queued local mutations in IndexedDB.
2. **Server Check:** The backend rejects requests if `baseVersion !== currentServerVersion` returning a `409 Conflict`.
3. **Queue Eviction on Conflict:** On `409`, purge the outbox entry and move the resource into a `conflict` state locally to prevent infinite retry loops.
4. **Resolution Re-queueing:** Resolving a conflict re-bases local state on `serverVersion`, permitting the next write transaction to succeed.
