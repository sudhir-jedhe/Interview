# Comparisons

### `<Link>` vs `<a>`

| Aspect | `<Link to="...">` | `<a href="...">` |
|---|---|---|
| Navigation | Intercepts the click, uses History API — no full page reload, React state preserved | Default browser navigation — full HTTP request, page teardown/reload |
| When to use | Any in-app navigation between routes handled by your router | External links (different domain) or links that genuinely need a full reload |
| Common mistake | None major — it's the correct default for internal navigation | Using a plain `<a>` for internal routes by habit/copy-paste, silently losing SPA behavior and app state |

Default to `<Link>`/`useNavigate` for anything within your app's routed pages; use `<a>` only for external URLs, `mailto:`/`tel:` links, or file downloads.

### `useNavigate` vs `<Navigate>`

| Aspect | `useNavigate()` hook | `<Navigate>` component |
|---|---|---|
| Trigger | Imperative — call `navigate('/path')` inside an event handler, effect, or async callback | Declarative — rendered as JSX, navigates as a side effect of being rendered |
| Typical use case | Navigating after a form submit, button click, or async operation completes | Redirecting during render, e.g. inside a route guard (`isAuthed ? children : <Navigate to="/login"/>`) |
| Common mistake | Calling `navigate()` directly in the render body (not inside an event handler/effect), causing render-phase side effects and warnings | Using `<Navigate>` for something that should be a response to a user action instead of a render-time condition, making the redirect harder to trace |

Use `<Navigate>` for conditional redirects that are a function of current render state (like auth guards); use `useNavigate` for anything triggered by an explicit action.

### `BrowserRouter` vs `createBrowserRouter` (data routers)

| Aspect | `BrowserRouter` + `Routes`/`Route` | `createBrowserRouter` (data router API, v6.4+) |
|---|---|---|
| Data loading | Manual — typically `useEffect` + fetch inside each route's component | Built-in `loader`/`action` functions per route, resolved before/alongside rendering via `useLoaderData` |
| Error handling | Manual, usually via error boundaries you add yourself | Built-in `errorElement` per route, automatically shown when a `loader`/`action`/render throws |
| Common mistake | Fetching data only after mount, causing request waterfalls (route renders, then effect fires, then data arrives) | Assuming you must migrate the whole app at once — data routers can be adopted incrementally, route by route |

Use the classic `Routes`/`Route` API for simple apps or when data fetching is already centralized (e.g., via a data-fetching library like React Query). Use data routers when you want route-level data loading/error handling built into the routing layer itself.

### Client-side routing vs full page reload (traditional multi-page app)

| Aspect | Client-side routing (SPA) | Full page reload (MPA) |
|---|---|---|
| Perceived speed | Fast — only the changed portion of the DOM updates, no full document re-parse | Slower per navigation — full HTML/CSS/JS re-download and re-parse each time |
| State preservation | In-memory state (unrelated to the URL) survives navigation | All JS state is lost; must be re-derived from the server response or URL each time |
| Common mistake | Forgetting that direct URL entry / hard refresh / shared links must still work correctly server-side (or via a fallback), since the server needs to serve the SPA shell for any route | Assuming an MPA can't have fast navigation at all — modern MPAs can still feel snappy with proper caching |

Use client-side routing for app-like interactive experiences where state continuity across "pages" matters; plain server-rendered navigation is still reasonable for largely static, content-first sites.
