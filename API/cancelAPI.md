In React, sometimes you need to cancel API calls, especially when you're working with asynchronous data fetching. This is particularly important for scenarios where the component may unmount or when you no longer need the data (e.g., navigating to another page or changing the component's state). Canceling unnecessary API calls helps prevent memory leaks, unwanted state updates, and wasted resources.

Here’s how you can handle **cancelling API calls** in a React component using different approaches:

### 1. **Using `AbortController` to Cancel Fetch Requests**

One common way to cancel an API request in React is by using the `AbortController`, which is part of the browser's native Fetch API. The `AbortController` allows you to abort fetch requests by calling its `abort` method.

#### Example

```javascript
import React, { useEffect, useState } from "react";

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create an instance of AbortController
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/data", {
          signal,
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to cancel the fetch when the component unmounts
    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array ensures the effect runs once

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default MyComponent;
```

#### Key points

- **AbortController**: We create an instance of `AbortController` and pass its `signal` to the `fetch` call.
- **Cleanup in `useEffect`**: In the cleanup function of `useEffect`, we call `controller.abort()` to cancel the request if the component unmounts or if the request is no longer needed.
- **Error Handling**: The `AbortError` is specifically handled to differentiate between network errors and an aborted request.

---

### 2. **Using Axios with Cancel Token**

If you're using **Axios** for HTTP requests, it has built-in support for canceling requests using a **cancel token**. Axios allows you to create a cancel token and cancel the request whenever needed.

#### Example

```javascript
import React, { useEffect, useState } from "react";
import axios from "axios";

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a cancel token
    const cancelTokenSource = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.example.com/data", {
          cancelToken: cancelTokenSource.token,
        });
        setData(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to cancel the request when the component unmounts
    return () => {
      cancelTokenSource.cancel("Component unmounted or request canceled");
    };
  }, []); // Empty dependency array ensures the effect runs once

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default MyComponent;
```

#### Key points

- **Cancel Token**: `axios.CancelToken.source()` creates a cancel token that can be used to cancel the request.
- **Cancellation in Cleanup**: In the cleanup function, we call `cancelTokenSource.cancel()` to cancel the request if the component unmounts.
- **Error Handling**: The `axios.isCancel` method checks if the error was due to a canceled request.

---

### 3. **Using `useRef` with `AbortController`**

For more complex use cases, you can use `useRef` to persist the `AbortController` instance across re-renders. This ensures that the abort signal is tied to the lifecycle of the component.

#### Example

```javascript
import React, { useEffect, useState, useRef } from "react";

function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(new AbortController()); // Using useRef to persist the controller

  useEffect(() => {
    const controller = abortControllerRef.current;
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/data", {
          signal,
        });
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to cancel the request when the component unmounts
    return () => {
      controller.abort(); // Aborts the request when component unmounts
    };
  }, []); // Empty dependency array ensures the effect runs once

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default MyComponent;
```

#### Key points

- **`useRef`**: The `AbortController` is stored in a `useRef` hook to persist the controller across re-renders, ensuring that the same controller is used throughout the component lifecycle.
- **Cleanup**: The cleanup function uses `controller.abort()` to cancel the fetch request when the component unmounts.

---

### 4. **Using React Query (or other Data Fetching Libraries)**

For more advanced and robust data-fetching and caching strategies, you can use libraries like **React Query** or **SWR** that automatically handle canceling requests when components unmount.

#### Example with React Query

```javascript
import React from "react";
import { useQuery } from "react-query";

function fetchData() {
  return fetch("https://api.example.com/data").then((res) => res.json());
}

function MyComponent() {
  const { data, error, isLoading } = useQuery("data", fetchData);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default MyComponent;
```

**React Query** takes care of canceling the request when the component unmounts or when the query is no longer needed, without needing to manage cancellation manually.

---

### Conclusion

Canceling API requests is an important consideration in React for avoiding memory leaks, unnecessary network activity, and handling unmounted components gracefully. Here's a summary of the approaches:

1. **Using `AbortController`**: Native JavaScript solution to cancel fetch requests.
2. **Using Axios Cancel Tokens**: For canceling Axios requests.
3. **Using `useRef`**: To persist an `AbortController` across re-renders.
4. **Using React Query or SWR**: For automated data fetching with built-in cancelation and caching mechanisms.

Choose the method that best fits your project’s needs and complexity.

Here is a review of your API cancellation patterns in React.

Your breakdown covers the core techniques well. However, there are two crucial modern nuances that impact real-world production code: **Axios' deprecation of `CancelToken**` and **React 18's Strict Mode behavior**.

---

### Critical Updates & Modern Refinements

#### 1. Axios Deprecated `CancelToken` in Favor of `AbortController`

Axios formally deprecated `axios.CancelToken` (starting in v0.22.0). Modern Axios uses the standard native `AbortController` API instead:

```javascript
import React, { useEffect, useState } from "react";
import axios from "axios";

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ✅ Modern Axios uses native AbortController
    const controller = new AbortController();

    axios
      .get("https://api.example.com/data", {
        signal: controller.signal, // Pass signal directly to Axios options
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        // Axios converts AbortError into CanceledError
        if (axios.isCancel(err)) {
          console.log("Axios request cancelled");
        }
      });

    return () => controller.abort();
  }, []);

  return <div>{data}</div>;
}
```

---

#### 2. The `useRef` Anti-Pattern Trap in React 18

In your Section 3 example:

```javascript
// ⚠️ Problematic in React 18+
const abortControllerRef = useRef(new AbortController());
```

- **Why it breaks:** An `AbortController` instance **cannot be reused once `.abort()` has been called**.
- In React 18+ (Development Mode with `<React.StrictMode>`), React intentionally **mounts $\rightarrow$ unmounts $\rightarrow$ remounts** your component immediately.
- On the double-mount, your `useRef` will hold an `AbortController` whose signal has _already been aborted_, causing subsequent fetch requests to fail immediately!
- **Rule:** Always instantiate a fresh `AbortController` **inside** the `useEffect` body rather than in a ref or global variable.

---

#### 3. React Query / TanStack Query Signal Propagation

When using React Query (TanStack Query), pass the `signal` argument that React Query injects into the `queryFn` directly down to your fetcher. This allows React Query to automatically trigger an abort if the component unmounts mid-flight or if a user triggers a query reset:

```javascript
import { useQuery } from "@tanstack/react-query";

// React Query automatically passes a { signal } context object to queryFn
const fetchData = async ({ signal }) => {
  const res = await fetch("https://api.example.com/data", { signal });
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myData"],
    queryFn: fetchData, // Cancellation is now fully automatic!
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

---

### Summary Comparison Matrix

| Approach                             | Best Use Case                                        | Recommendation                                        |
| ------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------- |
| **Native Fetch + `AbortController**` | Simple React apps without external libraries         | **Standard approach**                                 |
| **Axios + `signal**`                 | Projects already using Axios                         | Use `signal: controller.signal` (avoid `CancelToken`) |
| **TanStack Query / SWR**             | Enterprise apps with caching, pagination, auto-retry | **Best Overall Practice**                             |
