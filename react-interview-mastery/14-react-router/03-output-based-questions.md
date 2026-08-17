# Output-Based Questions

### 1. Given this route config, what renders at `/dashboard`?
```jsx
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
function DashboardLayout() {
  return <div><h1>Dashboard</h1><Outlet /></div>;
}
```
**Answer:** `<h1>Dashboard</h1>` followed by whatever `DashboardHome` renders.

**Why:** `/dashboard` matches the parent route and renders `DashboardLayout`. Because there's no further path segment, the `index` child route matches and its element (`DashboardHome`) renders into the `<Outlet />`. If the URL were `/dashboard/settings` instead, `Settings` would render in the `Outlet` position instead.

---

### 2. What happens when this `<a>` tag is clicked inside a React Router app?
```jsx
function Nav() {
  return (
    <nav>
      <a href="/profile">Profile</a>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
```
**Answer:** Clicking "Profile" causes a full page reload (a real HTTP GET request to `/profile`, tearing down the whole React app and re-initializing it). Clicking "Settings" navigates client-side with no reload.

**Why:** A plain `<a href>` has no React Router behavior attached — the browser's default navigation takes over. `<Link>` intercepts the click with `preventDefault()` and uses the History API instead. Using `<a>` for in-app links is a common bug that silently reintroduces full-page reloads and loses all React state.

---

### 3. What does `useParams()` return here, and what happens if the user manually edits the URL to `/users/abc`?
```jsx
// <Route path="/users/:userId" element={<UserProfile />} />
function UserProfile() {
  const { userId } = useParams();
  const id = Number(userId);
  return <p>User ID: {id}</p>;
}
// visiting /users/42
```
**Answer:** For `/users/42`, `userId` is the string `"42"`, and the component renders `"User ID: 42"`. For `/users/abc`, `userId` is `"abc"`, `Number("abc")` is `NaN`, and it renders `"User ID: NaN"` — no error is thrown, no validation happens automatically.

**Why:** Route params are always strings — React Router does zero type coercion or validation on dynamic segments. Any type conversion (and validation, like checking it's a valid numeric ID) is the developer's responsibility inside the component or a loader.

---

### 4. Two sibling routes are defined for the same path. Which one renders?
```jsx
<Routes>
  <Route path="/report" element={<ReportA />} />
  <Route path="/report" element={<ReportB />} />
</Routes>
```
**Answer:** `ReportA` renders — React Router uses the first matching route in document order when multiple routes could match the same path exactly.

**Why:** `Routes` picks a single best match by ranking specificity, but among routes with identical specificity/path, the one declared first wins. This is a real footgun when routes are generated dynamically (e.g., from a config array) and accidentally produce duplicate paths.

---

### 5. What happens after `navigate('/login')` runs inside `ProtectedRoute`, then the user logs in and manually presses the browser's back button?
```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />; // no `replace`
  }
  return children;
}
```
**Answer:** After logging in and clicking "back," the user lands back on `/login` (not the originally protected page), because the redirect pushed a new history entry rather than replacing the current one.

**Why:** Without `replace`, `<Navigate to="/login" />` adds `/login` as a *new* entry on top of the protected route's entry in the history stack (`[..., /dashboard, /login]`). Going back pops off `/login`'s own push, landing the user at `/dashboard` again momentarily, then since they're now authenticated it renders fine — but if they'd been redirected to `/login` multiple times without `replace`, the back button becomes a confusing loop through several stacked `/login` entries. Using `<Navigate to="/login" replace />` avoids polluting history with the redirect itself.

---

### 6. Given nested protected routes using a layout-style guard, what happens to `/settings/billing` if the user is unauthenticated?
```jsx
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
<Routes>
  <Route element={<RequireAuth />}>
    <Route path="/settings" element={<SettingsLayout />}>
      <Route path="billing" element={<Billing />} />
    </Route>
  </Route>
  <Route path="/login" element={<Login />} />
</Routes>
```
**Answer:** The user is redirected to `/login`, and neither `SettingsLayout` nor `Billing` ever renders.

**Why:** `RequireAuth` is the parent of the entire `/settings` branch. Since it renders `<Navigate>` instead of `<Outlet />` when unauthenticated, React Router never even attempts to match/render the nested `/settings/billing` route — the guard short-circuits the whole subtree in one place, which is the point of putting auth checks at a shared ancestor rather than repeating them per leaf route.

---

### 7. What does `useSearchParams` return, and what happens on re-render after calling `setSearchParams`?
```jsx
function Filters() {
  const [params, setParams] = useSearchParams();
  console.log('render, category =', params.get('category'));
  return (
    <button onClick={() => setParams({ category: 'shoes' })}>
      Filter shoes
    </button>
  );
}
// initial URL: /products
```
**Answer:** Initial log: `"render, category = null"`. After clicking the button: URL becomes `/products?category=shoes`, and it logs `"render, category = shoes"`.

**Why:** `useSearchParams` reads/writes the query string via `URLSearchParams`, synced to the browser's location. `params.get('category')` returns `null` when the key is absent (not `undefined`). Calling `setParams` updates the URL and triggers a re-render with the new `params` object reflecting the change — functionally similar to `useState`, but backed by the URL itself.
