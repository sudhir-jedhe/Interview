Based on recent React masterclass material in your organisation, API integration topics such as Axios, Fetch API, useEffect, Context API, and state management are common areas of focus. [[React-PPT-v4 2 | PDF]](https://persistentsystems-my.sharepoint.com/personal/bhagyashri_vikhe_persistent_com/Documents/Microsoft%20Teams%20Chat%20Files/React-PPT-v4%202.pdf?web=1), [[Masterclas...: July'26 | Meeting]](https://teams.microsoft.com/l/meeting/details?eventId=AAMkAGMxMjI2OWVkLWU0NzItNGZhMS04MWEyLWU0MTBmNzhiZjM3NAFRAAgI3uBxrrHAAEYAAAAAXK7K1kVmlUyuqsmSw-3huAcA65BX0zds3kuv4N8YqlYGvQAAAAABDQAA65BX0zds3kuv4N8YqlYGvQAChF1zKQAAEA%3d%3d)

# React API Integration Interview Questions (Senior/Architect Level)

## 1\. How do you fetch data in React?

**Answer:**

- `fetch()`
- `Axios`
- React Query (TanStack Query)
- SWR
- Server Components (React 19 / Next.js)

```js
useEffect(() => {

  const fetchUsers = async () => {

    const res = await fetch('/api/users');

    const data = await res.json();

    setUsers(data);

  };

  fetchUsers();

}, []);
```

---

## 2\. Fetch vs Axios

| Feature              | Fetch           | Axios            |
| -------------------- | --------------- | ---------------- |
| Built-in             | ✅               | ❌                |
| JSON Parsing         | Manual          | Automatic        |
| Error Handling       | Limited         | Better           |
| Interceptors         | ❌               | ✅                |
| Request Cancellation | AbortController | Built-in support |

**When asked in interviews:**

> Fetch is sufficient for simple applications. Axios is preferred in enterprise applications because of interceptors, request transformation, and centralised error handling.

---

## 3\. Where should API calls be placed?

### Good

```js
useEffect(() => {

  loadData();

}, []);
```

### Better

Move API logic into service layer:

```js
// userService.js

export const getUsers = () => axios.get('/users');
```

Benefits:

- Separation of concerns
- Easier testing
- Reusable APIs

---

## 4\. How do you handle loading and error states?

```js
const [loading, setLoading] = useState(false);

const [error, setError] = useState(null);

try {

  setLoading(true);

  const users = await getUsers();

} catch (err) {

  setError(err);

} finally {

  setLoading(false);

}
```

### Interview Follow-up

What happens if API fails?

- Show fallback UI
- Retry mechanism
- Log error
- Display user-friendly message

---

## 5\. How do you prevent memory leaks in API calls?

### Problem

User navigates away before API completion.

```js
useEffect(() => {

  fetch('/users')

    .then(res => res.json())

    .then(setUsers);

}, []);
```

### Solution

```js
useEffect(() => {

  const controller = new AbortController();

  fetch('/users', {

    signal: controller.signal

  });

  return () => controller.abort();

}, []);
```

---

## 6\. How do you avoid duplicate API calls?

### Use Caching

```js
const { data } = useQuery({

  queryKey: ['users'],

  queryFn: fetchUsers

});
```

Benefits:

- Cache
- Deduplication
- Background refetching
- Retry support

---

## 7\. What is React Query?

React Query manages:

- Fetching
- Caching
- Synchronization
- Background refresh
- Retry logic

```js
const {

  data,

  isLoading,

  error

} = useQuery({

  queryKey: ['users'],

  queryFn: fetchUsers

});


```

### Architect Answer

React Query eliminates boilerplate code around API state management.

---

## 8\. How do you handle authentication tokens?

### Axios Interceptor

```js
axios.interceptors.request.use(config => {

  config.headers.Authorization =

    `Bearer ${localStorage.getItem('token')}`;

  return config;

});

```

### Follow-Up

Where should token be stored?

- HTTP Only Cookie ✅
- LocalStorage ⚠️
- Session Storage ⚠️

---

## 9\. How do you handle multiple API requests?

### Parallel

```js
const [users, products] = await Promise.all([

  fetchUsers(),

  fetchProducts()

]);
```

```js
// Parallel execution with Promise.allSettled
async function loadDashboard() {
  const [userRes, statsRes, notificationsRes] = await Promise.allSettled([
    fetch('/api/user'),
    fetch('/api/stats'),
    fetch('/api/notifications')
  ]);

  const userData = userRes.status === 'fulfilled' ? await userRes.value.json() : null;
  const statsData = statsRes.status === 'fulfilled' ? await statsRes.value.json() : null;
}

```

### Benefit

Reduces overall network time.

---

## 10\. How do you design API architecture in a large React application?

```
src/
 ├── api/
 │   ├── axiosInstance.js
 │   ├── userApi.js
 │   └── productApi.js
 │
 ├── hooks/
 │   ├── useUsers.js
 │   └── useProducts.js
 │
 ├── pages/
 └── components/

```

### Advantages

- Reusable
- Testable
- Scalable
- Maintainable

---

# Scenario-Based Questions

### Q1. User types in search box and API fires on every keystroke. How do you optimize?

**Answer**

- Debounce
- Throttle
- Request cancellation

```js
const debouncedSearch = useDebounce(searchTerm, 500);
```

---

### Q2. Dashboard has 20 widgets calling APIs simultaneously. What would you do?

**Expected Discussion**

- Parallel requests
- Caching
- Lazy loading
- React Query
- Skeleton loaders
- Code splitting

---

When a dashboard triggers 20 API requests all at once, it leads to severe performance bottlenecks: browser network congestion (browsers limit concurrent connections to 6 per domain), high main-thread parsing overhead, backend database connection spikes, and potential `429 Too Many Requests` rate-limit errors.

Here is an architectural playbook to solve this on both the **frontend** and **backend**.

---

## 1. Frontend Strategies (Client Optimization)

### A. Prioritization & Staggered Fetching

Not all widgets are equally important. Divide widgets into priority tiers:

1. **Critical (Above-the-Fold):** Fetch immediately on mount (e.g., Key KPIs, critical status cards).
2. **Secondary:** Fetch after critical data loads or use request idle callbacks (`requestIdleCallback`).
3. **Lazy-Loaded (Below-the-Fold):** Use an **Intersection Observer** to only trigger API requests when the user actually scrolls the widget into view.

### B. Batching & Request Bouncing

If widgets make granular, individual requests (e.g., separate endpoints for `/widget/1`, `/widget/2`), implement a **batching queue**:

- Queue incoming fetch requests for a small window (e.g., 50ms) and send a single bulk request (`POST /api/widgets/batch` with `ids: [1, 2, ... 20]`).

### C. Concurrency Bounding (`p-limit`)

To prevent blowing past browser network limits, bound maximum active concurrent requests:

```javascript
import pLimit from 'p-limit';

// Limit concurrent API requests to 4 at a time
const limit = pLimit(4); 

const widgetFetchPromises = widgetUrls.map(url => 
  limit(() => fetch(url).then(res => res.json()))
);

const results = await Promise.allSettled(widgetFetchPromises);

```

### D. Smart Caching & Request Deduplication

- **Deduplication:** If two widgets request overlapping data (e.g., basic user info or overall account state), ensure only **one** network request is fired using libraries like **TanStack Query (React Query)** or **SWR**.
- **Stale-While-Revalidate:** Display cached data instantly from local storage / memory cache while updating silently in the background.

---

## 2. Backend & Architecture Strategies (Server Optimization)

### A. Aggregation Layer (BFF - Backend for Frontend)

Instead of 20 distinct HTTP roundtrips between the client and server, create a dedicated **Dashboard Aggregator Endpoint**:

- The client makes **1 single HTTP request** (`GET /api/dashboard`).
- The backend fetches data for all 20 widgets internally over low-latency private network interfaces (e.g., gRPC, microservices, or direct database calls).
- The server responds with a single JSON payload.

### B. GraphQL or REST Field Filtering

If using GraphQL, request all widget data in a single Query payload. The server executes sub-queries in parallel asynchronously.

### C. WebSockets / Server-Sent Events (SSE) for Real-Time Updates

Instead of 20 HTTP polling requests:

1. Open a single persistent WebSocket connection or SSE stream.
2. The server pushes updates to individual widgets asynchronously as soon as the underlying data changes or finishes computing.

### D. Redis Caching

Dashboard metrics (like weekly totals or analytics aggregations) rarely change second-by-second.

- Cache widget response payloads in **Redis** with a short Time-To-Live (TTL) (e.g., 30–60 seconds).
- This reduces database workload to near-zero for repetitive dashboard visits.

---

## Recommended Quick Wins Summary

| Metric              | Individual 20 API Calls                      | Unified Aggregator / Cached Approach |
| ------------------- | -------------------------------------------- | ------------------------------------ |
| **HTTP Requests**   | 20 separate network roundtrips               | 1 request (or SSE connection)        |
| **Browser Limits**  | Blocked by 6-connection limit                | Unblocked                            |
| **User Experience** | Jagged layout shifts, slow renders           | Clean skeleton loading, fast LCP     |
| **Server Overhead** | High TLS handshakes & connection pool spikes | Low, pooled requests                 |

### Q3. API returns stale data. How do you refresh?

**Answer**

React Query:

```js
useQuery({

  queryKey: ['users'],

  queryFn: fetchUsers,

  staleTime: 60000

});

```

Use:

- Background refetching
- Polling
- WebSocket if real-time

---

Handling stale API data requires a multi-layered approach depending on where the caching is occurring—in the **browser**, on the **CDN/Edge**, in a **state management library** (e.g., React Query, SWR), or on the **backend/database**.

Here is how to effectively tackle and force-refresh stale data across each layer:

---

## 1. Client-Side & UI Layer (React Query / SWR / Fetch)

If you are using data-fetching libraries like **TanStack Query (React Query)** or **SWR**, they cache data aggressively by default.

### A. Manual Revalidation / Invalidation

Trigger a manual refresh when an action occurs (e.g., after a mutation or button click):

```javascript
// React Query example
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const handleUpdate = async () => {
  await updateUserData();
  // Invalidates the cache and automatically refetches in the background
  queryClient.invalidateQueries({ queryKey: ['userData'] });
};

```

### B. Configure Automatic Polling or Focus Refetching

Keep data fresh without user intervention:

- **Refetch on Window Focus:** Refetches automatically when the user clicks back onto the tab.
- **Polling Interval:** Periodically refetches data every $N$ seconds for live dashboards:

```javascript
const { data } = useQuery({
  queryKey: ['liveStats'],
  queryFn: fetchStats,
  refetchInterval: 5000, // Refetch every 5 seconds
});

```

---

## 2. Browser & HTTP Network Layer

Browsers often cache `GET` requests aggressively based on response headers or local behavior.

### A. Add Cache-Busting Headers

If using standard `fetch` or `axios`, pass headers to instruct the browser to bypass local caches:

```javascript
fetch('/api/user-data', {
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

```

### B. Cache-Busting Query Parameters (Fallback Technique)

Append a unique timestamp or random string to the URL to force the browser to treat the request as brand new:

```javascript
const freshUrl = `/api/user-data?_t=${Date.now()}`;
fetch(freshUrl);

```

---

## 3. CDN & Reverse Proxy Layer (Cloudflare, AWS CloudFront, Nginx)

If a CDN or edge server is serving cached responses, changes to the origin database won't reflect immediately.

### A. HTTP Cache-Control Headers from the Server

Ensure your API sends appropriate caching headers depending on how sensitive the data is:

```http
Cache-Control: private, no-cache, no-store, must-revalidate

```

### B. ETags and Conditional Requests (`304 Not Modified`)

Use `ETag` or `Last-Modified` headers. The browser sends `If-None-Match: "etag_value"`.

- If the data **has changed**, the server returns `200 OK` with fresh data.
- If the data **has not changed**, the server returns an empty `304 Not Modified` payload to save bandwidth.

### C. Programmatic Cache Invalidation (Webhooks)

When a write operation occurs on your backend (e.g., a database `UPDATE`), send an API call to your CDN to purge the specific cached URL route:

```javascript
// Example: Cloudflare Cache Purge API
await fetch('https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${process.env.CF_API_TOKEN}` },
  body: JSON.stringify({ files: ['https://example.com/api/data'] }),
});

```

---

## 4. Backend & Database Caching Layer (Redis)

If your Node.js or backend API caches responses in **Redis** or in-memory variables:

### A. Cache Invalidation on Mutation (Write-Through / Cache-Aside)

When a `POST`, `PUT`, or `DELETE` request modifies data, explicitly delete or update the corresponding key in Redis:

```javascript
// Node.js Express route example
app.post('/api/user/update', async (req, res) => {
  await updateUserInDatabase(req.body);

  // Invalidate stale cache key
  await redisClient.del(`user:${req.body.id}`);

  res.json({ success: true });
});

```

### B. Short TTL (Time-To-Live)

Always assign an expiration time to cached keys so stale data automatically expires even if explicit invalidation fails:

```javascript
// Store in Redis with a 60-second expiration
await redisClient.setEx(`user:${userId}`, 60, JSON.stringify(userData));

```

---

## Real-Time Push Alternative: WebSockets / Server-Sent Events (SSE)

If stale data is critical to prevent (e.g., financial tickers, real-time chats, stock updates), abandon polling and HTTP caching entirely. Use **WebSockets** or **SSE** so the server instantly pushes new data to the client the exact second it updates.

### Q4. User rapidly clicks filters causing race conditions. How do you solve?

**Answer**

- Abort previous request
- React Query cancellation
- Request IDs
- Latest response only strategy

---

Race conditions caused by rapid clicking occur when an earlier, slower API request finishes *after* a later, faster request—overwriting the UI with stale data.

Here are the primary ways to solve this on both the **frontend** and **backend**.

---

## 1. Request Cancellation using `AbortController` (Best Practice)

The cleanest approach is to cancel the previous pending network request as soon as a new filter is selected.

### Native JavaScript / Fetch

```javascript
let currentController = null;

async function handleFilterChange(newFilter) {
  // 1. Cancel the previous in-flight request if it exists
  if (currentController) {
    currentController.abort();
  }

  // 2. Create a new AbortController for the new request
  currentController = new AbortController();

  try {
    const response = await fetch(`/api/products?filter=${newFilter}`, {
      signal: currentController.signal,
    });
    const data = await response.json();
    
    // 3. Update UI state only if request completed successfully
    setProducts(data);
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Fetch error:', error);
    }
    // AbortErrors are ignored because they are intentionally cancelled
  }
}

```

### React Hook with Cleanup (`useEffect`)

If filter changes trigger a state update:

```jsx
useEffect(() => {
  const controller = new AbortController();

  fetch(`/api/products?filter=${activeFilter}`, { signal: controller.signal })
    .then((res) => res.json())
    .then((data) => setProducts(data))
    .catch((err) => {
      if (err.name !== 'AbortError') setError(err);
    });

  // Cleanup runs automatically when activeFilter changes or component unmounts
  return () => controller.abort();
}, [activeFilter]);

```

---

## 2. Using React Query / SWR (Automated Solution)

Modern data-fetching libraries handle race conditions automatically out of the box.

- **Automatic Abort:** If the `queryKey` changes (e.g., from `['products', 'shoes']` to `['products', 'shirts']`), React Query cancels the previous fetch request automatically.
- **Deduplication:** Repeated fast clicks on the exact same filter won't trigger duplicate network calls.

```jsx
// React Query automatically cancels stale queries when activeFilter updates
const { data, isLoading } = useQuery({
  queryKey: ['products', activeFilter],
  queryFn: ({ signal }) =>
    fetch(`/api/products?filter=${activeFilter}`, { signal }).then((res) =>
      res.json()
    ),
});

```

---

## 3. Ignore Stale Responses (Request Sequence ID Tracking)

If you cannot cancel the request (e.g., using a legacy library or third-party SDK that doesn't support `AbortController`), use a monotonically increasing sequence counter or timestamp.

```javascript
let latestRequestId = 0;

async function handleFilterChange(newFilter) {
  // Capture current request sequence number
  const requestId = ++latestRequestId;

  const data = await fetchProducts(newFilter);

  // Only update state if this request is still the latest one triggered
  if (requestId === latestRequestId) {
    setProducts(data);
  }
}

```

---

## 4. UI Rate-Limiting (Prevent Excess Requests)

Complement network-level cancellation with UI-level controls to prevent spamming the backend:

1. **Debouncing:** Delay firing the API request until the user stops clicking/selecting filters for a short window (e.g., 300ms). Ideal for multi-select checkboxes or text inputs.
2. **Optimistic UI / Disabled States:** Temporarily disable filter controls or show a loading overlay on the filter bar until the active request finishes.

---

## Summary Checklist

| Strategy                    | When to Use                       | Pros                                            |
| --------------------------- | --------------------------------- | ----------------------------------------------- |
| **`AbortController`**       | Native `fetch` / Axios            | Cancels network usage; lightweight.             |
| **TanStack Query / SWR**    | Modern React apps                 | Handled completely automatically.               |
| **Request ID Tracking**     | SDKs without cancellation         | Easy to implement without modifying API client. |
| **Debouncing / UI Disable** | User input fields / Multi-selects | Protects server from request spikes.            |

### Q5. How would you monitor API performance in production?

**Architect-Level Answer**

- Browser Performance API
- Azure Application Insights
- Datadog
- New Relic
- Correlation IDs
- API latency dashboards
- Error-rate monitoring

---

# Favourite Senior/Lead React API Question

### "How would you architect API communication for a micro-frontend application used by 1 million users?"

**Expected Topics**

- Shared API Gateway
- Axios Interceptors
- Authentication
- Caching layer
- React Query
- Circuit Breaker
- Retry Strategy
- Observability
- Distributed Tracing
- Feature Flags
- Rate Limiting

Architecting API communication for a **Micro-Frontend (MFE)** application serving **1 million users** requires balancing **client performance**, **decoupled deployment**, and **backend security**.

At this scale, naive architectures lead to network bottlenecks, CORS chaos, and inconsistent auth states across MFE boundaries.

Here is an end-to-end architectural blueprint designed for high scale and fault tolerance.

---

## 1. High-Level System Architecture

Rather than allowing each MFE container to directly communicate with dozens of backend microservices, implement an **API Gateway / Backend-For-Frontend (BFF)** layer.

```text
  [ Client Browser / Web App ]
  ┌─────────────────────────────────────────────────────────┐
  │ Shell App (Container)                                  │
  │  ├── Navigation MFE                                     │
  │  ├── Checkout MFE                                       │
  │  └── Product Catalog MFE                                │
  └──────────────────────────┬──────────────────────────────┘
                             │ (Single HTTPS Domain / Base API Route)
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │ API Gateway / Edge Router (Cloudflare / AWS CloudFront) │
  │  - Global CDN Caching                                   │
  │  - Rate Limiting (429) & WAF                             │
  │  - SSL Termination                                      │
  └──────────────────────────┬──────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │ BFF Layer (Backend-For-Frontend) / GraphQL Gateway      │
  │  - Token Verification (JWT)                             │
  │  - Request Batching & Response Aggregation              │
  │  - Schema Stitching / Federation                        │
  └─────────────┬────────────────────┬──────────────────────┘
                │                    │
                ▼                    ▼
     [ Inventory Service ]    [ Payment Service ]  [ User Service ]

```

---

## 2. Shared API Client & Communication Standards

### A. Core Strategy: Shared Lightweight API Client SDK

Do **not** allow each MFE team to build their own HTTP client logic. Instead, publish a lightweight **Core SDK / Library** (internal NPM package) imported by all MFEs:

- **Centralized Interceptors:** Standardizes error handling, logging, and automatic header injection (e.g., `X-Correlation-ID`, `X-App-Version`).
- **Authentication State Management:** Manages token refresh loops silently in a single worker/event stream so multiple MFEs don't fire duplicate refresh requests at the same time.
- **Request Deduplication:** Prevents two separate MFEs on the same page from requesting identical user or config endpoints simultaneously.

### B. MFE Inter-Communication (Event Bus)

To communicate state changes between isolated MFEs (e.g., *Cart MFE* updating when a user clicks "Add to Cart" inside *Product MFE*):

- Use **Custom Browser Events / Window Event Bus** or lightweight libraries like `pubsub-js` for pure client-side pub/sub messaging.
- **Rule:** Never pass large API response payloads through custom events; pass minimalist event notifications/IDs (e.g., `{ type: 'CART_UPDATED', cartId: '123' }`), allowing the listening MFE to query its own cached API layer.

---

## 3. Caching & Performance at 1M User Scale

When 1 million users interact with the app, unthrottled API calls will crash downstream microservices.

### A. Edge & CDN Caching

- Cache static and semi-static API responses (e.g., Product Catalog, Configs) at the Edge using **Cloudflare / CloudFront**.
- Utilize `Cache-Control` headers with `stale-while-revalidate` so users receive instant responses while fresh data is fetched asynchronously in the background.

### B. Client-Side Data Fetching & Caching

Standardize on client libraries like **TanStack Query (React Query)** or **SWR**:

- **Garbage Collection & TTL:** Assign reasonable `staleTime` values so switching between MFE tabs doesn't trigger continuous network re-fetching.
- **Persistent Cache:** Persist non-sensitive API responses to `IndexedDB` or `sessionStorage` for instantaneous initial page loads.

### C. Request Batching

When a user loads a dashboard with components owned by 5 different MFE teams, leverage **GraphQL Federation** or a **REST Aggregator Endpoint** to bundle 5 requests into a single network roundtrip.

---

## 4. Authentication, Authorization & Security

### A. Token Management (OAuth 2.0 / OIDC)

- **HttpOnly, Secure Cookies:** The safest pattern for web applications. The API Gateway/BFF handles session tokens via HttpOnly cookies, completely insulating frontend JS from XSS token theft.
- **Cross-MFE Auth Sync:** If using JWTs in memory, maintain the token inside the **Shell/Host Container** and expose a secure provider or BroadcastChannel to pass fresh tokens down to child MFEs.

### B. CORS Management

- Route all micro-frontend calls through a **unified sub-domain** (e.g., `[https://app.domain.com/api/](https://app.domain.com/api/)...`) to eliminate cross-origin Preflight (`OPTIONS`) requests, cutting down latency by up to 50%.

### C. Circuit Breakers & Fallbacks

If an upstream microservice fails (e.g., *Recommendations Service* goes down):

- The API Gateway / BFF short-circuits the request and returns a fallback/empty state.
- The corresponding MFE renders a graceful UI fallback without crashing the entire Shell application.

---

## 5. Senior Engineering Interview Answer (Condensed Summary)

> *"To architect API communication for a micro-frontend app serving 1M users, I implement a **BFF (Backend-For-Frontend) / API Gateway pattern** behind an Edge CDN.
> On the frontend, we use a **centralized lightweight HTTP SDK** across all MFEs to enforce consistent interceptors, request deduplication, and auth sync. Cross-MFE state updates are handled via an asynchronous **Browser Event Bus** passing minimal event IDs rather than large payloads.
> To protect backend systems at scale, we enforce**edge caching with `stale-while-revalidate**`, client-side caching using TanStack Query, unified sub-domain routing to eliminate CORS preflights, and circuit-breaker fallbacks so an individual MFE failure never takes down the entire application."*

Architect-Level Answer
Question:

"Dashboard has 20 widgets calling APIs simultaneously. What would you do?"

This question tests your understanding of:

Network optimisation
React performance
Backend scalability
User experience
Observability
First: Analyse the Problem

20 widgets firing APIs simultaneously can cause:

Network congestion
Browser connection limits
High server load
Slow dashboard rendering
Duplicate requests
UI blocking/spinners everywhere

1. Prioritise Critical Widgets

Not all widgets have equal importance.

Loading Strategy
Critical Widgets
├─ Revenue
├─ Alerts
└─ User Tasks

Secondary Widgets
├─ Trends
├─ Charts
└─ Reports

Load:

P0 → Immediately
P1 → After first render
P2 → Lazy load

Example:

const RevenueWidget = lazy(() =>
import("./RevenueWidget")
);

1. Parallelise Requests Properly

Instead of:

await getRevenue();
await getUsers();
await getCustomers();

Use:

await Promise.all([
getRevenue(),
getUsers(),
getCustomers()
]);

Benefits:

Reduced overall wait time
Better network utilisation 3. Use React Query (TanStack Query)

Most enterprise dashboards use:

const { data } = useQuery({
queryKey: ['revenue'],
queryFn: getRevenue,
staleTime: 60000
});

Benefits:

✅ Caching

✅ Background refetch

✅ Deduplication

✅ Retry handling

✅ Request cancellation

1. Eliminate Duplicate Calls

Bad scenario:

Widget A → GET /user
Widget B → GET /user
Widget C → GET /user

Use shared cache:

useQuery({
queryKey: ['user']
});

Only one request goes to server.

1. Backend Aggregation Pattern

Instead of:

20 Widgets
↓
20 APIs

Create:

Dashboard API
↓
/dashboard

Response:

{
"revenue": {},
"alerts": {},
"users": {},
"sales": {}
}

Advantages:

Single network call
Reduced latency
Reduced authentication overhead

Architects usually prefer this approach.

1. Lazy Load Below-the-Fold Widgets

Only render visible content.

<LazyWidget />

Using:

IntersectionObserver

Example:

const isVisible = useInView();

Load charts only when user scrolls.

1. Skeleton Loaders

Avoid:

20 spinners

Use:

<Skeleton height={200}/>

Benefits:

Better perceived performance
Less layout shift 8. Request Prioritisation

Critical API:

Revenue
Alerts
Notifications

High priority.

Non-critical:

Historical Trends
Reports
Analytics

Load later:

requestIdleCallback(() => {
loadReports();
});

1. Pagination and Virtualisation

If widget displays:

50,000 rows

Never fetch all data.

Use:

Server-side pagination

or

React Window
AG Grid Virtualization

 1. Real-Time Widgets

Avoid:

setInterval(fetch, 1000);

Use:

WebSocket
Server-Sent Events (SSE)

Only changed data is pushed.

 1. Fault Isolation

One widget failure should not crash dashboard.

<ErrorBoundary>
   <RevenueWidget />
</ErrorBoundary>

Result:

Revenue widget fails
↓
Other 19 widgets work

 1. Monitoring

Track:

API Latency
Widget Render Time
FCP
LCP
CLS
INP
Error Rate

Using:

Browser Performance API
Azure App Insights
Datadog
New Relic
Architect-Level Answer (2-Minute Interview Version)

For a dashboard with 20 widgets, I would first classify widgets by business priority and load critical widgets first. I would execute independent requests in parallel using Promise.all, introduce React Query for caching, deduplication and background refresh, and avoid duplicate API calls through shared query keys. For scalability, I would prefer a Backend-for-Frontend (BFF) or aggregated dashboard API instead of 20 separate network calls. I would lazy-load non-visible widgets, use skeleton screens for perceived performance, virtualise large datasets, isolate failures with Error Boundaries, and monitor real-user metrics using Browser Performance APIs and observability tools. This provides faster initial render, reduced server load, and better user experience at scale.

Follow-up Interview Question

"What if one API takes 10 seconds while the other 19 APIs finish in 500ms?"

Expected discussion:

Timeouts
Request cancellation (AbortController)
Partial rendering
Retry strategy with exponential backoff
Stale cache fallback
Circuit breaker pattern

# Architect-Level Answer

### Question

**"Dashboard has 20 widgets calling APIs simultaneously. What would you do?"**

This question tests your understanding of:

- Network optimisation
- React performance
- Backend scalability
- User experience
- Observability

---

## First: Analyse the Problem

20 widgets firing APIs simultaneously can cause:

- Network congestion
- Browser connection limits
- High server load
- Slow dashboard rendering
- Duplicate requests
- UI blocking/spinners everywhere

---

# 1\. Prioritise Critical Widgets

Not all widgets have equal importance.

### Loading Strategy

Critical Widgets

├─ Revenue

├─ Alerts

└─ User Tasks

Secondary Widgets

├─ Trends

├─ Charts

└─ Reports

Load:

P0 → Immediately

P1 → After first render

P2 → Lazy load

Example:

const RevenueWidget = lazy(() =>

  import("./RevenueWidget")

);

---

# 2\. Parallelise Requests Properly

Instead of:

await getRevenue();

await getUsers();

await getCustomers();

Use:

await Promise.all([

  getRevenue(),

  getUsers(),

  getCustomers()

]);

Benefits:

- Reduced overall wait time
- Better network utilisation

---

# 3\. Use React Query (TanStack Query)

Most enterprise dashboards use:

const { data } = useQuery({

  queryKey: ['revenue'],

  queryFn: getRevenue,

  staleTime: 60000

});

Benefits:

✅ Caching

✅ Background refetch

✅ Deduplication

✅ Retry handling

✅ Request cancellation

---

# 4\. Eliminate Duplicate Calls

Bad scenario:

Widget A → GET /user

Widget B → GET /user

Widget C → GET /user

``

Use shared cache:

useQuery({

  queryKey: ['user']

});

Only one request goes to server.

---

# 5\. Backend Aggregation Pattern

Instead of:

20 Widgets

     ↓

20 APIs

Create:

Dashboard API

     ↓

/dashboard

Response:

{

  "revenue": {},

  "alerts": {},

  "users": {},

  "sales": {}

}

Advantages:

- Single network call
- Reduced latency
- Reduced authentication overhead

**Architects usually prefer this approach.**

---

# 6\. Lazy Load Below-the-Fold Widgets

Only render visible content.

<LazyWidget />

Using:

IntersectionObserver

Example:

const isVisible = useInView();

Load charts only when user scrolls.

---

# 7\. Skeleton Loaders

Avoid:

20 spinners

Use:

<Skeleton height={200}/>

Benefits:

- Better perceived performance
- Less layout shift

---

# 8\. Request Prioritisation

Critical API:

Revenue

Alerts

Notifications

High priority.

Non-critical:

Historical Trends

Reports

Analytics

Load later:

requestIdleCallback(() => {

    loadReports();

});

---

# 9\. Pagination and Virtualisation

If widget displays:

50,000 rows

Never fetch all data.

Use:

Server-side pagination

or

React Window

AG Grid Virtualization

---

# 10\. Real-Time Widgets

Avoid:

setInterval(fetch, 1000);

Use:

WebSocket

Server-Sent Events (SSE)

Only changed data is pushed.

---

# 11\. Fault Isolation

One widget failure should not crash dashboard.

<ErrorBoundary>

   <RevenueWidget />

</ErrorBoundary>

Result:

Revenue widget fails

↓

Other 19 widgets work

---

# 12\. Monitoring

Track:

API Latency

Widget Render Time

FCP

LCP

CLS

INP

Error Rate

Using:

- Browser Performance API
- Azure App Insights
- Datadog
- New Relic

---

# Architect-Level Answer (2-Minute Interview Version)

> For a dashboard with 20 widgets, I would first classify widgets by business priority and load critical widgets first. I would execute independent requests in parallel using `Promise.all`, introduce React Query for caching, deduplication and background refresh, and avoid duplicate API calls through shared query keys. For scalability, I would prefer a Backend-for-Frontend (BFF) or aggregated dashboard API instead of 20 separate network calls. I would lazy-load non-visible widgets, use skeleton screens for perceived performance, virtualise large datasets, isolate failures with Error Boundaries, and monitor real-user metrics using Browser Performance APIs and observability tools. This provides faster initial render, reduced server load, and better user experience at scale.

### Follow-up Interview Question

**"What if one API takes 10 seconds while the other 19 APIs finish in 500ms?"**

Expected discussion:

- Timeouts
- Request cancellation (`AbortController`)
- Partial rendering
- Retry strategy with exponential backoff
- Stale cache fallback
- Circuit breaker pattern

# Azure Application Insights (Interview Perspective)

**Azure Application Insights** is Microsoft's **Application Performance Monitoring (APM)** solution within **Azure Monitor**. It helps monitor application health, performance, failures, dependencies, and user behaviour in real time. [[bing.com]](https://bing.com/search?q=Azure+Application+Insights), [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

Your organisation's Azure architecture references Application Insights as a core observability component alongside Azure Monitor and Log Analytics for distributed tracing, request tracking, exception monitoring, and alerting. [[PS3_Azure_...tem_Design | HTML]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/PS3_Azure_Architecture_Diagram/PS3_Azure_System_Design.html?web=1), [[PS3_Azure_...re_Diagram | HTML]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/PS3_Azure_Architecture_Diagram/PS3_Azure_Architecture_Diagram.html?web=1)

---

# What Does It Monitor?

### Application Metrics

- Request count
- Response time
- Throughput
- Error rate
- Availability

### Dependency Tracking

- REST APIs
- Databases
- Redis
- Service Bus
- External services

### Exception Tracking

Unhandled Exceptions

API Errors

500 Errors

JavaScript Errors

### User Analytics

- Sessions
- Users
- Page Views
- Click Events
- Conversion Funnels

### Distributed Tracing

Tracks a request across:

React UI

↓

API Gateway

↓

Microservice A

↓

Microservice B

↓

Database

This end-to-end tracing capability is highlighted in your organisation's Azure observability architecture. [[PS3_Azure_...tem_Design | HTML]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/PS3_Azure_Architecture_Diagram/PS3_Azure_System_Design.html?web=1)

---

# Architecture Example

React App

    ↓

Application Insights SDK

    ↓

Azure Monitor

    ↓

Log Analytics

    ↓

Dashboards & Alerts

Enterprise observability patterns in your company's Azure designs connect Application Insights → Log Analytics → Azure Monitor Alerts. [[PS3_Azure_...tem_Design | HTML]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/PS3_Azure_Architecture_Diagram/PS3_Azure_System_Design.html?web=1)

---

# React Integration Example

Install:

npm install @microsoft/applicationinsights-web

``

Initialize:

import { ApplicationInsights }

from '@microsoft/applicationinsights-web';

const appInsights =

new ApplicationInsights({

  config: {

    connectionString:

      process.env.REACT_APP_AI_CONNECTION

  }

});

appInsights.loadAppInsights();

``

Track page views:

appInsights.trackPageView();

Track custom event:

appInsights.trackEvent({

  name: "DashboardLoaded"

});

---

# API Monitoring

Application Insights automatically captures:

GET /users

POST /orders

PUT /profile

``

Metrics:

Response Time

Success Rate

Failure Rate

Request Volume

Example:

appInsights.trackDependencyData({

  target: "/api/users",

  duration: 250

});

---

# Exception Monitoring

try {

   await getUsers();

}

catch(error){

   appInsights.trackException({

      exception: error

   });

}

Dashboard shows:

Exception Type

Stack Trace

User Session

Timestamp

Affected Users

---

# Most Important Interview Feature: Distributed Tracing

Imagine:

User clicks button

↓

Frontend API call

↓

Gateway

↓

User Service

↓

Payment Service

↓

SQL Database

Application Insights shows:

Total Transaction: 1.8 sec

Frontend      50 ms

Gateway       20 ms

User API     100 ms

Payment API 1200 ms  ← Bottleneck

Database      430 ms

This helps quickly locate performance issues. Your organisation's Azure reference architecture explicitly identifies Application Insights for distributed tracing across microservices. [[PS3_Azure_...tem_Design | HTML]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/PS3_Azure_Architecture_Diagram/PS3_Azure_System_Design.html?web=1)

---

# Common Metrics Interviewers Ask About

| Metric              | Meaning            |
| ------------------- | ------------------ |
| Requests            | Total API calls    |
| Response Time       | API speed          |
| Failures            | Error count        |
| Availability        | Uptime             |
| Dependency Duration | External call time |
| Exceptions          | App crashes        |
| Users               | Active users       |
| Sessions            | User sessions      |

---

# Kusto Query Language (KQL)

Application Insights data can be queried using KQL via Log Analytics. Enterprise guidance in your organisation references Log Analytics for centralised log analysis and KQL-based investigations. [[PS3_Azure_...tem_Design | HTML]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/PS3_Azure_Architecture_Diagram/PS3_Azure_System_Design.html?web=1)

Example:

requests

| where duration > 1000

| order by timestamp desc

Failed requests:

requests

| where success == false

Top slow APIs:

requests

| summarize avg(duration) by name

| order by avg_duration desc

---

# Dashboard Scenario (20 Widgets Question)

For a dashboard with 20 APIs:

Monitor:

Widget Load Time

API Latency

Failed Widgets

Client Errors

Server Errors

Track:

appInsights.trackEvent({

  name: "RevenueWidgetLoaded"

});

This helps identify:

Revenue Widget → 100ms

Sales Widget → 150ms

Reports Widget → 4 sec ← Problem

---

# Alerting

Configure alerts:

Error Rate > 5%

P95 Latency > 2 sec

CPU > 80%

Availability < 99%

Your organisation's Azure monitoring design includes alerting thresholds such as API response time breaches, queue depth issues, and service failures. [[PS3_Azure_...tem_Design | HTML]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/PS3_Azure_Architecture_Diagram/PS3_Azure_System_Design.html?web=1)

---

# Senior/Lead Interview Answer

> Azure Application Insights is an APM service within Azure Monitor used for end-to-end observability. It provides request monitoring, dependency tracking, exception analysis, distributed tracing, real-user monitoring, dashboards, and alerting. In a React and microservices environment, I use it to track user journeys, API performance, frontend failures, and backend bottlenecks. Combined with Log Analytics and KQL, it enables proactive monitoring, root-cause analysis, and production incident diagnostics. [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview), [[PS3_Azure_...tem_Design | HTML]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/PS3_Azure_Architecture_Diagram/PS3_Azure_System_Design.html?web=1)

### One-Line Interview Summary

> **Application Insights is Azure's APM solution that provides real-time monitoring, distributed tracing, failure analysis, performance diagnostics, and observability across frontend, backend, and cloud services.** [[bing.com]](https://bing.com/search?q=Azure+Application+Insights), [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

## 1\. How to Set Up Alerts in Azure Application Insights

Application Insights integrates with **Azure Monitor Alerts**, allowing you to proactively detect failures, performance degradation, and availability issues. Application Insights provides alerting, metrics, logs, failure analysis, performance monitoring, and availability monitoring capabilities. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

### Common Alert Scenarios

#### API Response Time Alert

Trigger when API latency exceeds a threshold.

Condition:

Average Response Time > 2 seconds

For:

5 minutes

``

Useful for detecting:

- Slow backend services
- Database bottlenecks
- Network issues

[[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

#### Failed Request Alert

Trigger when application errors increase.

Condition:

Failed Requests > 5%

Use cases:

- Deployment failures
- External dependency outages
- Authentication issues

[[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

#### Availability Alert

Application Insights supports availability monitoring to test endpoint responsiveness and availability. [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

Example:

Availability < 99%

---

### Alert Configuration Flow

Azure Portal

   ↓

Application Insights

   ↓

Monitoring

   ↓

Alerts

   ↓

Create Alert Rule

   ↓

Select Signal

   ↓

Configure Threshold

   ↓

Configure Action Group

Action Groups can notify:

- Email
- SMS
- Teams/Webhook
- Azure Automation

The sources confirm Application Insights supports alerts and notification workflows through Azure Monitor. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

### KQL-based Log Alert Example

Find slow requests:

requests

| where duration > 2000

``

Find failed requests:

requests

| where success == false

``

Create a Log Alert that executes periodically and triggers when results exceed a defined threshold.

Application Insights stores telemetry in Azure Monitoring Logs for querying and alerting. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

# 2\. Integrating Application Insights with a React Application

Application Insights supports JavaScript applications and provides SDKs for collecting telemetry such as page views, custom events, exceptions, user sessions, and performance data. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

## Step 1: Install SDK

npm install @microsoft/applicationinsights-web

---

## Step 2: Create Application Insights Configuration

// appInsights.js

import { ApplicationInsights }

from "@microsoft/applicationinsights-web";

const appInsights =

  new ApplicationInsights({

    config: {

      connectionString:

        process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING

    }

  });

appInsights.loadAppInsights();

export default appInsights;

Microsoft recommends using **connection strings** for new applications. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1)

---

## Step 3: Track Page Views

import { useEffect } from "react";

import appInsights from "./appInsights";

function Dashboard() {

  useEffect(() => {

    appInsights.trackPageView({

      name: "Dashboard"

    });

  }, []);

  return <h1>Dashboard</h1>;

}

Application Insights can track user interactions, sessions, events, and page activity. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

## Step 4: Track Custom Events

appInsights.trackEvent({

  name: "RevenueWidgetLoaded"

});

Useful for:

- Dashboard widget loads
- Button clicks
- Form submissions
- User journeys

[[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

## Step 5: Track Exceptions

try {

   await loadDashboard();

}

catch(error) {

   appInsights.trackException({

      exception: error

   });

}

Application Insights includes failure analysis and exception monitoring capabilities. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

## Step 6: Track API Performance

### Axios Interceptor Example

axios.interceptors.request.use(config => {

  config.metadata = {

    startTime: Date.now()

  };

  return config;

});

axios.interceptors.response.use(

  response => {

    const duration =

      Date.now() -

      response.config.metadata.startTime;

    appInsights.trackDependencyData({

      target: response.config.url,

      duration

    });

    return response;

  }

);

Application Insights supports dependency monitoring and performance analysis across service calls. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

## Step 7: Measure React Render Performance

useEffect(() => {

  performance.mark("start");

  return () => {

    performance.mark("end");

    performance.measure(

      "DashboardRender",

      "start",

      "end"

    );

  };

}, []);

Send custom measurements:

appInsights.trackMetric({

   name: "DashboardRenderTime",

   average: renderDuration

});

Application Insights can visualise metrics and trends for performance investigations. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1)

---

# Production-Grade React Monitoring Architecture

React App

   ↓

Application Insights SDK

   ↓

Azure Monitor

   ↓

Log Analytics

   ↓

Dashboards

   ↓

Alerts

This architecture aligns with Microsoft's Application Insights observability model and matches the Azure monitoring pattern referenced in your organisation's Azure architecture materials. [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1), [[AI_Intevie...d_00003240 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Tushar%20Rathod_00003240.pdf?web=1)

## Interview Answer (Senior/Lead Level)

> In React applications, I integrate the Application Insights JavaScript SDK using a connection string, then capture page views, custom events, exceptions, API dependencies, and performance metrics. In Azure, I configure Azure Monitor alerts for response times, failed requests, availability, and custom KQL queries. This provides end-to-end observability with dashboards, distributed tracing, proactive alerting, and faster production issue diagnosis. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/13-Multi-Cloud-Mapping.md?web=1), [[Real Stori...eal Impact | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Real-Stories.aspx?web=1), [[AI_Intevie...d_00003240 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Tushar%20Rathod_00003240.pdf?web=1)

These are **very common Staff/Lead React + Microservices interview topics**.

---

# 1\. Datadog

**Datadog** is a cloud-based observability platform used for:

- Application Performance Monitoring (APM)
- Infrastructure Monitoring
- Logs
- Distributed Tracing
- Real User Monitoring (RUM)
- Synthetic Monitoring

Datadog provides end-to-end tracing across browsers, APIs, services, and databases and correlates traces, logs, metrics, and user monitoring data for troubleshooting. [[datadoghq.com]](https://www.datadoghq.com/product/apm/), [[docs.datadoghq.com]](https://docs.datadoghq.com/tracing/)

Your organisation also has internal material describing Datadog as a unified observability platform with APM, RUM, synthetic monitoring, infrastructure monitoring, and AI-driven anomaly detection. [[Persistent...Datadog 01 | PDF]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/CorporateInformation/Partnerships/CIS%20Offerings/Datadog-%20CIS%20offerings/Persistent%20+%20Datadog%2001.pdf?web=1), [[Datadog | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B6792FB78-F1EB-46D4-A5A5-0DA816A063BB%7D&file=Datadog.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

### Example Architecture

React App

    ↓

API Gateway

    ↓

Node API

    ↓

Redis

    ↓

Database

Datadog traces every request.

Total Response Time = 2.4s

Frontend     100ms

Gateway       20ms

Node API    1200ms

Redis        800ms

Database     280ms

Bottleneck becomes obvious.

---

# 2\. New Relic

**New Relic** is a full-stack observability platform that provides application monitoring, infrastructure monitoring, distributed tracing, browser monitoring, logs, and AI-powered insights. [[New_Relic | HTML]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/ProductEnggServicesShowroom/Reference%20Folder/Francisco%20Partners%20CXO%20event/03_Research%20Dossiers/Existing%20Engagements%20Dossiers/New_Relic.html?web=1), [[newrelic.com]](https://newrelic.com/platform/application-monitoring)

Key features include:

APM

Infrastructure Monitoring

Distributed Tracing

Error Tracking

Browser Monitoring

Alerts

New Relic focuses on:

- Application performance
- User experience
- Business transaction visibility
- Root-cause analysis

[[newrelic.com]](https://newrelic.com/platform/application-monitoring), [[New_Relic | HTML]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/ProductEnggServicesShowroom/Reference%20Folder/Francisco%20Partners%20CXO%20event/03_Research%20Dossiers/Existing%20Engagements%20Dossiers/New_Relic.html?web=1)

### React Example

newrelic.addPageAction(

  'DashboardLoaded'

);

Track:

- Page loads
- API latency
- User actions
- Errors

---

# Datadog vs New Relic

| Feature             | Datadog | New Relic |
| ------------------- | ------- | --------- |
| APM                 | ✅       | ✅         |
| RUM                 | ✅       | ✅         |
| Logs                | ✅       | ✅         |
| Infra Monitoring    | ✅       | ✅         |
| Distributed Tracing | ✅       | ✅         |
| Dashboards          | ✅       | ✅         |
| OpenTelemetry       | ✅       | ✅         |

Both are commonly used enterprise observability platforms. Internal observability guidance also lists Datadog and New Relic as commercial APM options alongside OpenTelemetry-based stacks. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2023/Propeller%20group%204/Propeller_Team4/L-D/cloud-native-design/08-Observability.md?web=1), [[Persistent...P_20260306 | Word]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B21E7DD10-27FE-46E8-A412-5F30413CDDF6%7D&file=Persistent%20Proposal%20for%20Garuda%20Aerospace%20RFP_20260306.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 3\. Correlation IDs

### Most Frequently Asked Interview Topic

A **Correlation ID** is a unique identifier attached to every request.

Example:

REQ-12345

Request flow:

Browser

↓

Gateway

↓

User Service

↓

Payment Service

↓

Database

All logs contain:

CorrelationId=REQ-12345

Example log:

[INFO]

CorrelationId=REQ-12345

User Login Started

[ERROR]

CorrelationId=REQ-12345

Database Timeout

Now you can trace the same transaction across dozens of microservices.

Internal engineering guidance explicitly recommends including correlation IDs in logs to support distributed tracing. [[dotnet-C#-...guidelines | PDF]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/dotnet-C#-coding-guidelines.pdf?web=1)

---

# Node.js Implementation

### Middleware

import { v4 as uuid } from 'uuid';

app.use((req, res, next) => {

  req.correlationId = uuid();

  res.setHeader(

    'X-Correlation-ID',

    req.correlationId

  );

  next();

});

### Logging

logger.info({

   correlationId:

     req.correlationId

});

---

# 4\. API Latency Dashboards

Every production application should visualize API performance.

### Typical Dashboard

API Name

Average Latency

P95 Latency

P99 Latency

Requests/sec

Errors

Example:

GET /users

Avg  = 200ms

P95  = 900ms

P99  = 2500ms

### Why P95/P99?

Average hides problems.

Example:

99 requests = 100ms

1 request = 10sec

Average:

199ms

Looks healthy.

P99:

10 sec

Clearly unhealthy.

---

### Interview Answer

Monitor:

P50

P95

P99

Throughput

Error Rate

Availability

Golden Signals commonly tracked in observability platforms:

Latency

Traffic

Errors

Saturation

These are reflected in internal observability reference architectures and monitoring guidance. [[Agentic_SR...nsolidated | Word]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/_layouts/15/Doc.aspx?sourcedoc=%7B39416C27-88DE-4969-9396-FB32058024BC%7D&file=Agentic_SRE_Platform_MVP1_Final_Consolidated.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[Agent_Spec...ring_Agent | Word]](https://persistentsystems.sharepoint.com/sites/AgenticAIEnabledSDLC/_layouts/15/Doc.aspx?sourcedoc=%7BABB29C39-972F-4F5A-830E-92FF64AB1B77%7D&file=Agent_Spec_06A_Observability_and_Monitoring_Agent.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 5\. Error-Rate Monitoring

Measures:

Failed Requests /

Total Requests

``

Formula:

Error Rate =

Errors / Requests \* 100

Example:

10,000 Requests

200 Errors

Error Rate = 2%

---

### Alert Example

Error Rate > 1%

Warning

Error Rate > 5%

Critical

Common monitored errors:

500 Internal Server Error

502 Bad Gateway

503 Service Unavailable

504 Timeout

---

# Real Production Dashboard

SERVICE HEALTH

✓ Request Rate

✓ Error Rate

✓ Latency

✓ Availability

✓ CPU

✓ Memory

✓ Database Calls

✓ Queue Length

✓ Dependency Failures

---

# Architect-Level Interview Answer

> In large-scale React and microservice systems, I use observability platforms such as Datadog or New Relic to collect metrics, logs, traces, and real-user monitoring data. Every request carries a correlation ID, allowing distributed tracing across services. API latency dashboards track P50, P95, and P99 response times, while error-rate monitoring helps detect service degradation before users are impacted. Combining tracing, dashboards, alerts, and correlation IDs significantly reduces MTTR and simplifies root-cause analysis. [[datadoghq.com]](https://www.datadoghq.com/product/apm/), [[docs.datadoghq.com]](https://docs.datadoghq.com/tracing/), [[newrelic.com]](https://newrelic.com/platform/application-monitoring), [[dotnet-C#-...guidelines | PDF]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/dotnet-C#-coding-guidelines.pdf?web=1)

### One-Line Interview Summary

> **Datadog/New Relic provide full-stack observability, correlation IDs enable end-to-end request tracing, latency dashboards expose performance bottlenecks, and error-rate monitoring ensures proactive detection of production issues.** [[datadoghq.com]](https://www.datadoghq.com/product/apm/), [[newrelic.com]](https://newrelic.com/platform/application-monitoring), [[dotnet-C#-...guidelines | PDF]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/dotnet-C#-coding-guidelines.pdf?web=1)

# Best Practices for Tracking API Dependencies in React with Application Insights

Microsoft's Application Insights automatically tracks AJAX/fetch/XHR dependencies in web applications and correlates dependency calls with requests, exceptions, and traces. For React applications, Microsoft also provides a dedicated React plugin that supports route tracking and component usage telemetry. [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/dependencies), [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-framework-extensions), [[npmjs.com]](https://www.npmjs.com/package/@microsoft/applicationinsights-react-js)

---

## 1\. Use the React Plugin

npm install </span>

  @microsoft/applicationinsights-web </span>

  @microsoft/applicationinsights-react-js

import { ApplicationInsights }

from '@microsoft/applicationinsights-web';

import { ReactPlugin }

from '@microsoft/applicationinsights-react-js';

const reactPlugin = new ReactPlugin();

const appInsights =

  new ApplicationInsights({

    config: {

      connectionString: process.env.REACT_APP_AI,

      extensions: [reactPlugin],

      enableAutoRouteTracking: true

    }

  });

appInsights.loadAppInsights();

The React plugin supports route tracking and React-specific telemetry collection. [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-framework-extensions), [[npmjs.com]](https://www.npmjs.com/package/@microsoft/applicationinsights-react-js)

---

## 2\. Let Application Insights Auto-Track Dependencies

Application Insights JavaScript SDK automatically collects AJAX/XHR dependencies and records:

API URL

Duration

Success/Failure

Response Code

Trace Context

For most HTTP requests:

fetch('/api/users');

axios.get('/api/users');

No custom tracking is required. Dependency telemetry is automatically collected and correlated. [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/dependencies), [[github.com]](https://github.com/microsoft/ApplicationInsights-node.js/issues/1333)

---

## 3\. Track Business-Critical Dependencies

Not every API is equally important.

Example:

appInsights.trackEvent({

  name: 'CheckoutStarted'

});

Track:

Payment API

Order API

Customer API

Fraud API

This helps correlate technical failures with business impact.

---

## 4\. Monitor Dependency Failures

Create dashboards around:

Top Slow APIs

Top Failed APIs

P95 Latency

P99 Latency

Dependency Failure Rate

Application Insights provides dependency duration and failure telemetry that can be analysed through Application Map and transaction diagnostics. [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/dependencies)

---

## 5\. Capture User Context

appInsights.setAuthenticatedUserContext(

  userId

);

This allows correlation of:

User

Session

Page View

API Calls

Exceptions

---

## 6\. Use OpenTelemetry Where Possible

Internal observability guidance recommends OpenTelemetry as the standard mechanism for telemetry generation and distributed tracing. [[OpenTeleme...or buildin | Viva Engage]](https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMzI3MjU2MDU4MTc1NDg4MCJ9), [[Persistent...ervability | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BDC5B4B45-78EA-4491-80A6-3942D2D19CA6%7D&file=Persistent%20Systems%20to%20Splunk%20-%20Capabilities_Observability.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[Persistent...troduction | PDF]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/EPESGodwon/ReferenceProposals/Shell/Persistent_Shell_Introduction.pdf?web=1)

Modern architecture:

React

↓

Application Insights

↓

OpenTelemetry

↓

Azure Monitor

---

# Correlation ID Implementation (Frontend + Backend)

## What Problem Does It Solve?

Imagine:

User clicks "Pay Now"

Request flow:

React

↓

API Gateway

↓

Order Service

↓

Payment Service

↓

Redis

↓

Database

Without a Correlation ID:

Thousands of logs

No way to connect them

With a Correlation ID:

CORR-abc123

Every service writes:

[CORR-abc123]

allowing end-to-end traceability.

Distributed tracing and trace correlation are core observability patterns highlighted throughout internal observability materials. [[Stitching...y -- Part 3 | SharePoint]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/Stitching-Events-into-Traces-for-Observability-%e2%80%93-Part-3.aspx?web=1), [[Persistent...y response | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7BB8DC8BD6-2E26-4528-8827-3F3E032A1303%7D&file=Persistent%20Metamo%20API%20gateway%20response.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[Netskope-P...e_Jan 2025 | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B8DD4B758-3F20-4049-98C5-0D940FA15C88%7D&file=Netskope-Persistent_Work%20Stream-360%20Degree_Jan%202025.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

---

# Frontend Implementation

Generate correlation ID per user operation.

import { v4 as uuid }

from 'uuid';

const correlationId = uuid();

Example:

axios.get('/api/users', {

  headers: {

    'X-Correlation-ID':

      correlationId

  }

});

---

## Axios Interceptor

axios.interceptors.request.use(

  config => {

    config.headers[

      'X-Correlation-ID'

    ] = crypto.randomUUID();

    return config;

  }

);

Every request now contains:

X-Correlation-ID:

3e6f7c9a-1234

---

# Backend Implementation (Node.js)

## Express Middleware

app.use((req, res, next) => {

  const correlationId =

      req.headers[

       'x-correlation-id'

      ] || crypto.randomUUID();

  req.correlationId =

      correlationId;

  res.setHeader(

      'X-Correlation-ID',

      correlationId

  );

  next();

});

---

## Structured Logging

Internal engineering guidance specifically recommends including correlation IDs in structured logs for distributed tracing. [[Diksha Sha...Evaluation | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-Feb/Diksha%20Shaw_00002450_AI_Inteview_Evaluation.pdf?web=1), [[TD_API_Eng...ring_Final | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4F6C3508-6380-4200-9858-3BD259717E3B%7D&file=TD_API_Engineering_Final.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

logger.info({

  correlationId:

     req.correlationId,

  message:

     'User login'

});

Output:

{

  "correlationId":

    "3e6f7c9a",

  "message":

    "User login"

}

---

# Cross-Service Propagation

Service A:

axios.post(

'/payment',

payload,

{

   headers: {

     'X-Correlation-ID':

       req.correlationId

   }

}

);

Service B:

const correlationId =

req.headers[

   'x-correlation-id'

];

Now the same ID flows through:

Gateway

API

Microservice

Database

External API

---

# Application Insights + Correlation

Application Insights supports request/dependency correlation and automatically correlates HTTP calls when both frontend and backend are properly instrumented. Microsoft guidance indicates that additional manual context propagation is generally unnecessary when both sides are instrumented with Application Insights SDKs. [[github.com]](https://github.com/microsoft/ApplicationInsights-node.js/issues/1333), [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/dependencies)

Architecture:

React

↓

Trace ID

↓

API Gateway

↓

Node Service

↓

Payment Service

↓

SQL

Application Insights can display:

Request

├─ Dependency

├─ Dependency

├─ Exception

└─ SQL Call

as a single transaction view. [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/dependencies)

---

# Senior Architect Interview Answer

> In React, I use the Application Insights React SDK with automatic dependency tracking for fetch and Axios calls, while capturing custom business events for critical journeys. For distributed systems, I implement correlation IDs and propagate them through headers across all services. On the backend, correlation IDs are logged as structured metadata and included in outgoing service calls. Application Insights then correlates requests, dependencies, and exceptions into a single trace, enabling rapid root-cause analysis and end-to-end observability. [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/dependencies), [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/azure-monitor/app/javascript-framework-extensions), [[github.com]](https://github.com/microsoft/ApplicationInsights-node.js/issues/1333), [[TD_API_Eng...ring_Final | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B4F6C3508-6380-4200-9858-3BD259717E3B%7D&file=TD_API_Engineering_Final.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

# 1\. Best Practices for Handling Correlation IDs in Microservices

Correlation IDs enable end-to-end request tracing across gateways, APIs, queues, databases, and external services. Internal observability guidance and distributed tracing materials emphasise correlation IDs as a key mechanism for correlating logs, metrics, and traces and for distributed tracing across services.

## Recommended Practices

### Generate at the Edge

Generate the Correlation ID only once:

Browser

    ↓

API Gateway

    ↓

Microservices

The gateway should:

- Accept an incoming Correlation ID if present
- Generate one if missing
- Propagate it downstream

Internal interview and architecture material describes gateway-based generation and propagation when external systems do not provide identifiers. [[ Looking f...ewadi)

I | Viva Engage]](<https://engage.cloud.microsoft/main/threads/eyJfdHlwZSI6IlRocmVhZCIsImlkIjoiMzg5NDIyNDI3ODcwODIyNCJ9>)

---

### Propagate Everywhere

Pass the same ID through:

HTTP Headers

Message Queues

Events

Background Jobs

Example:

X-Correlation-ID: 4f9a32ec

This allows a single transaction to be reconstructed across multiple systems.

---

### Include in Structured Logs

{

  "correlationId":"4f9a32ec",

  "service":"payment-service",

  "message":"Payment initiated"

}

Internal engineering guidelines explicitly recommend including correlation IDs in all log entries for distributed tracing. [[React Fron..._5.1_grade | PDF]](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/Shared%20Documents/General/React%20Frontend%20Developer_Gunjan%20Yadav_5.1_grade.pdf?web=1)

---

### Correlate Logs + Metrics + Traces

Avoid treating them separately.

Trace

↓

Logs

↓

Metrics

Unified observability platforms should correlate all three telemetry types for faster root-cause analysis. [[UI_Intervi..._Questions | Word]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [[AI_Intevie...d_00003240 | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/Myriad/AI_Inteview_Evaluation_Tushar%20Rathod_00003240.pdf?web=1)

---

### Use OpenTelemetry Trace Context

Where possible use:

traceparent

tracestate

OpenTelemetry is repeatedly referenced internally as the preferred standard for telemetry and distributed tracing. [[Persistent...ementation | PowerPoint]](https://persistentsystems.sharepoint.com/sites/EIS-SE-UserExperience/_layouts/15/Doc.aspx?sourcedoc=%7B1150C70C-874E-4CBC-84BE-79DC965F1FE7%7D&file=Persistent%20Proposal%20-%20ISG%20Decision%20Support%20Platform%20Implementation.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1), [[UI_Intervi..._Questions | Word]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 2\. How to Visualise API Latency Dashboards Effectively

A common mistake is showing only average response time.

## Dashboard Layout

### Service Overview

Requests/sec

P50

P95

P99

Error %

Availability

Observability guidance highlights latency, traffic, errors, and service health as key monitoring signals.

---

### Use Multiple Percentiles

| Metric | Purpose                  |
| ------ | ------------------------ |
| P50    | Typical user experience  |
| P95    | Majority user experience |
| P99    | Worst-case experience    |

Example:

P50 = 100ms

P95 = 800ms

P99 = 4 sec

The average may appear healthy while a small percentage of users experience severe slowness.

---

### Top Slow APIs Widget

GET /users      2.1s

POST /payment   1.8s

GET /orders     1.5s

Sort by:

P95 latency

P99 latency

rather than average latency.

---

### Dependency Breakdown

Show latency split:

Frontend      80ms

Gateway       20ms

API          300ms

Database     900ms

Dependency tracking and tracing capabilities are specifically supported by Application Insights and modern observability platforms.

---

### Heatmaps

Visualise:

Time of Day

vs

Response Time

Helps identify:

- Traffic spikes
- Deployment impact
- Regional issues

---

### Correlation View

Allow engineers to drill into:

Latency Spike

↓

Trace

↓

Correlation ID

↓

Exact Logs

This aligns with observability recommendations to correlate metrics, logs, and traces. [[UI_Intervi..._Questions | Word]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# 3\. Error-Rate Monitoring and Alerting Strategy

## Track Error Rate as a Percentage

Formula:

Error Rate =

Failed Requests /

Total Requests × 100

Example:

100,000 requests

2,000 failures

Error Rate = 2%

---

## Monitor by Service

Bad:

Global Error Rate

Better:

Auth Service

Payments

Orders

Inventory

Notifications

This immediately identifies the failing component.

---

## Separate Errors by Type

Track:

4xx Errors

5xx Errors

Timeouts

Dependency Failures

Network Errors

Observability material highlights dependency monitoring, tracing, platform health, and failure monitoring.

---

## Configure Multi-Level Alerts

### Warning

Error Rate > 1%

for 5 minutes

### Critical

Error Rate > 5%

for 5 minutes

### Emergency

Error Rate > 10%

Internal monitoring guidance includes threshold-based alerts for latency and error conditions.

---

## Alert on Error Budget Burn

Instead of only checking errors:

SLO = 99.9%

Monitor how quickly the service is consuming its error budget.

Benefits:

- Fewer false alarms
- Better alignment with business impact

---

## Correlate Alerts with Traces

When an alert fires:

High Error Rate

     ↓

View Trace

     ↓

View Correlation ID

     ↓

Find Exact Failure

This significantly reduces Mean Time To Resolution (MTTR) and is consistent with the observability emphasis on trace correlation and root-cause analysis. [[UI_Intervi..._Questions | Word]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

---

# Staff Engineer / Architect Interview Answer

> In large-scale microservice systems, I generate correlation IDs at the gateway, propagate them across all synchronous and asynchronous calls, and include them in structured logs. For latency monitoring, I focus on P50, P95, and P99 dashboards, dependency breakdowns, and distributed traces rather than averages. For reliability, I monitor service-specific error rates, dependency failures, and SLO-based alerting. By correlating alerts, traces, logs, and metrics through a single correlation ID, production issues can be diagnosed and resolved much faster. [[React Fron..._5.1_grade | PDF]](https://persistentsystems.sharepoint.com/sites/MyLifeAtPersistent731/Shared%20Documents/General/React%20Frontend%20Developer_Gunjan%20Yadav_5.1_grade.pdf?web=1), [[UI_Intervi..._Questions | Word]](https://persistentsystems.sharepoint.com/sites/interviewquestions/_layouts/15/Doc.aspx?sourcedoc=%7B5A47BCB6-A3FC-4EAF-A505-7DD1A0BF3308%7D&file=UI_Interview_Questions.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

Here is a comprehensive breakdown of the key concepts, code implementations, and architectural strategies covered across your masterclass materials—structured cleanly for **Senior / Lead / Staff React Architect** interviews.

---

## Part 1: Core API Architecture & Best Practices

### 1. Fetch API vs. Axios

| Feature                  | Fetch API                                                                      | Axios                                              |
| ------------------------ | ------------------------------------------------------------------------------ | -------------------------------------------------- |
| **Environment**          | Built-in (Browsers, Node 18+)                                                  | Third-party library (`npm install axios`)          |
| **JSON Parsing**         | Manual (`res.json()`)                                                          | Automatic (`res.data`)                             |
| **HTTP Error Handling**  | Rejects **only** on network failure (404/500 are treated as resolved promises) | Rejects on any status code outside the `2xx` range |
| **Interceptors**         | ❌ Requires custom wrapper functions                                            | ✅ Native request and response interceptors         |
| **Request Cancellation** | Manual via `AbortController`                                                   | Built-in via `AbortController` / `CancelToken`     |
| **Progress Monitoring**  | Native streams (Complex)                                                       | Native `onUploadProgress` / `onDownloadProgress`   |

**Interview Script:**

> *"While `fetch` works well for lightweight apps or Next.js server components, enterprise React applications prefer Axios because of request/response interceptors, automatic JSON transformation, centralized error handling, and simpler request cancellation."*

---

### 2. Preventing Memory Leaks & Race Conditions

When a component unmounts or a user rapidly changes filter parameters, pending HTTP requests must be cancelled to avoid setting state on unmounted components or updating UI with stale data out-of-order.

#### Using Native `AbortController` in `useEffect`

```javascript
import { useState, useEffect } from "react";
import axios from "axios";

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUser() {
      try {
        const response = await axios.get(`/api/users/${userId}`, {
          signal: controller.signal,
        });
        setUser(response.data);
      } catch (err) {
        // Ignore aborted request errors
        if (!axios.isCancel(err)) {
          setError(err.message);
        }
      }
    }

    fetchUser();

    // Clean up: abort ongoing request on unmount or when userId changes
    return () => controller.abort();
  }, [userId]);

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;

  return <div>{user.name}</div>;
}
```

---

### 3. Avoiding Search Keystroke Spam (Debounce + Cancellation)

For live search inputs, combine **debouncing** with **request cancellation** to ensure only the latest search query reaches the UI.

```javascript
import { useState, useEffect } from "react";
import axios from "axios";

export function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    // 1. Debounce execution by 300ms
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `/api/search?q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
          },
        );
        setResults(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Search failed:", err);
        }
      }
    }, 300);

    // 2. Clean up timer and cancel in-flight request if user types again
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />
      <ul>
        {results.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Part 2: Enterprise API Architecture Patterns

### Scalable Directory Layout

```text
src/
├── api/
│   ├── apiClient.js          # Axios instance, baseURL, timeout, base interceptors
│   ├── retry.js              # Exponential backoff utility
│   └── circuitBreaker.js     # State machine circuit breaker
├── services/
│   ├── userService.js        # User domain API methods & response mapping
│   └── productService.js     # Product domain API methods
├── hooks/
│   ├── useUsers.js           # Custom hook wrapping TanStack Query / state
│   └── useDebounce.js        # Reusable debounce utility
└── components/
    └── UsersTable.jsx        # Presentation UI component

```

---

### Production-Grade Axios Interceptor (Auth + Token Refresh Queue)

Handles automatic JWT token injection and queues requests while refreshing expired access tokens on `401 Unauthorized` responses.

```javascript
import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://api.company.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 1. Request Interceptor: Attach Token & Correlation ID
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Inject Correlation ID for end-to-end distributed tracing
  config.headers["X-Correlation-ID"] = crypto.randomUUID();
  return config;
});

// 2. Response Interceptor: Seamless Token Refreshing
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post("/auth/refresh", {
          token: refreshToken,
        });

        localStorage.setItem("token", data.accessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
```

---

## Part 3: Architect-Level Scenario Answers

### Scenario 1: "Dashboard with 20 Widgets calling APIs simultaneously"

> **How to Answer in an Interview:**
> *"For a dashboard with 20 widgets, I address network congestion, browser connection limits (max 6 connections per domain), and backend load using a six-part architecture strategy:"*

```
                             ┌───────────────────────────────┐
                             │       Dashboard Page          │
                             └───────────────┬───────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
            ┌───────────────────┐                         ┌───────────────────┐
            │  P0: Critical UI  │                         │ P1/P2: Below-Fold │
            └─────────┬─────────┘                         └─────────┬─────────┘
                      │                                             │
          ┌───────────┴───────────┐                        ┌────────┴────────┐
          ▼                       ▼                        ▼                 ▼
   ┌─────────────┐         ┌─────────────┐          ┌─────────────┐   ┌─────────────┐
   │ React Query │         │     BFF     │          │Intersection │   │ Idle / SSE  │
   │ Caching &   │    OR   │ Aggregated  │          │ Observer    │   │ Push Stream │
   │ Deduplication         │   Endpoint  │          │ Lazy Load   │   └─────────────┘
   └─────────────┘         └─────────────┘          └─────────────┘

```

1. **Business Priority Partitioning:** Split widgets into tiers:

- **P0 (Critical):** Revenue, Active Alerts $\rightarrow$ Fetch immediately.
- **P1 (Primary):** Recent Transactions $\rightarrow$ Fetch right after initial paint.
- **P2 (Secondary):** Historical Charts $\rightarrow$ Lazy load below the fold using `IntersectionObserver`.

1. **Backend-for-Frontend (BFF) / Aggregation:** Instead of firing 20 individual client-side requests, introduce a `/api/v1/dashboard/summary` endpoint to aggregate data into a single payload.
2. **Caching & Deduplication (TanStack Query):** If widgets share endpoints (e.g., three widgets consuming `GET /users/me`), TanStack Query collapses them into **one** network request.
3. **Perceived Performance:** Render skeleton cards (`<Skeleton/>`) to eliminate cumulative layout shifts (CLS).
4. **Fault Isolation:** Wrap every widget in an independent React `ErrorBoundary`. If one widget API returns `500 Internal Server Error`, the remaining 19 widgets remain fully interactive.
5. **Non-Critical Deferral:** Use `requestIdleCallback()` for low-priority tracking or reporting telemetry.

---

### Scenario 2: "What if 1 API takes 10s while the other 19 finish in 500ms?"

> **Follow-Up Solution:**
>
> 1. **Strict Timeouts:** Set request timeouts on individual widgets (e.g., 5 seconds) via `AbortController`.
> 2. **Partial Rendering:** Render widgets as their respective promises resolve rather than waiting for `Promise.all()`.
> 3. **Stale-While-Revalidate Fallback:** If an API call times out or fails, serve cached data from `localStorage` or TanStack Query cache while displaying a subtle *"Updated 10m ago"* indicator.
> 4. **Circuit Breaker:** If a downstream service fails repeatedly, open the circuit immediately so subsequent requests fail fast without clogging network pipelines.

---

## Part 4: Observability, Distributed Tracing & Azure App Insights

### 1. Azure Application Insights React Integration

```tsx
import { useEffect } from "react";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
  },
});

appInsights.loadAppInsights();

export { appInsights, reactPlugin };

// Example Component Tracking
export function AnalyticsDashboard() {
  useEffect(() => {
    // Custom Page View
    appInsights.trackPageView({ name: "Analytics Dashboard" });

    // Performance Mark
    performance.mark("dashboard_mount_start");

    return () => {
      performance.mark("dashboard_mount_end");
      performance.measure(
        "dashboard_mount_time",
        "dashboard_mount_start",
        "dashboard_mount_end",
      );
    };
  }, []);

  const handleExportReport = () => {
    // Custom Business Event
    appInsights.trackEvent({
      name: "ExportReportClicked",
      properties: { format: "PDF" },
    });
  };

  return <button onClick={handleExportReport}>Export PDF</button>;
}
```

---

### 2. Distributed Tracing with Correlation IDs

A **Correlation ID** (`X-Correlation-ID` or OpenTelemetry `traceparent`) ties together every client action across frontend apps, API gateways, microservices, and databases.

```
React UI ──(X-Correlation-ID: 3e6f)──> API Gateway ──(3e6f)──> User Service ──(3e6f)──> SQL DB

```

#### Node.js / Express Middleware Example

```javascript
import { v4 as uuidv4 } from "uuid";

export function correlationIdMiddleware(req, res, next) {
  // Use incoming ID or generate a new one at the edge
  const correlationId = req.headers["x-correlation-id"] || uuidv4();

  req.correlationId = correlationId;
  res.setHeader("X-Correlation-ID", correlationId);

  // Attach to logger context
  req.logger = {
    info: (msg) => console.log(`[INFO] [CorrID: ${correlationId}] ${msg}`),
    error: (msg) => console.error(`[ERROR] [CorrID: ${correlationId}] ${msg}`),
  };

  next();
}
```

---

### 3. Key Observability Metrics (Datadog / New Relic / Azure Monitor)

| Metric Category         | Target Indicators                                 | Why It Matters                                                                                                                        |
| ----------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Latency Percentiles** | **P50, P95, P99**                                 | Averages hide outlier issues. P99 shows the worst-case speed experienced by 1% of users (e.g., 10,000 requests/min = 100 slow users). |
| **Golden Signals**      | **Latency, Traffic, Errors, Saturation**          | Standard SRE framework for measuring system health.                                                                                   |
| **Error Rates**         | **Failed Requests / Total Requests $\times$ 100** | Triggers automated alerts when error rates cross thresholds ($>1\%$ Warning, $>5\%$ Critical).                                        |
| **User Metrics (RUM)**  | **FCP, LCP, INP, CLS**                            | Measures real-user experience and Core Web Vitals directly inside the browser.                                                        |

---

### 4. Useful Kusto Query Language (KQL) Snippets

#### Query 1: Find Top 5 Slowest API Endpoints (P95 Latency)

```kql
requests
| where timestamp > ago(24h)
| summarize P95_Duration = percentiles(duration, 95), TotalCount = count() by name
| order by P95_Duration desc
| take 5

```

#### Query 2: Track Failed Requests Correlated with Exceptions

```kql
requests
| where success == false
| join kind=inner (
    exceptions
) on operation_Id
| project timestamp, name, resultCode, customDimensions, exceptionType, outerMessage
| order by timestamp desc

```
