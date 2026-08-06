Here's the complete implementation of the `fetchAllApis` function, including enhancements for better error resilience and the ability to handle partially failed API calls using `Promise.allSettled`:

### Complete Implementation of `fetchAllApis`

```javascript
async function fetchAllApis(apis) {
    try {
        // Create an array of promises by mapping over the APIs and fetching data
        const promises = apis.map(api => fetchWithTimeout(api));

        // Wait for all promises to resolve or reject using Promise.allSettled()
        const results = await Promise.allSettled(promises);

        // Filter successful responses and parse their JSON data
        const data = await Promise.all(
            results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value.json())
        );

        // Log errors for any rejected promises
        results
            .filter(result => result.status === 'rejected')
            .forEach(error => console.error("API call failed:", error.reason));

        return data;
    } catch (error) {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
        throw error;
    }
}

// Helper function to add a timeout to fetch
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error(`Request timed out for ${url}`);
        }
        throw error;
    }
}

// Example usage:
const apis = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://invalid-api.example.com' // Simulate an invalid API for testing error handling
];

fetchAllApis(apis)
    .then(data => {
        console.log("Data from all APIs:", data);
    })
    .catch(error => {
        console.error("Error fetching data from APIs:", error);
    });
```

---

### Key Features of This Implementation

1. **Error Resilience**:
   - Uses `Promise.allSettled` to ensure the function handles partially failed API calls gracefully.

2. **Timeout Handling**:
   - Includes a `fetchWithTimeout` helper function to prevent hanging on unresponsive APIs.

3. **Error Logging**:
   - Logs errors for rejected promises separately for better debugging.

4. **Fallback Behavior**:
   - Returns only the data from successful API calls.

---

### Example Output

**Given Input:**
```javascript
const apis = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://invalid-api.example.com' // Invalid URL
];
```

**Expected Output:**
```javascript
API call failed: Error: Request timed out for https://invalid-api.example.com
Data from all APIs: [
    { userId: 1, id: 1, title: '...', body: '...' },
    { userId: 1, id: 1, title: '...', completed: false }
]
```

This implementation is robust, handles edge cases, and can be adapted further as needed.