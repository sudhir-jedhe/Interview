Here is the standard, production-ready way to fetch data on component mount and continuously poll it every 10 seconds using React hooks (`useState` and `useEffect`).

---

## The Implementation

```tsx
import { useState, useEffect } from "react";

export function DataPollingComponent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Controller to cancel pending fetch requests on unmount
    const controller = new AbortController();

    // 1. Define the data fetching function
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.example.com/data", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch data");
        }
      } finally {
        setLoading(false);
      }
    };

    // 2. Fetch immediately on component mount
    fetchData();

    // 3. Set up interval to poll every 10 seconds (10,000 ms)
    const intervalId = setInterval(fetchData, 10000);

    // 4. Cleanup: Clear interval and abort in-flight requests on unmount
    return () => {
      clearInterval(intervalId);
      controller.abort();
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  if (loading) return <div>Loading initial data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Live Polling Data</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

---

## Key Best Practices Included

1. **Immediate Initial Call:** Calling `fetchData()` right before `setInterval` ensures the user sees data immediately on page load, rather than waiting 10 seconds for the first tick.
2. **Interval Cleanup:** Returning `clearInterval(intervalId)` in the effect cleanup function prevents **memory leaks** and keeps timer instances from stacking up if the component unmounts or re-renders.
3. **AbortController:** Passing `controller.signal` to `fetch()` cancels any active HTTP requests if the user navigates away mid-request.

---

## Alternative: Modern Data-Fetching Libraries (e.g., TanStack Query)

If you are using a data-fetching library like **TanStack Query**, polling is handled declaratively with built-in background refresh and tab-focus revalidation using `refetchInterval`:

```tsx
import { useQuery } from "@tanstack/react-query";

export function PollingWithReactQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["liveData"],
    queryFn: () =>
      fetch("https://api.example.com/data").then((res) => res.json()),
    refetchInterval: 10000, // 👈 Auto-polls every 10 seconds
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```
