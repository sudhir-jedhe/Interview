In Front-End System Design, **Browser Local Storage Techniques** enable applications to persist state, cache API responses, and run offline without relying on a continuous server connection.

When building React applications, selecting the right browser storage mechanism and combining it with **Service Workers** allows you to transform standard web applications into resilient, offline-first **Progressive Web Apps (PWAs)**.

---

## 1. Local Storage Techniques in the Browser

The browser provides several built-in storage engines, each tailored to specific data shapes, performance profiles, and storage limits:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BROWSER LOCAL STORAGE SPECTRUM                        │
│                                                                             │
│  1. LOCALSTORAGE / SESSIONSTORAGE  ──► Synchronous, String-only (5MB)     │
│  2. INDEXEDDB                      ──► Asynchronous, Structured DB (500MB+)│
│  3. CACHESTORAGE (SERVICE WORKERS) ──► HTTP Request/Response Offlining      │
└─────────────────────────────────────────────────────────────────────────────┘

```

### A. `localStorage` & `sessionStorage` (Web Storage API)

* **Type:** Key-value store (Strings only).
* **Capacity:** $\approx 5\text{MB}$ per origin.
* **API Nature:** **Synchronous** (blocks the JavaScript main thread during reads/writes).
* **Persistence:** `localStorage` persists until explicitly cleared; `sessionStorage` clears when the tab closes.
* **Best For:** Small, simple preferences (dark mode toggles, small non-sensitive settings).
* **Limitation:** Synchronous nature causes main-thread blocking if overused. Inaccessible inside Web Workers or Service Workers.

---

### B. IndexedDB

* **Type:** Transactional, NoSQL object-oriented database.
* **Capacity:** $500\text{MB} - 2\text{GB}+$ (up to 80% of available disk space).
* **API Nature:** **Asynchronous** (non-blocking, event-driven/Promise-based).
* **Persistence:** Permanent (until cleared by user or extreme disk pressure).
* **Best For:** Large JSON datasets, offline drafts, offline product catalogs, files/blobs, and complex key-range queries.
* **React Ecosystem Libraries:** **Dexie.js** or **localForage** (wraps IndexedDB in a simple Async `localStorage`-like API).

---

### C. CacheStorage API (Service Worker Cache)

* **Type:** HTTP Request/Response pair storage.
* **Capacity:** Large (shared origin disk quota).
* **API Nature:** Asynchronous Promises.
* **Best For:** Caching static assets (HTML, CSS, JS bundles) and network GET API payloads for offline playback.

---

## Storage Technique Comparison Matrix

| Storage Mechanism  | Synchronous / Asynchronous      | Storage Capacity     | Complex Query Support      | Best Use Case in React                                  |
| ------------------ | ------------------------------- | -------------------- | -------------------------- | ------------------------------------------------------- |
| **`localStorage`** | **Synchronous** (Blocking)      | $\approx 5\text{MB}$ | No (Key String only)       | User UI themes, small persistent settings.              |
| **`IndexedDB`**    | **Asynchronous** (Non-blocking) | $\ge 500\text{MB}$   | **Yes** (Indexes & Ranges) | Heavy offline data, offline form drafts, sync queues.   |
| **`CacheStorage`** | **Asynchronous** (Non-blocking) | $\ge 500\text{MB}$   | No (Request URL keys)      | Offline App Shell (HTML/CSS/JS) & API response caching. |

---

## 2. Implementing Offline Capabilities in React

Achieving robust offline functionality in React requires three coordinated layers:

1. **Persistent Data Layer:** Using IndexedDB to store offline data.
2. **Offline Network Interceptor:** Service Workers (`Workbox`) to cache assets and serve offline fallbacks.
3. **Sync Queue & Connection Detection:** Queueing offline mutations and syncing them back to the server when connection restores.

---

### Step 1: IndexedDB Storage with Dexie.js (`src/db/offlineDb.ts`)

Instead of writing verbose native IndexedDB code, use **Dexie.js** for type-safe, promise-based database operations:

```typescript
// src/db/offlineDb.ts
import Dexie, { type Table } from 'dexie';

export interface OfflineDraft {
  id?: number;
  title: string;
  content: string;
  updatedAt: number;
  synced: boolean;
}

class EnterpriseOfflineDB extends Dexie {
  drafts!: Table<OfflineDraft>;

  constructor() {
    super('EnterpriseOfflineDB');
    // Define schema and indexes
    this.version(1).stores({
      drafts: '++id, title, updatedAt, synced',
    });
  }
}

export const db = new EnterpriseOfflineDB();

```

---

### Step 2: React Offline Hook & Data Management (`src/hooks/useOfflineDrafts.ts`)

Create a custom hook that binds IndexedDB live queries directly to React component state:

```tsx
// src/hooks/useOfflineDrafts.ts
import { useState, useEffect } from 'react';
import { db, type OfflineDraft } from '../db/offlineDb';

export function useOfflineDrafts() {
  const [drafts, setDrafts] = useState<OfflineDraft[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 1. Listen for network connection changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Fetch offline drafts from IndexedDB
  useEffect(() => {
    async function loadDrafts() {
      const allDrafts = await db.drafts.toArray();
      setDrafts(allDrafts);
    }
    loadDrafts();
  }, []);

  // 3. Save draft offline into IndexedDB
  const saveDraft = async (title: string, content: string) => {
    const newDraft: OfflineDraft = {
      title,
      content,
      updatedAt: Date.now(),
      synced: false,
    };
    const id = await db.drafts.add(newDraft);
    setDrafts((prev) => [...prev, { ...newDraft, id }]);
  };

  return { drafts, saveDraft, isOnline };
}

```

---

### Step 3: Service Worker Caching Strategy with Workbox (`service-worker.ts`)

Service Workers run in a background thread, intercepting network fetch requests to serve cached assets when the user goes offline.

```typescript
// src/service-worker.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

// 1. Pre-cache application JS/CSS shell during build
precacheAndRoute(self.__WB_MANIFEST);

// 2. Cache API endpoints using Network-First (falls back to CacheStorage if offline)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/v1/products'),
  new NetworkFirst({
    cacheName: 'api-products-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 24 Hours
      }),
    ],
  })
);

// 3. Cache static images using Stale-While-Revalidate
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images-cache',
  })
);

```

---

### Step 4: React UI Integration (`src/components/OfflineArticleEditor.tsx`)

```tsx
// src/components/OfflineArticleEditor.tsx
import React, { useState } from 'react';
import { useOfflineDrafts } from '../hooks/useOfflineDrafts';

export const OfflineArticleEditor: React.FC = () => {
  const { drafts, saveDraft, isOnline } = useOfflineDrafts();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    await saveDraft(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <div className="editor-container">
      {/* Network Status Indicator */}
      <div className={`status-banner ${isOnline ? 'online' : 'offline'}`}>
        {isOnline ? '🟢 Online Mode' : '🔴 Offline Mode (Saving locally to IndexedDB)'}
      </div>

      <form onSubmit={handleSave}>
        <input
          placeholder="Article Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Save Draft</button>
      </form>

      <h2>Local Saved Drafts ({drafts.length})</h2>
      <ul>
        {drafts.map((draft) => (
          <li key={draft.id}>
            <strong>{draft.title}</strong> - {draft.synced ? 'Synced' : 'Pending Sync'}
          </li>
        ))}
      </ul>
    </div>
  );
};

```

---

## 3. Background Sync & Reconciliation Strategy

When a user performs actions while offline (e.g., submitting a form or deleting a record), store those mutations inside an IndexedDB **Sync Queue**.

```
[ User Action Offline ] ──► Store Mutation in IndexedDB Sync Queue
                                      │
                                      ▼
[ Connection Restored ] ──► Read Queue ──► Replay Requests to Server ──► Clear Queue

```

When the `online` event fires:

1. Iterate over all items in the IndexedDB `Sync Queue`.
2. Replay network calls to the backend (`POST`/`PUT`).
3. Upon server confirmation, mark the records as `synced: true` or remove them from the queue.

---

## Summary Best Practices

1. **Do NOT store heavy datasets in `localStorage`:** It blocks the JavaScript main thread synchronously. Use **IndexedDB** instead.
2. **Use Service Workers for Assets & API Fallbacks:** Combine CacheStorage with Workbox strategies (`NetworkFirst` / `StaleWhileRevalidate`).
3. **Provide Visual Feedback:** Always notify users of their network status (`navigator.onLine`) and indicate which data is currently stored locally pending synchronization.

In React applications, using browser storage mechanisms (**`localStorage`**, **`sessionStorage`**, **`IndexedDB`**, and **`CacheStorage`**) introduces specific real-world scenarios, edge cases, and architectural trade-offs.

Here are the most common scenarios you will encounter when using local storage in React, along with practical solutions and production-grade code.

---

## 1. Syncing React State with Storage (The "Initial Hydration" Scenario)

### The Scenario

You want to persist user preferences (e.g., UI theme, sidebar collapse state) so they persist across page refreshes.

### The Problem

Reading from `localStorage` inside `useState(localStorage.getItem('theme'))` runs on **every single render**, causing unnecessary synchronous I/O overhead that blocks the main thread.

### The Solution: Lazy State Initialization

Pass a callback function to `useState` so that `localStorage` is read **only once** during initial component mounting.

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. Lazy initializer: Reads localStorage ONCE during initial render
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Sync state updates to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

```

---

## 2. Multi-Tab Synchronization Scenario

### The Scenario

A user opens your React app in two side-by-side browser tabs. In Tab 1, they log out or switch to "Dark Mode". Tab 2 needs to reflect this state change instantly without requiring a full page refresh.

### The Solution: The `storage` Event Listener

Listen for the native browser `storage` event, which fires across all *other* open tabs sharing the same origin whenever `localStorage` changes.

```tsx
// src/hooks/useSyncTabStorage.ts
import { useState, useEffect } from 'react';

export function useSyncTabStorage(key: string, defaultValue: string) {
  const [value, setValue] = useState(
    () => window.localStorage.getItem(key) || defaultValue
  );

  useEffect(() => {
    // Listens for localStorage changes originating from OTHER tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        setValue(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return value;
}

```

---

## 3. Storage Quota Exceeded Scenario (`QuotaExceededError`)

### The Scenario

A user saves large datasets (e.g., offline form drafts, images converted to Base64, or large API responses) into `localStorage`, causing the browser to throw a `DOMException: QuotaExceededError` once it hits the $\approx 5\text{MB}$ origin limit.

### The Solution: Fallback Strategy & Upgrading to IndexedDB

Catch `QuotaExceededError` gracefully and migrate heavy data to **IndexedDB** (using a wrapper like `localForage` or `Dexie.js`), which supports hundreds of megabytes.

```typescript
import localforage from 'localforage';

export async function safeSaveData(key: string, data: any) {
  const jsonString = JSON.stringify(data);

  try {
    // Attempt standard fast write
    localStorage.setItem(key, jsonString);
  } catch (error: any) {
    // Detect quota limit error
    if (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    ) {
      console.warn('localStorage quota exceeded. Migrating payload to IndexedDB...');
      
      // Clear legacy items and offload heavy storage to IndexedDB
      localStorage.removeItem(key);
      await localforage.setItem(key, data);
    }
  }
}

```

---

## 4. Server-Side Rendering (SSR / Next.js) Hydration Mismatch Scenario

### The Scenario

In frameworks like Next.js, HTML is pre-rendered on the server where `window` and `localStorage` do **not** exist. Reading `localStorage` during initial rendering causes a **Hydration Mismatch Error** (`Text content does not match server-rendered HTML`).

```
Server HTML: <div class="theme-light">...</div>
Client DOM:  <div class="theme-dark">...</div> ──► HYDRATION MISMATCH ERROR

```

### The Solution: Mount Detection (`useEffect`)

Defer reading `localStorage` until *after* client-side hydration completes.

```tsx
import { useState, useEffect } from 'react';

export function ClientOnlyThemeWrapper({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Runs ONLY on the client after initial hydration
    setHasMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Avoid rendering mismatched content during SSR
  if (!hasMounted) {
    return <div className="theme-placeholder">{children}</div>;
  }

  return <div className={`theme-${theme}`}>{children}</div>;
}

```

---

## 5. Security & Sensitive Token Storage Scenario

### The Scenario

Storing sensitive JWT authentication tokens or user PII in `localStorage`.

### The Problem

`localStorage` is completely accessible to **any JavaScript running on the domain**. If a third-party NPM dependency or inline script suffers an **XSS (Cross-Site Scripting)** vulnerability, attackers can steal the token instantly via `localStorage.getItem('token')`.

### The Solution: Secure Cookie Storage Architecture

Never store sensitive JWT access tokens in `localStorage`.

* **Token Strategy:** Move authentication session tokens into **`HttpOnly`**, **`Secure`**, **`SameSite=Lax/Strict`** cookies managed directly by the backend server.
* **Result:** Browser JavaScript cannot read `HttpOnly` cookies, completely neutralizing XSS token theft vectors.

---

## 6. Schema Drift & Stale Data Migration Scenario

### The Scenario

You deploy a new version of your React application where the state structure stored in `localStorage` has changed (e.g., `{ name: "John" }` becomes `{ user: { firstName: "John", lastName: "" } }`). Existing users returning to the app crash because their local storage holds the old, incompatible JSON shape.

### The Solution: Versioned Storage & Migration Utility

```typescript
interface StoredStateV2 {
  version: 2;
  user: {
    firstName: string;
    lastName: string;
  };
}

export function getMigratedUserData(): StoredStateV2 {
  const rawData = localStorage.getItem('app_user_data');
  if (!rawData) return { version: 2, user: { firstName: '', lastName: '' } };

  try {
    const parsed = JSON.parse(rawData);

    // Migration logic from V1 to V2
    if (!parsed.version || parsed.version < 2) {
      const migrated: StoredStateV2 = {
        version: 2,
        user: {
          firstName: parsed.name || '',
          lastName: '',
        },
      };
      localStorage.setItem('app_user_data', JSON.stringify(migrated));
      return migrated;
    }

    return parsed;
  } catch {
    // If corrupted JSON, clear and return default
    localStorage.removeItem('app_user_data');
    return { version: 2, user: { firstName: '', lastName: '' } };
  }
}

```

---

## Storage Scenario Summary Matrix

| Scenario / Problem              | Core Cause                                            | Recommended Architectural Fix                              |
| ------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| **Main-Thread Lag**             | Reading `localStorage` synchronously on every render. | Use **Lazy State Initialization** (`useState(() => ...)`). |
| **Out-of-Sync Multi-Tab State** | Tab 1 updates state; Tab 2 remains stale.             | Listen to window **`storage` events**.                     |
| **`QuotaExceededError`**        | Storing $>5\text{MB}$ of data in `localStorage`.      | Offload heavy JSON or offline drafts to **IndexedDB**.     |
| **Next.js Hydration Errors**    | Server HTML doesn't match client `localStorage`.      | Defer reading storage until **`useEffect`** mounts.        |
| **XSS Token Theft**             | Storing JWTs/secrets in `localStorage`.               | Use **`HttpOnly` Cookies** for auth sessions.              |
| **Application Crash on Deploy** | Stale/legacy JSON schemas in user storage.            | Implement **Versioned Storage Migrations**.                |

In Front-End System Design, **`localStorage`** is a key-value, synchronous browser storage mechanism provided by the Web Storage API.

Unlike `sessionStorage` (which wipes data when a browser tab closes) or cookies (which expire and are automatically sent to the server on every HTTP request), `localStorage` has a distinct persistence profile:

> **The `localStorage` Rule:** Data stored in `localStorage` persists **indefinitely across all tabs and windows of the same origin (`domain:port`)** until it is explicitly cleared via JavaScript (`localStorage.clear()`) or by the user wiping their browser cache/storage. It has a typical storage quota of **$\approx 5\text{MB}$ per origin**.

Here are the primary real-world scenarios where `localStorage` is used in web applications, along with its edge cases, security implications, and architectural alternatives.

---

## 1. Persisting Non-Sensitive User Preferences (UI Customization)

### Scenario

A user configures personal interface settings—such as toggling between **Dark Mode and Light Mode**, collapsing a side navigation menu, or setting a default view mode (e.g., Grid View vs. List View).

### Why `localStorage` is Ideal

* **Cross-Session Continuity:** When the user closes the browser and returns days later, their preferences are remembered immediately.
* **Cross-Tab Synchronization:** If a user opens three tabs of your app and changes the theme to "Dark Mode" in Tab 1, `localStorage` can emit a `storage` event to update Tab 2 and Tab 3 instantly.

```tsx
// React Hook for persisting non-sensitive preferences
import { useState, useEffect } from 'react';

export function usePersistedTheme() {
  const [theme, setTheme] = useState(() => {
    // Lazy initialization: Read localStorage once on mount
    return localStorage.getItem('app_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  return [theme, setTheme] as const;
}

```

---

## 2. Multi-Tab Real-Time Synchronization

### Scenario

An application needs to coordinate state across multiple open tabs without hitting the server—for example, updating a shopping cart count, broadcasting a "User Logged Out" event across all active tabs, or syncing music playback controls.

### How It Works

Whenever `localStorage.setItem()` or `localStorage.removeItem()` is called, the browser automatically dispatches a native **`storage` event** to all *other* open tabs/windows sharing the same origin.

```typescript
// Listening for state updates originating from OTHER open tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'app_theme') {
    console.log(`Theme changed in another tab to: ${event.newValue}`);
    applyTheme(event.newValue);
  }
  
  if (event.key === 'user_logged_out') {
    // Force logout in this tab if user logged out in another tab
    window.location.href = '/login';
  }
});

```

---

## 3. Caching Static Data & Feature Flags

### Scenario

An application frequently fetches rarely changing reference data from the server—such as country dialing codes, state/province lists, or feature flag configurations.

### Why `localStorage` is Used

Caching this JSON payload in `localStorage` saves network bandwidth and speeds up application startup times by eliminating redundant HTTP requests on subsequent visits.

```typescript
// Fetching with a client-side localStorage fallback
async function getCountryCodes() {
  const cached = localStorage.getItem('country_codes_cache');
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // Cache valid for 24 hours
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      return data;
    }
  }

  // Fetch fresh data if missing or expired
  const res = await fetch('/api/v1/countries');
  const freshData = await res.json();
  
  localStorage.setItem('country_codes_cache', JSON.stringify({
    data: freshData,
    timestamp: Date.now()
  }));

  return freshData;
}

```

---

## 4. Preserving Offline Form Progress & Unsaved Content

### Scenario

A user is drafting a long blog post, a support ticket, or a complex form, and their internet connection drops or their browser crashes unexpectedly.

### Why `localStorage` is Used

Periodically auto-saving the input text into `localStorage` every few seconds ensures that if the page reloads or the browser crashes, the user can restore their draft work seamlessly.

---

## 5. Critical Anti-Patterns: When NOT to Use `localStorage`

Despite its convenience, using `localStorage` incorrectly is one of the most common causes of security breaches and performance bottlenecks in modern web development.

### ❌ Anti-Pattern 1: Storing Sensitive Authentication Tokens (JWTs / Passwords / PII)

* **The Threat:** `localStorage` is completely unencrypted and accessible to **any JavaScript executing on the page** via `window.localStorage`.
* **The Vulnerability:** If your application, a third-party npm package, or an analytics script suffers a **Cross-Site Scripting (XSS)** injection, an attacker can execute `localStorage.getItem('jwt_token')` and exfiltrate all user sessions instantly.
* **The Solution:** Store authentication session tokens in **`HttpOnly`**, **`Secure`**, **`SameSite=Lax/Strict`** cookies. JavaScript running on the page cannot read `HttpOnly` cookies, completely mitigating XSS token theft.

---

### ❌ Anti-Pattern 2: Storing Large Datasets ($>5\text{MB}$ or Heavy JSON Arrays)

* **The Problem:** `localStorage` operates **synchronously on the main thread**.
* **The Impact:** Parsing large JSON strings (`JSON.parse()`) or writing huge strings (`localStorage.setItem()`) blocks the main thread, causing frame drops, frozen UI inputs, and poor **Interaction to Next Paint (INP)** scores. Additionally, exceeding the $\approx 5\text{MB}$ quota throws an unhandled `QuotaExceededError`.
* **The Solution:** For large datasets, offline databases, or files, use **IndexedDB** (via wrapper libraries like `Dexie.js` or `localForage`). IndexedDB is asynchronous and handles hundreds of megabytes without blocking the UI thread.

---

### 开启 Anti-Pattern 3: SSR / Next.js Hydration Mismatches

* **The Problem:** In Server-Side Rendering (SSR) frameworks, HTML is generated on the server where `window` and `localStorage` do not exist. Reading `localStorage` during initial component render causes a **Hydration Mismatch Error** because the server-rendered HTML doesn't match the client's local storage state.
* **The Solution:** Read `localStorage` only inside client-side lifecycle hooks (e.g., React's `useEffect`).

---

## Storage Mechanism Comparison Matrix

| Criteria             | `localStorage`                       | `sessionStorage`                      | Cookies (`HttpOnly`)             | `IndexedDB`                          |
| -------------------- | ------------------------------------ | ------------------------------------- | -------------------------------- | ------------------------------------ |
| **Lifetime**         | Permanent (until manually cleared)   | Tab lifetime (cleared on tab close)   | Defined by `Max-Age` / `Expires` | Permanent (until manually cleared)   |
| **Scope**            | Same Origin (All tabs)               | Single Tab / Window                   | Same Origin / Subdomains         | Same Origin (All tabs)               |
| **Storage Capacity** | $\approx 5\text{MB}$                 | $\approx 5\text{MB}$                  | $\approx 4\text{KB}$ per cookie  | $\ge 500\text{MB}+$ (Disk Quota)     |
| **API Type**         | Synchronous (Blocking)               | Synchronous (Blocking)                | Synchronous / Automatic          | **Asynchronous** (Non-blocking)      |
| **XSS Protected?**   | ❌ No                                 | ❌ No                                  | **✅ Yes** (via `HttpOnly`)       | ❌ No                                 |
| **Best Used For**    | Dark mode, non-sensitive UI settings | Multi-step form drafts, tab isolation | **Auth Tokens / Session IDs**    | Large offline datasets, heavy drafts |
