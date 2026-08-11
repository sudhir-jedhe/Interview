A user searches React and immediately searches Angular. The first API response arrives after the second. How would you show the correct result?

When a user rapid-fires searches—such as searching for "React" first and then immediately searching for "Angular"—network latency can cause the slower first request ("React") to resolve **after** the faster second request ("Angular").

If not handled properly, this causes a **race condition**, where stale data ("React") overwrites the fresh user intent ("Angular"), displaying the wrong results on the screen.

Here are the industry-standard ways to solve this:

---

### 1. Request Cancellation (The Best Approach)

Instead of letting both network requests finish and trying to figure out which one is newer, **cancel the previous pending request** the moment a new search is triggered. This saves server bandwidth and completely prevents stale responses from arriving.

Using the modern `AbortController`:

```jsx
import { useState, useEffect, useRef } from 'react';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // 1. If there is an ongoing request, cancel it before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 2. Create a new AbortController for this specific request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/search?q=${query}`, {
          signal: controller.signal, // Link the signal to the fetch call
        });
        const data = await response.json();
        setResults(data);
      } catch (error) {
        // Ignore errors caused by intentional cancellation
        if (error.name !== 'AbortError') {
          console.error('Search failed:', error);
        }
      }
    };

    fetchResults();

    // Cleanup function if component unmounts
    return () => controller.abort();
  }, [query]);

  return (
    <div>
      <input 
        type="text" 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search..."
      />
      <ul>
        {results.map((item, index) => <li key={index}>{item.name}</li>)}
      </ul>
    </div>
  );
};

```

---

### 2. Request Tracking / Timestamp Comparison

If your API client or architecture doesn't easily support request cancellation, you can use a tracking variable to ignore any response that belongs to an outdated search query.

```jsx
let latestRequestId = 0;

const handleSearch = async (searchTerm) => {
  // Increment the ID for every new search initiated
  const currentRequestId = ++latestRequestId;

  const response = await fetch(`/api/search?q=${searchTerm}`);
  const data = await response.json();

  // ONLY update the UI if this response belongs to the absolute latest search
  if (currentRequestId === latestRequestId) {
    setResults(data);
  } else {
    console.log(`Discarding stale response for: ${searchTerm}`);
  }
};

```

* **What happens with "React" then "Angular":**

1. User types "React" (`requestId = 1`). Request goes out slowly.
2. User types "Angular" (`requestId = 2`). Request goes out quickly.
3. "Angular" finishes first (`requestId = 2`). It matches `latestRequestId`, so the UI displays **Angular**.
4. "React" finally finishes later (`requestId = 1`). It does **not** match `latestRequestId`, so the response is safely thrown away. The UI remains correctly set to Angular.

---

### 3. Built-in Solutions (React Query / SWR)

If you are using **TanStack Query (React Query)** or **SWR**, **race conditions and deduplication are handled automatically**.

When a user triggers multiple overlapping queries with the same key, React Query automatically manages the cache lifecycle and ensures that components receive the data corresponding to the latest active invocation or ignore stale out-of-order payloads.
