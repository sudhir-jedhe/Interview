The **React Server Components (RSC) Payload** is the custom, streamable wire format React uses to transfer server-rendered component trees, props, and metadata over HTTP to the browser.

Rather than sending traditional HTML or standard JSON, React uses a line-delimited format (similar to NDJSON) designed for **incremental streaming**, **parallel execution**, and **reference deduplication**.

---

# 1. Anatomy of the RSC Payload Stream

The RSC Payload is transmitted as a stream of chunk lines using `Content-Type: text/x-component` (or streamed inside HTML tags during initial SSR via `<script>` injection).

Each line in the stream follows a strict spec:

$$\text{<ID>}:\text{<TYPE>}\text{<JSON-like payload>}$$

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ STREAMING RESPONSE HEADER                                              │
 │ Content-Type: text/x-component                                         │
 └────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ LINE 1 (Root VDOM Structure)                                           │
 │ 0:["$","div",null,{"className":"container","children":["$","$L1",null]}]│
 └────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ LINE 2 (Client Component Reference)                                    │
 │ 1:I["./src/ClientCard.js",["client-chunk-123.js"],"ClientCard"]        │
 └────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ LINE 3 (Deferred / Suspense Data Resolution)                           │
 │ 2:{"user":"Sudhir","posts":["$","$L3",null]}                           │
 └────────────────────────────────────────────────────────────────────────┘

```

---

# 2. Key Line Types (Prefix Flags)

The first character or sequence before the colon specifies what kind of data the line contains:

| Line Tag   | Purpose                                                                        | Example / Structure                               |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------------- |
| **`ID:`**  | **Element / Model Node:** Standard Virtual DOM node or JSON value bound to ID. | `0:["$","main",null,{"children":"Hello"}]`        |
| **`ID:I`** | **Client Module Import:** Reference to a Client Component bundle path.         | `1:I["/static/js/button.js",["chunk1"],"Button"]` |
| **`ID:E`** | **Error Chunk:** Serialized error thrown during server rendering.              | `2:E{"message":"Database Connection Failed"}`     |
| **`ID:S`** | **Symbol Registration:** React Symbol (e.g., `Symbol.for("react.element")`).   | `3:S"react.element"`                              |
| **`ID:P`** | **Promise Resolution:** Deferred async promise payload (Suspense boundary).    | `4:P[{"data": "resolved"}]`                       |

---

# 3. Special Characters & Escape Sequences

Because React elements and specialized JavaScript types cannot be represented in standard JSON, React introduces prefix codes inside strings:

### A. The Virtual DOM Element Prefix: `"$"`

Standard JSON cannot express React elements. In the RSC wire format, a React element is encoded as a 4-element array starting with `"$"`:

$$\text{[\$ , \text{type} , \text{key} , \text{props}]}$$

```json
// Encodes: <div id="app">Hello World</div>
0:["$","div",null,{"id":"app","children":"Hello World"}]

```

### B. Client Component Reference: `"$L"` (Lazy Reference)

When a Server Component renders a Client Component, the server does **not** execute the Client Component code. Instead, it emits an `I` (Import) row with the module URL and places a `"$L"` reference in the VDOM tree pointing to that import ID.

```text
Row 1 (Import):  1:I["/chunks/avatar.js", ["avatar-chunk"],"Avatar"]
Row 0 (VDOM):    0:["$","div",null,{"children":["$","$L1",null,{"src":"/user.png"}]}]

```

*When the client parser encounters `"$L1"`, it instructs the browser's module loader to fetch `/chunks/avatar.js` and hydrate the `Avatar` component with props `{src: "/user.png"}`.*

### C. Deferred Data / Suspense Promises: `"$@"` or `"$F"`

When a Server Component uses `async/await` inside a `<Suspense>` boundary:

1. React streams the fallback UI immediately.
2. It sends a placeholder reference token like `"$@2"` for the pending data.
3. Once the database or API fetch resolves on the server, React streams a new line with ID `2` containing the resolved sub-tree. The client reconciler swaps the fallback with the incoming payload without triggering a full page re-render.

### D. Typed Data Encoding Prefixes

To pass non-JSON primitives across the wire without data loss:

* **`"$D"`:** `Date` objects (e.g., `"$D2026-08-05T02:37:55.000Z"`).
* **`"$K"`:** `Map` and `Set` collections.
* **`"$u"`:** `undefined` values (which standard JSON normally strips).
* **`"$n"`:** `BigInt` primitives (e.g., `"$n9007199254740991"`).
* **`"$S"`:** `Symbol.for(...)` registry references.

---

# 4. End-to-End Serialization Example

Consider this Server/Client component setup:

```tsx
// ServerComponent.tsx
import ClientCard from './ClientCard';

export default async function Feed() {
  const user = { name: "Sudhir", role: "Developer" };
  return (
    <main>
      <h1>Dashboard</h1>
      <ClientCard user={user} />
    </main>
  );
}

```

### The Streamed RSC Wire Payload Output

```text
1:I["/build/ClientCard.js",["client-chunk-88"],"ClientCard"]
0:["$","main",null,{"children":[["$","h1",null,{"children":"Dashboard"}],["$","$L1",null,{"user":{"name":"Sudhir","role":"Developer"}}]]}]

```

### How the Client Parses This

1. **Reads Line 1 (`1:I`):** Preloads the JavaScript bundle `/build/ClientCard.js` via `<link rel="modulepreload">`.
2. **Reads Line 0 (`0:`):** Reconstructs the top-level VDOM (`<main>`, `<h1>Dashboard</h1>`).
3. **Resolves `"$L1"`:** Replaces `"$L1"` with the hydrated `ClientCard` component, passing `{user: {name: "Sudhir", role: "Developer"}}` as props.

---

# 5. Architectural Advantages of the RSC Wire Format

1. **Incremental Out-of-Order Streaming:** Fast UI chunks render instantly; slow database queries stream in later over the same HTTP connection and auto-fill Suspense placeholders.
2. **Deduplication:** Shared client modules, repeated components, or duplicate props are assigned a single ID (`$L1`) and reused across the stream, reducing payload size.
3. **Zero Client JS for Server Nodes:** Server Components render strictly down to `"$"` array descriptors. The actual JavaScript logic for Server Components remains on the server and is never sent to the browser bundle.
