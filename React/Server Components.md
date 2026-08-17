**React Server Components (RSC)** represent a architectural paradigm in React that allows you to render components entirely on the server *before* any JavaScript is bundled or sent to the client.

Unlike traditional Server-Side Rendering (SSR)—which generates HTML on the server per request and then hydrates the exact same components on the client—Server Components **never run on the client at all**. Their code stays entirely on the server, leaving zero bundle footprint.

---

## 1. Core Architecture & Execution Environments

* **Server Environment:** Server Components execute in a separate environment (either at build time on your CI server or dynamically per request on a web server). They have direct access to backend resources like databases, file systems, and internal microservices without exposing credentials to the browser.
* **Client Environment:** The browser downloads only the lightweight, pre-rendered JSON/HTML output of the Server Components, along with the code for any interactive Client Components.

---

## 2. Key Usage Scenarios & Patterns

### Server Components without a Server (Build-Time Execution)

You don't necessarily need a running Node.js web server to use Server Components. They can execute once during build time on your CI server to generate static HTML or JSON files for static site generators (SSG).

### Server Components with a Server (Request-Time Execution)

When running on a web server (like Next.js, Remix, or Vite-powered SSR servers), Server Components render on each incoming request, allowing you to fetch fresh data directly from your database right inside the component body.

### Async Components with Server Components

Because Server Components run exclusively on the server and never hydrate in the browser, **they can be asynchronous functions (`async/await`)**. This lets you fetch data using standard `await` syntax directly at the component level without needing `useEffect` or `useState`.

```jsx
// This is a Server Component! It runs only on the server.
import db from '@/lib/db';

async function UserProfile({ userId }) {
  // Directly query your database or backend API
  const user = await db.users.findUnique({ where: { id: userId } });

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}

```

### Adding Interactivity to Server Components (The Client Boundary)

Server Components are completely static and **cannot use state (`useState`), effects (`useEffect`), or browser APIs (`window`, `localStorage`)**, nor can they attach event listeners (`onClick`).

To add interactivity, you must create a **Client Component** by adding the `'use client'` directive at the top of the file, and then import it into your Server Component.

```jsx
// File: LikeButton.jsx
'use client'; // Marks this file and its children as Client Components

import { useState } from 'react';

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(likes + 1)}>Likes: {likes}</button>;
}

```

```jsx
// File: ArticlePage.jsx (Server Component)
import LikeButton from './LikeButton';
import db from '@/lib/db';

export default async function ArticlePage({ id }) {
  const article = await db.articles.findUnique({ where: { id } });

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      {/* Mixing a Client Component inside a Server Component */}
      <LikeButton />
    </article>
  );
}

```
