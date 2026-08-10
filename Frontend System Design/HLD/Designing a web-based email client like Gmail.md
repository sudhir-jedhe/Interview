Designing a web-based email client like Gmail requires handling **high-volume real-time events**, **instant search/filtering**, **offline-first local persistence**, and **rich layout rendering** (virtualized lists, email thread composition, and complex inline HTML rendering).

---

## 1. High-Level System Architecture

```
+---------------------------------------------------------------------------------------------------+
| CLIENT BROWSER ARCHITECTURE                                                                        |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  | VIEW & INTERACTION LAYER (React / Virtualized Component Tree)                                |  |
|  |  +--------------------+  +----------------------+  +-------------------------------------+  |  |
|  |  | Navigation Rail    |  | Thread List          |  | Thread Detail View / Compose Modal  |  |  |
|  |  | (Labels, Folders)  |  | (Virtualized Window) |  | (Sanitized HTML iframe / Draft Editor)|  |  |
|  |  +--------------------+  +----------------------+  +-------------------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                ^                                                  |
|                                         Subscribes / Binds                                        |
|                                                v                                                  |
|  +---------------------------------------------------------------------------------------------+  |
|  | STATE & DATA MANAGEMENT LAYER                                                               |  |
|  |  +-----------------------------------+  +-------------------------------------------------+  |  |
|  |  | Normalized Memory Store           |  | Optimistic Mutation Engine                      |  |  |
|  |  | (Entities: Threads, Messages, Drafts)| | (Instant UI updates + Rollback Queue)           |  |  |
|  |  +-----------------------------------+  +-------------------------------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                ^                                                  |
|                                           Syncs / Reads                                           |
|                                                v                                                  |
|  +---------------------------------------------------------------------------------------------+  |
|  | BACKGROUND & OFFLINE ENGINE (Web Workers + IndexedDB)                                         |  |
|  |  +-----------------------------------+  +-------------------------------------------------+  |  |
|  |  | Dedicated Web Worker              |  | IndexedDB Local Database                        |  |  |
|  |  | (Delta Syncing, SSE Processing)   |  | (Full-text Search Index, Offline Mail Sync)     |  |  |
|  |  +-----------------------------------+  +-------------------------------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
                                                 ^
                                         Network Requests
                                                 v
+---------------------------------------------------------------------------------------------------+
| BACKEND & EDGE GATEWAY                                                                            |
|                                                                                                   |
|  +--------------------+  +--------------------+  +-------------------+  +----------------------+  |
|  | Global CDN         |  | API Gateway / BARS |  | Server-Sent Events|  | Search Service Engine|  |
|  | (Static Bundles)   |  | (REST / GraphQL)   |  | (SSE Push Stream) |  | (Elastic / Custom)   |  |
|  +--------------------+  +--------------------+  +-------------------+  +----------------------+  |
+---------------------------------------------------------------------------------------------------+

```

---

## 2. Key Architecture Pillars

### Pillar A: Rendering Strategy & Component Hierarchy

* **App Shell:** Served via static CDN with aggressive caching. The core shell mounts layout containers immediately and initiates background sync.
* **Virtualized List Engine:** Inboxes frequently contain thousands of threads. Standard DOM rendering will crash the browser. A **windowing engine** (rendering only items visible within the viewport plus a 5-item buffer) maintains a flat $O(1)$ memory footprint regardless of list size.
* **Isolated Email Body View:** Email contents contain arbitrary, untrusted HTML/CSS that can easily bleed styles or expose XSS vulnerabilities. The client renders email bodies inside **sandboxed `<iframe>` elements** with strict `srcdoc` restrictions and Content Security Policies (`script-src 'none'`).

---

### Pillar B: Data Layer & State Management Model

To support multi-folder views, dynamic filtering, and search, store all entities in a **normalized relational format**:

```typescript
// Normalized State Schema
interface EmailClientState {
  threads: Record<string, ThreadEntity>;
  messages: Record<string, MessageEntity>;
  folders: Record<string, FolderEntity>;
  drafts: Record<string, DraftEntity>;
  ui: {
    activeFolderId: string;
    selectedThreadIds: Set<string>;
    viewMode: 'SPLIT' | 'FULL';
  };
}

interface ThreadEntity {
  id: string;
  snippet: string;
  senderList: Array<{ name: string; email: string }>;
  messageIds: string[];
  unread: boolean;
  labelIds: string[];
  updatedAt: number;
}

```

---

### Pillar C: Real-Time Updates & Offline Synchronization

```
                                    DELTA SYNC FLOW

   [ Browser Client ]                                              [ Sync Server ]
            |                                                             |
            |------------ 1. GET /sync/delta?lastSequenceId=1024 -------->|
            |                                                             |
            |<----------- 2. Return Delta Payload (1025, 1026) -----------|
            |                                                             |
   [ Writes to IndexedDB ]                                                |
            |                                                             |
            |------------ 3. Listen to SSE Gateway ---------------------->|
            |                                                             |
            |<----------- 4. Push Real-time Event: { seq: 1027 } ---------|
            |                                                             |
   [ Applies Delta to Store ]                                             |

```

1. **Delta Sync Protocol:** Instead of downloading entire inbox arrays repeatedly, the client passes a `lastSequenceId` (or sync token). The server returns *only* mutated/deleted objects since that checkpoint.
2. **Push Notifications (Server-Sent Events / WebSockets):** The client maintains a single persistent **Server-Sent Events (SSE)** channel. When a new email arrives or a status changes elsewhere, the server pushes a lightweight notification containing the new `sequenceId`.
3. **Offline Engine (Web Worker + IndexedDB):** A dedicated background Web Worker intercepts sync requests and persists state inside **IndexedDB**. When the network disconnects:

* Users can read cached emails and perform actions (archive, mark read, compose).
* Actions are saved to an **Offline Mutation Queue** in IndexedDB and replayed in order once online connectivity returns.

---

### Pillar D: Optimistic UI & Local Mutations

When a user archives or deletes an email, waiting for a network HTTP round-trip causes noticeable lag.

1. **Optimistic Update:** The client immediately updates its local in-memory store and UI view ($0\text{ ms}$ latency).
2. **Queueing:** The mutation (`ARCHIVE_THREAD`, `id: "t_1001"`) is appended to an execution queue.
3. **Rollback Handling:** If the network request fails after retries, the mutation engine rolls back the specific state change and triggers a discrete user-facing notification ("Action failed — Retry").

---

## 3. High-Level Component Mapping

| Module / Layer               | Primary Responsibility                                    | Technical Mechanism                                                                    |
| ---------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Compose Engine**           | Rich text formatting, auto-saving drafts                  | Uncontrolled draft state + Debounced auto-save ($2\text{ sec}$) to IndexedDB & Server. |
| **Full-Text Search Engine**  | Instant client-side searching across cached emails        | IndexedDB compound indexes + Web Worker `FlexSearch` / WASM search engine.             |
| **Attachment Manager**       | Uploading/downloading large files                         | Chunked resumable uploads via `Blob` API directly to Cloud Object Storage (S3 / GCS).  |
| **Keyboard Shortcut Engine** | Power-user navigation (e.g., `j/k` navigate, `e` archive) | Global event dispatcher with focus-aware hotkey mapping.                               |

---

## 4. Key Performance & Security Bottlenecks

1. **XSS Prevention in HTML Emails:** Sanitize raw email bodies with `DOMPurify` before rendering inside sandboxed `<iframe>`s. Block tracking pixels by default until explicit user action.
2. **Memory Leaks from Long Sessions:** Single-page applications left open for days accumulate memory leaks. The system periodically purges off-screen message body DOM elements while retaining light thread metadata in IndexedDB.
3. **Rate Limiting & Queue Throttling:** Rapid user actions (e.g., selecting 100 emails and marking them as read) are batched into a single bulk-update network request rather than 100 individual API calls.
