An offline sync queue allows users to perform mutations (create, update, delete) while offline or experiencing unstable connectivity. The mutations are persisted locally in **IndexedDB**, queued, and automatically processed in the background with exponential backoff when connectivity resumes.

---

### 1. IndexedDB Queue Storage (`utils/syncDb.ts`)

Use the native IndexedDB API (or lightweight wrapper like `idb`) to store queued requests.

```typescript
export interface QueuedRequest {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers: Record<string, string>;
  body?: any;
  createdAt: number;
  retryCount: number;
}

const DB_NAME = 'offline_sync_db';
const STORE_NAME = 'mutation_queue';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
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

export const syncDb = {
  async add(item: QueuedRequest): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getAll(): Promise<QueuedRequest[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => {
        // Sort FIFO (First-In, First-Out) by creation timestamp
        const sorted = (request.result as QueuedRequest[]).sort((a, b) => a.createdAt - b.createdAt);
        resolve(sorted);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async remove(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async update(item: QueuedRequest): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
};

```

---

### 2. The Offline Sync Engine (`context/SyncContext.tsx`)

This provider monitors network status (`online`/`offline`), manages the synchronization queue, executes requests sequentially, and handles exponential retries with jitter.

```tsx
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { syncDb, QueuedRequest } from '../utils/syncDb';

interface SyncContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  enqueueRequest: (req: Omit<QueuedRequest, 'id' | 'createdAt' | 'retryCount'>) => Promise<void>;
  syncNow: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | null>(null);

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const isSyncingRef = useRef(false);

  const refreshCount = useCallback(async () => {
    const items = await syncDb.getAll();
    setPendingCount(items.length);
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  // Exponential backoff with jitter helper
  const getBackoffDelay = (attempt: number) => {
    const exponential = Math.min(30000, BASE_DELAY_MS * Math.pow(2, attempt));
    const jitter = Math.random() * 300;
    return exponential + jitter;
  };

  const processQueue = useCallback(async () => {
    if (isSyncingRef.current || !navigator.onLine) return;

    isSyncingRef.current = true;
    setIsSyncing(true);

    try {
      const queue = await syncDb.getAll();

      for (const item of queue) {
        if (!navigator.onLine) break; // Abort if network dropped mid-sync

        try {
          const response = await fetch(item.url, {
            method: item.method,
            headers: item.headers,
            body: item.body ? JSON.stringify(item.body) : undefined,
          });

          // 2xx Success or 4xx Client Error (bad request / unprocessable entity - don't retry bad payload)
          if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
            await syncDb.remove(item.id);
          } else if (response.status === 429 || response.status >= 500) {
            // Server error or rate limit: increment retry and pause
            item.retryCount += 1;
            if (item.retryCount > MAX_RETRIES) {
              console.error(`Request ${item.id} exceeded max retries. Discarding.`);
              await syncDb.remove(item.id);
            } else {
              await syncDb.update(item);
              const delay = getBackoffDelay(item.retryCount);
              await new Promise((res) => setTimeout(res, delay));
            }
            break; // Stop further queue execution until next cycle
          }
        } catch (error) {
          // Network failure during fetch
          item.retryCount += 1;
          await syncDb.update(item);
          break;
        }
      }
    } finally {
      await refreshCount();
      isSyncingRef.current = false;
      setIsSyncing(false);
    }
  }, [refreshCount]);

  // Listen to network status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [processQueue]);

  // Enqueue new mutation
  const enqueueRequest = async (req: Omit<QueuedRequest, 'id' | 'createdAt' | 'retryCount'>) => {
    const queuedItem: QueuedRequest = {
      ...req,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      retryCount: 0,
    };

    await syncDb.add(queuedItem);
    await refreshCount();

    if (navigator.onLine) {
      processQueue();
    }
  };

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingCount,
        enqueueRequest,
        syncNow: processQueue,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncQueue = () => {
  const context = useContext(SyncContext);
  if (!context) throw new Error('useSyncQueue must be used within SyncProvider');
  return context;
};

```

---

### 3. Custom Mutation Hook (`hooks/useOfflineMutation.ts`)

Wraps mutations with optimistic execution and fallback to the sync queue.

```typescript
import { useSyncQueue } from '../context/SyncContext';

interface MutationOptions<TData, TVariables> {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  onOptimisticUpdate?: (variables: TVariables) => void;
  onSuccess?: (data: TData) => void;
}

export function useOfflineMutation<TData = any, TVariables = any>({
  url,
  method = 'POST',
  headers = { 'Content-Type': 'application/json' },
  onOptimisticUpdate,
  onSuccess,
}: MutationOptions<TData, TVariables>) {
  const { isOnline, enqueueRequest } = useSyncQueue();

  const mutate = async (variables: TVariables) => {
    // 1. Trigger local optimistic update immediately
    if (onOptimisticUpdate) {
      onOptimisticUpdate(variables);
    }

    // 2. If offline, enqueue directly to IndexedDB
    if (!isOnline) {
      await enqueueRequest({ url, method, headers, body: variables });
      return;
    }

    // 3. If online, attempt direct network call
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(variables),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      if (onSuccess) onSuccess(data);
    } catch (err) {
      // If direct network call fails unexpectedly, push to sync queue
      await enqueueRequest({ url, method, headers, body: variables });
    }
  };

  return { mutate };
}

```

---

### 4. UI Status Banner & Form Example

```tsx
import React, { useState } from 'react';
import { useSyncQueue } from '../context/SyncContext';
import { useOfflineMutation } from '../hooks/useOfflineMutation';

export function TaskManager() {
  const { isOnline, isSyncing, pendingCount, syncNow } = useSyncQueue();
  const [tasks, setTasks] = useState<{ id: string; title: string }[]>([]);
  const [input, setInput] = useState('');

  const { mutate: createTask } = useOfflineMutation({
    url: '/api/tasks',
    method: 'POST',
    onOptimisticUpdate: (newTask: { id: string; title: string }) => {
      setTasks((prev) => [...prev, newTask]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    createTask({ id: crypto.randomUUID(), title: input });
    setInput('');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      {/* Network & Sync Status Header */}
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '6px',
          marginBottom: '1rem',
          backgroundColor: !isOnline ? '#fef3c7' : pendingCount > 0 ? '#eff6ff' : '#f0fdf4',
          color: !isOnline ? '#92400e' : pendingCount > 0 ? '#1e40af' : '#166534',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
        }}
      >
        <span>
          {!isOnline ? '⚡ Offline mode' : isSyncing ? '🔄 Syncing...' : '🟢 Online'}
          {pendingCount > 0 && ` (${pendingCount} pending)`}
        </span>
        {isOnline && pendingCount > 0 && !isSyncing && (
          <button onClick={syncNow} style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>
            Sync Now
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New task title..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Add
        </button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ padding: '6px 0' }}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

### Architectural Highlights

* **FIFO Execution Order:** Sorts queue by `createdAt` timestamp to ensure updates and dependent mutations run in the exact order the user performed them.
* **4xx vs 5xx Handling:** Drops unprocessable permanent client errors (400, 422) to avoid blocking the queue forever, while retrying temporary server errors (500, 503) and rate limits (429).
* **Crash Resilience:** Because state is written to IndexedDB before execution, closing the tab or reloading the page retains all queued mutations until connectivity is restored.
