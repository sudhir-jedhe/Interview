The **Web Background Sync API** allows web applications to defer server mutations until the user has stable network connectivity, even if the user has closed the tab or navigated away.

Here is the end-to-end architecture:

1. **React App:** Saves the pending payload into **IndexedDB** and registers a `sync` event tag via the Service Worker registration.
2. **Service Worker (`sw.js`):** Listens to `self.addEventListener('sync', ...)` and executes pending network requests directly in the background.

---

### 1. IndexedDB Helper for Main Thread & Service Worker (`idb-queue.js`)

Both the main React thread and the Service Worker need shared access to the same IndexedDB store.

```javascript
// public/idb-queue.js (or bundled shared module)
const DB_NAME = 'bg_sync_db';
const STORE_NAME = 'sync_queue';
const DB_VERSION = 1;

export function openQueueDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addToQueue(item) {
  const db = await openQueueDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getQueue() {
  const db = await openQueueDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function removeFromQueue(id) {
  const db = await openQueueDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

```

---

### 2. Service Worker Implementation (`public/sw.js`)

The Service Worker listens for the `sync` event. When the browser confirms connectivity, it fires the event and runs `event.waitUntil()`. If the sync fails (e.g., server still down), throwing an error tells the browser to schedule another sync retry automatically.

```javascript
// public/sw.js
import { getQueue, removeFromQueue } from './idb-queue.js';

const SYNC_TAG = 'sync-messages';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(flushPendingRequests());
  }
});

async function flushPendingRequests() {
  const queue = await getQueue();

  for (const item of queue) {
    try {
      const response = await fetch(item.url, {
        method: item.method || 'POST',
        headers: { 'Content-Type': 'application/json', ...(item.headers || {}) },
        body: JSON.stringify(item.body),
      });

      if (response.ok || (response.status >= 400 && response.status < 500)) {
        // Successful or unretryable client error -> discard from queue
        await removeFromQueue(item.id);

        // Notify active clients in React of the sync outcome
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_COMPLETED', id: item.id });
        });
      } else {
        // 5xx Server Error: throw to tell browser to retry background sync later
        throw new Error(`Server returned status: ${response.status}`);
      }
    } catch (err) {
      console.warn(`Background sync failed for item ${item.id}, will retry later.`, err);
      throw err; // Re-throw triggers browser-managed exponential retry
    }
  }
}

```

---

### 3. Registering the Service Worker (`src/registerServiceWorker.ts`)

```typescript
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers are not supported in this browser.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      type: 'module', // If using ES imports in the SW
    });
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

```

---

### 4. Background Sync React Hook (`hooks/useBackgroundSync.ts`)

This hook checks if `SyncManager` is supported. If supported, it enqueues to IndexedDB and triggers `registration.sync.register()`. If unsupported (like in Safari/Firefox), it falls back to direct execution or a standard window `online` listener.

```typescript
import { useCallback, useEffect } from 'react';
import { addToQueue } from '../utils/idb-queue';

export function useBackgroundSync(syncTag = 'sync-messages') {
  // Listen for sync completion messages dispatched from Service Worker
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SYNC_COMPLETED') {
        console.log(`Item ${event.data.id} synchronized in background.`);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, []);

  const triggerBackgroundSync = useCallback(
    async (payload: { url: string; method?: string; body: any; headers?: Record<string, string> }) => {
      const item = {
        id: crypto.randomUUID(),
        url: payload.url,
        method: payload.method || 'POST',
        headers: payload.headers || {},
        body: payload.body,
        createdAt: Date.now(),
      };

      // 1. Always store to IndexedDB first
      await addToQueue(item);

      // 2. Check for native Background Sync API support
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        // @ts-expect-error SyncManager is not in default TS lib DOM
        await registration.sync.register(syncTag);
      } else {
        // Fallback: If online, attempt fetch immediately; else wait for 'online' event
        if (navigator.onLine) {
          try {
            await fetch(item.url, {
              method: item.method,
              headers: { 'Content-Type': 'application/json', ...item.headers },
              body: JSON.stringify(item.body),
            });
          } catch (e) {
            console.warn('Direct fetch failed, item remains in IndexedDB fallback queue.');
          }
        }
      }
    },
    [syncTag]
  );

  return { triggerBackgroundSync };
}

```

---

### 5. UI Component Example (`ChatComposer.tsx`)

```tsx
import React, { useState, useEffect } from 'react';
import { registerServiceWorker } from './registerServiceWorker';
import { useBackgroundSync } from './hooks/useBackgroundSync';

export function ChatComposer() {
  const [text, setText] = useState('');
  const { triggerBackgroundSync } = useBackgroundSync('sync-messages');

  useEffect(() => {
    registerServiceWorker();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await triggerBackgroundSync({
      url: '/api/messages',
      method: 'POST',
      body: { content: text, sentAt: new Date().toISOString() },
    });

    setText('');
    alert('Message queued! It will send even if you close this tab.');
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px', maxWidth: '400px', fontFamily: 'sans-serif' }}>
      <h3>Offline Chat Composer</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        rows={3}
        style={{ width: '100%', marginBottom: '8px' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>
        Send Message
      </button>
    </form>
  );
}

```

---

### Key Technical Details

* **`event.waitUntil()` lifecycle:** Guarantees the browser will keep the Service Worker alive until the network Promise settles.
* **Browser-Managed Retries:** If `flushPendingRequests()` throws or rejects (due to no internet or a 500 error), the browser automatically reschedules another `sync` event with exponential backoff.
* **HTTPS Requirement:** Background Sync and Service Workers are strictly available in secure contexts (`https://` or `localhost`).
* **Browser Support Fallback:** Chromium-based browsers (Chrome, Edge, Opera, Samsung Internet) fully support the Background Sync API. For Safari and Firefox, the hook falls back to a standard `navigator.onLine` / `window.addEventListener('online')` handler.
