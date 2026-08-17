# Scenario Questions

### 1. You're building an admin dashboard with several pages (`/admin/users`, `/admin/reports`, `/admin/settings`) that should all be inaccessible to non-admin users, redirecting them to `/login` and — after they log in — sending them back to the page they originally tried to visit. How do you architect this?

**Approach:** Use a single layout-style guard wrapping all admin routes, and capture the attempted location in the redirect's `state` so the login page can send the user back afterward.

```jsx
function RequireAdmin() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user?.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? '/admin';

  async function handleLogin(credentials) {
    await login(credentials);
    navigate(from, { replace: true });
  }
  return <LoginForm onSubmit={handleLogin} />;
}

<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<RequireAdmin />}>
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path="/admin/reports" element={<AdminReports />} />
    <Route path="/admin/settings" element={<AdminSettings />} />
  </Route>
</Routes>
```

One guard covers every current and future `/admin/*` route without repeating the auth check per page, and `replace` on both redirects keeps the back button from looping through `/login`.

---

### 2. Your app has a `/products/:productId` route. Users report that pasting a malformed ID (e.g., `/products/../../etc`) or a non-existent product ID crashes the page with a blank screen instead of showing a proper 404. How do you fix it?

**Approach:** Validate the param and handle the not-found case explicitly instead of assuming the data will always be there — ideally combined with an error boundary as a safety net for anything unexpected.

```jsx
function ProductPage() {
  const { productId } = useParams();
  const [state, setState] = useState({ status: 'loading', product: null });

  useEffect(() => {
    let cancelled = false;
    fetchProduct(productId)
      .then(product => {
        if (!cancelled) setState({ status: 'success', product });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'not-found', product: null });
      });
    return () => { cancelled = true; };
  }, [productId]);

  if (state.status === 'loading') return <Spinner />;
  if (state.status === 'not-found') return <Navigate to="/products/not-found" replace />;
  return <ProductDetails product={state.product} />;
}

// catch genuinely unexpected errors (bad routing, render bugs) with a boundary too
<Route element={<ErrorBoundary fallback={<GenericError />} />}>
  <Route path="/products/:productId" element={<ProductPage />} />
</Route>
```

If migrating to a data router, this becomes cleaner: throw a `Response('Not Found', { status: 404 })` from the route's `loader` and let a route-level `errorElement` render the 404 UI automatically, removing the manual status-state juggling from the component.

---

### 3. A marketing team wants `/pricing` to support both `/pricing` and `/pricing/enterprise`, `/pricing/startup` as sub-pages sharing the same header/tabs UI, and they want the URL to be the source of truth for which tab is active (not local component state). How do you build this?

**Approach:** Use a layout route with an `Outlet` for the shared tab UI, and derive the active tab from the current path via `useLocation` (or `NavLink`'s built-in active styling) rather than local state.

```jsx
function PricingLayout() {
  return (
    <div>
      <h1>Pricing</h1>
      <nav>
        <NavLink to="/pricing" end className={({ isActive }) => isActive ? 'active' : ''}>
          General
        </NavLink>
        <NavLink to="/pricing/startup" className={({ isActive }) => isActive ? 'active' : ''}>
          Startup
        </NavLink>
        <NavLink to="/pricing/enterprise" className={({ isActive }) => isActive ? 'active' : ''}>
          Enterprise
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

<Route path="/pricing" element={<PricingLayout />}>
  <Route index element={<GeneralPricing />} />
  <Route path="startup" element={<StartupPricing />} />
  <Route path="enterprise" element={<EnterprisePricing />} />
</Route>
```

`NavLink`'s `isActive` (URL-derived) replaces any local "which tab is selected" state entirely — the URL is the single source of truth, so refreshing, sharing a link, or using back/forward all work correctly without extra synchronization code.

---

### 4. Performance testing shows the `/dashboard` route (behind a login) fetches its data only after the component mounts, causing a visible loading spinner every time, even on fast connections, because of the fetch-after-render waterfall. Your team is on React Router v6.4+. How do you improve this?

**Approach:** Move data fetching to a route `loader`, so the fetch starts as part of route matching/navigation rather than after the component has already mounted and run its first render.

```jsx
const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <RequireAuth><Dashboard /></RequireAuth>,
    loader: async () => {
      const [user, stats] = await Promise.all([fetchUser(), fetchStats()]);
      return { user, stats };
    },
    errorElement: <DashboardError />,
  },
]);

function Dashboard() {
  const { user, stats } = useLoaderData();
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <StatsPanel stats={stats} />
    </div>
  );
}
```

Because the loader runs during navigation (in parallel with any code-splitting/chunk loading for the route), the data is often ready by the time the component actually renders — eliminating the extra spinner-then-content flash that a `useEffect`-based fetch produces on every navigation.
