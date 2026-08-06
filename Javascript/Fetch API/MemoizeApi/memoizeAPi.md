Here’s how you can **memoize an API fetch function** using a cache mechanism. The implementation uses a `Map` to store responses for a specified time, allowing you to reuse results for repeated calls with the same URL while respecting TTL (time-to-live).

---

### **Improved Memoized Fetch Function with TTL**
```javascript
const cache = new Map();

/**
 * Memoized Fetch Function
 * @param {string} url - The API URL to fetch data from.
 * @param {number} ttl - Time to live for the cache in milliseconds (default: 60000).
 * @returns {Promise<any>} - Cached or fetched data.
 */
async function fetchWithCache(url, ttl = 60000) {
  const now = Date.now();

  // Check cache
  if (cache.has(url)) {
    const { data, expiry } = cache.get(url);
    if (now < expiry) {
      console.log('Returning cached data for:', url);
      return data;
    }

    // Remove expired entry
    console.log('Cache expired for:', url);
    cache.delete(url);
  }

  // Fetch new data
  console.log('Fetching data from API for:', url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Network response was not ok for URL: ${url}`);
  }

  const data = await response.json();

  // Store in cache with expiry
  cache.set(url, { data, expiry: now + ttl });

  return data;
}

/**
 * Clear Cache
 * Clears all entries from the cache.
 */
fetchWithCache.clearCache = () => {
  cache.clear();
  console.log('Cache cleared.');
};

/**
 * Remove Specific Cache Entry
 * @param {string} url - The URL whose cache entry should be removed.
 */
fetchWithCache.removeCache = (url) => {
  if (cache.delete(url)) {
    console.log(`Cache removed for URL: ${url}`);
  } else {
    console.log(`No cache found for URL: ${url}`);
  }
};

// Usage example
(async () => {
  const apiUrl = 'https://api.example.com/data';

  try {
    // First call (API fetch)
    const data1 = await fetchWithCache(apiUrl, 10000);
    console.log('Data:', data1);

    // Second call (cache hit)
    const data2 = await fetchWithCache(apiUrl, 10000);
    console.log('Data:', data2);

    // Clear the cache
    fetchWithCache.clearCache();

    // Third call (API fetch again after clearing)
    const data3 = await fetchWithCache(apiUrl, 10000);
    console.log('Data:', data3);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

---

### **Features**
1. **Caching with TTL:**
   - Cached entries have an expiry time, after which they are automatically invalidated.

2. **Automatic Expiry:**
   - Expired entries are removed when accessed or overwritten by newer data.

3. **Clear Cache:**
   - `fetchWithCache.clearCache()` allows manual clearing of all cache entries.

4. **Selective Cache Removal:**
   - `fetchWithCache.removeCache(url)` enables removing specific cache entries.

5. **Reusable & Scalable:**
   - Easily adjustable TTL and supports any number of concurrent requests.

---

### **Example Output**
```plaintext
Fetching data from API for: https://api.example.com/data
Data: { /* Fetched Data */ }
Returning cached data for: https://api.example.com/data
Data: { /* Cached Data */ }
Cache cleared.
Fetching data from API for: https://api.example.com/data
Data: { /* Fetched Data */ }
```

This implementation ensures efficient use of API resources and minimizes redundant network requests by leveraging caching and TTL.