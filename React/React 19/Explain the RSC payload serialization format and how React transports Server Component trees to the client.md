The **React Server Component (RSC) Payload** (sometimes referred to as the Flight format) is a compact, line-delimited JSON-based streaming protocol used by React to transmit Server Component trees from the server to the browser over an open HTTP response stream.

Rather than sending compiled HTML string snippets or standard JSON, React serializes the virtual DOM tree, server props, client component references, and suspended async boundaries into a structured stream.

---

## 1. Why Not Just Send Raw HTML or Pure JSON?

* **Why not plain HTML?** If React only sent raw HTML strings, client-side interactivity would break. React needs to preserve client component state (e.g., text inputs, open accordions, scroll position) when re-rendering subtrees.
* **Why not standard JSON?** Standard JSON objects cannot represent Promises, Symbol references, Suspense fallback placeholders, or lazy-loaded module imports natively.
* **The RSC Solution:** A streamable protocol that represents component trees as a graph of serialized nodes, allowing client components to keep their internal state while Server Components stream in around them.

---

## 2. Anatomy of the RSC Payload Format

The RSC payload is sent as a series of line-delimited rows. Each row begins with an identifier key, a colon (`:`), and a JSON payload or serialized string token.

```text
[ID]:[TYPE][DATA]

```

### Common Row Types

| Row Prefix | Meaning                      | Description                                                                                          |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| **`M:`**   | **Module Reference**         | Declares a Client Component import (`'use client'`). Specifies the bundle URL/chunk and export name. |
| **`J:`**   | **JSON Virtual DOM Tree**    | Defines a serialized JSX element node (type, props, children).                                       |
| **`S:`**   | **Symbol / Suspense**        | Indicates a Suspense boundary or special React internal symbol.                                      |
| **`HL:`**  | **Resource Hint / Hoisting** | Tells the client to preload CSS, fonts, or JS assets.                                                |
| **`P:`**   | **Promise / Async Slot**     | Represents unresolved async server data wrapped in `<Suspense>`.                                     |

---

## 3. Detailed Serialization Example

Consider this simple React Server Component tree:

```tsx
// ServerComponent.tsx
import { UserProfile } from './UserProfile'; // Client Component ('use client')

export default async function Feed() {
  return (
    <main>
      <h1>Activity Feed</h1>
      <UserProfile name="Alex" />
    </main>
  );
}

```

### The Generated RSC Payload Stream

Over the wire, React streams the following lines:

```text
M1:{"id":"./src/UserProfile.tsx","chunks":["client-userprofile.js"],"name":"UserProfile"}
J0:["$","main",null,{"children":[["$","h1",null,{"children":"Activity Feed"}],["$","$L1",null,{"name":"Alex"}]]}]

```

### Line Breakdown

1. **`M1:...` (Module Row):**

* Tells the browser: *"Client Component #1 lives in JavaScript bundle `client-userprofile.js` and exports `UserProfile`."*

1. **`J0:...` (JSON Tree Row):**

* Encodes the virtual DOM structure using React's internal element format:
* `"$"` represents a React element (`React.createElement` / `jsx`).
* `"main"` is the HTML tag.
* `"$L1"` refers to the **Module Reference #1** (`UserProfile`), passing `{"name":"Alex"}` as props.

---

## 4. How Suspense & Streaming Are Serialized

When a Server Component performs an async operation wrapped in `<Suspense>`, React does not wait for the Promise to resolve. It streams a **Promise slot** and updates it later down the same connection.

### Step 1: Initial Stream (Immediate)

```text
M1:{"id":"./ClientComments.js","chunks":["comments.js"],"name":"default"}
J0:["$","div",null,{"children":["$","$Sreact.suspense",null,{"fallback":["$","p",null,{"children":"Loading..."}],"children":"$P2"}]}]

```

* **`$Sreact.suspense`**: Declares a Suspense boundary.
* **`$P2`**: Acts as a **Promise Placeholder** for asynchronous task `#2`.

### Step 2: Deferred Stream (When Async Data Resolves)

Once the database query or API fetch finishes on the server, React pushes a new row down the open HTTP stream:

```text
2:["$","$L1",null,{"items":["Great post!","Thanks for sharing."]}]

```

* React's client runtime intercepts row `2:` and replaces the placeholder `$P2` inside Suspense slot `#0` with the rendered `<ClientComments>` component—without triggering a full page reload or breaking UI state.

---

## 5. End-to-End Transport Pipeline

```
┌────────────────────────────────────────────────────────────────────────┐
│ SERVER                                                                 │
│ 1. Executes Server Components (async/await, DB queries).               │
│ 2. Serializes Virtual DOM into RSC Payload lines (M:, J:, P:).         │
│ 3. Streams payload chunks over HTTP (Transfer-Encoding: chunked).      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Stream
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ CLIENT (BROWSER)                                                       │
│ 1. `createFromFetch()` / React DOM runtime reads the incoming stream.  │
│ 2. Resolves `M:` module references and dynamically imports JS chunks.  │
│ 3. Reconstructs Virtual DOM tree and performs reconciliation.          │
│ 4. Retains existing Client Component state (inputs, state, focus).     │
└────────────────────────────────────────────────────────────────────────┘

```

---

## Summary

The RSC payload format is the "glue" of React Server Components:

1. **It preserves interactivity:** Server-rendered elements stream as structured React virtual DOM trees rather than dead HTML strings, allowing Client Components to remain interactive.
2. **It eliminates client code:** Functions, secrets, and server-only dependencies inside Server Components never get serialized into the payload—only their rendered JSX results travel over the network.
3. **It enables progressive hydration:** Components enclosed in `<Suspense>` stream in parallel and hydrate independently as their payload chunks arrive.
