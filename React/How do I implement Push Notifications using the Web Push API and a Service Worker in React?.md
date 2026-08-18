Implementing Web Push Notifications involves three stages:

1. **Service Worker (`sw.js`):** Listens for incoming `push` events from the push service and displays notifications via `showNotification()`. Handles user clicks via `notificationclick`.
2. **Client-side React Hook:** Requests notification permissions, subscribes the browser to the push service via **VAPID Public Key**, and sends the resulting `PushSubscription` to your backend.
3. **Backend Trigger (Node.js/Web-Push):** Encrypts and sends push payloads to the subscription endpoint using your private VAPID key.

---

### 1. VAPID Key Helper (`utils/vapidHelper.ts`)

The Web Push standard requires converting the base64-encoded VAPID public key into a `Uint8Array` for `pushManager.subscribe()`.

```typescript
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

```

---

### 2. Service Worker Implementation (`public/sw.js`)

Place `sw.js` in your `public/` directory so it has root-level scope (`/`).

```javascript
// public/sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 1. Listen for push messages dispatched from the backend push service
self.addEventListener('push', (event) => {
  let data = { title: 'New Notification', body: 'You have a new update.', url: '/' };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    data: {
      url: data.url || '/',
    },
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 2. Handle notification click & focus or open the target URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus open window if already on target URL
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

```

---

### 3. Custom React Hook (`hooks/usePushNotifications.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { urlBase64ToUint8Array } from '../utils/vapidHelper';

interface UsePushNotificationsOptions {
  vapidPublicKey: string;
  onSubscribeSuccess?: (subscription: PushSubscription) => Promise<void>;
  onUnsubscribeSuccess?: () => Promise<void>;
}

export function usePushNotifications({
  vapidPublicKey,
  onSubscribeSuccess,
  onUnsubscribeSuccess,
}: UsePushNotificationsOptions) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check support & initialize existing subscription
  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      navigator.serviceWorker.ready.then(async (registration) => {
        const existingSubscription = await registration.pushManager.getSubscription();
        setSubscription(existingSubscription);
      });
    }
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!isSupported) return null;

    setIsLoading(true);
    try {
      // 1. Request user permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      // 2. Wait for service worker and create subscription
      const registration = await navigator.serviceWorker.ready;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      setSubscription(newSubscription);

      // 3. Send subscription payload to your backend database
      if (onSubscribeSuccess) {
        await onSubscribeSuccess(newSubscription);
      }

      return newSubscription;
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, vapidPublicKey, onSubscribeSuccess]);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    if (!subscription) return false;

    setIsLoading(true);
    try {
      const successful = await subscription.unsubscribe();
      if (successful) {
        setSubscription(null);
        if (onUnsubscribeSuccess) {
          await onUnsubscribeSuccess();
        }
      }
      return successful;
    } catch (err) {
      console.error('Failed to unsubscribe from push notifications:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription, onUnsubscribeSuccess]);

  return {
    isSupported,
    permission,
    subscription,
    isSubscribed: Boolean(subscription),
    isLoading,
    subscribeToPush,
    unsubscribeFromPush,
  };
}

```

---

### 4. UI Toggle Component (`PushNotificationToggle.tsx`)

```tsx
import React, { useEffect } from 'react';
import { usePushNotifications } from './hooks/usePushNotifications';

// Replace with your VAPID Public Key generated from web-push CLI
const VAPID_PUBLIC_KEY = 'BCx_example_vapid_public_key_from_your_backend_generation';

export function PushNotificationToggle() {
  // Register Service Worker on mount
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }
  }, []);

  const {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribeToPush,
    unsubscribeFromPush,
  } = usePushNotifications({
    vapidPublicKey: VAPID_PUBLIC_KEY,
    onSubscribeSuccess: async (sub) => {
      // Send subscription object to backend server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
    },
    onUnsubscribeSuccess: async () => {
      // Remove subscription from backend server
      await fetch('/api/push/unsubscribe', { method: 'POST' });
    },
  });

  if (!isSupported) {
    return <p style={{ color: '#9ca3af' }}>Push notifications not supported in this browser.</p>;
  }

  return (
    <div style={{ padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', maxWidth: '380px' }}>
      <h4 style={{ margin: '0 0 8px' }}>Push Notifications</h4>
      <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }}>
        Permission status: <strong>{permission}</strong>
      </p>

      {permission === 'denied' ? (
        <p style={{ color: '#ef4444', fontSize: '13px' }}>
          Notifications are blocked in your browser settings.
        </p>
      ) : (
        <button
          onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isSubscribed ? '#ef4444' : '#0284c7',
            color: '#ffffff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          {isLoading
            ? 'Processing...'
            : isSubscribed
            ? 'Disable Notifications'
            : 'Enable Notifications'}
        </button>
      )}
    </div>
  );
}

```

---

### 5. Backend Trigger Reference (Node.js + `web-push`)

To trigger push notifications to subscribed clients from your server:

```javascript
// server.js (Node.js Express / Next.js API Route)
import webpush from 'web-push';

// 1. Generate keys once: `npx web-push generate-vapid-keys`
webpush.setVapidDetails(
  'mailto:support@yourdomain.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// 2. Dispatch push to stored subscription endpoint
export async function sendNotificationToUser(subscription, messagePayload) {
  const payload = JSON.stringify({
    title: messagePayload.title,
    body: messagePayload.body,
    url: messagePayload.url || '/',
  });

  try {
    await webpush.sendNotification(subscription, payload);
  } catch (error) {
    if (error.statusCode === 410 || error.statusCode === 404) {
      // Subscription expired or uninstalled -> remove from database
      console.log('Subscription has expired, removing from DB.');
    }
  }
}

```

---

### Key Requirements & Constraints

* **HTTPS Requirement:** The Push API and Service Workers require a secure origin (`https://` or `localhost`).
* **`userVisibleOnly: true`:** All major browsers require every push event to show a visible notification (`showNotification()`) to prevent covert background tracking.
* **Expired Subscriptions (HTTP 410):** When users clear browser data or reset permissions, push gateways return HTTP `410 Gone`. Your backend should prune these subscriptions on receiving a 410 response.
