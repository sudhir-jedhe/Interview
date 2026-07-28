import { useEffect, useState } from "react";

// src/usePolling.js

// Creating a custom React hook to poll a server endpoint at specified intervals is a useful feature for fetching data regularly

```js
const usePolling = (url, interval) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, interval); // Set up polling

    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
    };
  }, [url, interval]); // Rerun effect if url or interval changes

  return { data, error, isLoading };
};

export default usePolling;
```
