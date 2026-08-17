**React Performance Tracks** are specialized custom entries that appear directly on your browser developer tools' Performance panel timeline. They provide deep, synchronized visibility into your React application's internal events, concurrent scheduling, and component-level timings alongside standard browser metrics like network requests, JavaScript execution, and event loop activity.

---

## 1. Usage & Availability

React Performance tracks are available in **Development** and **Profiling** builds of React:

* **Development Builds:** Enabled by default. All tracks (Scheduler, Components, and Server tracks) are fully active.
* **Profiling Builds (`react-dom/profiling`):** Only the **Scheduler** track is enabled by default. The **Components** track only records components wrapped in `<Activity>` unless the React Developer Tools browser extension is installed. Server tracks are not available in profiling builds.
* **Production Builds:** Disabled by default because profiling instrumentation introduces slight overhead.

---

## 2. Track Categories

### Scheduler

The **Scheduler** track provides insight into React's internal task prioritization engine. It breaks down tasks into four distinct priority subtracks:

* **Blocking:** Synchronous updates typically triggered by urgent user interactions (e.g., clicks, typing).
* **Transition:** Non-blocking background work triggered by `startTransition` or non-urgent state updates.
* **Suspense:** Work related to Suspense boundaries (e.g., displaying fallbacks or revealing suspended content).
* **Idle:** Low-priority background tasks that run only when higher-priority work is clear.

Each render pass on the timeline follows clear lifecycle phases: **Update**, **Render**, **Commit** (layout effects like `useLayoutEffect`), and **Remaining Effects** (`useEffect`).

### Components

The **Components** track visualizes component render durations as an interactive **flame graph**. Each entry represents the time spent rendering a component and its descendant subtrees.

* **Color Intensity:** Darker shades indicate longer render durations, helping you instantly spot performance bottlenecks.
* **Lifecycle Events:** Displays specialized markers like `Mount`, `Unmount`, `Reconnect`, and `Disconnect`.

### Server

The **Server** tracks visualize server-side rendering (RSC) activity, captured promises, streaming data, and I/O operations (such as Server Requests and Server Component render durations) to help diagnose and optimize SSR performance.
