Designing an **Offline-First Chat Application** requires treating local client storage as the **primary source of truth** for the UI, while the network and backend server act as a synchronization target.

This architecture ensures users can read, search, draft, and send messages instantly—even while offline, in airplane mode, or during flaky network transitions.

---

## 1. High-Level Architecture: Single-Directional Sync Loop

Instead of rendering messages directly from API responses, the UI reads exclusively from an **In-Memory Store** backed by **IndexedDB**.

All outgoing user actions are written to an **Offline Mutation Queue** before being dispatched over the wire.

```text
                        ┌────────────────────────────────────────┐
                        │              REACT VIEW                │
                        │   (Renders directly from Local DB)     │
                        └───────────────────▲────────────────────┘
                                            │ Reactive Query (Dexie.js)
                                            │
                        ┌───────────────────┴────────────────────┐
                        │        INDEXEDDB LOCAL STORAGE         │
                        │    (Primary Source of Truth / DB)      │
                        └───────▲────────────────────────▲───────┘
                                │                        │
         1. Enqueue Mutation    │                        │ 3. Hydrate & Sync
    (Status: 'pending_sync')    │                        │    Incoming Messages
                                │                        │
┌───────────────────────────────┴──┐          ┌──────────┴────────────────────────┐
│     OFFLINE MUTATION QUEUE       │          │          SYNC ENGINE              │
│   (Persistent Outbox Queue)      ├─────────►│  (WebSocket / HTTP Sync Manager)  │
└──────────────────────────────────┘ 2. Flush └───────────────────┬───────────────┘
                                   Queue over                     │
                                     Network                      ▼
                                                      ┌───────────────────────┐
                                                      │     BACKEND SERVER    │
                                                      └───────────────────────┘

```

---

## 2. IndexedDB Data Schema (Dexie.js Implementation)

Standard IndexedDB APIs are verbose and event-driven. Using a lightweight wrapper like **Dexie.js** provides Promise-based transactions and reactive live queries (`useLiveQuery`).

### IndexedDB Schema Definition (`db.ts`)

```typescript
import Dexie, { Table } from 'dexie';

export interface LocalMessage {
  id: string;             // Client-generated UUID or server ID
  tempId?: string;         // Temporary client ID used before server ACK
  channelId: string;
  senderId: string;
  content: string;
  timestamp: number;
  syncStatus: 'synced' | 'pending_sync' | 'error';
  errorReason?: string;
}

export interface OutboxMutation {
  id?: number;            // Auto-incremented primary key
  tempMessageId: string;   // Maps to local LocalMessage.id
  type: 'SEND_MESSAGE' | 'DELETE_MESSAGE' | 'READ_RECEIPT';
  payload: any;
  createdAt: number;
  retryCount: number;
}

export class ChatOfflineDatabase extends Dexie {
  messages!: Table<LocalMessage>;
  outbox!: Table<OutboxMutation>;

  constructor() {
    super('ChatOfflineDB');
    
    // Define indexes for fast lookup and pagination
    this.version(1).stores({
      messages: 'id, channelId, [channelId+timestamp], syncStatus',
      outbox: '++id, tempMessageId, createdAt'
    });
  }
}

export const db = new ChatOfflineDatabase();

```

---

## 3. Local Message Queueing & Outbox Pattern

When an offline user hits "Send", the application **never** blocks waiting for `fetch()` or a WebSocket frame. It performs a single local atomic database transaction.

### Step-by-Step Outbox Insertion Process

```typescript
import { v4 as uuidv4 } from 'uuid';

export async function sendOfflineMessage(channelId: string, senderId: string, content: string) {
  const tempMessageId = `temp_${uuidv4()}`;
  const now = Date.now();

  const newMessage: LocalMessage = {
    id: tempMessageId,
    tempId: tempMessageId,
    channelId,
    senderId,
    content,
    timestamp: now,
    syncStatus: 'pending_sync'
  };

  const mutation: OutboxMutation = {
    tempMessageId,
    type: 'SEND_MESSAGE',
    payload: { channelId, content, tempMessageId },
    createdAt: now,
    retryCount: 0
  };

  // Perform an atomic transaction: write message & queue mutation simultaneously
  await db.transaction('rw', [db.messages, db.outbox], async () => {
    await db.messages.add(newMessage);
    await db.outbox.add(mutation);
  });
  
  // Trigger queue flush if online
  SyncEngine.flushOutbox();
}

```

---

## 4. The Sync Engine: Queue Flushing & Reconnection Logic

The **Sync Engine** monitors browser network connectivity using `navigator.onLine`, `online`/`offline` window events, and WebSocket heartbeat pings.

### Flushing the Outbox Queue

```typescript
export class SyncEngine {
  private static isFlushing = false;

  public static async flushOutbox() {
    if (!navigator.onLine || this.isFlushing) return;
    this.isFlushing = true;

    try {
      // Get all pending mutations sorted by creation time (FIFO)
      const pendingMutations = await db.outbox.orderBy('id').toArray();

      for (const mutation of pendingMutations) {
        try {
          // Send mutation over network
          const response = await fetch('/api/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mutation.payload)
          });

          if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

          const result = await response.json(); // Contains real server ID & timestamp

          // Atomic reconciliation: Swap temp ID with real server ID and remove mutation
          await db.transaction('rw', [db.messages, db.outbox], async () => {
            // Remove original temporary message
            await db.messages.delete(mutation.tempMessageId);

            // Add verified server message
            await db.messages.put({
              id: result.id,
              channelId: result.channelId,
              senderId: result.senderId,
              content: result.content,
              timestamp: result.timestamp,
              syncStatus: 'synced'
            });

            // Delete mutation from outbox
            if (mutation.id) await db.outbox.delete(mutation.id);
          });

        } catch (err) {
          console.error(`Failed to sync mutation ${mutation.id}`, err);

          // Update retry count or mark as error if threshold exceeded
          if (mutation.retryCount >= 3) {
            await db.messages.update(mutation.tempMessageId, { syncStatus: 'error' });
            if (mutation.id) await db.outbox.delete(mutation.id);
          } else {
            await db.outbox.update(mutation.id!, { retryCount: mutation.retryCount + 1 });
          }
          break; // Stop flushing remaining queue until network stabilizes
        }
      }
    } finally {
      this.isFlushing = false;
    }
  }
}

// Global network listener
window.addEventListener('online', () => SyncEngine.flushOutbox());

```

---

## 5. Inbound Catch-Up Sync (Gap Recovery)

When reconnecting after being offline for hours or days, the client may have missed dozens of incoming messages. Instead of refetching the entire database, use **Cursor-Based Delta Invalidation**.

```text
 Client Request upon Reconnect:
 GET /api/v1/sync?lastKnownTimestamp=1772930000000
                                 │
                                 ▼
 Server responds with Delta (Only missing messages/edits)
                                 │
                                 ▼
 Client performs bulk Put into IndexedDB (bulkPut)

```

```typescript
export async function catchUpDeltaSync(channelId: string) {
  // Find the latest synced message timestamp stored locally
  const latestMessage = await db.messages
    .where('channelId')
    .equals(channelId)
    .and(msg => msg.syncStatus === 'synced')
    .reverse()
    .sortBy('timestamp');

  const lastTimestamp = latestMessage[0]?.timestamp || 0;

  // Request missing records from server
  const response = await fetch(`/api/v1/sync?channelId=${channelId}&since=${lastTimestamp}`);
  const deltaMessages: LocalMessage[] = await response.json();

  // Bulk upsert into local database
  const preparedMessages = deltaMessages.map(msg => ({ ...msg, syncStatus: 'synced' as const }));
  await db.messages.bulkPut(preparedMessages);
}

```

---

## 6. Rendering Reactive Local Data in React

Using Dexie's **`useLiveQuery`**, React component state automatically re-renders whenever IndexedDB updates (whether from local outbox sends or background sync updates), completely decoupling state management from network code.

```jsx
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';

export function MessageList({ channelId }) {
  // Automatically updates when IndexedDB messages table changes!
  const messages = useLiveQuery(
    () => db.messages
      .where('channelId')
      .equals(channelId)
      .sortBy('timestamp'),
    [channelId]
  );

  if (!messages) return <div>Loading cached messages...</div>;

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message-bubble ${msg.syncStatus}`}>
          <p>{msg.content}</p>
          <span className="status-indicator">
            {msg.syncStatus === 'pending_sync' && ' 🕒'}
            {msg.syncStatus === 'synced' && ' ✓✓'}
            {msg.syncStatus === 'error' && ' ⚠️ Failed to send'}
          </span>
        </div>
      ))}
    </div>
  );
}

```

---

## Summary Key Takeaways

1. **Local DB First:** Writes occur locally to IndexedDB before touching the network.
2. **Outbox Pattern:** Enqueue pending actions to an `outbox` table in a single atomic transaction.
3. **Sequential Outbox Flush:** Process outbox mutations sequentially (FIFO). On success, swap client temporary IDs (`temp_msg_001`) with real server database IDs.
4. **Delta Delta Catch-Up:** Reconnect using `since={lastKnownTimestamp}` queries to pull down missing history efficiently.
5. **Reactive View Layer:** Use `useLiveQuery` or IndexedDB listeners so the React UI updates automatically on any DB change.
