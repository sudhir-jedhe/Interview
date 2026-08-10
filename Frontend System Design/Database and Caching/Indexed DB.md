### 1. What is IndexedDB?

**IndexedDB** is a low-level, transactional, object-oriented database built directly into modern web browsers. Unlike `localStorage` or `sessionStorage`—which are limited to $\approx 5\text{MB}$ of string-only key-value data and execute **synchronously** (blocking the JavaScript main thread)—IndexedDB is designed specifically for **large-scale, structured data**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WEB STORAGE SPECTRUM IN BROWSERS                     │
│                                                                             │
│  1. LOCALSTORAGE / SESSIONSTORAGE  ──► Synchronous, Strings only (5MB)      │
│  2. COOKIES                        ──► Small HTTP headers (4KB)             │
│  3. INDEXEDDB                      ──► Asynchronous, Objects, Indexes (500MB+)│
└─────────────────────────────────────────────────────────────────────────────┘

```

#### Key Characteristics of IndexedDB

* **High Capacity:** Allows applications to store $500\text{MB}$ to multiple gigabytes of data (typically taking up to 60–80% of available disk space depending on the browser).
* **Asynchronous Execution:** Operations run via asynchronous events or Promises, ensuring that heavy read/write queries never freeze or lag the UI main thread (preserving smooth **Interaction to Next Paint / INP**).
* **Structured Clone Algorithm:** Stores complex JavaScript objects, arrays, Blobs, Files, and TypedArrays directly without requiring manual `JSON.stringify()` serialization.
* **Indexed Queries:** Supports indexes on object properties, allowing fast search lookups across millions of records without scanning the entire database sequentially.
* **ACID Transactions:** Database modifications occur inside atomic transactions, ensuring data integrity even if the browser crashes mid-operation.

---

### 2. How IndexedDB Enables Large-Scale Front-End Data Management

Using native IndexedDB with vanilla callbacks can be verbose. In enterprise Front-End System Design, applications use wrapper libraries like **Dexie.js** or **`idb`** to convert IndexedDB into a clean, promise-based API.

Here is how IndexedDB handles large-scale structured data across three real-world frontend scenarios.

---

### Scenario 1: Offline-First E-Commerce Product Catalog

#### Problem

An e-commerce application has a catalog of 50,000 products with images, categories, and prices. Fetching this data over the network every time a user navigates between views causes slow load times and fails completely when offline.

#### Solution

Cache the full product catalog inside an IndexedDB Object Store using **Dexie.js**, indexed by `category` and `price`.

#### Code Example (`src/db/productCatalogDb.ts`)

```typescript
import Dexie, { type Table } from 'dexie';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  imageBlob?: Blob;
}

class ProductDatabase extends Dexie {
  products!: Table<Product>;

  constructor() {
    super('ECommerceCatalogDB');
    
    // Schema definition: Primary Key 'id', Indexed attributes: 'category', 'price'
    this.version(1).stores({
      products: 'id, category, price, [category+price]',
    });
  }
}

export const db = new ProductDatabase();

// 1. Bulk Insert 10,000+ Products without blocking main thread
export async function seedProductCatalog(products: Product[]) {
  await db.products.bulkPut(products);
  console.log('Successfully cached products in IndexedDB');
}

// 2. Query Indexed DB efficiently using indexes (sub-millisecond execution)
export async function getInexpensiveElectronics(maxPrice: number) {
  return await db.products
    .where('category')
    .equals('electronics')
    .and((product) => product.price <= maxPrice)
    .toArray();
}

```

---

### Scenario 2: Offline Form Drafts & Pending Mutation Sync Queue

#### Problem

Users filling out complex enterprise forms (e.g., field inspection reports, medical charts, or long support tickets) need to save their work continuously. If the network drops, submitted forms must be queued locally and automatically retried when internet connectivity returns.

#### Solution

Store pending mutation requests in an IndexedDB `sync_queue` table and replay them when the browser emits the `online` event.

#### Code Example (`src/db/syncQueue.ts`)

```typescript
import Dexie, { type Table } from 'dexie';

export interface PendingMutation {
  id?: number;
  endpoint: string;
  method: 'POST' | 'PUT' | 'DELETE';
  payload: Record<string, any>;
  timestamp: number;
}

class SyncDatabase extends Dexie {
  mutationQueue!: Table<PendingMutation>;

  constructor() {
    super('AppSyncDB');
    this.version(1).stores({
      mutationQueue: '++id, timestamp',
    });
  }
}

export const syncDb = new SyncDatabase();

// Add mutation to offline queue
export async function queueOfflineAction(endpoint: string, method: 'POST' | 'PUT', payload: any) {
  await syncDb.mutationQueue.add({
    endpoint,
    method,
    payload,
    timestamp: Date.now(),
  });
}

// Replay queue when network connection is restored
export async function processSyncQueue() {
  if (!navigator.onLine) return;

  const pendingMutations = await syncDb.mutationQueue.orderBy('timestamp').toArray();

  for (const mutation of pendingMutations) {
    try {
      const response = await fetch(mutation.endpoint, {
        method: mutation.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mutation.payload),
      });

      if (response.ok) {
        // Remove successfully processed item from queue
        await syncDb.mutationQueue.delete(mutation.id!);
      }
    } catch (error) {
      console.error(`Failed to sync mutation ID ${mutation.id}, will retry later.`, error);
      break; // Stop loop if network drops mid-sync
    }
  }
}

// Listen for network restoration
window.addEventListener('online', processSyncQueue);

```

---

### Scenario 3: Heavy Media & Blob File Storage (Video / Audio Caching)

#### Problem

An e-learning or podcast application needs to let users download media files (audio tracks or videos) for offline listening. Storing binary Blobs in `localStorage` requires converting them to Base64 strings, inflating file size by $\approx 33\%$ and exceeding storage limits.

#### Solution

IndexedDB handles raw binary `Blob` and `File` objects natively without Base64 conversion overhead.

#### Code Example (`src/db/mediaStorage.ts`)

```typescript
import Dexie, { type Table } from 'dexie';

export interface OfflineAudioTrack {
  id: string;
  title: string;
  audioBlob: Blob;
  downloadedAt: number;
}

class MediaDatabase extends Dexie {
  audioTracks!: Table<OfflineAudioTrack>;

  constructor() {
    super('OfflineMediaDB');
    this.version(1).stores({
      audioTracks: 'id, downloadedAt',
    });
  }
}

export const mediaDb = new MediaDatabase();

// Download and store raw binary audio blob directly into IndexedDB
export async function downloadTrackForOffline(trackId: string, title: string, audioUrl: string) {
  const response = await fetch(audioUrl);
  const blob = await response.blob();

  await mediaDb.audioTracks.put({
    id: trackId,
    title,
    audioBlob: blob,
    downloadedAt: Date.now(),
  });
}

// Retrieve audio blob and generate Object URL for html5 <audio> playback
export async function getOfflineAudioUrl(trackId: string): Promise<string | null> {
  const track = await mediaDb.audioTracks.get(trackId);
  if (!track) return null;

  return URL.createObjectURL(track.audioBlob);
}

```

---

### 3. Comparison of Browser Storage Mechanisms

| Storage Mechanism    | Capacity                | API Nature                      | Querying Capabilities            | Native Blob/File Support?         |
| -------------------- | ----------------------- | ------------------------------- | -------------------------------- | --------------------------------- |
| **`localStorage`**   | $\approx 5\text{MB}$    | **Synchronous** (Blocking)      | Key-String matching only         | ❌ No (Requires Base64 conversion) |
| **`sessionStorage`** | $\approx 5\text{MB}$    | **Synchronous** (Blocking)      | Key-String matching only         | ❌ No                              |
| **`IndexedDB`**      | **$\ge 500\text{MB}+$** | **Asynchronous** (Non-blocking) | **Full Indexed & Range Queries** | **✅ Yes (Direct Binary Storage)** |
| **`CacheStorage`**   | $\ge 500\text{MB}+$     | **Asynchronous** (Non-blocking) | Request URL Key matching         | **✅ Yes (Raw HTTP Responses)**    |
