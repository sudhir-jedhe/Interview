In React, an API call itself (such as invoking `fetch()` or `axios.get()`) does not automatically leak memory. A **memory leak** occurs when asynchronous network operations retain references to component state, closures, DOM nodes, or resources after the component has unmounted, preventing the JavaScript Garbage Collector (GC) from reclaiming that memory.

---

### 1. Closures Retaining the Component Scope

When an API call is initiated inside a `useEffect` hook, the promise callbacks (`.then()`, `await`, or `.catch()`) capture the surrounding lexical scope.

```jsx
function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null);
  const largeDataset = new Array(1000000).fill("data"); // Heavy memory consumer

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        // This callback forms a closure over setUserData, largeDataset, and props.
        setUserData(data);
        console.log(largeDataset.length);
      });
  }, [userId]);

  return <div>{userData?.name}</div>;
}

```

* **The Mechanism:** If the user leaves the page while the API request is still pending, the Promise remains active in the browser's microtask/event queue.
* **The Leak:** Because the unresolved promise callback maintains a reference to `largeDataset` and `setUserData`, the entire component's lexical environment cannot be garbage-collected until the request completes or fails.

---

### 2. Dangling Event Listeners and Stream Readers

Certain API requests rely on open-ended streams or event listeners (such as Server-Sent Events, WebSockets, or chunked `ReadableStream` bodies).

```jsx
useEffect(() => {
  const eventSource = new EventSource("/api/live-updates");

  eventSource.onmessage = (event) => {
    setData(JSON.parse(event.data));
  };

  // Missing cleanup!
}, []);

```

* **The Mechanism:** Unlike standard HTTP requests that naturally close when the response finishes, connections like `EventSource` or `WebSocket` stay open indefinitely.
* **The Leak:** If no cleanup function closes the connection on unmount, the network socket stays alive, and the event listener retains references to React state updaters indefinitely.

---

### 3. Rapid Route/Prop Changes (Race Conditions + Uncollected Promises)

When props drive API requests (e.g., pagination or switching tabs quickly), initiating new requests without canceling prior ones causes pending promises to accumulate.

* Every fast transition leaves an orphaned promise executing in the background.
* Each unresolved promise holds its own closure chain, callbacks, and response parsing logic.
* If responses arrive out of order, you risk both memory bloat and UI bugs where stale data overwrites fresh state.

---

### 4. Global Interceptors and Module-Level Caches

Libraries like Axios or custom fetch wrappers often provide request and response interceptors.

```jsx
// Antipattern: Registering an interceptor inside a component without ejection
function Dashboard() {
  useEffect(() => {
    const interceptorId = axios.interceptors.response.use((response) => {
      // Do something with response
      return response;
    });

    // If interceptorId is not ejected on unmount, it stays registered globally
  }, []);
}

```

* **The Mechanism:** Interceptors are attached to the global `axios` instance.
* **The Leak:** The global instance retains the closure of the component where the interceptor was registered. Every time the component mounts, an additional interceptor is pushed into an internal array and never cleaned up.

---

### How to Prevent API-Related Leaks

#### A. Cancel Requests Using `AbortController`

Native `fetch` supports the `AbortController` API to abort in-flight requests when a component unmounts.

```jsx
useEffect(() => {
  const controller = new AbortController();
  const { signal } = controller;

  async function loadData() {
    try {
      const res = await fetch(`/api/users/${userId}`, { signal });
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Fetch error:", err);
      }
    }
  }

  loadData();

  // Cancel the request when component unmounts or userId changes
  return () => {
    controller.abort();
  };
}, [userId]);

```

#### B. Clean Up Persistent Connections

Always invoke teardown methods (`close()`, `unsubscribe()`, or `removeEventListener()`) inside the effect's cleanup return:

```jsx
useEffect(() => {
  const socket = new WebSocket("wss://example.com/socket");

  socket.onmessage = (event) => {
    setData(JSON.parse(event.data));
  };

  return () => {
    socket.close();
  };
}, []);

```

#### C. Use Dedicated Data-Fetching Libraries

Libraries like **TanStack Query (React Query)**, **SWR**, or **RTK Query** manage the request lifecycle automatically:

* They deduplicate requests and cancel out-of-order or unmounted network calls.
* They store data in an external cache with configurable garbage collection (`gcTime`), decoupling network payloads from transient component closures.
