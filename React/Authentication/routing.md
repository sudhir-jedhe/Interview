### Common Routing Interview Questions & Answers (React & Node.js)

Routing interviews test your understanding of how navigation works on both the client side (React Router) and the server side (Express Router), including performance optimizations, security, and structural design.

---

### 1. React Router (Client-Side Routing) Questions

#### Q: What is the difference between Server-Side Routing and Client-Side Routing (CSR)?

- **Server-Side Routing:** Every time a user clicks a link or changes the URL, the browser sends a full HTTP request to the server. The server responds with a brand-new HTML document, causing a full page reload.
- **Client-Side Routing (CSR):** The browser loads a single HTML page once (Single Page Application). When a user clicks a link, JavaScript intercepts the event, prevents the full reload, updates the browser's URL using the HTML5 History API (`pushState`), and dynamically renders the matching React components on the page.

#### Q: How do Nested Routes and the `<Outlet/>` component work in React Router v6?

- **Answer:** Nested routes allow you to render child components inside a parent layout dynamically based on the URL path. The parent route acts as a shared layout (e.g., a dashboard shell with a sidebar), and `<Outlet/>` serves as a placeholder where the matched child route component will render.
- **Code Example:**

```jsx
import { Routes, Route, Outlet, Link } from "react-router-dom";

const DashboardLayout = () => (
  <div style={{ display: "flex" }}>
    <nav>
      <Link to="profile">Profile</Link>
      <Link to="settings">Settings</Link>
    </nav>
    {/* Outlet renders the active child route */}
    <main>
      <Outlet />
    </main>
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="profile" element={<h2>User Profile</h2>} />
        <Route path="settings" element={<h2>Settings Panel</h2>} />
      </Route>
    </Routes>
  );
}
```

#### Q: How do you implement route-based code splitting and lazy loading in a React application?

- **Answer:** To prevent bundling the entire application into a single massive JavaScript file, you use React's built-in `lazy()` function combined with `Suspense`. This tells the bundler to split code into separate chunks and load route components asynchronously only when the user navigates to that URL.
- **Code Example:**

```jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazily load components
const Home = lazy(() => import("./pages/Home"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

export default function App() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}
```

---

### 2. Node.js & Express Router (Server-Side Routing) Questions

#### Q: How do you modularize routes in an Express application using `express.Router()`?

- **Answer:** As an application grows, placing all routes in a single `server.js` file becomes unmaintainable. `express.Router()` allows you to create modular, mountable route handlers in separate files.
- **Code Example:**

```javascript
// routes/users.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Get all users" });
});

router.post("/", (req, res) => {
  res.json({ message: "Create user" });
});

module.exports = router;

// server.js
const express = require("express");
const app = express();
const userRoutes = require("./routes/users");

app.use("/api/users", userRoutes); // Mount router on path prefix
app.listen(3000);
```

#### Q: How do you handle 404 Not Found errors and global error handling correctly in an Express router pipeline?

- **Answer:** In Express, order matters. A 404 handler should be placed _after_ all valid route definitions but _before_ the global error-handling middleware.
- **Code Example:**

```javascript
const express = require("express");
const app = express();

app.get("/api/data", (req, res) => {
  res.json({ data: "success" });
});

// 1. Catch-all 404 Middleware (triggers if no prior route matched)
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// 2. Global Error Handling Middleware (must have 4 parameters: err, req, res, next)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
```

Here is a comprehensive master list of **50 advanced routing scenarios and interview questions** spanning both **React Router (Frontend)** and **Express Router (Node.js backend)**, designed for full-stack architecture interviews.

---

### Category 1: React Router Advanced Navigation & State Control

1. **Route Transition Animations:** How do you implement exit and entry animations between pages using React Router and `framer-motion`?
2. **Scroll Restoration:** When navigating back to a long list view, how do you prevent React Router from resetting the scroll position to top?
3. **Query Parameter State Sync:** How do you bind complex filter arrays and pagination objects directly to URL search parameters using `useSearchParams`?
4. **Programmatic Navigation Hooks:** What is the structural difference between executing `useNavigate()` inside a React component vs. performing an imperative redirect outside the React tree?
5. **Catch-All and Splat Routes:** How do you configure a glob/splat route (`/*`) to capture multi-level nested dynamic path segments for a CMS page builder?
6. **Relative Path Linking:** How does relative path navigation work when using `Link to=".."` inside nested child routes?
7. **Multiple Router Instances:** When would you use a `MemoryRouter` instead of a `BrowserRouter` (e.g., testing or multi-window architecture)?
8. **Preventing Accidental Navigation:** How do you warn users about unsaved form data using React Router's `useBlocker` or `usePrompt` hooks?
9. **Index Routes:** What is the precise function of an `index` route property inside a parent layout route container?
10. **Trailing Slash Normalization:** How do you handle canonical SEO redirect rules in React Router when a user visits `/dashboard/` versus `/dashboard`?
11. **HashRouter vs BrowserRouter for SEO:** Why is `HashRouter` detrimental to server-side rendering and search engine indexing?
12. **Route-Level Data Loading:** How do modern patterns like React Router v6.4+ `loader` functions replace traditional `useEffect` data-fetching waterfalls?
13. **Action Submissions:** How do you handle form mutations and data validation actions natively through React Router loaders and actions?
14. **Pending Navigation Indicators:** How do you display a global top-loading progress bar (like Next.js router events) during asynchronous React Router transitions?
15. **Deep Link State Preservation:** How do you pass hidden state objects via `navigate(path, { state })` without cluttering the visible URL string?

---

### Category 2: React Router Performance, Code Splitting & Architecture

16. **Granular Bundle Splitting:** How do you architect route chunks so that shared layout code isn't duplicated across dynamic sub-routes?
17. **Prefetching Route Chunks:** How can you trigger programmatic prefetching of code-split route chunks on mouse hover over a navigation link?
18. **ErrorBoundary Sub-tree Isolation:** How do you configure React Router error elements so a failure in a single nested widget doesn't crash the entire application layout?
19. **Micro-Frontend Routing Conflicts:** How do you prevent host-app and remote-app path collision when mounting independent routers via Module Federation?
20. **Memory Leak Abort Signals:** How do you tie React Router's request `signal` to Axios/Fetch calls inside loaders to cancel stale background queries on rapid navigation?
21. **Server-Side Rendering (SSR) Hydration:** How do you pass static context down from a Node/Express SSR renderer to match client-side React hydration routes?
22. **Dynamic Route Registration:** Can you dynamically inject new route definitions into an active React Router tree at runtime? (And how to approach module plugin systems instead).
23. **Base URL Configuration:** How do you deploy a React Router app successfully to a subdirectory (e.g., `[domain.com/app/](https://domain.com/app/)`) using `basename`?
24. **Path-to-RegExp Custom Matchers:** How do you write advanced custom constraint matchers for parameters (e.g., ensuring an ID route parameter matches only valid UUIDv4 patterns)?
25. **Concurrent Mode Transitions:** How do React 18 transition APIs interact with route switches to keep user input responsive during heavy rendering?

---

### Category 3: Express Router Advanced Middleware & Execution Pipelines

26. **Route Parameter Pre-conditions (`router.param`):** How do you use `router.param()` middleware to automatically fetch a database document whenever a specific route parameter (like `:id`) appears?
27. **Async Route Error Handlers in Express 4 vs 5:** Why do async/await route functions throw unhandled rejections in Express 4, and how does Express 5 natively fix this?
28. **Skipping Route Stacks (`next('route')`):** How do you bypass remaining handlers in a single route block and jump directly to the next matching route definition using `next('route')`?
29. **Sub-App Mount Path Discovery (`req.baseUrl`):** When mounting modular routers using `app.use('/api/v1', subRouter)`, how do you inspect the parent mount prefix inside the child handler?
30. **Strict Routing and Case Sensitivity:** How do you configure Express router settings (`case sensitive routing`, `strict routing`) to treat `/Users` and `/users` as distinct endpoints?
31. **Complex Regex Route Matching:** How do you build an Express route path using regular expression patterns to match localized multi-language URL paths?
32. **Method-Specific Middleware Ordering:** How do you attach middleware exclusively to `POST` and `PUT` methods without affecting `GET` requests on the same path?
33. **Request Body Parsing Scope:** How do you restrict heavy JSON body parsers (`express.json()`) from running on public webhook endpoints that require raw request buffers (like Stripe webhooks)?
34. **Route-Level Rate Limiting Granularity:** How do you apply distinct rate-limiting thresholds dynamically based on the matched route segment size or sensitivity?
35. **Response Header Pollution Security:** How do Express routers handle duplicate query keys, and how do you protect against query parameter pollution (HPP) attacks?

---

### Category 4: Express Router Microservices, Scaling & Security

36. **API Versioning Strategies:** What are the trade-offs between URL path versioning (`/api/v1/`), header versioning (`Accept: application/vnd.app.v1+json`), and query parameter versioning in Express?
37. **Proxy Trust Configurations (`app.set('trust proxy', true)`):** Why is configuring `trust proxy` essential when your Express API sits behind an Nginx load balancer or Cloudflare CDN for correct routing/IP logging?
38. **Graceful Shutdown Routing Drain:** When an Express server receives a `SIGTERM` signal, how do you stop accepting new router connections while allowing active requests to finish?
39. **Internal API Gateway Routing:** How do you design an Express-based API gateway router that dynamically proxies requests to downstream microservices using `http-proxy-middleware`?
40. **CORS Preflight Route Optimization:** Why do `OPTIONS` preflight requests hit Express routers, and how do you optimize CORS middleware placement to prevent unnecessary controller executions?
41. **Response Time Monitoring Middleware:** How do you write custom router-level instrumentation middleware to log execution duration metrics for slow endpoint identification?
42. **File Streaming Route Architecture:** How do you route large file downloads using Node streams (`fs.createReadStream`) without exhausting server RAM?
43. **Trailing Slash Redirection Loops:** How do you prevent infinite redirect loops when Express static file routers interact with custom trailing-slash rules?
44. **Dynamic Controller Loading:** How do you auto-load routes dynamically by reading the file system directory structure (file-based routing similar to Next.js) in a custom Express setup?
45. **Multi-Tenant Subdomain Routing:** How do you extract wildcard subdomains (`*.tenant.com`) using Express routing parameters to dynamically database-switch per tenant?
46. **Route-Based Content Negotiation:** How do you use `req.accepts()` inside an Express router to serve JSON, XML, or HTML views from a single URI endpoint?
47. **Preventing ReDoS (Regular Expression Denial of Service):** How can maliciously crafted URL parameters crash an Express path-to-regexp parser, and how do you write safe paths?
48. **Memory Leakage via Unclosed Route Handlers:** What happens to Express request-response lifecycles if a route handler forgets to send a response or call `next()`, and how do you catch hanging sockets?
49. **Global vs Local Error Middleware Separation:** How do you structure router-specific error catchers that format errors differently than the global API error handler?
50. **Testing Express Routers Independently:** How do you unit test an isolated `express.Router()` module using `supertest` without spinning up the entire root server instance?

### Category 1: React Router Advanced Navigation & State Control

#### 1. Route Transition Animations (`framer-motion`)

```jsx
import { motion } from "framer-motion";
const AnimatedPage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <h1>Page Content</h1>
  </motion.div>
);
```

#### 2. Scroll Restoration

```jsx
import { ScrollRestoration } from "react-router-dom";
export default function App() {
  return (
    <>
      <Routes>...</Routes>
      <ScrollRestoration />
    </>
  );
}
```

#### 3. Query Parameter State Sync

```jsx
import { useSearchParams } from "react-router-dom";
const FilterComponent = () => {
  const [params, setParams] = useSearchParams();
  return <button onClick={() => setParams({ sort: "asc" })}>Sort</button>;
};
```

#### 4. Programmatic Navigation Hooks

```jsx
import { useNavigate } from "react-router-dom";
const SubmitButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/success", { replace: true })}>
      Submit
    </button>
  );
};
```

#### 5. Catch-All and Splat Routes

```jsx
<Routes>
  <Route path="/docs/*" element={<DocViewer />} />
</Routes>
```

#### 6. Relative Path Linking

```jsx
import { Link } from "react-router-dom";
const ChildComponent = () => <Link to="..">Back to Parent</Link>;
```

#### 7. Multiple Router Instances (Testing)

```jsx
import { MemoryRouter } from "react-router-dom";
const TestWrapper = () => (
  <MemoryRouter initialEntries={["/dashboard"]}>
    <App />
  </MemoryRouter>
);
```

#### 8. Preventing Accidental Navigation (`useBlocker`)

```jsx
import { useBlocker } from "react-router-dom";
const Form = () => {
  const [isDirty, setIsDirty] = useState(true);
  useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );
};
```

#### 9. Index Routes

```jsx
<Route path="dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
</Route>
```

#### 10. Trailing Slash Normalization

```jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const NormalizeSlash = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname.endsWith("/") && pathname !== "/")
      navigate(pathname.slice(0, -1), { replace: true });
  }, [pathname]);
};
```

#### 11. HashRouter vs BrowserRouter

```jsx
import { HashRouter, Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
```

#### 12. Route-Level Data Loading

```jsx
const router = createBrowserRouter([
  { path: "/user", element: <User />, loader: async () => fetch("/api/user") },
]);
```

#### 13. Action Submissions

```jsx
const router = createBrowserRouter([
  {
    path: "/edit",
    element: <Edit />,
    action: async ({ request }) => {
      const fd = await request.formData();
      return updateData(fd);
    },
  },
]);
```

#### 14. Pending Navigation Indicators

```jsx
import { useNavigation } from "react-router-dom";
const GlobalLoader = () => {
  const navigation = useNavigation();
  return navigation.state === "loading" ? <ProgressBar /> : null;
};
```

#### 15. Deep Link State Preservation

```jsx
navigate("/details", { state: { secretKey: "xyz" } });
// Retrieval: const { state } = useLocation();
```

---

### Category 2: React Router Performance, Code Splitting & Architecture

#### 16. Granular Bundle Splitting

```jsx
const HeavyDashboard = lazy(() => import("./HeavyDashboard"));
// Wrapped inside Suspense at route boundary
```

#### 17. Prefetching Route Chunks

```jsx
<Link to="/settings" onMouseEnter={() => import("./Settings")}>
  Settings
</Link>
```

#### 18. ErrorBoundary Sub-tree Isolation

```jsx
<Route path="/widget" element={<Widget />} errorElement={<WidgetError />} />
```

#### 19. Micro-Frontend Routing Conflicts

```jsx
<Routes>
  <Route path="/remote-app/*" element={<RemoteMicroApp />} />
</Routes>
```

#### 20. Memory Leak Abort Signals

```jsx
const loader = async ({ request }) =>
  fetch("/api/data", { signal: request.signal });
```

#### 21. Server-Side Rendering (SSR) Hydration

```jsx
import { hydrateRoot } from "react-dom/client";
hydrateRoot(
  document.getElementById("root"),
  <StaticRouterProvider router={router} context={context} />,
);
```

#### 22. Dynamic Route Registration

```jsx
// Use patchRoutes option in modern createBrowserRouter architectures
router.patchRoutes(parentRouteId, newRoutesArray);
```

#### 23. Base URL Configuration

```jsx
<BrowserRouter basename="/my-app">

```

#### 24. Path-to-RegExp Custom Matchers

```jsx
<Route path="/user/:id([0-9a-f]{8}-[0-9a-f]{4})">

```

#### 25. Concurrent Mode Transitions

```jsx
import { startTransition } from "react";
startTransition(() => navigate("/next-page"));
```

---

### Category 3: Express Router Advanced Middleware & Execution Pipelines

#### 26. Route Parameter Pre-conditions (`router.param`)

```javascript
router.param("id", async (req, res, next, id) => {
  req.user = await User.findById(id);
  next();
});
```

#### 27. Async Route Error Handlers in Express 5

```javascript
// Express 5 natively catches unhandled rejections in async functions
router.get("/data", async (req, res) => {
  throw new Error("Fail");
});
```

#### 28. Skipping Route Stacks (`next('route')`)

```javascript
router.get(
  "/check",
  (req, res, next) => {
    if (req.query.skip) return next("route");
    res.send("Default");
  },
  (req, res) => {
    res.send("Fallback");
  },
);
```

#### 29. Sub-App Mount Path Discovery (`req.baseUrl`)

```javascript
const subRouter = express.Router();
subRouter.get("/", (req, res) => res.send(req.baseUrl)); // Outputs /api/v1
app.use("/api/v1", subRouter);
```

#### 30. Strict Routing and Case Sensitivity

```javascript
const router = express.Router({ caseSensitive: true, strict: true });
```

#### 31. Complex Regex Route Matching

```javascript
router.get(/^\/items\/([a-zA-Z]+)\/(\d+)$/, (req, res) => {
  res.json(req.params);
});
```

#### 32. Method-Specific Middleware Ordering

```javascript
router.route("/resource").all(authMiddleware).get(getCtrl).post(postCtrl);
```

#### 33. Request Body Parsing Scope (Webhook Buffer)

```javascript
app.post("/webhook", express.raw({ type: "application/json" }), webhookHandler);
```

#### 34. Route-Level Rate Limiting Granularity

```javascript
const strictLimiter = rateLimit({ windowMs: 60000, max: 5 });
router.post("/login", strictLimiter, loginController);
```

#### 35. Response Header Pollution Security (`hpp`)

```javascript
const hpp = require("hpp");
app.use(hpp());
```

---

### Category 4: Express Router Microservices, Scaling & Security

#### 36. API Versioning Strategies

```javascript
app.use("/api/v1", require("./routes/v1"));
app.use("/api/v2", require("./routes/v2"));
```

#### 37. Proxy Trust Configurations

```javascript
app.set("trust proxy", true); // Correct client IP behind Nginx/Cloudflare
```

#### 38. Graceful Shutdown Routing Drain

```javascript
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
```

#### 39. Internal API Gateway Routing (`http-proxy-middleware`)

```javascript
const { createProxyMiddleware } = require("http-proxy-middleware");
app.use(
  "/service-b",
  createProxyMiddleware({ target: "http://localhost:4001" }),
);
```

#### 40. CORS Preflight Route Optimization

```javascript
const cors = require("cors");
app.use(cors({ origin: "https://domain.com" })); // Place before routes
```

#### 41. Response Time Monitoring Middleware

```javascript
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () =>
    console.log(`${req.method} ${req.url} - ${Date.now() - start}ms`),
  );
  next();
});
```

#### 42. File Streaming Route Architecture

```javascript
const fs = require("fs");
router.get("/download", (req, res) => {
  fs.createReadStream("./large-file.zip").pipe(res);
});
```

#### 43. Trailing Slash Redirection Loops

```javascript
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith("/")) {
    return res.redirect(301, req.path.slice(0, -1));
  }
  next();
});
```

#### 44. Dynamic Controller Loading (File-System Routing)

```javascript
fs.readdirSync("./routes").forEach((file) => {
  app.use("/api", require(`./routes/${file}`));
});
```

#### 45. Multi-Tenant Subdomain Routing

```javascript
app.use((req, res, next) => {
  const subdomain = req.headers.host.split(".")[0];
  req.tenant = subdomain;
  next();
});
```

#### 46. Route-Level Content Negotiation

```javascript
router.get("/data", (req, res) => {
  res.format({
    json: () => res.json({ status: "ok" }),
    html: () => res.send("<h1>OK</h1>"),
  });
});
```

#### 47. Preventing ReDoS (Regular Expression Denial of Service)

```javascript
// Avoid user-supplied raw strings in RegExp path patterns; use built-in Express path strings.
router.get("/user/:username", (req, res) => res.send(req.params.username));
```

#### 48. Memory Leakage via Unclosed Route Handlers

```javascript
router.get("/safe", (req, res, next) => {
  if (!res.headersSent) res.json({ success: true });
});
```

#### 49. Global vs Local Error Middleware Separation

```javascript
router.use((err, req, res, next) => {
  res.status(400).json({ customRouterError: err.message });
});
```

#### 50. Testing Express Routers Independently (`supertest`)

```javascript
const request = require("supertest");
const app = express();
app.use("/test", require("./myRouter"));
test("GET /test", async () => {
  await request(app).get("/test").expect(200);
});
```
