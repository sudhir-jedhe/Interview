# Interview Questions

**Q: Why does client-side routing need to intercept link clicks instead of letting the browser handle them?**
A default `<a href>` click triggers a full HTTP request and page reload, destroying the JS runtime and all in-memory React state. To behave like a single-page app, the router must call `event.preventDefault()` on the click, then use the History API (`pushState`) to change the URL and re-render the matching route entirely client-side, with no network round-trip for the navigation itself.

**Q: What's the difference between `<Link to="/x">` and `<a href="/x">` in a React Router app?**
`<Link>` renders an `<a>` tag (preserving accessibility and native behaviors like middle-click/open-in-new-tab) but intercepts left-clicks to perform client-side navigation instead of a full page load. A plain `<a href>` has none of that — clicking it always causes a full page reload, since React Router never sees or handles the click.

**Q: What does `useParams()` return, and does it do any type conversion?**
It returns an object mapping each `:param` name in the matched route's path to its string value from the URL — e.g., `{ userId: "42" }` for a route `/users/:userId` matched against `/users/42`. No conversion or validation happens automatically; values are always strings, so numeric IDs need explicit `Number()`/parsing and validation in your code.

**Q: What is an `Outlet`, and how does it relate to nested/layout routes?**
`<Outlet />` is a placeholder rendered inside a parent route's element, marking where the matched child route's element should render. It's what makes layout routes possible — a shared header/sidebar renders once in the parent, and only the `Outlet` content changes as the user navigates between child routes.

**Q: How do you implement a protected/private route?**
Wrap the protected route's element in a component that checks auth state and either renders the children (or `<Outlet />` for a nested-route guard) or renders `<Navigate to="/login" replace />` to redirect. For multiple protected routes, put the check on a shared parent/layout route rather than repeating it on every leaf route.

```jsx
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
```

**Q: What's the difference between `navigate('/path')` and `navigate('/path', { replace: true })`?**
Without `replace`, navigation pushes a new entry onto the browser history stack, so the previous page is still reachable via the back button. With `replace: true`, the current history entry is overwritten instead of a new one being added — commonly used after a redirect (e.g., post-login) so the back button doesn't take the user back to an intermediate/redirect page.

**Q: What does `useLocation()` give you, and give a practical use case.**
It returns the current location object: `{ pathname, search, hash, state, key }`. A practical use: reading `location.state` after a redirect (e.g., `<Navigate to="/login" state={{ from: location }} />`) to send the user back to where they originally tried to go after they successfully log in.

**Q: How do query parameters differ from route params, and how do you read/update them?**
Route params (`:id`) are part of the URL path structure and defined by the route's `path`; you read them with `useParams()`. Query parameters (`?sort=price`) are read and updated with `useSearchParams()`, which returns a `URLSearchParams`-like object and a setter — updating them changes the URL's query string without necessarily matching a different route.

**Q: What is a "loader" in modern React Router, and what problem does it solve?**
A `loader` is a function attached to a route (via `createBrowserRouter`) that fetches the data that route needs, run during navigation before/alongside rendering, with the result accessible via `useLoaderData()`. It solves the "fetch-after-render waterfall" problem where a component historically had to mount first, then fire a `useEffect` fetch, causing a visible loading state on every navigation even when the fetch could have started earlier.

**Q: How would you handle a 404 for an unmatched URL, and separately, for a valid route with no matching data (e.g., a deleted resource)?**
For an unmatched URL, add a catch-all route `<Route path="*" element={<NotFound />} />` at the end of your route tree. For a valid route whose specific resource doesn't exist (e.g., `/products/999` where 999 was deleted), handle it inside the component/loader — either render a "not found" state directly, redirect to a dedicated not-found page, or (with a data router) throw a `Response('Not Found', { status: 404 })` from the loader and let a route's `errorElement` handle it.

**Q: Why is `<Navigate>` used inside a component's render output instead of just calling `navigate()` directly during render?**
Calling `navigate()` (an imperative function) directly during the render phase is a side effect and violates React's rule against side effects in render — it can cause warnings or double-invocation issues, especially in Strict Mode. `<Navigate>` is a component specifically designed to perform its redirect as a controlled effect internally when rendered, making it safe to return conditionally from JSX.

**Q: What's the difference between how `BrowserRouter` and a hash-based router (`HashRouter`) represent the URL, and when would you use each?**
`BrowserRouter` uses the History API to produce clean URLs (`/about`) but requires the server to be configured to serve the SPA's `index.html` for any path (so direct loads/refreshes work). `HashRouter` encodes the route in the URL fragment (`/#/about`), which never hits the server on navigation or refresh (since fragments aren't sent in HTTP requests) but produces uglier URLs. Use `BrowserRouter` by default; `HashRouter` is a fallback when you can't configure server-side routing/fallback rules (e.g., a static file host with no rewrite rules).
