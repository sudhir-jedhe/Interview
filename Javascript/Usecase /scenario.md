A user searches for “React” and then “Redux”, but the slower React response arrives later and replaces the correct results. How would you prevent it?

This is a classic race condition in asynchronous web applications. It occurs because network requests complete out of order: the faster request for "Redux" resolves first, and the slower, earlier request for "React" resolves second, overwriting the state with stale data.

Here are the most effective ways to prevent this in React.

---

### Method 1: Cancel Pending Requests (AbortController)

The cleanest client-side fix is to cancel the previous HTTP request as soon as a new search query is triggered. Modern browsers and libraries (like `fetch` or `axios`) support this via the native `AbortController` API.

#### Using `useEffect` with `AbortController`:

```jsx
import { useState, useEffect } from "react";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // 1. Create an AbortController instance
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchResults() {
      try {
        const response = await fetch(`/api/search?q=${query}`, { signal });
        const data = await response.json();
        setResults(data);
      } catch (error) {
        // Ignore errors caused by manual cancellation
        if (error.name !== "AbortError") {
          console.error("Fetch error:", error);
        }
      }
    }

    fetchResults();

    // 2. Cleanup function runs when `query` changes or component unmounts
    return () => {
      controller.abort(); // Cancels the previous request in-flight
    };
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {/* Render results */}
    </div>
  );
}
```

---

### Method 2: Track Latest Request ID / Ref

If aborting the request isn't feasible (or you want to preserve background caching), you can keep track of the most recent query using a mutable reference (`useRef`) and only update state if the response matches the current query.

```jsx
import { useState, useEffect, useRef } from "react";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const latestQueryRef = useRef(query);

  // Keep the ref updated with the latest query string
  useEffect(() => {
    latestQueryRef.current = query;
  }, [query]);

  useEffect(() => {
    if (!query) return;

    async function fetchResults() {
      const currentQuery = query;
      const response = await fetch(`/api/search?q=${currentQuery}`);
      const data = await response.json();

      // Only update state if the query hasn't changed since request started
      if (currentQuery === latestQueryRef.current) {
        setResults(data);
      }
    }

    fetchResults();
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {/* Render results */}
    </div>
  );
}
```

---

### Method 3: Use a Data Fetching Library (TanStack Query / RTK Query)

In production applications, data fetching libraries handle race conditions out of the box automatically.

For example, using **TanStack Query (React Query)**:

```jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

function SearchComponent() {
  const [query, setQuery] = useState("");

  const { data: results = [] } = useQuery({
    queryKey: ["search", query],
    queryFn: async ({ signal }) => {
      if (!query) return [];
      const res = await fetch(`/api/search?q=${query}`, { signal });
      return res.json();
    },
    enabled: Boolean(query),
  });

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

**Why this works automatically:**

- Query keys (`['search', query]`) uniquely isolate requests.
- Outdated requests are automatically cancelled or ignored when the `queryKey` changes.

---

### Summary of Techniques

| Technique                       | Pros                                                       | Best Used For                           |
| ------------------------------- | ---------------------------------------------------------- | --------------------------------------- |
| **`AbortController`**           | Saves server bandwidth & network traffic                   | Raw `fetch` or `axios` in vanilla React |
| **Request Tracking (`useRef`)** | Simple logic, doesn't require request cancellation support | Quick fixes or legacy API setups        |
| **React Query / RTK Query**     | Zero boilerplate, built-in caching, automatic cancellation | Production-grade React applications     |

Combining **debouncing** with request cancellation (`AbortController`) is the industry standard for search inputs. Debouncing prevents sending a request on every single keystroke, and `AbortController` handles any race conditions if slow network requests overlap.

Here is how to create a custom `useDebounce` hook and use it in your search component.

---

### Step 1: Create the `useDebounce` Custom Hook

This hook takes a fast-changing value (like user input) and a delay in milliseconds, returning a value that only updates after the specified delay has passed without new changes.

```javascript
// hooks/useDebounce.js
import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Reset the timer if the input value changes before the delay finishes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

### Step 2: Implement the Debounced Search Component

Pass the debounced value into your `useEffect` API trigger. Pairing this with an `AbortController` ensures complete protection against both excessive API calls and race conditions.

```jsx
import { useState, useEffect } from "react";
import { useDebounce } from "./hooks/useDebounce";

export default function SearchComponent() {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce the raw input value by 300ms
  const debouncedQuery = useDebounce(inputValue, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    async function fetchSearch() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
          { signal },
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Search request failed:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchSearch();

    // Abort in-flight request if debouncedQuery changes again
    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type to search..."
        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
      />

      {isLoading && <p>Searching...</p>}

      <ul>
        {results.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

### How It Works Under the Hood

1. **User Types Quickly:** Typing `"R-e-a-c-t"` triggers `setInputValue` on every keystroke.
2. **Timer Resets:** `useDebounce` clears and restarts its `setTimeout(300)` on each keystroke, so `debouncedQuery` remains unchanged while the user is actively typing.
3. **Execution Pause:** Once typing stops for 300ms, `debouncedQuery` updates to `"React"`.
4. **Single Fetch:** The `useEffect` triggers a single API request for `"React"`.
   Redux Toolkit (RTK) Query prevents race conditions automatically by completely changing how data is stored and tracked. Instead of storing response data in a single local state variable (like `const [results, setResults]`), RTK Query uses a **centralized cache dictionary** combined with a **reference-counted subscription system**.

Here is exactly how it solves the _"React" vs. "Redux"_ race condition under the hood.

### 1. Cache Key Isolation (No Overwriting)

When you trigger a query in RTK Query, it serializes the endpoint name and your parameters to create a unique **Cache Key**.

Instead of a single bucket of "search results," the Redux store looks like this:

```json
{
  "queries": {
    "getSearch(\"React\")": { "status": "pending", "data": null },
    "getSearch(\"Redux\")": {
      "status": "fulfilled",
      "data": ["Redux Toolkit", "Redux Thunk"]
    }
  }
}
```

If the slow `"React"` request eventually finishes, it does not overwrite the `"Redux"` data. It simply updates its own isolated cache entry: `"getSearch(\"React\")": { status: "fulfilled", ... }`.

### 2. Hook Subscriptions

When you use a hook like `useGetSearchQuery(query)`, the component **subscribes** only to the cache key matching the _current_ argument.

1. You type `"React"`. The component subscribes to `getSearch("React")`.
2. You type `"Redux"`. The component immediately **unsubscribes** from `getSearch("React")` and **subscribes** to `getSearch("Redux")`.

Because the component is now strictly listening to the `"Redux"` cache entry, when the delayed `"React"` response hits the store, the UI completely ignores it. The stale data cannot bleed into your component.

### 3. Automatic Request Cancellation

RTK Query takes it a step further to save network bandwidth. It actively monitors how many components are subscribed to a specific cache key (Reference Counting).

If you type `"Redux"`, the subscription count for the `"React"` query drops to **0**. When a query has zero active subscribers and is still in-flight, RTK Query automatically fires an internal `AbortController` to cancel the HTTP request outright, stopping the slow response from ever consuming background resources.

### 4. In-Flight Request Deduplication

What if two completely different components on the screen ask for the exact same data at the same time?

```jsx
// Component A
const { data } = useGetSearchQuery("Redux");

// Component B
const { data } = useGetSearchQuery("Redux");
```

Vanilla React with `useEffect` would fire two identical network requests, creating a different kind of race condition.

RTK Query prevents this via **Promise sharing**:

1. Component A asks for `'Redux'`. RTK Query checks the cache, sees it doesn't exist, and fires the network request.
2. Component B asks for `'Redux'` 10 milliseconds later.
3. RTK Query checks the cache, sees that `getSearch("Redux")` is currently `"pending"`, and **skips the network request entirely**.
4. It attaches Component B to the exact same Promise as Component A. When the single network request resolves, both components update simultaneously.
   React 18’s `useDeferredValue` provides a built-in alternative to custom debouncing. While custom debouncing waits for a fixed time delay (e.g., 300 ms) after you stop typing, `useDeferredValue` defers updating part of the UI until the main thread is idle.

It keeps the input field responsive immediately while rendering the deferred results in the background at **intent-level speed** rather than a fixed timer.

---

### Basic Pattern: Deferred UI Updates

When using `useDeferredValue`, you maintain the raw input state and pass it to the hook. You then use the deferred value to compute or fetch the heavy UI content.

```jsx
import { useState, useDeferredValue, memo } from 'react';

// Memoizing heavy child components ensures they only re-render
// when the deferred value actually changes.
const SearchResults = memo(({ query }) => {
  // Expensive rendering or filtering logic here
  return (
    <div>
      <p>Displaying results for: <strong>{query}</strong></p>
      {/* ... search result items ... */}
    </div>
  );
});

export default function SearchComponent() {
  const [query, setQuery] = useState('');

  // 1. Pass the fast-changing state to useDeferredValue
  const deferredQuery = useDeferredValue(query);

  // 2. Check if the deferred update is currently pending
  const isStale = query !== deferredQuery;

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />

      {/* Visual cue while the deferred update is rendering */}
      <div style={{ opacity: isStale ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <SearchResults query={deferredQuery} />
      </div>
    </div>
  );
});

```

---

### Fetching Data with `useDeferredValue` and Suspense / Data Libraries

If you are using `useDeferredValue` to trigger network requests (e.g., with TanStack Query or React Suspense), React automatically coordinates the pending states without requiring manually managed loading spinners.

```jsx
import { useState, useDeferredValue, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

function SearchResults({ query }) {
  const { data } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetch(`/api/search?q=${query}`).then((res) => res.json()),
    enabled: Boolean(query),
  });

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}

export default function Search() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />

      {/* Suspense fallback shows on initial load; subsequent typing keeps old UI visible */}
      <Suspense fallback={<p>Loading initial results...</p>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  );
}
```

---

### `useDeferredValue` vs. Custom Debounce

| Feature             | Custom `useDebounce`                                                   | React 18 `useDeferredValue`                                                                         |
| ------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Mechanism**       | Waits for a fixed delay timer (e.g., 300 ms).                          | React pauses/resumes the render work based on user device performance.                              |
| **User Experience** | Always has a artificial delay before showing any feedback.             | Updates instantly on fast devices; slows down gracefully on slower devices.                         |
| **API Requests**    | Highly effective at preventing frequent network requests while typing. | Fires requests as soon as main thread frees up (can still trigger multiple calls if typing slowly). |
| **Best Used For**   | Direct API rate-limiting and heavy network fetches.                    | Laggy UI renders, complex list filtering, and local component updates.                              |

> **Pro Tip:** If your main goal is to **prevent excessive network requests** to a third-party server, traditional **debouncing** is still preferred because it guarantees a fixed pause before sending a request. Use `useDeferredValue` when you want to keep the UI smooth during CPU-heavy local updates or when integrated with Suspense.
