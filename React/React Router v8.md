When considering **React Router v8**, it is essential to understand the version unification story led by the Remix and React Router teams (Remix Software / Shopify).

---

## The Version Bridge: React Router v6 → Remix → v7 → v8

To clarify where React Router v8 sits in the ecosystem:

1. **React Router v6:** Introduced Data APIs (`loader`, `action`, `RouterProvider`) alongside traditional component-based routing (`<Routes>`, `<Route>`).
2. **React Router v7:** Formally unified **Remix** and **React Router** into a single framework. React Router v7 added full-stack framework capabilities (SSR, Server Actions, file-system routing, Vite plugin) while maintaining backward compatibility with SPA client-side applications.
3. **React Router v8:** Represents the next major evolution building on the unified v7 foundation, focusing on deeper React 19 integration (React Server Components, `useActionState`, Async Transitions), tighter compiler-based optimizations, and streamlining deprecated v6 APIs.

---

## Key Features & Architecture in Modern React Router (v7 / v8)

### 1. Data Loading & Mutations (`loader` & `action`)

Modern React Router separates UI rendering from data fetching and mutations, preventing waterfall loading states.

```tsx
import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router';

// 1. Loader runs BEFORE rendering the component
export async function loader({ params }) {
  const res = await fetch(`/api/users/${params.userId}`);
  if (!res.ok) throw new Response("User not found", { status: 404 });
  return res.json();
}

// 2. Component receives pre-fetched type-safe data
export default function UserProfile() {
  const user = useLoaderData();
  return <h1>Welcome, {user.name}</h1>;
}

// 3. Router configuration
const router = createBrowserRouter([
  {
    path: 'users/:userId',
    element: <UserProfile />,
    loader: loader,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

```

---

### 2. Type-Safe Routes with Vite Plugin

Using the modern Vite bundler integration, React Router supports optional file-system routing and automatic route module typing:

```typescript
// app/routes/user.tsx
import type { Route } from './+types/user';

// Types for loader and params are auto-generated
export async function loader({ params }: Route.LoaderArgs) {
  return { userId: params.userId };
}

export default function User({ loaderData }: Route.ComponentProps) {
  return <div>User ID: {loaderData.userId}</div>;
}

```

---

### 3. Server-Side Rendering (SSR) & Static Site Generation (SSG)

You can run React Router as a light SPA or as a full-stack framework with SSR support:

```typescript
// react-router.config.ts
import type { Config } from '@react-router/dev/config';

export default {
  // Configures SSR or static pre-rendering
  ssr: true,
  async prerender() {
    return ['/', '/about', '/contact'];
  },
} satisfies Config;

```

---

## Migration Strategy: Upgrading Legacy React Router Code

If you are upgrading an existing codebase from React Router v5 or v6:

### 1. Enable Future Flags in v6 / v7

Before upgrading major versions, enable the future flags in your existing setup to catch deprecations incrementally:

```tsx
// In React Router v6/v7
const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

```

### 2. Update Package Names

Modern React Router consolidated all routing and framework imports under the single `react-router` package:

```bash
npm uninstall react-router-dom
npm install react-router

```

```tsx
// ❌ Old
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ✅ Modern
import { BrowserRouter, Routes, Route } from 'react-router';

```

---
Show how to build a complete CRUD form using React Router loader, action, and Form components.
Here is a complete, working example demonstrating how to build a CRUD flow (Create, Read, Update, Delete) using React Router's `loader`, `action`, and `<Form>` components.

This pattern leverages **HTML form semantics** and **progressive enhancement**: React Router automatically intercepts form submissions, re-validates data, handles loading states, and updates the UI without requiring manual `useState` or `useEffect` for data fetching.

---

## 1. Mock API Data Store

First, create a mock data service (`src/api/posts.ts`) that simulates network latency:

```typescript
// src/api/posts.ts
export interface Post {
  id: string;
  title: string;
  content: string;
}

let posts: Post[] = [
  { id: '1', title: 'Getting Started with React Router', content: 'Loaders and actions simplify state management.' },
  { id: '2', title: 'Why Progressive Enhancement Matters', content: 'Forms work natively even before JS hydrates.' },
];

export async function getPosts(): Promise<Post[]> {
  await new Promise((res) => setTimeout(res, 200));
  return [...posts];
}

export async function getPost(id: string): Promise<Post | null> {
  await new Promise((res) => setTimeout(res, 200));
  return posts.find((p) => p.id === id) || null;
}

export async function createPost(title: string, content: string): Promise<Post> {
  await new Promise((res) => setTimeout(res, 300));
  const newPost = { id: Date.now().toString(), title, content };
  posts.push(newPost);
  return newPost;
}

export async function updatePost(id: string, title: string, content: string): Promise<Post> {
  await new Promise((res) => setTimeout(res, 300));
  const post = posts.find((p) => p.id === id);
  if (!post) throw new Error('Post not found');
  post.title = title;
  post.content = content;
  return post;
}

export async function deletePost(id: string): Promise<void> {
  await new Promise((res) => setTimeout(res, 300));
  posts = posts.filter((p) => p.id !== id);
}

```

---

## 2. Post List Component (Read & Delete)

This route uses a `loader` to fetch posts and an `action` to handle deleting posts via an imperative `<Form>` submission:

```tsx
// src/routes/PostList.tsx
import React from 'react';
import { useLoaderData, Form, Link, redirect, useNavigation } from 'react-router';
import { getPosts, deletePost, Post } from '../api/posts';

// Loader: Fetches list of posts
export async function loader() {
  const posts = await getPosts();
  return { posts };
}

// Action: Handles DELETE mutations triggered from this route
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const postId = formData.get('postId') as string;

  if (intent === 'delete' && postId) {
    await deletePost(postId);
    return redirect('/posts');
  }

  return null;
}

export function PostList() {
  const { posts } = useLoaderData() as { posts: Post[] };
  const navigation = useNavigation();

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Blog Posts</h2>
        <Link to="/posts/new" style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
          + Create Post
        </Link>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <Link to={`/posts/${post.id}/edit`} style={{ color: '#4f46e5' }}>
                Edit
              </Link>

              {/* Form submits POST with intent="delete" to trigger the action */}
              <Form method="post" onSubmit={(e) => { if (!confirm('Delete this post?')) e.preventDefault(); }}>
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="postId" value={post.id} />
                <button
                  type="submit"
                  disabled={navigation.state === 'submitting'}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                >
                  Delete
                </button>
              </Form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

## 3. Post Form Component (Create & Update)

A unified form route component handles both **creation** (`/posts/new`) and **editing** (`/posts/:id/edit`):

```tsx
// src/routes/PostForm.tsx
import React from 'react';
import { useLoaderData, Form, redirect, useNavigation, useActionData, ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { getPost, createPost, updatePost, Post } from '../api/posts';

interface ActionError {
  errors?: {
    title?: string;
    content?: string;
  };
}

// Loader: Fetches post data if editing; returns null if creating
export async function loader({ params }: LoaderFunctionArgs) {
  if (params.id) {
    const post = await getPost(params.id);
    if (!post) throw new Response('Post Not Found', { status: 404 });
    return { post };
  }
  return { post: null };
}

// Action: Processes form submission for both CREATE and UPDATE
export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  // Simple server-side validation
  const errors: { title?: string; content?: string } = {};
  if (!title || title.trim().length < 3) errors.title = 'Title must be at least 3 characters.';
  if (!content || content.trim().length < 10) errors.content = 'Content must be at least 10 characters.';

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  if (params.id) {
    // Edit Mode
    await updatePost(params.id, title, content);
  } else {
    // Create Mode
    await createPost(title, content);
  }

  // Automatically redirects back to list view and triggers re-validation
  return redirect('/posts');
}

export function PostForm() {
  const data = useLoaderData() as { post: Post | null };
  const actionData = useActionData() as ActionError | undefined;
  const navigation = useNavigation();

  const isEditing = Boolean(data.post);
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>

      {/* React Router <Form> intercepts submit, sends formData to action */}
      <Form method="post" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Title</label>
          <input
            type="text"
            name="title"
            defaultValue={data.post?.title || ''}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {actionData?.errors?.title && (
            <p style={{ color: '#ef4444', margin: '4px 0 0', fontSize: '14px' }}>{actionData.errors.title}</p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Content</label>
          <textarea
            name="content"
            rows={5}
            defaultValue={data.post?.content || ''}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {actionData?.errors?.content && (
            <p style={{ color: '#ef4444', margin: '4px 0 0', fontSize: '14px' }}>{actionData.errors.content}</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </Form>
    </div>
  );
}

```

---

## 4. Router Setup

Wire up the routes inside your application router config:

```tsx
// src/router.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { PostList, loader as postListLoader, action as postListAction } from './routes/PostList';
import { PostForm, loader as postFormLoader, action as postFormAction } from './routes/PostForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/posts" replace />,
  },
  {
    path: '/posts',
    element: <PostList />,
    loader: postListLoader,
    action: postListAction,
  },
  {
    path: '/posts/new',
    element: <PostForm />,
    loader: postFormLoader,
    action: postFormAction,
  },
  {
    path: '/posts/:id/edit',
    element: <PostForm />,
    loader: postFormLoader,
    action: postFormAction,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

```

---

## Key Benefits of This Architecture

1. **Automatic Revalidation:** When an `action` returns a `redirect()` or data, React Router automatically re-runs all active `loader` functions on the page to guarantee the UI is in sync with the backend.
2. **Pending States via `useNavigation()`:** `navigation.state === 'submitting'` gives you global access to pending states without managing local `loading` booleans.
3. **Form Validation via `useActionData()`:** Server-side validation errors returned from the `action` flow back down into the component via `useActionData()`.

Provide a step-by-step setup guide for React Router with Vite, SSR, and type generation.

Here is a step-by-step setup guide for configuring React Router (v7+) with Vite, Server-Side Rendering (SSR), and automatic type generation.

---

## 1. Create a New Vite Project

Initialize a new Vite project using the React TypeScript template:

```bash
npm create vite@latest my-router-app -- --template react-ts
cd my-router-app

```

---

## 2. Install Dependencies

Install `react-router` along with the development plugin `@react-router/dev`:

```bash
npm install react-router
npm install -D @react-router/dev

```

---

## 3. Configure Vite (`vite.config.ts`)

Add the `reactRouter` plugin to your `vite.config.ts`. Place it **before** any other React-related plugins:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig({
  plugins: [
    reactRouter(),
  ],
});

```

---

## 4. Add the React Router Config (`react-router.config.ts`)

Create a `react-router.config.ts` file in your root directory to configure SSR mode:

```typescript
// react-router.config.ts
import type { Config } from '@react-router/dev/config';

export default {
  // Enables Server-Side Rendering (SSR)
  ssr: true,
} satisfies Config;

```

---

## 5. Configure TypeScript (`tsconfig.json`)

To enable automatic type generation for route loaders, actions, and params, update your `tsconfig.json` to include the generated `.react-router/types` directory:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "rootDirs": [".", "./.react-router/types"]
  },
  "include": ["app/**/*", ".react-router/types/**/*"]
}

```

---

## 6. Set Up App Entry Files

Create the core layout and entry files inside the `app/` directory.

### Root Layout (`app/root.tsx`)

This acts as the main HTML shell:

```tsx
// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

```

---

## 7. Define Routes (`app/routes.ts`)

Create a `routes.ts` file inside `app/` to configure route definitions:

```typescript
// app/routes.ts
import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('users/:userId', 'routes/user.tsx'),
] satisfies RouteConfig;

```

---

## 8. Create Typed Route Components

Now create the individual route files. Notice how `Route.LoaderArgs` and `Route.ComponentProps` provide full, end-to-end type safety inferred from your route definitions and parameters.

### Home Route (`app/routes/home.tsx`)

```tsx
// app/routes/home.tsx
import { Link } from 'react-router';
import type { Route } from './+types/home';

export function meta(): Route.MetaDescriptors {
  return [{ title: 'Home Page' }, { name: 'description', content: 'Welcome to React Router SSR' }];
}

export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>React Router SSR Home</h1>
      <Link to="/users/123">View User 123</Link>
    </div>
  );
}

```

### Typed User Route (`app/routes/user.tsx`)

```tsx
// app/routes/user.tsx
import type { Route } from './+types/user';

// Fully typed loader: params.userId is strongly typed as string
export async function loader({ params }: Route.LoaderArgs) {
  const { userId } = params;
  
  // Simulate server-side database call
  const user = { id: userId, name: `User #${userId}`, role: 'Admin' };
  return { user };
}

// Fully typed component: loaderData is automatically inferred
export default function UserProfile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>User Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}

```

---

## 9. Update `package.json` Scripts

Update your build and dev scripts to run type generation and the SSR server:

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc"
  }
}

```

---

## 10. Run the Development Server

Start the development server:

```bash
npm run dev

```

React Router will automatically run its typegen engine, generating a `.react-router/types` directory with exact TypeScript definitions for loaders, actions, params, and route modules.

Show how to handle streaming data with React Router loaders and React Suspense in SSR mode.

Streaming slow or non-critical data allows you to render and serve critical UI immediately while deferring secondary data until it resolves on the server. In React Router SSR, this is accomplished by returning unawaited Promises inside `defer()` or directly in loader objects alongside `<Suspense>` and `<Await>`.

---

## 1. How Streaming Data Flow Works

```
Server receives request
  │
  ├── 1. Critical data awaited (Fast) ────► Renders HTML Shell & Page Layout
  │                                           │
  └── 2. Non-critical Promise created ────────┼─► Flushes HTML immediately to browser
                                              │   (Suspense fallback renders)
                                              │
                                              └─► Promise resolves on server
                                                  └─► Streams HTML chunk + <script>
                                                      (Replaces fallback with real UI)

```

---

## 2. Implementation Example

In this example, user profile details are critical (awaited), while activity logs are slow/non-critical (streamed via promise).

### The Route File (`app/routes/user.tsx`)

```tsx
import { Suspense } from 'react';
import { Await } from 'react-router';
import type { Route } from './+types/user';

// Mock fast API call (Critical)
async function getFastUserData(userId: string) {
  return { id: userId, name: 'Alex Johnson', email: 'alex@example.com' };
}

// Mock slow API call (Deferred / Streamed)
async function getSlowActivityLogs(userId: string) {
  // Simulate 3-second network/database latency
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return [
    { id: '1', action: 'LoggedIn', timestamp: '2 mins ago' },
    { id: '2', action: 'Updated Profile', timestamp: '1 hour ago' },
  ];
}

// Loader
export async function loader({ params }: Route.LoaderArgs) {
  // 1. Await critical data (blocks immediate SSR response briefly)
  const user = await getFastUserData(params.userId);

  // 2. DO NOT await the slow promise — pass it directly to stream it
  const activityPromise = getSlowActivityLogs(params.userId);

  return {
    user,
    activityPromise, // Unawaited Promise passed to client/stream
  };
}

// Route Component
export default function UserDashboard({ loaderData }: Route.ComponentProps) {
  const { user, activityPromise } = loaderData;

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h1>User Profile</h1>
      
      {/* 1. Critical UI renders immediately during initial SSR HTML flush */}
      <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px' }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h2 style={{ marginTop: '24px' }}>Recent Activity</h2>

      {/* 2. Suspense shows fallback while the server streams the remaining promise */}
      <Suspense fallback={<ActivitySkeleton />}>
        <Await resolve={activityPromise} errorElement={<ActivityError />}>
          {(activities) => (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {activities.map((item) => (
                <li
                  key={item.id}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  <strong>{item.action}</strong> — <small>{item.timestamp}</small>
                </li>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

// Fallback UI shown while streaming
function ActivitySkeleton() {
  return (
    <div style={{ opacity: 0.6 }}>
      <p style={{ color: '#64748b' }}>⏳ Streaming activity logs from server...</p>
    </div>
  );
}

// Error UI shown if streamed promise rejects
function ActivityError() {
  return <p style={{ color: '#ef4444' }}>Failed to load activity logs.</p>;
}

```

---

## 3. Server Configuration Checklist for Streaming

To enable true HTTP chunked streaming responses, verify your server configuration:

1. **Enable Response Streaming:** Ensure your Node/Edge server wrapper does not buffer HTML output before sending it.
2. **React 18 / 19 `renderToPipeableStream`:** React Router uses `renderToPipeableStream` under the hood during SSR when deferred promises are returned from loaders.
3. **CDN / Proxy Compression:** Make sure proxies or reverse proxies (like Nginx or Cloudflare) don't buffer responses. For Nginx, ensure `proxy_buffering off;` is set.

---

## Summary of `<Await>` Props

| Prop           | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| `resolve`      | The unawaited Promise passed down from your loader.                                  |
| `children`     | Render function receiving the resolved value once the promise settles.               |
| `errorElement` | Fallback component rendered if the deferred promise rejects on the server or client. |

Show how to handle errors using ErrorBoundary and isRouteErrorResponse in React Router.

In React Router, route-level errors (such as `404 Not Found`, throws inside loaders/actions, or unexpected JavaScript runtime exceptions) are caught declaratively using **`ErrorBoundary`** export components paired with the **`isRouteErrorResponse`** helper.

---

## 1. How Error Boundaries Work

When an error occurs during a route lifecycle:

* **Route Responses (e.g. `throw new Response(...)` or `throw redirect(...)`):** Caught as structured route error responses.
* **JavaScript Errors (`throw new Error(...)` or syntax/runtime bugs):** Caught as standard thrown errors.
* **Bubble Up Behavior:** If a route does not define its own `ErrorBoundary`, the error bubbles up the route tree until it hits a parent or root `ErrorBoundary`.

---

## 2. Complete Code Example

Here is a complete setup showing a route loader throwing a `404 Response`, an action throwing a validation error, and a typed `ErrorBoundary` catching both structured responses and uncaught runtime exceptions.

### Route Module (`app/routes/user.tsx`)

```tsx
import React from 'react';
import {
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
  Link,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from 'react-router';

// Simulated database lookup
async function getUserById(id: string) {
  if (id === '404') return null;
  if (id === '500') throw new Error('Database connection crashed!');
  return { id, name: 'Alex Johnson', role: 'Developer' };
}

// 1. LOADER: Throws a Response when a resource is not found
export async function loader({ params }: LoaderFunctionArgs) {
  const user = await getUserById(params.userId || '');

  if (!user) {
    // Throwing a Response triggers isRouteErrorResponse in the ErrorBoundary
    throw new Response('User Profile Not Found', {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return { user };
}

// 2. MAIN COMPONENT: Normal happy-path rendering
export default function UserProfile() {
  const { user } = useLoaderData() as { user: { id: string; name: string; role: string } };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>User Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );
}

// 3. ERROR BOUNDARY: Catches loader/action/render errors for this route
export function ErrorBoundary() {
  const error = useRouteError();

  // Case A: Errors thrown explicitly via Response (e.g. throw new Response())
  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#1e293b' }}>
        <h1 style={{ color: '#ef4444' }}>
          {error.status} — {error.statusText}
        </h1>
        <p style={{ fontSize: '18px' }}>
          {error.data || 'The requested page or user could not be found.'}
        </p>
        <Link to="/" style={{ color: '#4f46e5', fontWeight: 'bold' }}>
          ← Return to Safety
        </Link>
      </div>
    );
  }

  // Case B: Uncaught JavaScript errors (e.g. null pointer, database crash)
  let errorMessage = 'An unexpected application error occurred.';
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#1e293b' }}>
      <h1 style={{ color: '#dc2626' }}>Application Error</h1>
      <p style={{ background: '#fef2f2', padding: '12px', borderRadius: '6px', color: '#991b1b' }}>
        {errorMessage}
      </p>
      <Link to="/" style={{ color: '#4f46e5', fontWeight: 'bold' }}>
        ← Return to Safety
      </Link>
    </div>
  );
}

```

---

## 3. Global Root Fallback (`app/root.tsx`)

Adding an `ErrorBoundary` at the root layout guarantees a graceful fallback if a route without its own boundary throws an error or if an invalid URL is entered:

```tsx
// app/root.tsx
import {
  isRouteErrorResponse,
  useRouteError,
  Outlet,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from 'react-router';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// Root-level Error Boundary handles catch-all 404s and unhandled crashes
export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <RootLayout>
      <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        {isRouteErrorResponse(error) ? (
          <>
            <h1>{error.status} Page Error</h1>
            <p>{error.statusText || 'Page not found'}</p>
          </>
        ) : (
          <>
            <h1>System Error</h1>
            <p>{error instanceof Error ? error.message : 'Unknown error'}</p>
          </>
        )}
      </div>
    </RootLayout>
  );
}

```

---

## Key Utility Methods

| Helper / Hook                     | Description                                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **`useRouteError()`**             | Retrieves the caught exception or thrown Response object inside an `ErrorBoundary`.                                                |
| **`isRouteErrorResponse(error)`** | Type guard checking if the error is a structured router response (e.g., created via `throw new Response()` or 404 router matches). |
| **`error.status`**                | The HTTP status code (e.g. `404`, `401`, `500`) available when `isRouteErrorResponse(error)` is true.                              |
| **`error.data`**                  | The payload body passed into the thrown `Response`.                                                                                |

Show how to use React 19 transitions and pending states during navigation in React Router.
React 19 introduces native support for asynchronous transitions, and modern React Router leverages this integration out of the box via hooks like `useNavigation` and `useTransition`.

When navigating between routes or submitting forms, React Router marks transitions as pending without blocking the main thread, allowing you to display immediate UI feedback (such as top loading bars, dimming, or spinner overlays) while data loaders resolve.

---

## 1. Global Navigation Pending State (`useNavigation`)

The `useNavigation()` hook provides real-time access to the application's global navigation state (`'idle'`, `'loading'`, or `'submitting'`). This is ideal for top-level progress bars or layout-level loaders.

```tsx
// app/root.tsx
import React from 'react';
import {
  Outlet,
  NavLink,
  useNavigation,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from 'react-router';

export default function Root() {
  const navigation = useNavigation();
  
  // navigation.state will be 'loading' when a loader is running for the next route
  const isNavigating = navigation.state === 'loading';

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        {/* Top Progress Bar */}
        <div
          style={{
            height: '4px',
            width: '100%',
            backgroundColor: 'transparent',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: '#4f46e5',
              width: isNavigating ? '70%' : '0%',
              transition: isNavigating ? 'width 1s ease-in-out' : 'width 0.2s ease',
            }}
          />
        </div>

        <nav style={{ padding: '16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
          <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#4f46e5' : '#0f172a', fontWeight: 'bold' })}>
            Home
          </NavLink>
          <NavLink to="/dashboard" style={({ isActive }) => ({ color: isActive ? '#4f46e5' : '#0f172a', fontWeight: 'bold' })}>
            Dashboard (Slow Loader)
          </NavLink>
        </nav>

        <main style={{ padding: '24px' }}>
          {/* Optional inline spinner when loading */}
          {isNavigating && (
            <p style={{ color: '#64748b', fontSize: '14px' }}>Loading content...</p>
          )}
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

```

---

## 2. Granular Transition States (`useTransition` / `useFetcher`)

If you want to scope a pending state to a specific button, inline component, or background action without triggering a full global layout shift, you can use React Router's fetcher or React 19's `useTransition`.

Here is an example using `useFetcher` to handle an inline form update (like toggling a status or upvoting) with instant pending indicators:

```tsx
// app/routes/todos.tsx
import React from 'react';
import { useLoaderData, useFetcher } from 'react-router';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Mock loader
export async function loader() {
  return {
    todos: [
      { id: '1', text: 'Learn React Router', completed: false },
      { id: '2', text: 'Explore React 19 Transitions', completed: true },
    ] as Todo[],
  };
}

// Mock action
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get('id');
  
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 1000));
  return { success: true, id };
}

export default function TodosComponent() {
  const { todos } = useLoaderData() as { todos: Todo[] };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2>Tasks</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

function TodoItem({ todo }: { todo: Todo }) {
  const fetcher = useFetcher();

  // Check if this specific fetcher is currently submitting or loading
  const isUpdating = fetcher.state !== 'idle';

  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        borderBottom: '1px solid #e2e8f0',
        opacity: isUpdating ? 0.6 : 1, // Dim item during transition
        transition: 'opacity 0.2s',
      }}
    >
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>

      <fetcher.Form method="post">
        <input type="hidden" name="id" value={todo.id} />
        <button
          type="submit"
          disabled={isUpdating}
          style={{
            padding: '4px 8px',
            backgroundColor: isUpdating ? '#cbd5e1' : '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isUpdating ? 'not-allowed' : 'pointer',
          }}
        >
          {isUpdating ? 'Updating...' : todo.completed ? 'Undo' : 'Complete'}
        </button>
      </fetcher.Form>
    </li>
  );
}

```

---

## Key Concepts of React 19 & React Router Transitions

1. **Non-Blocking UI:** React 19 transitions mark state updates and route navigations as non-urgent when necessary, allowing current user interactions (like typing in an unrelated input) to remain responsive while heavy loaders process in the background.
2. **`navigation.location` vs `navigation.state`:** When `navigation.state === 'loading'`, you can inspect `navigation.location.pathname` to know *where* the user is navigating, enabling targeted loading indicators (e.g., highlighting the specific sidebar link being clicked).
3. **`useFetcher` Isolation:** Unlike global navigation, `useFetcher()` allows multiple background mutations or data loads to occur concurrently across different components without conflicting or triggering full-page router transitions.

Show how to implement protected routes and authentication guards using React Router loaders.

Implementing authentication guards in loaders guarantees that unauthenticated requests are **blocked on the server/client before any component markup renders or loads**. If a user tries to access a protected URL, the loader intercepts the request, checks session/token validity, and throws an immediate `redirect()`.

---

## 1. Authentication Service & Session Helper

Create a central authentication module (`src/auth.ts`) that manages user sessions:

```typescript
// src/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Simulated session token storage
let currentUser: User | null = null;

export const authService = {
  isAuthenticated: () => currentUser !== null,
  getUser: () => currentUser,

  login: async (email: string): Promise<User> => {
    await new Promise((res) => setTimeout(res, 300));
    currentUser = {
      id: '101',
      name: 'Alex Johnson',
      email,
      role: 'admin',
    };
    return currentUser;
  },

  logout: async (): Promise<void> => {
    await new Promise((res) => setTimeout(res, 200));
    currentUser = null;
  },
};

/**
 * Reusable Auth Guard Helper for Route Loaders
 */
export function requireAuth(request: Request, allowedRoles?: ('admin' | 'user')[]) {
  const url = new URL(request.url);

  // 1. Check if user is authenticated
  if (!authService.isAuthenticated()) {
    // Preserve requested URL so user can be sent back after login
    const searchParams = new URLSearchParams([['redirectTo', url.pathname]]);
    
    // Throwing redirect() halts loader execution immediately
    throw new Response(null, {
      status: 302,
      headers: { Location: `/login?${searchParams}` },
    });
  }

  const user = authService.getUser()!;

  // 2. Optional Role-Based Authorization Guard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Response('Forbidden: Insufficient privileges', { status: 403 });
  }

  return user;
}

```

---

## 2. Route Modules

### A. Login Route (`src/routes/Login.tsx`)

Handles authentication and redirects users back to the page they originally tried to visit:

```tsx
// src/routes/Login.tsx
import React from 'react';
import { Form, redirect, useSearchParams, useNavigation, ActionFunctionArgs } from 'react-router';
import { authService } from '../auth';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';

  await authService.login(email);

  // Redirect back to original destination
  return redirect(redirectTo);
}

export function LoginRoute() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const navigation = useNavigation();

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', fontFamily: 'sans-serif' }}>
      <h2>Sign In</h2>
      {searchParams.get('redirectTo') && (
        <p style={{ color: '#eab308', background: '#fefce8', padding: '8px', borderRadius: '4px' }}>
          You must log in to view that page.
        </p>
      )}

      <Form method="post" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>
          Email Address
          <input
            type="email"
            name="email"
            required
            defaultValue="alex@example.com"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>
        
        <button
          type="submit"
          disabled={navigation.state === 'submitting'}
          style={{ padding: '10px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {navigation.state === 'submitting' ? 'Signing in...' : 'Sign In'}
        </button>
      </Form>
    </div>
  );
}

```

### B. Protected Dashboard Route (`src/routes/Dashboard.tsx`)

Guarded by `requireAuth()`. Unauthenticated visitors are intercepted before rendering:

```tsx
// src/routes/Dashboard.tsx
import React from 'react';
import { useLoaderData, Form, redirect, LoaderFunctionArgs } from 'react-router';
import { requireAuth, authService, User } from '../auth';

// Loader Guard
export async function loader({ request }: LoaderFunctionArgs) {
  // Executes guard before resolving loader data
  const user = requireAuth(request);
  return { user };
}

// Action for Logout
export async function action() {
  await authService.logout();
  return redirect('/login');
}

export function DashboardRoute() {
  const { user } = useLoaderData() as { user: User };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>Protected Dashboard</h1>
      <p>Welcome back, <strong>{user.name}</strong> ({user.role})!</p>

      <Form method="post">
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Sign Out
        </button>
      </Form>
    </div>
  );
}

```

### C. Role-Restricted Admin Route (`src/routes/Admin.tsx`)

Demonstrates role authorization guards:

```tsx
// src/routes/Admin.tsx
import React from 'react';
import { useLoaderData, LoaderFunctionArgs } from 'react-router';
import { requireAuth, User } from '../auth';

export async function loader({ request }: LoaderFunctionArgs) {
  // Requires both authentication AND 'admin' role
  const user = requireAuth(request, ['admin']);
  return { user };
}

export function AdminRoute() {
  const { user } = useLoaderData() as { user: User };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h1>Admin Settings</h1>
      <p>Restricted area for admins only. Logged in as: {user.email}</p>
    </div>
  );
}

```

---

## 3. Router Configuration & Layout Protection

You can protect individual routes or apply a global guard to an entire group of routes using a **Layout Route**:

```tsx
// src/router.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, redirect } from 'react-router';
import { LoginRoute, action as loginAction } from './routes/Login';
import { DashboardRoute, loader as dashboardLoader, action as logoutAction } from './routes/Dashboard';
import { AdminRoute, loader as adminLoader } from './routes/Admin';
import { requireAuth } from './auth';

// Protected Parent Layout Guard
function ProtectedLayout() {
  return <Outlet />;
}

export async function protectedLayoutLoader({ request }: { request: Request }) {
  // Protecting the parent route automatically guards ALL nested children routes
  requireAuth(request);
  return null;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginRoute />,
    action: loginAction,
  },
  
  // Option A: Parent Layout Guard (Protects all child routes)
  {
    element: <ProtectedLayout />,
    loader: protectedLayoutLoader,
    children: [
      {
        path: '/dashboard',
        element: <DashboardRoute />,
        loader: dashboardLoader,
        action: logoutAction,
      },
      {
        path: '/admin',
        element: <AdminRoute />,
        loader: adminLoader, // Has additional role guard
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

```

---

## Why Loader Guards Are Superior to Component Guards

| Aspect                   | Traditional Wrapper Component (`<RequireAuth>`)                    | React Router Loader Guard (`requireAuth()`)                               |
| ------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Execution Timing**     | Runs *after* JavaScript loads and React renders layout components. | Runs *before* route rendering begins or HTML is flushed in SSR.           |
| **Data Fetching Safety** | Sensitive API loaders run before auth check occurs on client.      | Unauthenticated requests are aborted before loaders fetch sensitive data. |
| **Waterfall Prevention** | Causes visual layout flashes (redirects after component mount).    | Zero UI flashing; clean, instant 302 HTTP redirects.                      |
