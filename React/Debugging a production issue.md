Debugging a production issue requires a systematic, step-by-step approach because production environments differ from local development—code is minified, sourcemaps may be hidden, and live user data is involved.

Here is how to effectively leverage each tool throughout the production debugging lifecycle:

---

### Step-by-Step Production Debugging Workflow

```text
┌─────────────────────────────────────────────────────────┐
│ 1. TRIAGE & DETECTION                                   │
│    Sentry / Datadog / Server Logs (Identify the error)  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 2. REPRODUCTION & LOCALIZATION                          │
│    Network Tab / Console Log / DevTools (Trace API/State│
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ 3. DEEP DIAGNOSIS & PROFILING                           │
│    React DevTools Profile / Sources Tab / Sourcemaps   │
└─────────────────────────────────────────────────────────┘

```

---

### 1. Error Monitoring Tools (Sentry, Datadog, LogRocket)

* **When to use:** **First line of defense.** When a bug happens in the wild, you usually learn about it here before a user reports it.
* **How to use it:**
* **Stack Traces:** Inspect the exact line of code that threw the unhandled exception.
* **Breadcrumbs:** Look at user actions leading up to the error (clicks, console logs, network requests).
* **Replays (Session Replay):** Watch a video-like recording of the user's screen during the crash.
* **Tags & Environment:** Filter by browser version, OS, user ID, and release commit hash.

---

### 2. Server Logs (Winston, Morgan, AWS CloudWatch, Datadog Logs)

* **When to use:** When the client receives HTTP `5xx` errors, unexpected `4xx` responses, or API requests time out.
* **How to use it:**
* **Trace Correlation IDs:** Search logs using a unique `x-request-id` passed from the frontend to trace the exact lifecycle of a failing request.
* **Uncaught Exceptions / Rejections:** Identify crashes on the backend, database connection drops, or第三方 third-party API rate limits.

---

### 3. Network Tab (Browser DevTools)

* **When to use:** For bugs related to missing data, failed API calls, slow response times, or authentication issues.
* **How to use it:**
* **Status Codes:** Check for `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, or `500 Internal Server Error`.
* **Payload & Response:** Verify if the frontend sent correct payload params and if the backend payload matches expected TypeScript interfaces/contracts.
* **Headers:** Inspect CORS headers, authorization bearer tokens, and cookie headers (`Set-Cookie`).
* **Copy as cURL:** Right-click a failing request $\rightarrow$ **Copy as cURL** to reproduce and test the endpoint locally or via Postman.

---

### 4. Console Logs & Browser DevTools (Sources / Application Tabs)

* **When to use:** Debugging state anomalies, local browser storage issues, or runtime errors directly on a user's machine/reproduced environment.
* **How to use it:**
* **Sourcemaps:** Un-minify production code in the **Sources Tab** by enabling production sourcemaps (or uploading private sourcemaps to Sentry/Datadog so production bundles map back to original TypeScript/JSX files).
* **Conditional Breakpoints:** Right-click line numbers in Sources $\rightarrow$ **Add Conditional Breakpoint** (e.g., `userId === '123'`) to pause execution without freezing production for all paths.
* **Logpoints:** Add non-intrusive `console.log` statements directly inside the browser Sources tab without altering or redeploying build artifacts.
* **Storage Checks:** Inspect `Cookies`, `localStorage`, and `sessionStorage` in the **Application Tab** for stale cached states or invalid auth tokens.

---

### 5. React DevTools Profiler

* **When to use:** When production complaints are about **sluggish UI, laggy input fields, frame drops, or frozen screens** rather than outright crashes.
* **How to use it:**
* **Flamegraph Chart:** Identify which specific components re-rendered and how long they took.
* **Ranked Chart:** Quickly see the most expensive components on the screen.
* **"Why did this render?":** Enable "Record why each component rendered" in React DevTools settings to detect unnecessary re-renders caused by unstable prop references.

---

### Best Practices Summary Matrix

| Scenario                                           | Primary Debugging Tool                                            |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| **User reports "App crashed with a blank screen"** | **Sentry** (Find unhandled exception stack trace)                 |
| **API call fails with 500 Internal Server Error**  | **Server Logs** (CloudWatch/Datadog) via `x-request-id`           |
| **Incorrect data displayed on UI**                 | **Network Tab** (Check payload) + **React DevTools**              |
| **UI feels sluggish or freezes during typing**     | **React DevTools Profiler**                                       |
| **Auth token missing on request**                  | **Network Tab** (Headers) + **Application Tab** (Cookies/Storage) |
