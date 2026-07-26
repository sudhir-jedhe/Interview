Implementing and managing **authorization** across a React (frontend) and Node.js (backend) stack is a favorite topic in full-stack interviews. Interviewers want to ensure you understand that frontend security is just for UX, while backend security is where actual authorization enforcement happens.

Here are the most common React + Node.js authorization interview questions, broken down by category, along with concise answers.

---

### 1. Conceptual Questions

#### Q: What is the difference between Authentication and Authorization?

- **Authentication** verifies _who_ the user is (e.g., logging in with email and password).
- **Authorization** verifies _what_ the user is allowed to do or access (e.g., whether an authenticated user has "admin" privileges to delete a resource).

#### Q: Why is frontend authorization (in React) alone insufficient?

- React runs entirely on the client side (in the user's browser). Anyone can inspect code, modify state, or bypass UI elements (like hidden buttons or routes). Therefore, frontend authorization is strictly for **User Experience (UX)**. Real security and authorization **must always be enforced on the Node.js backend** by validating tokens and checking roles/permissions for every incoming API request.

---

### 2. Node.js (Backend) Authorization Questions

#### Q: How do you implement Role-Based Access Control (RBAC) in a Node.js/Express API?

- **Answer Structure:**

1. Store user roles (e.g., `['admin', 'editor', 'user']`) in the database.
2. Upon login, issue a **JWT (JSON Web Token)** containing the user's ID and roles/permissions in its payload.
3. Create an Express middleware function to verify the JWT and extract the user info.
4. Create a higher-order middleware (e.g., `checkRole(['admin'])`) that inspects the user's role before letting them hit the controller.

- **Code Example:**

```javascript
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // req.user is populated by your previous auth JWT middleware
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access Denied: Insufficient permissions" });
    }
    next();
  };
};

// Usage in routes
app.delete(
  "/api/posts/:id",
  verifyJWT,
  checkRole(["admin", "editor"]),
  deletePostController,
);
```

#### Q: Where should you store JWTs on the client side, and what are the security trade-offs?

- **Local Storage / Session Storage:** Easy to implement in React, but vulnerable to **XSS (Cross-Site Scripting)** attacks because any malicious script running on the page can access `localStorage.getItem('token')`.
- **HttpOnly Cookies:** The most secure approach. The Node.js backend sets the cookie with `httpOnly: true`, `secure: true`, and `sameSite: 'strict'`. JavaScript cannot read it, making it immune to XSS. However, you must explicitly handle **CSRF (Cross-Site Request Forgery)** protection if using cookies.

---

### 3. React (Frontend) Authorization Questions

#### Q: How do you implement Protected Routes in a React app (e.g., using React Router)?

- **Answer:** Create a wrapper component (often called `ProtectedRoute` or `RequireAuth`) that checks if the user is authenticated and possesses the required role. If they do, render the `<Outlet/>` or children components; if not, redirect them to a `/login` or `/unauthorized` page.
- **Code Example:**

```jsx
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // Or pulled from a React Context/Redux store

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

// Usage with React Router v6
// <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
//   <Route path="/admin" element={<AdminDashboard />} />
// </Route>
```

#### Q: How do you conditionally render UI components based on user roles or permissions in React?

- **Answer:** You can use conditional rendering (`&&`, ternary operators) or build a custom reusable `Can` or `Authorize` component driven by a global state provider (like React Context).
- **Example using React Context:**

```jsx
const AdminButton = () => {
  const { user } = useAuth(); // Custom hook accessing AuthContext

  if (!user || user.role !== "admin") {
    return null; // Hide element safely on UI
  }

  return <button onClick={deleteDatabase}>Delete System</button>;
};
```

---

### 4. Scenario-Based / System Design Questions

#### Q: Walk me through the end-to-end flow when a user with specific roles tries to access a restricted resource.

1. **Login:** User submits credentials via the React form to the Node.js API.
2. **Authentication:** Node verifies credentials, embeds user data/roles into a JWT, and sends it back (either in JSON body to store or via an HttpOnly cookie).
3. **Frontend State:** React stores the auth state (using Context, Redux, or Zustand).
4. **Navigation/UI:** React router checks `ProtectedRoute` before displaying the page layout. If authorized, components render.
5. **API Request:** When the React app makes an API request (e.g., `axios.get('/api/admin/users')`), it attaches the token (via headers or automatic cookie inclusion with `withCredentials: true`).
6. **Backend Enforcement:** Node.js runs the auth middleware (decodes/verifies token) followed by the RBAC middleware (checks if role is permitted). If valid, it returns data; otherwise, it responds with `401 Unauthorized` or `403 Forbidden`.

### Scenario-Based Interview Questions: RBAC in React & Node.js

---

### Scenario 1: Multi-Tenant Hierarchical RBAC (Inherited Permissions)

> **The Scenario:**
> You are building a project management tool. An organization has a hierarchy of roles: `Admin` > `Manager` > `Contributor` > `Viewer`.
>
> - An `Admin` can do everything.
> - A `Manager` can perform `Contributor` actions plus manage team members.
> - A `Contributor` can create and edit tasks, but cannot delete projects.
> - A `Viewer` has read-only access.
>
> **The Problem:** Hardcoding arrays like `['admin', 'manager']` everywhere on your Node.js routes becomes unmaintainable as permissions grow. **How would you design a scalable role/permission architecture for this?**

#### Suggested Answer & Implementation Strategy

1. **Shift from Roles to Permissions (Granular ACL):** Instead of checking hardcoded roles in your backend middleware, map roles to specific _granular permissions_ (e.g., `task:create`, `task:delete`, `project:manage`).
2. **Backend Storage & Inheritance:** Store a mapping in your database or configuration file:

```javascript
const rolePermissions = {
  viewer: ["task:read", "project:read"],
  contributor: ["task:read", "task:create", "task:update", "project:read"],
  manager: [
    "task:read",
    "task:create",
    "task:update",
    "task:delete",
    "user:invite",
  ],
  admin: ["*"], // wildcard for all permissions
};
```

3. **Node.js Permission Middleware:** Write a middleware that checks if the user's role contains the required permission (handling the wildcard `*` case):

```javascript
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // e.g., 'manager'
    const permissions = rolePermissions[userRole] || [];

    if (permissions.includes("*") || permissions.includes(requiredPermission)) {
      return next();
    }
    return res.status(403).json({ message: "Forbidden: Missing permission" });
  };
};

// Usage
app.post(
  "/api/tasks",
  verifyJWT,
  checkPermission("task:create"),
  createTaskController,
);
```

---

### Scenario 2: Object-Level Authorization (Resource Ownership)

> **The Scenario:**
> A user with the role `Contributor` can edit tasks. However, a contributor should **only** be able to edit tasks that _they created_ or tasks assigned to their specific team. Another contributor from a different team should get a `403 Forbidden` if they try to modify it, even though they share the exact same role.
> **The Problem:** Role-based middleware alone (`checkRole(['contributor'])`) isn't enough because it only checks _who_ the user is, not _what_ resource they are trying to touch. **How do you implement resource-level (or row-level) authorization in Node.js?**

#### Suggested Answer & Implementation Strategy

1. **Database Query Filtering (Frontend/API level):** Ensure your database queries automatically scope data to the current user's team or ID if they aren't an admin.
2. **Controller/Service-Level Guard:** In your Node.js route controller, fetch the resource _first_, then compare its metadata (`ownerId` or `teamId`) against `req.user.id` or `req.user.teamId`.

```javascript
const updateTaskController = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user is an admin OR the owner of the task
    const isAdmin = req.user.role === "admin";
    const isOwner = task.ownerId.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "You do not have permission to edit this task" });
    }

    // Proceed with update
    task.title = req.body.title;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

### Scenario 3: Real-Time Role Changes & State Synchronization in React

> **The Scenario:**
> An administrator changes a user's role from `Viewer` to `Manager` via the admin dashboard while that user is currently active in another browser tab.
> **The Problem:** The user's React app is still running with the old JWT stored in memory/localStorage or state, meaning their UI still restricts them, and their active token lacks the new permissions. **How do you handle real-time privilege elevation or revocation without forcing the user to manually log out and log back in?**

#### Suggested Answer & Implementation Strategy

1. **Token Expiration & Refresh Flow (Short-lived Access Tokens):**

- Issue short-lived Access Tokens (e.g., 15 minutes) and long-lived Refresh Tokens (HttpOnly cookies).
- When the access token expires, the client requests a new one. The Node.js backend fetches the _current_ user state from the database during token refresh, embedding the updated role into the new access token.

2. **WebSocket / SSE (Server-Sent Events) for Instant Update:**

- If instant UI updates are required, establish a lightweight WebSocket connection (or SSE channel).
- When a role changes on the backend, push a `{ type: 'ROLE_UPDATE' }` event to the specific client.
- Upon receiving this event, the React application triggers a silent API call to fetch the updated user profile/permissions and updates the global React Context state dynamically.

```javascript
// React side snippet handling a real-time role refresh event
useEffect(() => {
  socket.on("permissions_updated", async () => {
    // Fetch latest user info and permissions from backend
    const updatedUser = await fetchUserProfile();
    setUser(updatedUser); // Update React Context state instantly
  });
}, []);
```

Navigating full-stack authorization interviews requires mastering complex architectural edges, security vulnerabilities, and state synchronization challenges between React and Node.js.

The following catalog contains **54 advanced, scenario-based interview questions** categorized by technical domain.

---

### Category 1: Frontend Routing & UI Navigation Scenarios (React)

1. **The Stale Route Cache:** A user's role is downgraded from Admin to User, but client-side React Router still has the admin bundle/routes cached. How do you prevent unauthorized component rendering?
2. **Deep-Link Bypass:** A user types `/admin/settings` directly into the URL bar. How does your React Router `ProtectedRoute` intercept this before any layout flashes?
3. **Async Route Permissions:** User permissions must be fetched asynchronously from an API on app boot before routes can render. How do you handle the loading state in the router wrapper without a jarring white screen?
4. **Dynamic Sidebar Navigation:** You need to render a sidebar menu where items dynamically appear or disappear based on granular permissions fetched from the backend. How do you structure this cleanly?
5. **Nested Route Protection:** A parent route is public, but a nested child route requires an `editor` role. How do you configure React Router outlets to handle nested security checks?
6. **Concurrent Navigation Canceling:** A user clicks a restricted link, triggering an async permission check. Before it finishes, they click a public link. How do you abort the stale authorization check?
7. **Browser Back-Button Exploits:** After logging out, clicking the browser's "Back" button shows cached React component views. How do you invalidate or clear history state securely?
8. **Multi-Step Wizard Authorization:** A user is filling out a multi-step form where Step 3 requires a supervisor sign-off. How do you lock down step transitions in React state?
9. **Micro-Frontend Authorization:** Your React app is a host container loading remote micro-frontends (Module Federation). How do you pass authorization context down to untrusted remote modules?
10. **Tab-Switch Authorization Sync:** A user opens your React app in two tabs, logs out in Tab A, and Tab B attempts a protected mutation. How do you handle the resulting 401 gracefully across tabs?

---

### Category 2: State Management & Context Synchronization

11. **Context Prop Drilling vs Global Stores:** When using React Context for authorization, frequent permission updates cause unnecessary re-renders of the entire component tree. How do you optimize this using Zustand or Redux Toolkit?
12. **The "Flash of Unauthorized Content" (FOUC):** On initial page load, React renders restricted buttons for a split second before the auth state resolves to `false`. How do you eliminate this visual glitch?
13. **Local State Tampering:** A clever user opens React DevTools, modifies the local state variable `isAdmin: true`, and unlocks UI buttons. How do you ensure this has zero impact on actual data security?
14. **Optimistic UI Updates with Permissions:** An optimistic update allows a user to delete a post instantly, but the backend rejects it with a `403 Forbidden`. How do you roll back the React state safely?
15. **Offline Mode Authorization:** Your React PWA works offline. How do you evaluate whether a user can perform an action while disconnected from the Node.js backend?
16. **Shared Device State Leak:** A user logs out on a shared public terminal, but stale user profile data remains in persistent browser storage. How do you execute a complete data purge on logout?
17. **Multi-Role User Switching:** A user has multiple accounts/roles (e.g., Merchant vs Customer) under a single login. How do you manage active role switching in React state without full page reloads?
18. **Third-Party OAuth State Mismatch:** A user logs in via Google OAuth, but the client-side state mapper fails to map external scopes to internal application roles. How do you gracefully handle mapping errors?

---

### Category 3: Token Management, Storage & Lifecycle

19. **XSS vs CSRF Trade-offs:** An interviewer asks why you chose `HttpOnly` cookies over `localStorage` for JWT storage. How do you defend against XSS while explaining CSRF mitigation strategies?
20. **Silent Token Refresh Race Condition:** Multiple concurrent API requests fail with `401 Token Expired` simultaneously, triggering multiple refresh token requests to Node.js. How do you queue or deduplicate them?
21. **JWT Payload Bloat:** The backend embeds 50 different permissions directly inside the JWT payload, making the cookie header size massive and causing HTTP 431 errors. How do you refactor this?
22. **Token Revocation Blacklisting:** A user's account is compromised, and you need to instantly invalidate their JWT before its 1-hour expiration time. How do you implement a token blacklist in Node.js (e.g., using Redis)?
23. **Cross-Subdomain Authentication:** Your React frontend is on `app.domain.com` and your Node API is on `api.domain.com`. How do you configure cookie domains and attributes securely?
24. **JWT Secret Rotation:** You need to rotate the private signing key on your Node.js server without logging out all active users globally. How do you design a multi-key validation strategy?
25. **Decoupled Mobile App Support:** Your Node.js backend now needs to support a React Native mobile app alongside the web app. How does your token storage and handling strategy adapt?
26. **Clock Skew Issues:** Servers across a distributed Node.js cluster have minor time differences (clock skew), causing JWT `exp` (expiration) validation errors. How do you handle this?
27. **Session Hijacking Detection:** An attacker steals a user's valid JWT cookie and uses it from a different IP address and User-Agent. How do you detect and block this anomaly in Node.js?
28. **Immediate Logout Propagation:** A user clicks "Logout on all devices." How does the Node.js backend invalidate active sessions across distributed clusters?

---

### Category 4: Node.js Backend & Middleware Enforcement

29. **Middleware Execution Order Bug:** A developer places the authorization middleware _before_ the authentication (`verifyJWT`) middleware in Express, causing a crash because `req.user` is undefined. How do you catch and structure middleware pipelines correctly?
30. **Granular ACL Middleware Generator:** You need an Express middleware factory that accepts a dynamic list of permissions (e.g., `checkPermission('reports:export')`). How do you write a clean higher-order middleware function?
31. **Wildcard Permission Logic:** Your system supports hierarchical wildcard permissions like `reports:*` or `*`. How do you write an efficient permission-matching algorithm in Node.js?
32. **Rate Limiting by Role:** You want to apply stricter API rate limits to free-tier users compared to enterprise-tier admins. How do you implement dynamic rate-limiting middleware in Express based on `req.user.tier`?
33. **API Versioning and Breaking Auth Changes:** You are releasing v2 of your API with a completely new role structure. How do you handle backward compatibility for legacy v1 tokens?
34. **Internal Service-to-Service Authorization:** Your React app talks to Node.js Gateway A, which talks to internal microservice Node.js B. How do you propagate authorization context safely between internal services without trusting raw headers?
35. **Database Connection Pooling Exhaustion via Auth Queries:** Every single API request hits the database to re-verify user roles. How do you optimize this using caching layers like Redis?
36. **Handling Malformed or Tampered JWTs:** An attacker sends a JWT with a modified payload but an invalid signature. How does your Node.js verification layer handle the cryptographic failure without throwing unhandled exceptions?
37. **GraphQL Authorization Complexity:** Instead of REST endpoints, your Node.js backend uses GraphQL. How do you handle field-level and resolver-level authorization efficiently without falling into the N+1 query problem?
38. **Webhooks and Third-Party API Security:** Your Node.js server receives incoming webhooks from Stripe or GitHub. How do you authenticate and authorize webhook payloads instead of using user JWTs?

---

### Category 5: Object-Level & Row-Level Security (RLS)

39. **Multi-Tenant Data Isolation:** A user belongs to Tenant A. They craft an API request modifying an ID belonging to Tenant B. How do you enforce strict tenant isolation in your Node.js database queries (MongoDB/PostgreSQL)?
40. **Hierarchical Resource Ownership:** A user can edit a document if they own it, _or_ if they are an admin of the team that owns the document, _or_ if the document has public editing flags enabled. How do you structure this complex business logic cleanly?
41. **Partial Field-Level Authorization:** An API endpoint returns a user profile. Regular users can see `name` and `email`, but only admins can see `salary` and `ssn`. How do you filter response payloads securely in Node.js?
42. **Shared Resource Collaborators:** A file belongs to User X, but User Y has been explicitly added as a "Collaborator" via a join table. How do you write a reusable middleware or service guard to verify collaborator access?
43. **Soft-Deleted Resource Access:** A resource is soft-deleted (`isDeleted: true`). A regular user tries to access its ID. Should the API return `404 Not Found` or `403 Forbidden` to prevent information disclosure?
44. **Cascading Permissions on Deletion:** An admin deletes a project containing 500 tasks. How do you ensure authorization checks evaluate whether the user can delete _all_ child resources before executing a cascade?
45. **Conditional Write Validation:** A user updates a task status from "In Progress" to "Completed", but only managers are allowed to make that specific status transition. How do you validate state-transition rules in your backend service?
46. **Bulk Operations Authorization:** A React app sends an array of 50 IDs to delete in a single batch request. Some IDs belong to the user, others do not. How do you process partial successes or enforce all-or-nothing security rules in Node.js?

---

### Category 6: Advanced Edge Cases & Security Exploits

47. **Mass Assignment / Over-Posting Vulnerability:** A user sends an extra payload field `{ role: 'admin' }` during a profile update request in React, and your Mongoose/Sequelize model blindly saves it. How do you prevent privilege escalation via request body sanitization?
48. **Insecure Direct Object References (IDOR):** An attacker guesses sequential integer IDs (`/api/users/1001`, `/api/users/1002`) to view private data. How do you implement robust UUID/slug obfuscation or ownership checks to stop IDOR?
49. **Timing Attacks on Token/API Keys:** An attacker measures the exact response time of your Node.js authentication check to figure out valid user tokens or API keys. How do you implement constant-time comparison functions?
50. **CSRF Vulnerabilities with Cookie-Based JWTs:** If your Node.js API uses `HttpOnly` cookies, a malicious external site tricks the user's browser into making an authenticated request. How do you implement Anti-CSRF tokens or `SameSite` configurations?
51. **CORS Misconfigurations:** Your Node.js backend specifies `Access-Control-Allow-Origin: *` while accepting credentialed cookies. Why does this break browser security, and how do you lock it down?
52. **Denial of Service (DoS) via Heavy Auth Middleware:** An attacker floods your Node.js server with invalid JWTs, forcing expensive cryptographic verification loops that spike CPU usage. How do you mitigate this?
53. **Session Fixation Attacks:** An attacker forces a victim to log in with a session identifier chosen by the attacker. How do you ensure session ID regeneration happens successfully upon authentication in Node.js?
54. **Privilege Creep Audit Trails:** Compliance requires tracking _who_ authorized a privilege elevation and _when_. How do you design an immutable audit logging pipeline in Node.js for administrative actions?

Providing code implementations for all **54 scenarios** requires structured, highly concentrated snippets. Below are concise, production-ready code examples mapping directly to each scenario from the previous catalog.

---

### Category 1: Frontend Routing & UI Navigation Scenarios (React)

#### 1. The Stale Route Cache

```jsx
// Force route validation check on location change
const ProtectedRoute = ({ role }) => {
  const { currentRole } = useAuth();
  return currentRole === role ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};
```

#### 2. Deep-Link Bypass

```jsx
// Intercepting deep links before layout renders
const AppRouter = () => (
  <Routes>
    <Route element={<ProtectedRoute requiredRole="admin" />}>
      <Route path="/admin/settings" element={<AdminSettings />} />
    </Route>
  </Routes>
);
```

#### 3. Async Route Permissions

```jsx
const AsyncProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return user ? <Outlet /> : <Navigate to="/login" />;
};
```

#### 4. Dynamic Sidebar Navigation

```jsx
const Sidebar = ({ permissions }) => {
  const navItems = [
    { label: "Reports", path: "/reports", perm: "reports:read" },
  ].filter((item) => permissions.includes(item.perm));
  return navItems.map((i) => (
    <NavLink key={i.path} to={i.path}>
      {i.label}
    </NavLink>
  ));
};
```

#### 5. Nested Route Protection

```jsx
<Route path="dashboard" element={<DashboardLayout />}>
  <Route element={<RequireRole role="editor" />}>
    <Route path="edit" element={<EditorPanel />} />
  </Route>
</Route>
```

#### 6. Concurrent Navigation Canceling

```jsx
// Using AbortController for stale permission checks
useEffect(() => {
  const controller = new AbortController();
  fetchPermissions({ signal: controller.signal }).catch(() => {});
  return () => controller.abort();
}, [location]);
```

#### 7. Browser Back-Button Exploits

```javascript
// Clear session flags and replace history stack on logout
const handleLogout = () => {
  localStorage.clear();
  window.location.replace("/login");
};
```

#### 8. Multi-Step Wizard Authorization

```jsx
const WizardStep3 = () => {
  const { hasPermission } = useAuth();
  if (!hasPermission("supervisor:signoff"))
    return <Navigate to="/wizard/step2" />;
  return <SupervisorApprovalForm />;
};
```

#### 9. Micro-Frontend Authorization

```jsx
// Passing context down to Module Federation remotes
<RemoteApp userPermissions={user.permissions} />
```

#### 10. Tab-Switch Authorization Sync

```javascript
// Listen to storage events to catch cross-tab logouts
window.addEventListener("storage", (event) => {
  if (event.key === "logout") window.location.href = "/login";
});
```

---

### Category 2: State Management & Context Synchronization

#### 11. Context Prop Drilling vs Global Stores (Zustand)

```javascript
import { create } from "zustand";
const useAuthStore = create((set) => ({
  permissions: [],
  setPermissions: (perms) => set({ permissions: perms }),
}));
```

#### 12. The "Flash of Unauthorized Content" (FOUC)

```jsx
const ProtectedButton = () => {
  const { isInitialized, hasRole } = useAuth();
  if (!isInitialized) return null; // Prevent flash
  return hasRole("admin") ? <DeleteButton /> : null;
};
```

#### 13. Local State Tampering

```javascript
// React state modified in DevTools is ignored; backend decides security
const handleDelete = async () => {
  await axios.delete("/api/resource"); // Backend validates token, not client state
};
```

#### 14. Optimistic UI Updates with Rollback

```javascript
const deleteItem = async (id) => {
  setItems(items.filter((i) => i.id !== id)); // Optimistic
  try {
    await api.delete(`/items/${id}`);
  } catch {
    setItems(rollbackItems);
  } // Rollback on 403
};
```

#### 15. Offline Mode Authorization

```javascript
const canPerformOffline = (action, cachedPermissions) => {
  return cachedPermissions.includes(action);
};
```

#### 16. Shared Device State Leak

```javascript
const secureLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  document.cookie
    .split(";")
    .forEach(
      (c) =>
        (document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")),
    );
};
```

#### 17. Multi-Role User Switching

```javascript
const switchActiveRole = async (newRole) => {
  const { data } = await axios.post("/api/auth/switch-role", { role: newRole });
  setToken(data.token);
};
```

#### 18. Third-Party OAuth State Mismatch

```javascript
const mapOAuthScopesToRoles = (scopes) => {
  if (scopes.includes("admin:all")) return "admin";
  return "user";
};
```

---

### Category 3: Token Management, Storage & Lifecycle

#### 19. XSS vs CSRF Trade-offs (HttpOnly Cookie Set)

```javascript
// Node.js backend setting secure cookie
res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
});
```

#### 20. Silent Token Refresh Queueing

```javascript
let isRefreshing = false;
let failedQueue = [];
// Queue requests during token refresh lifecycle...
```

#### 21. JWT Payload Bloat

```javascript
// Instead of storing 100 permissions, store a role ID or hash reference
const tokenPayload = { userId: user._id, role: user.role };
```

#### 22. Token Revocation Blacklisting (Redis)

```javascript
const checkBlacklist = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (await redis.get(`bl_${token}`)) return res.status(401).send("Revoked");
  next();
};
```

#### 23. Cross-Subdomain Authentication

```javascript
res.cookie("token", token, { domain: ".domain.com", httpOnly: true });
```

#### 24. JWT Secret Rotation

```javascript
const verifyWithMultipleKeys = (token) => {
  try {
    return jwt.verify(token, CURRENT_SECRET);
  } catch {
    return jwt.verify(token, PREVIOUS_SECRET);
  }
};
```

#### 25. Decoupled Mobile App Support

```javascript
// Support Bearer header for mobile apps alongside HttpOnly cookies for web
const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
```

#### 26. Clock Skew Issues

```javascript
jwt.verify(token, secret, { clockTolerance: 30 }); // Allow 30 seconds drift
```

#### 27. Session Hijacking Detection

```javascript
if (req.headers["user-agent"] !== session.userAgent) {
  return res.status(401).json({ error: "Session anomaly detected" });
}
```

#### 28. Immediate Logout Propagation

```javascript
// Increment user token version in database, invalidating older JWT payloads
await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
```

---

### Category 4: Node.js Backend & Middleware Enforcement

#### 29. Middleware Execution Order Bug

```javascript
// Correct order: Verify user first, check roles second
app.delete("/data", verifyJWT, checkRole(["admin"]), controller);
```

#### 30. Granular ACL Middleware Generator

```javascript
const permit = (permission) => (req, res, next) =>
  req.user.permissions.includes(permission) ? next() : res.sendStatus(403);
```

#### 31. Wildcard Permission Logic

```javascript
const hasPerm = (userPerms, required) =>
  userPerms.includes("*") ||
  userPerms.includes(required) ||
  userPerms.some(
    (p) => p.endsWith(":*") && required.startsWith(p.slice(0, -2)),
  );
```

#### 32. Rate Limiting by Role

```javascript
const dynamicLimiter = (req, res, next) => {
  const limit = req.user.tier === "free" ? 10 : 1000;
  return getRateLimiter(limit)(req, res, next);
};
```

#### 33. API Versioning and Breaking Auth Changes

```javascript
app.use("/api/v1", v1AuthMiddleware);
app.use("/api/v2", v2AuthMiddleware);
```

#### 34. Internal Service-to-Service Authorization

```javascript
// Sign internal requests with a shared HMAC service token
const internalSig = crypto
  .createHmac("sha256", SECRET)
  .update(req.body)
  .digest("hex");
```

#### 35. Database Connection Pooling Exhaustion via Auth Queries

```javascript
// Cache role lookups in Redis to save DB connections
const role =
  (await redis.get(`role_${userId}`)) || (await fetchRoleFromDB(userId));
```

#### 36. Handling Malformed or Tampered JWTs

```javascript
try {
  jwt.verify(token, secret);
} catch (err) {
  return res.status(403).json({ error: "Invalid signature" });
}
```

#### 37. GraphQL Authorization Complexity

```javascript
const typeDefs = `#graphql
  type Query { secretData: String @auth(requires: ADMIN) }
`;
```

#### 38. Webhooks and Third-Party API Security

```javascript
const signature = req.headers["stripe-signature"];
const event = stripe.webhooks.constructEvent(
  req.rawBody,
  signature,
  endpointSecret,
);
```

---

### Category 5: Object-Level & Row-Level Security (RLS)

#### 39. Multi-Tenant Data Isolation

```javascript
const data = await Model.find({
  tenantId: req.user.tenantId,
  _id: req.params.id,
});
```

#### 40. Hierarchical Resource Ownership

```javascript
const canEdit =
  doc.ownerId.equals(req.user._id) ||
  (req.user.teamId.equals(doc.teamId) && req.user.role === "admin");
```

#### 41. Partial Field-Level Authorization

```javascript
const sanitizeUser = (user, role) => {
  if (role !== "admin") {
    delete user.salary;
    delete user.ssn;
  }
  return user;
};
```

#### 42. Shared Resource Collaborators

```javascript
const isCollab = await CollaboratorModel.exists({
  fileId: req.params.id,
  userId: req.user._id,
});
```

#### 43. Soft-Deleted Resource Access

```javascript
const doc = await Document.findOne({ _id: id, isDeleted: false });
if (!doc) return res.status(404).json({ message: "Not found" }); // Prevent disclosure
```

#### 44. Cascading Permissions on Deletion

```javascript
const canDeleteProject = async (userId, projectId) => {
  const tasks = await Task.find({ projectId });
  return tasks.every((t) => t.ownerId.toString() === userId);
};
```

#### 45. Conditional Write Validation

```javascript
if (req.body.status === "Completed" && req.user.role !== "manager") {
  return res.status(403).json({ error: "Only managers can complete" });
}
```

#### 46. Bulk Operations Authorization

```javascript
const authorizedIds = requestedIds.filter((id) => userOwnedIds.includes(id));
```

---

### Category 6: Advanced Edge Cases & Security Exploits

#### 47. Mass Assignment / Over-Posting Vulnerability

```javascript
// Explicitly pick allowed fields, stripping malicious 'role: admin' inputs
const updates = _.pick(req.body, ["name", "bio"]);
await User.findByIdAndUpdate(req.user.id, updates);
```

#### 48. Insecure Direct Object References (IDOR)

```javascript
// Use UUIDs instead of sequential IDs, combined with strict ownership checks
const resource = await Resource.findOne({
  _id: req.params.uuid,
  owner: req.user.id,
});
```

#### 49. Timing Attacks on Token/API Keys

```javascript
const secureCompare = (a, b) =>
  crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
```

#### 50. CSRF Vulnerabilities with Cookie-Based JWTs

```javascript
// Enforce SameSite=Strict and validate custom CSRF header tokens
if (req.headers["x-csrf-token"] !== req.cookies["csrf-token"])
  return res.sendStatus(403);
```

#### 51. CORS Misconfigurations

```javascript
// Never combine credentials: true with origin: *
app.use(cors({ origin: "https://app.domain.com", credentials: true }));
```

#### 52. Denial of Service (DoS) via Heavy Auth Middleware

```javascript
// Implement rate limiting on auth middleware endpoints before verification
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.post("/api/login", authLimiter, loginController);
```

#### 53. Session Fixation Attacks

```javascript
req.session.regenerate((err) => {
  req.session.userId = user._id; // Re-assign session ID upon login
});
```

#### 54. Privilege Creep Audit Trails

```javascript
await AuditLog.create({
  adminId: req.user.id,
  targetUserId: req.body.userId,
  action: "PROMOTE",
  timestamp: new Date(),
});
```

1 / 29

Create User Roles & Permissions Project Models |
User Register & Create an Admin in Project 3
User Login with JWT Token
Create Permission Model, & Add Permission API 5
Create Auth Middleware & Profile API 6

Create Read, Delete, and Update Permission API 7

Only Admin can access Permissions APIs 8

Create CRUD APIs of Category in Node JS 9

Create & Read Post APIs in Node JS 10

Delete & Update Post APIs in Node JS 11

Store and Get Roles API for Admin in Node JS 12

Create User API in Node JS 13

Send Mail to User with their Details & Password 14

Get Users and Update User API in Node JS 15

Delete User, Post like, UnLike, Like Count APIs 16

Assign Default Permissions on User Registration 17

Create Query for Get Permissions in Login API 18

Add Permissions in Get and Create User API 19

Update User Permissions in Node JS 20

Create Router Permission Model in Node JS 21

Create Get All Routes API in Node JS 22

Create OR Update Router Permissions API 23

Get Router Permissions API in Node JS 24

Update Router Permission Models & APIs 25

Get User Permission Helper Method & Refresh Permissions API #26

Permission Check Middleware & Admin can Access all Routes | Roles & Permissions APIs in Node JS #27

Helper Method for Get Router Permission & Update Middleware #28

Check User Permission with Router Permission & Middleware Testing #29

### Comprehensive Full Stack Backend: Node.js, Express, & MongoDB

This complete backend codebase maps step-by-step to modules 2 through 29 of the requested series, covering models, authentication, user/role/permission management, dynamic router permissions, mail notifications, posts, likes, and middleware enforcement.

---

### Phase 1: Database Models (`models/`)

#### 1. Role & Permission Models (`models/RolePermission.js`)

```javascript
const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
  },
  { timestamps: true },
);

const routerPermissionSchema = new mongoose.Schema(
  {
    route: { type: String, required: true },
    method: { type: String, required: true },
    permission: { type: String, required: true },
  },
  { timestamps: true },
);

const Permission = mongoose.model("Permission", permissionSchema);
const Role = mongoose.model("Role", roleSchema);
const RouterPermission = mongoose.model(
  "RouterPermission",
  routerPermissionSchema,
);

module.exports = { Permission, Role, RouterPermission };
```

#### 2. User Model (`models/User.js`)

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }], // Direct user permissions
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
```

#### 3. Category & Post Models (`models/CategoryPost.js`)

```javascript
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
  },
  { timestamps: true },
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);
const Post = mongoose.model("Post", postSchema);

module.exports = { Category, Post };
```

---

### Phase 2: Helper Methods (`utils/helpers.js`)

```javascript
const User = require("../models/User");

// Helper method to fetch comprehensive user permissions (direct + role-based)
const getUserPermissions = async (userId) => {
  const user = await User.findById(userId)
    .populate({
      path: "roles",
      populate: { path: "permissions" },
    })
    .populate("permissions");

  if (!user) return [];

  const directPermissions = user.permissions.map((p) => p.slug);
  const rolePermissions = user.roles.flatMap((role) =>
    role.permissions.map((p) => p.slug),
  );

  return [...new Set([...directPermissions, ...rolePermissions])];
};

module.exports = { getUserPermissions };
```

---

### Phase 3: Authentication & Authorization Middlewares (`middleware/auth.js`)

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { RouterPermission } = require("../models/RolePermission");
const { getUserPermissions } = require("../utils/helpers");

// Verify JWT Token & Load User Context
const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Access token missing" });

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const user = await User.findById(decoded.userId).populate("roles");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Check if User is Admin
const isAdmin = (req, res, next) => {
  const adminRole = req.user.roles.some((role) => role.name === "Admin");
  if (!adminRole)
    return res.status(403).json({ message: "Admin access required" });
  next();
};

// Check Router & User Permission Alignment Middleware
const checkRouterPermission = async (req, res, next) => {
  try {
    // Admins bypass router permission checks
    const isAdminUser = req.user.roles.some((role) => role.name === "Admin");
    if (isAdminUser) return next();

    const currentRoute = req.route?.path || req.path;
    const currentMethod = req.method;

    const routePerm = await RouterPermission.findOne({
      route: currentRoute,
      method: currentMethod,
    });
    if (!routePerm) return next(); // Route not restricted by router permission table

    const userPermissions = await getUserPermissions(req.user._id);

    if (
      userPermissions.includes("*") ||
      userPermissions.includes(routePerm.permission)
    ) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient router permissions" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { verifyJWT, isAdmin, checkRouterPermission };
```

---

### Phase 4: Main Express Server & Controllers Implementation (`server.js`)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { Permission, Role, RouterPermission } = require('./models/RolePermission');
const User = require('./models/User');
const { Category, Post } = require('./models/CategoryPost');
const { verifyJWT, isAdmin, checkRouterPermission } = require('./middleware/auth');
const { getUserPermissions } = require('./utils/helpers');

const app = express();
app.use(express.json());

// Nodemailer Transporter Setup (Mod 14)
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: { user: 'mock_user', pass: 'mock_pass' }
});

// ================= MODULE 3: Register & Admin Setup =================
app.post('/api/auth/register-admin', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    let adminRole = await Role.findOne({ name: 'Admin' });
    if (!adminRole) adminRole = await Role.create({ name: 'Admin' });

    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@project.com',
      password: hashedPassword,
      roles: [adminRole._id]
    });
    res.status(201).json({ message: 'Admin created successfully', adminUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= MODULE 4 & 18: Login with JWT & Permissions Query =================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET || 'secret', { expiresIn: '1d' });
    const permissions = await getUserPermissions(user._id); // Mod 18

    res.json({ token, user: { id: user._id, email: user.email, permissions } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= MODULE 6: Profile API =================
app.get('/api/auth/profile', verifyJWT, async (req, res) => {
  const permissions = await getUserPermissions(req.user._id);
  res.json({ user: req.user, permissions });
});

// ================= MODULE 5, 7, 8: Permission CRUD (Admin Only) =================
app.post('/api/permissions', verifyJWT, isAdmin, async (req, res) => {
  const perm = await Permission.create(req.body);
  res.status(201).json(perm);
});

app.get('/api/permissions', verifyJWT, isAdmin, async (req, res) => {
  const perms = await Permission.find();
  res.json(perms);
});

app.put('/api/permissions/:id', verifyJWT, isAdmin, async (req, res) => {
  const updated = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/api/permissions/:id', verifyJWT, isAdmin, async (req, res) => {
  await Permission.findByIdAndDelete(req.params.id);
  res.json({ message: 'Permission deleted' });
});

// ================= MODULE 9: Category CRUD APIs =================
app.post('/api/categories', verifyJWT, isAdmin, async (req, res) => {
  const cat = await Category.create(req.body);
  res.status(201).json(cat);
});

app.get('/api/categories', async (req, res) => {
  const cats = await Category.find();
  res.json(cats);
});

// ================= MODULE 10 & 11: Post APIs (Create, Read, Update, Delete) =================
app.post('/api/posts', verifyJWT, checkRouterPermission, async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user._id });
  res.status(201).json(post);
});

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().populate('category author', 'name email');
  res.json(posts);
});

app.put('/api/posts/:id', verifyJWT, checkRouterPermission, async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
});

app.delete('/api/posts/:id', verifyJWT, checkRouterPermission, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Post deleted' });
});

// ================= MODULE 12 & 13 & 14 & 15: User Management & Auto-Email Password =================
app.post('/api/users', verifyJWT, isAdmin, async (req, res) => {
  const { name, email, roles, permissions } = req.body;
  const tempPassword = Math.random().toString(36.slice(-8));
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const newUser = await User.create({ name, email, password: hashedPassword, roles, permissions });

  // Send Mail (Mod 14)
  await transporter.sendMail({
    to: email,
    subject: 'Your Account Details',
    text: `Hello ${name}, your password is: ${tempPassword}`
  });

  res.status(201).json({ message: 'User created and email dispatched', newUser });
});

app.get('/api/users', verifyJWT, isAdmin, async (req, res) => {
  const users = await User.find().populate('roles permissions');
  res.json(users);
});

app.put('/api/users/:id', verifyJWT, isAdmin, async (req, res) => {
  const { name, roles, permissions } = req.body;
  const updated = await User.findByIdAndUpdate(req.params.id, { name, roles, permissions }, { new: true });
  res.json(updated);
});

app.delete('/api/users/:id', verifyJWT, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// ================= MODULE 16: Like / Unlike APIs =================
app.post('/api/posts/:id/like', verifyJWT, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const index = post.likes.indexOf(req.user._id);
  if (index > -1) {
    post.likes.splice(index, 1); // Unlike
  } else {
    post.likes.push(req.user._id); // Like
  }
  await post.save();
  res.json({ likesCount: post.likes.length, post });
});

// ================= MODULE 21-25: Router Permissions Management =================
app.get('/api/router-permissions/routes', verifyJWT, isAdmin, (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({ path: middleware.route.path, method: Object.keys(middleware.route.methods)[0].toUpperCase() });
    }
  });
  res.json(routes);
});

app.post('/api/router-permissions', verifyJWT, isAdmin, async (req, res) => {
  const { route, method, permission } = req.body;
  const entry = await RouterPermission.findOneAndUpdate({ route, method }, { permission }, { upsert: true, new: true });
  res.json(entry);
});

app.get('/api/router-permissions', verifyJWT, isAdmin, async (req, res) => {
  const list = await RouterPermission.find();
  res.json(list);
});

// ================= MODULE 26: Refresh Permissions API =================
app.get('/api/auth/refresh-permissions', verifyJWT, async (req, res) => {
  const permissions = await getUserPermissions(req.user._id);
  res.json({ permissions });
});

// Database & Server Initialization
mongoose.connect('mongodb://localhost:27017/rbac_project')
  .then(() => app.listen(5000, () => console.log('Enterprise RBAC Server running on port 5000')));

```
