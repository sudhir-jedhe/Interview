A **memory leak** in React occurs when a component allocates memory—such as subscribing to an event, initiating an interval, or creating an un-cancelled network request—and fails to release that memory when the component unmounts or when dependencies update.

Over time, accumulated memory leaks lead to high RAM consumption, UI lag, frozen tabs, and browser crashes.

---

### Part 1: Common Causes of React Memory Leaks

1. **Unsubscribed Event Listeners:** Attaching listeners to `window`, `document`, or DOM nodes inside `useEffect` without removing them in the cleanup function.
2. **Uncleared Timers & Intervals:** Setting `setInterval` or `setTimeout` without calling `clearInterval` or `clearTimeout`.
3. **Pending Async Requests & Promises:** Asynchronous API calls resolving after a component unmounts and attempting to update unmounted component state.
4. **Global Event Subscriptions / RxJS / EventEmitters:** Subscribing to global state stores, WebSockets, or RxJS Observables without unsubscribing on unmount.
5. **Retained Closures:** Storing heavy objects or functions inside refs or global state that prevent garbage collection.

---

### Part 2: How to Detect Memory Leaks

#### Method 1: Chrome DevTools Memory Profiler (Heap Snapshots)

This is the most reliable way to confirm and pinpoint memory leaks:

1. Open **Chrome DevTools** $\rightarrow$ Navigate to the **Memory** tab.
2. Select **Take heap snapshot** $\rightarrow$ Click **Take snapshot** (Snapshot 1).
3. Perform the suspected action in your app (e.g., open a modal or navigate to a route).
4. Close the modal or navigate away (triggering component unmount).
5. Force Garbage Collection by clicking the **Trash Can icon** in the top-left corner of DevTools.
6. Take a second heap snapshot (Snapshot 2).
7. Change the snapshot view from *Summary* to **Comparison** or **Objects allocated between Snapshot 1 and 2**.
8. Filter by component names or objects. If unmounted component DOM nodes or React Fibre nodes still exist in memory (highlighted as **Detached HTMLDivElement** or **Detached FiberNode**), you have a memory leak.

#### Method 2: Chrome DevTools Performance Monitor

1. Press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows) in DevTools $\rightarrow$ Search for **Show Performance Monitor**.
2. Monitor the **JS Heap Size** graph in real-time.
3. Repeatedly mount and unmount the component.
4. **Diagnosis:** If the JS Heap graph forms a **"Sawtooth Pattern"** that drops back to baseline after Garbage Collection, there is no leak. If the baseline continuously rises (a rising stairs pattern), memory is leaking.

---

### Part 3: How to Fix React Memory Leaks (Code Examples)

#### 1. Fix: Event Listener Cleanup

* **The Leak:**

```tsx
// ❌ LEAK: Event listener attached continuously on re-renders/unmount
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

```

* **The Fix:** Return a cleanup function from `useEffect` to remove the listener.

```tsx
// ✅ FIXED: Listener removed on component unmount
useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

```

---

#### 2. Fix: Timers & Intervals

* **The Leak:**

```tsx
// ❌ LEAK: Interval continues running in the background after unmount
useEffect(() => {
  setInterval(() => {
    setCount((prev) => prev + 1);
  }, 1000);
}, []);

```

* **The Fix:** Store the timer ID and clear it in the cleanup function.

```tsx
// ✅ FIXED: Interval cleared on unmount
useEffect(() => {
  const timerId = setInterval(() => {
    setCount((prev) => prev + 1);
  }, 1000);

  return () => {
    clearInterval(timerId);
  };
}, []);

```

---

#### 3. Fix: Pending Async API Requests (`AbortController`)

* **The Leak:**
If an API call takes 5 seconds to resolve and the user navigates away after 1 second, the resolved Promise will still attempt to update state on an unmounted component or hold closure references in memory.
* **The Fix:** Cancel the network request using `AbortController`.

```tsx
// ✅ FIXED: Cancels fetch request if component unmounts mid-request
useEffect(() => {
  const controller = new AbortController();

  async function fetchUserData() {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,
      });
      const data = await response.json();
      setUser(data);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError(error.message);
      }
    }
  }

  fetchUserData();

  return () => {
    controller.abort(); // Cancels in-flight HTTP request
  };
}, [userId]);

```

---

#### 4. Fix: Global Event Subscriptions & WebSockets

* **The Leak:**

```tsx
// ❌ LEAK: WebSocket socket connection remains open
useEffect(() => {
  const socket = new WebSocket('wss://api.example.com');
  socket.onmessage = (event) => setMessage(event.data);
}, []);

```

* **The Fix:** Close connections and remove subscribers on cleanup.

```tsx
// ✅ FIXED: WebSocket connection closed properly
useEffect(() => {
  const socket = new WebSocket('wss://api.example.com');
  socket.onmessage = (event) => setMessage(event.data);

  return () => {
    socket.close();
  };
}, []);

```

---

### Memory Leak Prevention Checklist

1. **Rule of Thumb:** Every `addEventListener`, `setInterval`, `setTimeout`, `subscribe()`, or `WebSocket` inside `useEffect` **MUST** have a corresponding cleanup operation returned.
2. **Use React StrictMode in Development:** `React.StrictMode` deliberately mounts, unmounts, and re-mounts components in development to immediately expose missing cleanup logic inside your `useEffect` hooks.
3. **Use Linter Rules:** Enable `eslint-plugin-react-hooks` to catch missing dependencies in `useEffect` arrays that could cause stale closure retention.
