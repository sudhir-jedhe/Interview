Server Components and Client Components represent a split in where and how React executes your code. Historically, React rendered your entire application in the user's browser. Now, you can divide the labor between the backend server and the frontend browser to get the best of both worlds.

Here is the breakdown of how they differ and when to use each.

## 1. Server Components (The Default)

Server Components render exclusively on your web server. When the server finishes rendering, it sends only the finished HTML and serialized data to the browser — **zero JavaScript is added to the client bundle.**

Because they run on the server, they have superpowers that traditional React components do not, but they also have strict limitations.

**What they can do:**

- **Direct Backend Access:** You can query a database, read from the file system, or securely access API keys directly inside the component without building a separate API endpoint.
- **Zero Bundle Size:** Heavy dependencies (like a massive date-formatting library or markdown parser) stay on the server and are never downloaded by the user's browser.

**What they CANNOT do:**

- **No Interactivity:** They cannot use `onClick`, `onChange`, or any DOM event listeners.
- **No State or Lifecycle:** You cannot use `useState`, `useReducer`, or `useEffect`.
- **No Browser APIs:** They do not know what `window`, `document`, or `localStorage` are because they never run in a browser.

## 2. Client Components (Traditional React)

Client Components are what you are already used to. They are rendered on the client (the browser) and can handle interactivity.

To create a Client Component in modern React (like in the Next.js App Router), you must explicitly declare it by putting the `"use client"` directive at the very top of the file.

**What they can do:**

- **Interactivity:** They handle all user input (clicks, typing, scrolling).
- **State and Effects:** They can use `useState`, `useEffect`, and custom hooks.
- **Browser APIs:** They have full access to the `window` object, geolocation, local storage, etc.

**What they CANNOT do:**

- **No Direct Backend Access:** They cannot safely hold secret API keys or directly query a database, as all their code is exposed to the user's browser.

---

## Quick Comparison

| Feature                       | Server Components      | Client Components    |
| ----------------------------- | ---------------------- | -------------------- |
| **Execution Environment**     | Server                 | Browser (Client)     |
| **Directive Needed?**         | No (Default)           | Yes (`"use client"`) |
| **State (`useState`)**        | ❌ No                   | ✅ Yes                |
| **Interactivity (`onClick`)** | ❌ No                   | ✅ Yes                |
| **Access Backend/DB**         | ✅ Yes                  | ❌ No (Needs API)     |
| **Access `window**`           | ❌ No                   | ✅ Yes                |
| **Affects Bundle Size?**      | ❌ No (Zero JS shipped) | ✅ Yes                |

## The Golden Rule of Composition

You do not build an app using _only_ Server Components or _only_ Client Components. You weave them together.

The standard architecture is to keep your application primarily Server Components (for fast loading and data fetching) and only sprinkle in Client Components at the "leaves" of your component tree where you actually need interactivity.

**The Composition Rule:** A Server Component can import and render a Client Component. However, **a Client Component cannot import a Server Component.** If a Client Component needs to render a Server Component, it must be passed in as a `children` prop.

You pass data from a Server Component to a Client Component the exact same way you pass data between any React components: **using props**.

However, because the Server Component runs on the backend and the Client Component runs in the browser, the props you pass must cross a physical network boundary.

## The Code Example

Here is a standard pattern where a Server Component fetches secure data and passes it to an interactive Client Component.

```jsx
// 1. page.js (Server Component)
import InteractiveChart from "./InteractiveChart";

export default async function Dashboard() {
  // Fetch data directly from a database (runs only on the server)
  const userStats = await db.query("SELECT * FROM stats WHERE user_id = 1");

  return (
    <div>
      <h1>Your Dashboard</h1>
      {/* Pass the data down via props */}
      <InteractiveChart data={userStats} />
    </div>
  );
}
```

```jsx
// 2. InteractiveChart.js (Client Component)
"use client"; // Marks this for the browser

import { useState } from "react";

export default function InteractiveChart({ data }) {
  const [filter, setFilter] = useState("all");

  // The client component can now use the data for state and interactivity
  return (
    <div>
      <button onClick={() => setFilter("monthly")}>Monthly</button>
      <DrawChart data={data} filter={filter} />
    </div>
  );
}
```

---

## The Core Limitation: Serialization

The network boundary means that any prop you pass from a Server Component to a Client Component must be **serializable**.

React has to take the data, convert it into a string-like format, send it over the internet to the browser, and reconstruct it. If React doesn't know how to serialize a data type, your app will throw an error.

### What you CAN pass

React's serialization is much smarter than standard `JSON.stringify()`. You can safely pass:

- **Primitives:** Strings, Numbers, Booleans, Null, Undefined.
- **Standard Objects & Arrays:** Plain JavaScript objects and arrays.
- **Complex Data Types:** `Date` objects, `Map`, `Set`, and `BigInt`.
- **Promises:** You can pass a pending Promise from the server to the client, and the client can unwrap it using the new `use()` hook.

### What you CANNOT pass

You cannot pass anything that relies on the execution environment or memory references.

- **Standard Functions:** You cannot pass callbacks like `onClick={() => doSomething()}` from the server to the client. Functions cannot be serialized across a network.
- **Class Instances:** You cannot pass instances of custom classes (e.g., `new User()`). They will be stripped of their methods and converted to plain objects.
- **Symbols:** JavaScript Symbols cannot be serialized.

---

## The One Exception: Server Actions

I mentioned you cannot pass standard functions across the boundary. However, React 19 introduced a massive exception: **Server Actions**.

If you mark an async function with the `"use server"` directive, React will serialize it into a hidden API endpoint. You _can_ pass this specific type of function to a Client Component as a prop.

```jsx
// ServerComponent.js
import { ClientForm } from "./ClientForm";

export default function Page() {
  // This is a Server Action
  async function updateUser(formData) {
    "use server";
    await db.update(formData);
  }

  // Passing a function to a Client Component! (Only works because of "use server")
  return <ClientForm action={updateUser} />;
}
```

When the Client Component calls that function, it isn't running JavaScript in the browser — it is silently making a POST request back to the server to execute the code.

To understand why the `children` prop is the secret to mixing these components, you first have to understand what happens if you try to do it the wrong way.

## The Wrong Way (Importing)

If you have a Client Component and you try to `import` a Server Component directly into it, **the Server Component stops being a Server Component.**

Because the Client Component needs to be bundled and sent to the browser, any file it imports gets bundled and sent to the browser right along with it. Your secure server code is now exposed to the client, and React will likely throw an error if you try to use server-only modules like `fs` or `mysql`.

```jsx
// ❌ THE WRONG WAY
"use client";
import ServerSideWidget from "./ServerSideWidget"; // React will complain or convert this!

export default function InteractiveLayout() {
  return (
    <div onClick={() => console.log("clicked")}>
      <ServerSideWidget />
    </div>
  );
}
```

## The Right Way (The "Children" Pattern)

To get around this, you use the `children` prop to create a "hole" in your Client Component.

Instead of the Client Component importing the Server Component, a **Parent Server Component** imports _both_ of them, and passes the Server Component into the Client Component's hole.

### Step 1: Create the Client Component wrapper

This component handles the interactivity but doesn't care what goes inside it. It just accepts `children`.

```jsx
// 1. ClientWrapper.js
"use client";

import { useState } from "react";

export default function ExpandableSection({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border p-4">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide Details" : "Show Details"}
      </button>

      {/* This is the "hole" where the Server Component will go */}
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

### Step 2: Compose them in a Server Component

Now, in a Server Component (like a Next.js Page), you bring them together. You render the Client Component and pass the Server Component inside it as a child.

```jsx
// 2. page.js (Server Component)
import ExpandableSection from "./ClientWrapper";
import SecureDatabaseList from "./SecureDatabaseList"; // This is a Server Component

export default function Page() {
  return (
    <main>
      <h1>My Dashboard</h1>

      {/* The Server Component orchestrates the layout */}
      <ExpandableSection>
        {/* SecureDatabaseList safely executes on the server! */}
        <SecureDatabaseList />
      </ExpandableSection>
    </main>
  );
}
```

## Why does this work?

It works because of **when** the code executes.

1. On the server, React looks at `page.js`. It sees `<SecureDatabaseList/>` and fully executes it, querying the database and generating the final HTML.
2. It then looks at `<ExpandableSection>`. It sees the `"use client"` directive, so it stops. It doesn't run the client code on the server.
3. Instead, React takes the finished HTML from the Server Component and passes it into the Client Component as a pre-rendered package (the `children` prop).

By the time the browser downloads the Client Component and runs the JavaScript to make the button clickable, it isn't running a Server Component. It is just rendering the static HTML that the server already finished processing.

If you try to import a traditional React component (like a carousel, slider, or chart library) directly into a Server Component, your app will likely crash with an error like `useState is not a function` or `window is not defined`.

This happens because the third-party package relies on browser-only features, but the author hasn't updated their library to include the `"use client"` directive at the top of their files. Because the directive is missing, React assumes it is safe to run on the server, which immediately fails.

You cannot edit the package inside your `node_modules` folder to add the directive. Instead, you must use the **Wrapper Pattern**.

## The Solution: The Wrapper Pattern

To fix this, you create your own Client Component that does nothing but import the third-party library, add the `"use client"` directive, and immediately export it back out.

This creates a "client boundary." When your Server Component imports your wrapper, React sees the directive, stops rendering on the server, and bundles the third-party library securely for the browser.

### Step 1: Create the Wrapper File

Create a new file in your project (e.g., `components/SliderWrapper.js`). Put `"use client"` at the very top, and pass all props straight through to the third-party component.

```jsx
// components/SliderWrapper.js
"use client";

// Import the problematic third-party component
import { AwesomeSlider } from "awesome-react-slider";

// Export it, passing along all props
export default function SliderWrapper(props) {
  return <AwesomeSlider {...props} />;
}
```

### Step 2: Use the Wrapper in your Server Component

Now, inside your Server Component, completely ignore the NPM package. Import your wrapper instead.

```jsx
// app/page.js (Server Component)
import SliderWrapper from "../components/SliderWrapper";

export default async function Page() {
  // Fetch data securely on the server
  const images = await fetchImageUrls();

  return (
    <main>
      <h1>My Photo Gallery</h1>

      {/* 
        This works perfectly! React knows to send this 
        part to the browser because of the wrapper. 
      */}
      <SliderWrapper images={images} />
    </main>
  );
}
```

## Why this is a best practice

Even when third-party libraries eventually update their code to include `"use client"`, using a wrapper is still considered a best practice for heavy libraries (like charting tools or rich text editors).

It centralizes the dependency. If you ever need to swap out `awesome-react-slider` for `better-react-slider`, you only have to update your wrapper file, rather than hunting down every Server Component where you imported it.

Even when you use the `"use client"` directive, you might still get a `window is not defined` or `document is not defined` error.

This happens because of a common misunderstanding about Client Components: **Client Components are still pre-rendered on the server.**

Frameworks like Next.js execute Client Components on the server first to generate the initial HTML, so the user doesn't stare at a blank white screen while the JavaScript loads. If the third-party library tries to measure the `window` or access `localStorage` the exact millisecond it is imported, the server crashes because those APIs don't exist in a Node.js backend.

To fix this, you must tell the framework to completely skip Server-Side Rendering (SSR) for that specific component and only load it once the browser takes over.

Here is how to do it depending on your setup.

## 1. The Next.js Way (Using `next/dynamic`)

If you are using Next.js (which is the most common environment for Server Components), it provides a built-in utility called `dynamic` specifically for this problem.

You take the wrapper component you created in the previous step and import it dynamically with the `{ ssr: false }` flag.

```jsx
// app/page.js
import dynamic from "next/dynamic";

// 1. Dynamically import the wrapper component
// 2. Explicitly disable SSR
const ClientSideChart = dynamic(() => import("../components/ChartWrapper"), {
  ssr: false,
  loading: () => <p>Loading chart...</p>, // Optional: Show this while loading
});

export default function Dashboard() {
  return (
    <main>
      <h1>Your Analytics</h1>

      {/* This will NOT run on the server. It waits for the browser. */}
      <ClientSideChart data={[10, 20, 30]} />
    </main>
  );
}
```

## 2. The Pure React Way (Custom Hook)

If you are using a different framework (like Remix or a custom SSR setup) that doesn't have `next/dynamic`, you have to manually prevent the component from returning its UI until the component has "mounted" in the browser.

Because `useEffect` **only runs on the client** and is ignored on the server, you can use it to track whether the code is currently running in the browser.

### Step 1: Create a `useIsMounted` hook

```jsx
// hooks/useIsMounted.js
import { useState, useEffect } from "react";

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // This only executes in the browser
    setIsMounted(true);
  }, []);

  return isMounted;
}
```

### Step 2: Return `null` during the server render

In your wrapper component, you check if the component has mounted. If it hasn't (meaning it's currently on the server), you return `null` or a loading skeleton.

```jsx
// components/MapWrapper.js
"use client";

import { useIsMounted } from "../hooks/useIsMounted";
import { HeavyMapLibrary } from "heavy-map-library"; // Assumes window exists

export default function MapWrapper(props) {
  const isMounted = useIsMounted();

  // If we are on the server, render nothing.
  // This prevents the HeavyMapLibrary from trying to access 'window'.
  if (!isMounted) {
    return <div className="map-placeholder">Loading map...</div>;
  }

  // Once mounted in the browser, it is safe to render the library.
  return <HeavyMapLibrary {...props} />;
}
```

By forcing the component to return a placeholder during the initial server pass, the problematic third-party code is never executed in the Node.js environment, completely bypassing the `window is not defined` error.

**React Server Components (RSC)** are a component architecture introduced natively in React 19 that allows components to render exclusively on the server before sending data or visual structures down to the client.

By splitting components into **Server Components** and **Client Components**, React applications can fetch data and render heavy dependencies on the server without sending unnecessary JavaScript to the browser.

---

## 1. Key Architectural Differences

| Feature                   | React Server Components (RSC)                                                              | Client Components (`'use client'`)                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| **Execution Location**    | Executed **only on the server** (at build time or per request).                            | Rendered on the server (SSR HTML) and **hydrated on the client**.                   |
| **Bundle Size Impact**    | **0 KB added to JS bundle**. Code & dependencies stay on server.                           | Adds JavaScript code and imported npm dependencies to the client bundle.            |
| **Data Fetching**         | Can directly access databases, file systems, or private microservices using `async/await`. | Fetches data via client-side APIs (`fetch`, SWR, TanStack Query) or Server Actions. |
| **Interactivity & State** | ❌ Cannot use `useState`, `useEffect`, or event listeners (`onClick`).                      | ✅ Can use all React Hooks (`useState`, `useEffect`, `useReducer`) and DOM events.   |
| **Security**              | Safe for private tokens, database keys, and sensitive business logic.                      | Code is exposed to the browser bundle; no private API secrets allowed.              |

---

## 2. Code Comparison

### Server Component (Default in RSC Architectures)

Server components are async functions that run entirely on the server. They can query databases directly without exposing API routes or secret keys to the browser:

```tsx
// ProductList.tsx (Server Component by default)
import { db } from '@/lib/db'; // Direct database connection

export async function ProductList() {
  // Query database directly on the server — zero client bundle overhead!
  const products = await db.products.findMany();

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

```

### Client Component (`'use client'`)

When interactive UI elements, browser APIs, or React state hooks are needed, add the `'use client'` directive at the top of the file:

```tsx
// AddToCartButton.tsx (Client Component)
'use client'; // Marks this file and its imports as client boundary

import { useState } from 'react';

export function AddToCartButton({ productId }: { productId: string }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    setIsAdded(true);
    // Trigger interaction/mutation
  };

  return (
    <button onClick={handleClick}>
      {isAdded ? 'Added to Cart!' : 'Add to Cart'}
    </button>
  );
}

```

---

## 3. Combining Server and Client Components

Server Components can import and render Client Components directly. However, a **Client Component cannot directly import a Server Component** into its file body (since Server Components cannot run in browser environments).

### Pattern: Passing Server Components as `children`

To nest a Server Component inside a Client Component (e.g., a modal or layout wrapper), pass it via the `children` prop:

```tsx
// ModalWrapper.tsx (Client Component)
'use client';

import { useState } from 'react';

export function ModalWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && <div className="modal-body">{children}</div>}
    </div>
  );
}

// Page.tsx (Server Component - Parent)
import { ModalWrapper } from './ModalWrapper';
import { ProductList } from './ProductList'; // Server Component

export default async function Page() {
  return (
    <ModalWrapper>
      {/* ProductList executes on the server and passes rendered JSX slots to the client modal */}
      <ProductList />
    </ModalWrapper>
  );
}

```

---

## 4. Summary: When to Use Which?

```
                      Do you need...
                            │
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
  Data Fetching,                             State, Effects,
Database/File Access,                      Event Listeners,
 Private API Keys                         Browser APIs (window)
       │                                         │
       ▼                                         ▼
Server Component                          Client Component
 (Default in RSC)                          ('use client')

```
