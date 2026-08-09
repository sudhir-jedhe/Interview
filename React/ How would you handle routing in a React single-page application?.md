In a React single-page application (SPA), routing is handled client-side by intercepting browser navigation (like clicking links or changing the URL bar) and rendering different component trees without triggering a full page reload from the server.

The industry-standard approach uses **React Router** (v6/v7). Below is a comprehensive guide to implementing client-side routing, including nested routes, dynamic parameters, lazy loading, and protected routes.

---

## 1. Basic Setup & Component-Based Router

Modern React Router uses `createBrowserRouter` paired with `<RouterProvider>` for data loading, code splitting, and framework integration capabilities.

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router-dom';

// Layout component with shared navigation
function RootLayout() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f4f4f4' }}>
        {/* Link prevents full page reloads */}
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <main style={{ padding: '16px' }}>
        {/* Outlet renders the active child route */}
        <Outlet />
      </main>
    </div>
  );
}

// Route Definitions
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <div>Page Not Found (404)</div>,
    children: [
      { index: true, element: <h2>Home Page</h2> },
      { path: 'about', element: <h2>About Us</h2> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

```

---

## 2. Dynamic Route Parameters & Navigation

To read parameters from the URL (e.g., `/users/usr_123`) or navigate programmatically (e.g., after a login form submission), use `useParams` and `useNavigate`.

```tsx
import { useParams, useNavigate } from 'react-router-dom';

export function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic...
    navigate('/login', { replace: true }); // Redirect programmatically
  };

  return (
    <div>
      <h3>Viewing Profile for ID: {userId}</h3>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

```

---

## 3. Protected / Authenticated Routes

To prevent unauthenticated users from accessing specific routes (like `/dashboard`), wrap private routes in a custom layout or guard component.

```tsx
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes() {
  const isAuthenticated = Boolean(localStorage.getItem('token')); // Replace with real auth hook/state

  if (!isAuthenticated) {
    // Redirect to login page, preserving requested URL for post-login redirect
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renders protected child components
}

// Route Configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      
      // Wrap protected routes inside the guard
      {
        element: <ProtectedRoutes />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
]);

```

---

## 4. Performance: Code Splitting & Lazy Loading

For large SPAs, bundling all route components into a single JavaScript file hurts initial page load performance. Use **`React.lazy()`** and **`<Suspense>`** to split routes into separate chunks loaded on demand.

```tsx
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Dynamically import route components
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

const router = createBrowserRouter([
  {
    path: '/admin',
    element: (
      // Suspense handles fallback UI while chunk is downloaded
      <Suspense fallback={<div>Loading page chunk...</div>}>
        <AdminDashboard />
      </Suspense>
    ),
  },
]);

```

---

## 5. Critical Server Configuration for SPAs

Client-side routing relies on JavaScript manipulating the browser URL using the HTML5 History API (`pushState`).

When a user lands on `[https://myapp.com/dashboard](https://myapp.com/dashboard)` and refreshes the page, the browser sends a direct GET request to the server for `/dashboard`. By default, static file servers look for a physical file named `/dashboard/index.html` and return a **404 error**.

### Solution: Fallback Rewrite Rule

Configure your web server (Nginx, Caddy, Vercel, Netlify) to rewrite all non-file requests back to `index.html`.

* **Nginx Configuration:**

```nginx
location / {
  try_files $uri $uri/ /index.html;
}

```

* **Netlify (`_redirects` file):**

```text
/*    /index.html   200

```

* **Vite Dev Server (`vite.config.ts`):** Handles this automatically during development!

---

## Routing Strategy Matrix

| Architectural Need           | Tool / Hook                      | Best Used For                                                   |
| ---------------------------- | -------------------------------- | --------------------------------------------------------------- |
| **Declarative Links**        | `<Link to="...">` or `<NavLink>` | Standard navigation without full page reload.                   |
| **Programmatic Redirection** | `useNavigate()`                  | Redirecting after async actions (e.g., login, form submission). |
| **URL Parameter Parsing**    | `useParams()`                    | Dynamic routes like `/posts/:postId`.                           |
| **Query String Reading**     | `useSearchParams()`              | Reading and updating filtering/pagination (`?page=2&sort=asc`). |
| **Chunk Optimization**       | `React.lazy()` + `<Suspense>`    | Keeping initial JS bundle sizes small in large applications.    |
