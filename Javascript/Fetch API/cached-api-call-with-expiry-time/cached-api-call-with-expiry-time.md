// Implement a function in JavaScript that caches the API response for the given amount of time. If a new call is made between that time, the response from the cache will be returned, else a fresh API call will be made.


The given code provides a robust solution to implement API call caching with an expiration mechanism in JavaScript. Here's how the solution works, explained in detail:

---

### **Steps Explained**

1. **Outer Function (`cachedApiCall`)**:
   - Accepts the time duration (`time`) for which the cached response should remain valid.
   - Maintains a `cache` object to store the API responses and their expiration times.

2. **Key Generation (`generateKey`)**:
   - Combines the API path (`path`) and sorted configuration object (`config`) into a unique string.
   - This ensures each combination of path and config gets a unique cache entry.

3. **API Call (`makeApiCall`)**:
   - Uses the `fetch` API to make the network call.
   - Parses and returns the JSON response.

4. **Caching Logic**:
   - When an API call is made:
     - The key is checked in the `cache`.
     - If the cache entry is missing or expired, a new API call is made, and the response is cached with a new expiry time.
     - Otherwise, the cached value is returned directly.

---

### **Enhancements and Best Practices**

1. **Improved Error Handling**:
   - Catching and logging errors in `makeApiCall` ensures failures are handled gracefully.
   - In the cached function, `console.error` should replace `console.log(error)` for better debugging.

2. **Cache Size Management**:
   - Optionally, implement a maximum size for the `cache` to prevent memory overuse in long-running applications.

3. **Extending Functionality**:
   - Add support for removing specific cache entries.
   - Provide a method to clear the entire cache when needed.

4. **Code Cleanup**:
   - Use `const` instead of `let` for variables that don’t change.

---

### **Final Optimized Code**

```javascript
// Helper function to generate a unique cache key
const generateKey = (path, config) => {
  const key = Object.keys(config)
    .sort((a, b) => a.localeCompare(b))
    .map((k) => `${k}:${config[k]}`)
    .join("&");
  return `${path}?${key}`;
};

// Helper function to make an API call
const makeApiCall = async (path, config) => {
  try {
    const response = await fetch(path, config);
    return await response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    return null;
  }
};

// Cached API Call Function
const cachedApiCall = (time) => {
  const cache = {};

  return async function (path, config = {}) {
    const key = generateKey(path, config);
    const entry = cache[key];

    if (!entry || Date.now() > entry.expiryTime) {
      console.log("Making a new API call...");
      try {
        const value = await makeApiCall(path, config);
        cache[key] = { value, expiryTime: Date.now() + time };
      } catch (error) {
        console.error("Error caching the API response:", error);
      }
    }

    return cache[key].value;
  };
};

// Usage Example
const call = cachedApiCall(1500);

// First API call
call("https://jsonplaceholder.typicode.com/todos/1", {}).then(console.log);

// Cached response (quick)
setTimeout(() => {
  call("https://jsonplaceholder.typicode.com/todos/1", {}).then(console.log);
}, 700);

// Fresh API call (cache expired)
setTimeout(() => {
  call("https://jsonplaceholder.typicode.com/todos/1", {}).then(console.log);
}, 2000);
```

---

### **Output**

1. **First Call**: Logs "Making a new API call..." and the API response.
2. **Second Call**: Returns the cached response without logging "Making a new API call...".
3. **Third Call**: Logs "Making a new API call..." again, as the cache has expired.

---

Would you like to extend this with advanced features like cache size management or async storage for caching?


Your solution is good, but in a **Senior JavaScript interview**, interviewers usually expect you to discuss a few additional edge cases:

## Problem with Current Solution

If 5 requests come simultaneously:

```javascript
call("/users");
call("/users");
call("/users");
call("/users");
call("/users");
```

Current implementation:

```text
Request 1 → API Call
Request 2 → API Call
Request 3 → API Call
Request 4 → API Call
Request 5 → API Call
```

Even though all requests are identical.

***

# Better Solution: Cache Promise (Request Deduplication)

```javascript
function cachedApiCall(ttl) {

  const cache = new Map();

  return async function(path, config = {}) {

    const key =
      `${path}-${JSON.stringify(config)}`;

    const cached =
      cache.get(key);

    if (
      cached &&
      cached.expiry > Date.now()
    ) {

      console.log(
        "Returning cached value"
      );

      return cached.promise;
    }

    console.log(
      "Making network request"
    );

    const promise =
      fetch(path, config)
        .then(res => {

          if (!res.ok) {
            throw new Error(
              "API Failed"
            );
          }

          return res.json();
        });

    cache.set(key, {
      promise,
      expiry:
        Date.now() + ttl
    });

    return promise;
  };
}
```

***

# Example

```javascript
const getTodos =
  cachedApiCall(5000);

Promise.all([
  getTodos("/todos"),
  getTodos("/todos"),
  getTodos("/todos")
]);
```

Output:

```text
Making network request
Returning cached value
Returning cached value
```

Only one API request.

***

# Add Manual Cache Clear

```javascript
function cachedApiCall(ttl) {

  const cache =
    new Map();

  async function request(
    path,
    config = {}
  ) {

    const key =
      `${path}-${JSON.stringify(config)}`;

    const cached =
      cache.get(key);

    if (
      cached &&
      cached.expiry > Date.now()
    ) {

      return cached.value;
    }

    const value =
      await fetch(
        path,
        config
      )
      .then(r =>
        r.json()
      );

    cache.set(key, {
      value,
      expiry:
        Date.now() + ttl
    });

    return value;
  }

  request.clear =
    () => cache.clear();

  request.delete =
    key => cache.delete(key);

  return request;
}
```

Usage:

```javascript
api.clear();

api.delete(
  "/users"
);
```

***

# LRU Cache (Most Senior-Level)

Prevent memory leaks.

```javascript
if (
  cache.size > MAX_SIZE
) {

  const firstKey =
    cache.keys()
      .next().value;

  cache.delete(
    firstKey
  );
}
```

This keeps only the latest N entries.

***

# React Query Equivalent

This problem is effectively solved by React Query:

```javascript
const { data } =
  useQuery({

    queryKey: ["users"],

    queryFn: getUsers,

    staleTime: 5000
  });
```

React Query automatically provides:

```text
✅ Cache

✅ Deduplication

✅ Cache Expiry

✅ Refetch

✅ Background Updates

✅ Retry Logic
```

***

# Interview Follow-Up Questions

### Time Complexity

```javascript
Map.get() = O(1)
Map.set() = O(1)
```

***

### Why use Map instead of Object?

```javascript
Map
✅ Faster lookup
✅ Any key type
✅ Better iteration

Object
❌ Prototype pollution
❌ String keys only
```

***

### What happens if API fails?

Current implementation should remove failed cache entries.

```javascript
try {

  const promise =
    fetch(url);

  cache.set(key, promise);

  return await promise;

} catch (error) {

  cache.delete(key);

  throw error;
}
```

Otherwise failed responses remain cached.

***

# Senior Interview Answer

A production-ready cache should support:

```text
✅ TTL expiration

✅ O(1) lookup using Map

✅ Request deduplication
   (cache promises)

✅ Error handling

✅ Manual cache invalidation

✅ LRU eviction

✅ Cache clear methods

✅ Optional persistent storage
   (localStorage/IndexedDB)

✅ Background refresh
```

This is essentially how libraries like **React Query, SWR, Apollo Client, and RTK Query** implement client-side API caching internally.


Excellent follow-up. This is where interviewers usually push beyond a basic TTL cache implementation.

# 1. Cache Size Limit + LRU Eviction Policy

A common production approach is **LRU (Least Recently Used)**.

When cache exceeds its limit:

```text
Remove Least Recently Used Entry
```

## Example

```javascript
function createCache(
  ttl = 5000,
  maxSize = 3
) {

  const cache = new Map();

  return async function(
    key,
    apiCall
  ) {

    const cached =
      cache.get(key);

    if (
      cached &&
      cached.expiry >
        Date.now()
    ) {

      // Move to end
      cache.delete(key);
      cache.set(
        key,
        cached
      );

      console.log(
        "Cache Hit"
      );

      return cached.value;
    }

    console.log(
      "API Call"
    );

    const value =
      await apiCall();

    // LRU Eviction
    if (
      cache.size >= maxSize
    ) {

      const oldestKey =
        cache.keys()
          .next().value;

      cache.delete(
        oldestKey
      );

      console.log(
        `Evicted ${oldestKey}`
      );
    }

    cache.set(key, {
      value,
      expiry:
        Date.now() + ttl
    });

    return value;
  };
}
```

***

## Example Flow

```text
Cache Size = 3

Store:
A B C

Access:
A

Order:
B C A

Add:
D

Evict:
B
```

***

# 2. Async Storage Cache Persistence

Memory cache disappears on refresh.

For persistence:

```text
localStorage
sessionStorage
IndexedDB
AsyncStorage (React Native)
```

***

## localStorage Example

```javascript
function createPersistentCache(
  ttl
) {

  return async function(
    key,
    apiCall
  ) {

    const cached =
      localStorage.getItem(
        key
      );

    if (cached) {

      const data =
        JSON.parse(
          cached
        );

      if (
        data.expiry >
        Date.now()
      ) {

        console.log(
          "Storage Cache Hit"
        );

        return data.value;
      }
    }

    const value =
      await apiCall();

    localStorage.setItem(
      key,
      JSON.stringify({
        value,
        expiry:
          Date.now() +
          ttl
      })
    );

    return value;
  };
}
```

***

## Usage

```javascript
const getUsers =
  createPersistentCache(
    10000
  );

const users =
  await getUsers(
    "users",

    () =>
      fetch("/users")
        .then(res =>
          res.json()
        )
  );
```

***

# IndexedDB Example (Large Data)

For:

```text
Offline Data
Infinite Scroll
Large Response Cache
```

Use:

```javascript
idb
Dexie
localForage
```

Example:

```javascript
import localforage
  from "localforage";

await localforage.setItem(
  "users",
  response
);
```

***

# 3. Manual Cache Invalidation

Very important.

Suppose:

```text
Users Cached
```

Then:

```text
Create User
Update User
Delete User
```

Need cache invalidation.

***

## Single Key Invalidation

```javascript
cache.delete(
  "users"
);
```

Example:

```javascript
await createUser();

cache.delete(
  "users"
);
```

Next request:

```text
Fresh API Call
```

***

## Clear Entire Cache

```javascript
cache.clear();
```

Example:

```javascript
function logout() {

  cache.clear();

  localStorage.clear();
}
```

***

# Production Cache API

```javascript
function createCache() {

  const cache =
    new Map();

  return {

    get(key) {
      return cache.get(key);
    },

    set(
      key,
      value
    ) {
      cache.set(
        key,
        value
      );
    },

    remove(key) {

      cache.delete(key);

    },

    clear() {

      cache.clear();

    }
  };
}
```

Usage:

```javascript
cache.remove(
  "users"
);

cache.clear();
```

***

# React Query Equivalent

React Query provides these features automatically:

## Cache Invalidation

```javascript
queryClient.invalidateQueries({
  queryKey: [
    "users"
  ]
});
```

***

## Remove Cache

```javascript
queryClient.removeQueries({
  queryKey: [
    "users"
  ]
});
```

***

## Clear Everything

```javascript
queryClient.clear();
```

***

# Senior Interview Answer

A production-grade API cache should support:

```text
✅ TTL Expiration

✅ LRU Eviction

✅ Promise Deduplication

✅ Manual Invalidation

✅ Cache Clear

✅ Persistent Storage

✅ Error Recovery

✅ Background Refresh

✅ O(1) Operations with Map

✅ Optional IndexedDB Support
```

That is essentially the same set of features implemented by libraries such as **React Query, SWR, Apollo Client, RTK Query**, and browser caching layers.


These are the next-level caching concepts interviewers expect after a basic TTL cache.

# 1. Background Cache Refresh (Stale-While-Revalidate)

Instead of:

```text
Cache Expired
    ↓
Wait For API
    ↓
Show Data
```

Use:

```text
Show Cached Data
        ↓
Refresh In Background
        ↓
Update Cache
```

## Implementation

```javascript
function createCache(ttl = 5000) {

  const cache = new Map();

  return async function(key, apiCall) {

    const cached = cache.get(key);

    if (cached) {

      // Return stale value immediately
      if (Date.now() > cached.expiry) {

        console.log("Refreshing in background...");

        apiCall()
          .then(newData => {

            cache.set(key, {
              value: newData,
              expiry: Date.now() + ttl
            });

          })
          .catch(console.error);
      }

      return cached.value;
    }

    const value = await apiCall();

    cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });

    return value;
  };
}
```

***

## Flow

```text
User Visits Page

Cache Exists ✅
Expired ✅

Return Cached Data
        ↓
Background API Call
        ↓
Cache Updated
        ↓
Next Request Gets Fresh Data
```

This is the same concept used by:

```text
React Query
SWR
Apollo
```

***

# 2. Error Recovery in Cache

A common interview question:

> What happens if the API fails?

Bad implementation:

```javascript
cache.set(key, failedResponse);
```

Now the cache contains a failure.

***

## Better Recovery

```javascript
function createCache() {

  const cache = new Map();

  return async function(key, apiCall) {

    try {

      const value =
        await apiCall();

      cache.set(key, {
        value,
        timestamp: Date.now()
      });

      return value;

    } catch (error) {

      const stale =
        cache.get(key);

      if (stale) {

        console.log(
          "Returning stale cache"
        );

        return stale.value;
      }

      throw error;
    }
  };
}
```

***

## Flow

```text
Users Loaded
      ↓
Cache Stored
      ↓
API Fails
      ↓
Return Previous Cache
```

Instead of:

```text
Blank Screen
```

***

# Retry Strategy

```javascript
async function retry(
  fn,
  retries = 3
) {

  try {

    return await fn();

  } catch (error) {

    if (!retries)
      throw error;

    return retry(
      fn,
      retries - 1
    );
  }
}
```

Usage:

```javascript
await retry(
  () => fetchUsers()
);
```

***

# 3. React Query Cache Integration

React Query already provides sophisticated cache management.

## Query

```javascript
import { useQuery }
from "@tanstack/react-query";

const {
  data,
  isLoading
} = useQuery({

  queryKey: ["users"],

  queryFn: fetchUsers,

  staleTime: 10000
});
```

***

## Cache Lifecycle

```text
First Request
      ↓
API Call
      ↓
Cache Created

Second Request
      ↓
Cache Used

Cache Becomes Stale
      ↓
Background Refetch
```

***

## Mutation

```javascript
const queryClient =
  useQueryClient();

const mutation =
  useMutation({

    mutationFn:
      createUser,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [
          "users"
        ]
      });

    }
  });
```

***

## Flow

```text
Create User
      ↓
Mutation Success
      ↓
Invalidate Cache
      ↓
Refetch Users
      ↓
UI Updates
```

***

# Optimistic Update

Update UI before API finishes.

```javascript
const mutation =
  useMutation({

    mutationFn:
      updateUser,

    onMutate:
      async updatedUser => {

        await queryClient.cancelQueries({
          queryKey: ["users"]
        });

        const previous =
          queryClient.getQueryData(
            ["users"]
          );

        queryClient.setQueryData(
          ["users"],
          old =>
            old.map(user =>
              user.id === updatedUser.id
                ? updatedUser
                : user
            )
        );

        return { previous };
      },

    onError:
      (
        error,
        variables,
        context
      ) => {

        queryClient.setQueryData(
          ["users"],
          context.previous
        );
      },

    onSettled: () => {

      queryClient.invalidateQueries({
        queryKey: ["users"]
      });
    }
  });
```

***

# React Query Features vs Manual Cache

| Feature               | Manual Cache | React Query |
| --------------------- | ------------ | ----------- |
| TTL Cache             | ✅            | ✅           |
| Background Refresh    | Manual       | ✅           |
| Retry Logic           | Manual       | ✅           |
| Stale Data Recovery   | Manual       | ✅           |
| Cache Invalidation    | Manual       | ✅           |
| Optimistic Updates    | Complex      | ✅           |
| Request Deduplication | Manual       | ✅           |
| DevTools              | ❌            | ✅           |

***

# Senior Interview Answer

A production-grade cache should support:

```text
✅ TTL Expiration

✅ Stale-While-Revalidate

✅ Error Recovery Using Stale Data

✅ Retry Logic

✅ Request Deduplication

✅ Cache Invalidation

✅ Optimistic Updates

✅ Persistent Storage

✅ LRU Eviction Policy
```

In modern React applications, these concerns are typically handled by **React Query**, which provides automatic background refetching, cache invalidation, stale data recovery, retries, optimistic updates, and deduplication out of the box.
