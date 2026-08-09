When handling concurrent form submissions in an architecture powered by **React Server Components (RSC)** and **Server Actions**, processing is divided between server-side HTTP request handling and client-side stream reconciliation.

Here is a detailed breakdown of how the server and React client runtime process concurrent mutations.

---

## 1. Server-Side Processing: Independent Stateless Execution

On the server, every Server Action invocation is an independent, stateless HTTP POST request (an RPC call).

```
[ Client Browser ]
  │
  ├── 1. Dispatches Server Action A ──► [ Server Process Worker #1 ] ──► (Database Mutation A)
  │                                                                            │
  └── 2. Dispatches Server Action B ──► [ Server Process Worker #2 ] ──► (Database Mutation B)

```

1. **Independent Workers / Isolate Contexts:** When two form submissions occur concurrently, the server runtime (e.g., Node.js, Cloudflare Workers, or Next.js server processes) handles them as separate concurrent event-loop tasks or isolated worker threads.
2. **Server Memory Isolation:** Server Actions do not share local JavaScript variables across concurrent requests. Each action reads its own `FormData` payload, executes its own validation, and communicates with external services (databases or microservices) independently.
3. **Database Concurrency Control:** Because Server Actions run independently, concurrent mutations rely on database-level concurrency controls (e.g., ACID transactions, optimistic locking, or atomic updates) to ensure data consistency.

---

## 2. Server Response Payload: RSC Tree Revalidation

When a Server Action completes, it often calls framework cache invalidation functions like `revalidatePath()` or `revalidateTag()`.

Instead of returning raw JSON, the server renders the updated Server Component subtree into an **RSC Payload stream** (Flight format) and sends it back to the client.

```
[ Action A Finishes ] ──► Server re-renders affected RSC subtree ──► Streams Payload A to Client
[ Action B Finishes ] ──► Server re-renders affected RSC subtree ──► Streams Payload B to Client

```

---

## 3. Client-Side Processing: Stream Reconciliation & Optimistic Queuing

The true complexity of concurrent form submissions is handled on the client when the responses arrive out of order or while optimistic UI updates are active.

### A. The Optimistic State Queue

If a user submits Form A and Form B concurrently:

1. React's `useOptimistic` hook maintains an internal **update queue**: `[Optimistic Update A, Optimistic Update B]`.
2. The UI immediately displays the combined optimistic result of both submissions.
3. When Server Action A resolves, React updates the underlying base server state. React then **re-applies remaining in-flight optimistic updates (Update B)** on top of the new base state.
4. When Server Action B resolves, all optimistic overrides are cleared, leaving the final confirmed server state.

### B. Out-of-Order Responses & Race Conditions

If Action B resolves *before* Action A:

```
Time ───►
Client dispatches Action A ───────────────────────────────► Action A Resolves (Slow)
Client dispatches Action B ─────────────► Action B Resolves (Fast)

```

* **Transition Sequencing:** React tracks asynchronous transitions using internal transition IDs.
* **Payload Reconciliation:** When Action B resolves first, React updates the DOM with the RSC payload from Action B. When Action A subsequently resolves, React reconciles the new RSC payload from Action A.
* **Revalidation Consistency:** In framework implementations (like Next.js), Server Component revalidations triggered by Server Actions use versioned snapshot IDs. If a stale revalidation payload arrives after a newer one, React discards the older payload, preventing stale data from overwriting newer state.

---

## 4. Server-Side Synchronization Patterns

If two concurrent Server Actions target the exact same database record (e.g., two users editing the same document simultaneously), you should handle concurrency on the server using one of these patterns:

### Pattern A: Atomic Operations (Recommended)

Avoid reading data, mutating it in JS, and writing it back. Instead, perform atomic database updates:

```typescript
// app/actions.ts
'use server';

import { db } from '@/lib/db';

export async function incrementLikes(postId: string) {
  // ✅ Atomic database operation handles concurrency safely
  await db.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  });
}

```

### Pattern B: Optimistic Concurrency Control (Version Checks)

Include a version timestamp or ID in the form data to ensure stale updates are rejected on the server:

```typescript
'use server';

export async function updatePost(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const version = Number(formData.get('version'));

  // Reject submission if record was updated by a concurrent request
  const updated = await db.post.updateMany({
    where: { id, version }, // Must match current version
    data: { title, version: version + 1 },
  });

  if (updated.count === 0) {
    return { error: 'Conflict: This post was modified by another request. Please refresh.' };
  }
}

```

---

## Summary

| Phase                | How Concurrent Submissions Are Handled                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Server Execution** | Executed as independent, non-blocking HTTP POST requests / stateless worker tasks.                          |
| **Data Safety**      | Delegated to database transactions, atomic operations, or version locks.                                    |
| **Client UI**        | `useOptimistic` queues in-flight transitions and re-applies pending updates sequentially.                   |
| **RSC Revalidation** | React reconciles incoming RSC payload streams, discarding outdated snapshots to prevent UI race conditions. |
