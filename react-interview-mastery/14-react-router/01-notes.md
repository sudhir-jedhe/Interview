# Core Concepts

## Why SPA routing needs to intercept link clicks

By default, clicking an `<a href="/about">` tells the browser to make a full HTTP request for `/about`, tearing down the current page and loading a fresh HTML document. That defeats the point of a single-page app, which wants to keep the JS runtime alive and just swap out which components render. React Router's `<Link>` renders an `<a>` under the hood (for accessibility, right-click "open in new tab," etc.) but attaches an `onClick` handler that calls `event.preventDefault()` and instead pushes a new entry onto the browser's History API (`history.pushState`), then re-renders the matching route — no network round-trip, no full page reload.

```jsx
import { Link } from 'react-router-dom';

<Link to="/about">About</Link>
// vs
<a href="/about">About</a> // triggers a full page reload — avoid for in-app navigation
```

## Core setup: `Routes` and `Route`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

`Routes` picks the single best-matching `Route` for the current URL (unlike the old v5 `Switch`, matching is more explicit/ranked). `path="*"` is the catch-all for 404s.

## Dynamic route matching

Segments prefixed with `:` are params, extracted with `useParams()`:

```jsx
// route: <Route path="/users/:userId" element={<UserProfile />} />
function UserProfile() {
  const { userId } = useParams(); // e.g. "42" for /users/42
  return <p>Viewing user {userId}</p>;
}
```

## `useNavigate`, `useLocation`, `useSearchParams`

```jsx
function LoginForm() {
  const navigate = useNavigate();
  function handleSubmit() {
    login().then(() => navigate('/dashboard')); // programmatic navigation
  }
  return <form onSubmit={handleSubmit}>...</form>;
}

function CurrentPathDisplay() {
  const location = useLocation(); // { pathname, search, hash, state, key }
  return <p>You're on {location.pathname}</p>;
}

function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  return (
    <input
      value={query}
      onChange={e => setParams({ q: e.target.value })} // updates ?q=...
    />
  );
}
```

`navigate(-1)` goes back; `navigate('/path', { replace: true })` replaces the current history entry instead of pushing (useful after a redirect so back doesn't loop through it).

## Nested routes and layout routes

A parent route can render a shared layout (nav bar, sidebar) with an `<Outlet />` placeholder where the matched child route renders:

```jsx
function DashboardLayout() {
  return (
    <div>
      <Sidebar />
      <main><Outlet /></main> {/* child route renders here */}
    </div>
  );
}

<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />       {/* /dashboard */}
    <Route path="settings" element={<Settings />} />  {/* /dashboard/settings */}
    <Route path="billing" element={<Billing />} />     {/* /dashboard/billing */}
  </Route>
</Routes>
```

`index` marks the default child rendered at the parent's exact path. Nested paths are relative — no need to repeat `/dashboard/`.

## Protected/private routes

Auth-gated routes are typically implemented as a wrapper component that checks auth state and either renders children/`<Outlet/>` or redirects:

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    // preserve where the user was headed so we can send them back post-login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
/>
```

For multiple protected routes, wrap them under a single layout-style guard using nested routes and `<Outlet />` instead of repeating `<ProtectedRoute>` everywhere:

```jsx
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

<Route element={<RequireAuth />}>
  <Route path="/dashboard" element={<DashboardLayout />} />
  <Route path="/settings" element={<Settings />} />
</Route>
```

## Data loading: loader functions (brief)

Modern React Router (v6.4+ "data routers", created with `createBrowserRouter`) supports a `loader` function per route that fetches data *before* the route renders, decoupling data fetching from component mount and enabling render-as-you-fetch instead of fetch-on-mount waterfalls:

```jsx
const router = createBrowserRouter([
  {
    path: '/users/:userId',
    element: <UserProfile />,
    loader: async ({ params }) => {
      const res = await fetch(`/api/users/${params.userId}`);
      if (!res.ok) throw new Response('Not Found', { status: 404 });
      return res.json();
    },
  },
]);

function UserProfile() {
  const user = useLoaderData(); // data resolved by the loader above
  return <h1>{user.name}</h1>;
}
```

This is a meaningful shift from the older pattern of fetching inside `useEffect` after mount — loaders run in parallel with route transition, and errors thrown in a loader are caught by that route's `errorElement`.
