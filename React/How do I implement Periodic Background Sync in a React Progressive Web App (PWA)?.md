The **Periodic Background Sync API** enables Progressive Web Apps (PWAs) to periodically fetch fresh data in the background (e.g., daily news, stock updates, dashboard metrics) even when the app is completely closed.

---

### Prerequisites & Browser Constraints

* **Installed PWA Only:** The web app must be installed as a PWA (added to home screen/desktop).
* **Site Engagement Score:** The browser uses your site engagement score to determine how frequently it wakes up the Service Worker (usually once a day or every few hours).
* **Permission Model:** Requires checking the `'periodic-background-sync'` permission via the Permissions API.
* **Chromium Support:** Supported on Chromium browsers (Chrome, Edge, Samsung Internet, Opera).

---

### 1. Service Worker Periodic Sync Handler (`public/sw.js`)

Listen for the `periodicsync` event inside the Service Worker and update the cache or IndexedDB:

```javascript
// public/sw.js
const PERIODIC_SYNC_TAG = 'update-daily-content';
const CACHE_NAME = 'daily-content-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle the periodic background event
self.addEventListener('periodicsync', (event) => {
  if (event.tag === PERIODIC_SYNC_TAG) {
    event.waitUntil(fetchAndCacheLatestData());
  }
});

async function fetchAndCacheLatestData() {
  try {
    const response = await fetch('/api/daily-feed');
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/api/daily-feed', response);
      
      // Optionally notify active windows
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({ type: 'PERIODIC_SYNC_SUCCESS', tag: PERIODIC_SYNC_TAG });
      });
    }
  } catch (error) {
    console.error('Periodic background sync failed to fetch data:', error);
  }
}

```

---

### 2. Custom React Hook for Periodic Sync (`hooks/usePeriodicSync.ts`)

This hook verifies browser support, checks site permissions, and registers the periodic sync interval.

```typescript
import { useState, useEffect, useCallback } from 'react';

interface PeriodicSyncOptions {
  tag: string;
  minIntervalMs?: number; // Browser default target interval (e.g., 24 hours: 24 * 60 * 60 * 1000)
}

export function usePeriodicSync({ tag, minIntervalMs = 24 * 60 * 60 * 1000 }: PeriodicSyncOptions) {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Check if Periodic Sync is available in the current browser
  const checkStatus = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      setIsSupported(false);
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    // Check if PeriodicSyncManager exists on the SW registration
    if ('periodicSync' in registration) {
      setIsSupported(true);
      // @ts-expect-error periodicSync is not part of standard TS lib.dom.d.ts
      const tags: string[] = await registration.periodicSync.getTags();
      setIsRegistered(tags.includes(tag));
    } else {
      setIsSupported(false);
    }
  }, [tag]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Register periodic sync
  const registerSync = useCallback(async () => {
    if (!isSupported) {
      setStatusMessage('Periodic Background Sync is not supported or the app is not installed.');
      return false;
    }

    try {
      // 1. Check permissions
      // @ts-expect-error PermissionDescriptor for periodic-background-sync
      const status = await navigator.permissions.query({ name: 'periodic-background-sync' });

      if (status.state !== 'granted') {
        setStatusMessage('Permission not granted. Ensure PWA is installed and site engagement is active.');
        return false;
      }

      // 2. Register periodic sync interval
      const registration = await navigator.serviceWorker.ready;
      // @ts-expect-error periodicSync API
      await registration.periodicSync.register(tag, {
        minInterval: minIntervalMs,
      });

      setIsRegistered(true);
      setStatusMessage(`Periodic sync registered (Interval: ~${minIntervalMs / 3600000}h)`);
      return true;
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      setStatusMessage(`Registration failed: ${error}`);
      return false;
    }
  }, [isSupported, minIntervalMs, tag]);

  // Unregister periodic sync
  const unregisterSync = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      if ('periodicSync' in registration) {
        // @ts-expect-error periodicSync API
        await registration.periodicSync.unregister(tag);
        setIsRegistered(false);
        setStatusMessage('Periodic sync unregistered.');
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      setStatusMessage(`Unregister failed: ${error}`);
    }
  }, [tag]);

  return {
    isSupported,
    isRegistered,
    statusMessage,
    registerSync,
    unregisterSync,
  };
}

```

---

### 3. PWA Component Integration (`FeedManager.tsx`)

```tsx
import React, { useEffect } from 'react';
import { usePeriodicSync } from './hooks/usePeriodicSync';

export function DailyFeedSync() {
  const {
    isSupported,
    isRegistered,
    statusMessage,
    registerSync,
    unregisterSync,
  } = usePeriodicSync({
    tag: 'update-daily-content',
    minIntervalMs: 12 * 60 * 60 * 1000, // Request update every 12 hours
  });

  // Listen for background update notifications dispatched from the Service Worker
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PERIODIC_SYNC_SUCCESS') {
        console.log('Fresh background data cached by periodic sync!');
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', maxWidth: '420px' }}>
      <h3>Background Feed Synchronization</h3>

      <p style={{ fontSize: '14px', color: '#64748b' }}>
        Status: <strong>{isSupported ? (isRegistered ? 'Active 🟢' : 'Inactive ⚪') : 'Unsupported ❌'}</strong>
      </p>

      {statusMessage && (
        <p style={{ fontSize: '12px', color: '#2563eb', backgroundColor: '#eff6ff', padding: '6px' }}>
          {statusMessage}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {!isRegistered ? (
          <button
            onClick={registerSync}
            disabled={!isSupported}
            style={{ padding: '8px 14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Enable Background Updates
          </button>
        ) : (
          <button
            onClick={unregisterSync}
            style={{ padding: '8px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Disable Background Updates
          </button>
        )}
      </div>
    </div>
  );
}

```

---

### How to Test Periodic Background Sync in DevTools

Because the browser controls when to trigger periodic syncs in production, you can trigger manual test executions in Chrome/Edge:

1. Open **Chrome DevTools** (`F12`).
2. Go to the **Application** panel.
3. Select **Periodic Background Sync** in the left sidebar (under *Background Services*).
4. Enter the tag name (`update-daily-content`) into the input field and click **Periodic Sync**.
5. Check the **Console** and the **Cache Storage** section to see your updated data.
