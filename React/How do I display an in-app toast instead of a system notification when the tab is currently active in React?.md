To route incoming push messages conditionally—showing an **in-app toast** when the user is actively viewing your application and falling back to a **system push notification** when the tab is backgrounded or closed—use the Service Worker `clients.matchAll()` API paired with `client.focused` and `client.visibilityState`.

---

### Architecture Overview

```
                        ┌───────────────────────────────┐
                        │   Incoming Web Push Event     │
                        └──────────────┬────────────────┘
                                       │
                    Is any client window open & focused?
                                       │
                     ┌─────────────────┴─────────────────┐
                    YES                                 NO
                     │                                   │
       PostMessage to Active Tab            Show OS System Notification
       (Trigger In-App UI Toast)           (sw.registration.showNotification)

```

---

### 1. Service Worker Logic (`public/sw.js`)

In the `push` event handler, query all attached window clients to determine if any window has focus. If a focused tab exists, forward the payload via `postMessage()`. If no tabs are focused, call `registration.showNotification()`.

```javascript
// public/sw.js

self.addEventListener('push', (event) => {
  let payload = {
    title: 'New Update',
    body: 'You have a new message.',
    url: '/',
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (err) {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    (async () => {
      // Query all open browser tabs/windows controlled by this Service Worker
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      // Check if at least one tab is visible and focused
      const focusedClient = windowClients.find(
        (client) => client.focused && client.visibilityState === 'visible'
      );

      if (focusedClient) {
        // Tab is active: send message to React client for an in-app toast
        focusedClient.postMessage({
          type: 'IN_APP_NOTIFICATION',
          payload,
        });
      } else {
        // Tab is backgrounded, minimized, or closed: show OS system notification
        const notificationOptions = {
          body: payload.body,
          icon: payload.icon || '/icon-192.png',
          badge: payload.badge || '/badge-72.png',
          data: {
            url: payload.url || '/',
          },
        };

        await self.registration.showNotification(payload.title, notificationOptions);
      }
    })()
  );
});

// Handle clicking on the OS system notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });

      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })()
  );
});

```

---

### 2. React In-App Toast Listener Hook (`hooks/usePushToastListener.ts`)

Listen for `message` events dispatched from the Service Worker and trigger your toast library (e.g., Sonner, React Hot Toast, or a custom toast state).

```typescript
import { useEffect } from 'react';

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

interface UsePushToastListenerProps {
  onReceiveToast: (payload: PushNotificationPayload) => void;
}

export function usePushToastListener({ onReceiveToast }: UsePushToastListenerProps) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === 'IN_APP_NOTIFICATION') {
        const payload = event.data.payload as PushNotificationPayload;
        onReceiveToast(payload);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [onReceiveToast]);
}

```

---

### 3. Application Integration (Using Sonner / React Hot Toast)

Integrate the listener at the root of your application layout to pop up an interactive banner when new notifications arrive while the user is actively working in the app.

```tsx
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePushToastListener, PushNotificationPayload } from './hooks/usePushToastListener';

// Example UI Toast Stack (replace with your preferred toast library like `sonner` or `react-hot-toast`)
export function AppNotificationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleReceiveToast = useCallback(
    (payload: PushNotificationPayload) => {
      // Play subtle chime or sound if desired
      // new Audio('/notification.mp3').play().catch(() => {});

      // Custom in-app toast trigger (Example using standard browser custom dispatch or toast library)
      console.log('Displaying In-App Toast:', payload);

      // Example using `sonner`:
      // toast(payload.title, {
      //   description: payload.body,
      //   action: payload.url
      //     ? { label: 'View', onClick: () => navigate(payload.url!) }
      //     : undefined,
      // });
    },
    [navigate]
  );

  usePushToastListener({ onReceiveToast: handleReceiveToast });

  return <>{children}</>;
}

```

---

### Key Operational Considerations

* **`client.focused` vs `client.visibilityState`:** Checking `client.focused` ensures the user is actively working in that window. If the tab is visible on an un-focused split monitor, `visibilityState === 'visible'` is true but `focused` is false, correctly allowing a system notification to grab their attention.
* **Silent Push Constraint:** The Web Push standard mandates that every push event must either invoke `showNotification()` or resolve a Promise. When routing to `postMessage()`, resolving the `event.waitUntil()` block immediately satisfies browser heuristics without triggering penalties.
* **Multi-Tab Sync:** `self.clients.matchAll()` inspects all tabs belonging to your origin. If the user has 3 tabs open and one is focused, only the focused tab receives the `postMessage`, preventing duplicate alerts across tabs.
