# LRU Cache (Least Recently Used Cache)

An **LRU Cache** is a caching mechanism that removes the **least recently accessed item** when the cache reaches its maximum capacity. This helps keep frequently used data readily available while discarding stale data. [[geeksforgeeks.org]](https://www.geeksforgeeks.org/system-design/lru-cache-implementation/), [[leetcode.com]](https://leetcode.com/problems/lru-cache/)

## Why Do We Need It?

Caches have limited memory.

When the cache is full and a new item needs to be added:

- Keep recently used items.
- Remove the least recently used item.

Common use cases:

- Browser caching
- Database query caching
- API response caching
- Redis local caches
- React data caching (React Query, RTK Query) [[geeksforgeeks.org]](https://www.geeksforgeeks.org/system-design/lru-cache-implementation/), [[baeldung.com]](https://www.baeldung.com/java-lru-cache)

---

## Example

Capacity = 3

put(1, A)  -> [1]

put(2, B)  -> [2,1]

put(3, C)  -> [3,2,1]

get(1)     -> [1,3,2]   // 1 becomes most recently used

put(4, D)  -> [4,1,3]

             2 evicted (Least Recently Used)

---

## Interview Requirements

Implement:

get(key)  -> O(1)

put(key, value) -> O(1)

To achieve **O(1)** time complexity:

| Data Structure     | Purpose              |
| ------------------ | -------------------- |
| HashMap            | Fast key lookup      |
| Doubly Linked List | Maintain usage order |

This is the standard approach used in interviews. [[leetcode.com]](https://leetcode.com/problems/lru-cache/), [[geeksforgeeks.org]](https://www.geeksforgeeks.org/dsa/design-a-data-structure-for-lru-cache/)

---

# Visual Representation

HEAD (MRU)

|

v

[4] <-> [1] <-> [3]

^

|

TAIL (LRU)

- Head = Most Recently Used (MRU)
- Tail = Least Recently Used (LRU)

---

# Complete JavaScript Implementation

class Node {

  constructor(key, value) {

    this.key = key;

    this.value = value;

    this.prev = null;

    this.next = null;

  }

}

class LRUCache {

  constructor(capacity) {

    this.capacity = capacity;

    this.cache = new Map();

    this.head = new Node(0, 0);

    this.tail = new Node(0, 0);

    this.head.next = this.tail;

    this.tail.prev = this.head;

  }

  remove(node) {

    node.prev.next = node.next;

    node.next.prev = node.prev;

  }

  insert(node) {

    node.next = this.head.next;

    node.prev = this.head;

    this.head.next.prev = node;

    this.head.next = node;

  }

  get(key) {

    if (!this.cache.has(key)) {

      return -1;

    }

    const node = this.cache.get(key);

    this.remove(node);

    this.insert(node);

    return node.value;

  }

  put(key, value) {

    if (this.cache.has(key)) {

      const oldNode = this.cache.get(key);

      this.remove(oldNode);

    }

    const newNode = new Node(key, value);

    this.insert(newNode);

    this.cache.set(key, newNode);

    if (this.cache.size > this.capacity) {

      const lru = this.tail.prev;

      this.remove(lru);

      this.cache.delete(lru.key);

    }

  }

}

---

# Dry Run

const cache = new LRUCache(2);

cache.put(1, 1);

cache.put(2, 2);

console.log(cache.get(1));

// 1

cache.put(3, 3);

// Evicts key 2

console.log(cache.get(2));

// -1

cache.put(4, 4);

// Evicts key 1

console.log(cache.get(1));

// -1

console.log(cache.get(3));

// 3

console.log(cache.get(4));

// 4

Output:

1

-1

-1

3

4

---

# Complexity Analysis

| Operation | Time        |
| --------- | ----------- |
| get()     | O(1)        |
| put()     | O(1)        |
| Space     | O(capacity) |

---

# Senior React/System Design Interview Follow-up

**Q: Why not use only a Map?**

You can:

const cache = new Map();

`

Delete and reinsert keys to maintain order.

However:

- Eviction logic becomes less flexible.
- Harder to extend for LFU/TTL caches.
- Large-scale systems generally combine a HashMap + Doubly Linked List.

---

# Common Interview Questions

### 1\. LRU vs LFU

| LRU                        | LFU                                            |
| -------------------------- | ---------------------------------------------- |
| Evicts least recently used | Evicts least frequently used                   |
| Simpler                    | More complex                                   |
| O(1) implementation        | Usually O(log n) or O(1) with extra structures |

---

### 2\. LRU + TTL

Many production caches add:

{

  value,

  expiryTime

}

If expired:

cache.delete(key);

Examples:

- Redis
- React Query
- CDN caches

---

### 3\. Where is LRU used in React?

- React Query cache
- RTK Query cache
- Image caching
- API response caching
- Memoization libraries

The core idea remains the same: **keep recently used data and evict stale data**. [[npmjs.com]](https://www.npmjs.com/package/lru-cache), [[geeksforgeeks.org]](https://www.geeksforgeeks.org/system-design/lru-cache-implementation/)

Enterprise references found related to LRU cache libraries and implementations include [README.md](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/yocto-queue/readme.md?web=1&EntityRepresentationId=0fde46b6-ab3f-4dcc-b1a8-f30e6091056b), [package.json](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/simple-lru-cache/package.json?web=1&EntityRepresentationId=b31c93d8-4d69-4b84-abbb-4951fa85a294), and several [lru-cache](https://persistentsystems.sharepoint.com/sites/POC94/Shared%20Documents/Source/node_modules/lru-cache?web=1&EntityRepresentationId=b8866903-2b1d-4e3f-99cb-73b8d5b1294d) examples in your organisation's code repositories. [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Group-3/llm-gateway-Code/frontend/node_modules/lru-cache/README.md?web=1), [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Group-3/llm-gateway-Code/frontend/node_modules/lru-cache/package.json?web=1), [[lru-cache | SharePoint]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/Batch%2024/Group-3/llm-gateway-Code/frontend/node_modules/lru-cache?web=1)

## LRU Cache Use Cases in React

An **LRU (Least Recently Used) cache** is useful when you want to keep frequently accessed data in memory while automatically removing older, unused data to control memory usage. [[npmjs.com]](https://www.npmjs.com/package/lru-cache), [[bing.com]](https://bing.com/search?q=LRU+cache+React)

### 1\. API Response Caching ⭐ Most Common

Avoid repeated API calls for the same data.

User -> Profile Page

      -> Fetch User 123

Next Visit

      -> Read from LRU Cache

      -> No API Call

**Used in:**

- React Query
- RTK Query
- SWR-like caching strategies

Benefits:

- Faster UI
- Reduced network traffic
- Better user experience [[bing.com]](https://bing.com/search?q=LRU+cache+React), [[npmjs.com]](https://www.npmjs.com/package/lru-cache)

---

### 2\. Search Auto-Complete

Cache recent search results.

Search: "react"

API called once.

Search again:

"react"

Result returned from cache.

Benefits:

- Instant suggestions
- Less backend load

---

### 3\. Infinite Scroll / Virtualized Lists

Large tables and grids often re-render the same items.

Examples:

- Data Grid
- Handsontable
- AG Grid
- Infinite feeds

LRU stores recently rendered components and evicts off-screen items. [[github.com]](https://github.com/zekedroid/react-lru), [[bing.com]](https://bing.com/search?q=LRU+cache+React)

Benefits:

- Reduced remounting
- Better scroll performance
- Lower memory consumption

---

### 4\. Image Caching

Store recently viewed images.

User opens:

Image A

Image B

Image C

Back to Image A

Loaded from cache

instead of network.

Benefits:

- Faster image rendering
- Improved mobile performance [[codezup.com]](https://codezup.com/react-lru-cache-image-loading-performance/)

---

### 5\. Recently Visited Pages

Store recent routes.

/dashboard

/users

/settings

/reports

When cache is full:

Least visited route removed.

Benefits:

- Quick navigation history
- Faster route restoration [[medium.com]](https://medium.com/@avhishekydv/recently-visited-pages-implementation-using-lru-cache-4eff7eabae65)

---

### 6\. MFE (Micro Frontend) Shared Data Cache

Since you work with Micro Frontends, LRU is commonly used to cache:

- User profile
- Feature flags
- Permissions
- Configuration data

Shell App

   ↓

LRU Cache

   ↓

MFE1

MFE2

MFE3

Benefits:

- Prevents duplicate API calls
- Faster MFE startup

---

### 7\. Expensive Computation Caching

Cache calculated values.

calculatePermissions(user);

calculatePrice(data);

buildMenuTree(items);

``

Store results in LRU:

cache.get(userId);

Benefits:

- Avoids recalculation
- Faster renders

---

### 8\. Offline-First Applications

Cache:

- Last viewed data
- Dashboard widgets
- User preferences

Benefits:

- Better resilience during network issues

---

## React Interview Answer (1 Minute)

> "In React, LRU cache is commonly used for API response caching, search suggestions, image caching, infinite scrolling, route history, and Micro Frontend shared data. It keeps recently used data in memory and automatically removes stale entries when capacity is reached. This improves performance, reduces network requests, and prevents unbounded memory growth." [[bing.com]](https://bing.com/search?q=LRU+cache+React), [[npmjs.com]](https://www.npmjs.com/package/lru-cache), [[github.com]](https://github.com/zekedroid/react-lru)

### Senior-Level Insight

For enterprise React applications, LRU caching is typically combined with:

- **TTL (Time To Live)**
- **React Query**
- **RTK Query**
- **IndexedDB**
- **Service Workers**

This provides both **fast access** and **automatic cache expiry**, avoiding stale data while keeping memory usage under control. [[npmjs.com]](https://www.npmjs.com/package/lru-cache), [[persistent...epoint.com]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/Propeller%20Program/P_Batch%2025/Propeller_Technothon_Files/Problem_Statement_4_LLM_Gateway/LLM_Gateway_Implementation_Guide.md?web=1)

# LRU Cache in React Query (TanStack Query)

**Important:** React Query does **not use a true LRU cache internally**. It uses an **in-memory query cache** with:

- `staleTime` (freshness)
- `gcTime` / `cacheTime` (garbage collection)
- Query invalidation
- Background refetching

Cached queries are removed when they become inactive and exceed their configured cache lifetime. [[tanstack.com]](https://tanstack.com/query/v4/docs/framework/react/guides/caching), [[bing.com]](https://bing.com/search?q=React+Query+cache+LRU+caching)

If you need **strict LRU eviction**, you typically add an LRU layer on top of React Query or use a custom QueryCache strategy. [[medium.com]](https://medium.com/@japeshsinghal/hooked-on-caching-building-a-smarter-usequery-hook-with-lru-superpowers-920bf040e51e), [[stackoverflow.com]](https://stackoverflow.com/questions/75783266/wheres-cache-in-react-querytanstack-where-do-they-actually-cache-the-data)

---

# 1\. Implementing LRU Cache with React Query

## Option 1: React Query Native Cache (Recommended)

Most enterprise apps don't need a true LRU.

import { useQuery } from "@tanstack/react-query";

function useUsers() {

  return useQuery({

    queryKey: ["users"],

    queryFn: fetchUsers,

    staleTime: 5 _ 60 _ 1000,

    gcTime: 30 _ 60 _ 1000,

  });

}

Behavior:

Fresh Data

    ↓

Served From Cache

    ↓

Stale

    ↓

Background Refetch

    ↓

Unused

    ↓

Garbage Collection

This is usually sufficient for:

- Dashboards
- CRUD apps
- Internal portals
- Micro Frontends

[[tanstack.com]](https://tanstack.com/query/v4/docs/framework/react/guides/caching), [[bing.com]](https://bing.com/search?q=React+Query+cache+LRU+caching)

---

## Option 2: Add a Real LRU Layer

Useful when:

- Thousands of dynamically generated query keys
- Search applications
- Product catalogues
- Memory-sensitive dashboards

import { LRUCache } from "lru-cache";

export const apiCache = new LRUCache({

  max: 100,

  ttl: 1000 _ 60 _ 5,

});

``

Query Function:

const fetchUser = async (id) => {

  const key = `user-${id}`;

  const cached = apiCache.get(key);

  if (cached) {

    return cached;

  }

  const response = await fetch(`/api/users/${id}`);

  const data = await response.json();

  apiCache.set(key, data);

  return data;

};

``

React Query:

useQuery({

  queryKey: ["user", id],

  queryFn: () => fetchUser(id),

});

Now:

React Query

          +

LRU Cache

Benefits:

- Query management from React Query
- O(1) eviction from LRU
- Memory remains bounded

[[medium.com]](https://medium.com/@japeshsinghal/hooked-on-caching-building-a-smarter-usequery-hook-with-lru-superpowers-920bf040e51e), [[bing.com]](https://bing.com/search?q=React+Query+cache+LRU+caching)

---

# React Caching Strategy Comparison

| Strategy                | Memory Control         | Persistence         | Best For               |
| ----------------------- | ---------------------- | ------------------- | ---------------------- |
| React Query Cache       | Medium                 | Memory              | API data               |
| LRU Cache               | Excellent              | Memory              | Search, dynamic data   |
| Memoization (`useMemo`) | Limited                | Component lifecycle | Expensive calculations |
| Local Storage           | Manual                 | Browser persistent  | Preferences            |
| Session Storage         | Manual                 | Session             | Temporary state        |
| IndexedDB               | Excellent              | Persistent          | Offline apps           |
| Service Worker Cache    | Excellent              | Persistent          | Assets, APIs           |
| SWR Cache               | Similar to React Query | Memory              | Revalidation workflows |

Based on available React Query documentation and cache lifecycle examples. [[tanstack.com]](https://tanstack.com/query/v4/docs/framework/react/guides/caching), [[bing.com]](https://bing.com/search?q=React+Query+cache+LRU+caching)

---

# React Query vs LRU Cache

| Feature                      | React Query | LRU |
| ---------------------------- | ----------- | --- |
| Automatic Refetch            | ✅           | ❌   |
| Query Invalidation           | ✅           | ❌   |
| Mutation Support             | ✅           | ❌   |
| Background Sync              | ✅           | ❌   |
| Memory Bound Control         | Limited     | ✅   |
| Least Recently Used Eviction | ❌           | ✅   |
| TTL Support                  | ✅           | ✅   |
| API Management               | ✅           | ❌   |

### Interview Answer

> React Query focuses on server-state management and freshness, while LRU focuses on memory optimisation. React Query decides when data becomes stale, whereas LRU decides which data to evict when memory limits are exceeded.

---

# Best Practices for LRU Cache in React Apps

## 1\. Always Set Maximum Capacity

❌ Bad

new LRUCache();

✅ Good

new LRUCache({

  max: 500,

});

``

Prevents memory leaks. [[bing.com]](https://bing.com/search?q=React+Query+cache+LRU+caching)

---

## 2\. Combine LRU + TTL

new LRUCache({

  max: 500,

  ttl: 1000 _ 60 _ 5,

});

Eviction occurs based on:

- Age
- Memory pressure

This avoids stale data. [[bing.com]](https://bing.com/search?q=React+Query+cache+LRU+caching), [[LLM_Gatewa...rm_group_3 | PowerPoint]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/_layouts/15/Doc.aspx?sourcedoc=%7B724E2C6A-9DE4-43BF-959D-12C20AC5129B%7D&file=LLM_Gateway_Platform_group_3.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

---

## 3\. Use LRU Only for Expensive Data

Good candidates:

✅ Search results

✅ Product details

✅ User profiles

✅ Permissions

✅ Feature flags

Avoid caching:

❌ Frequently changing data

❌ Real-time trading data

❌ Live notifications

---

## 4\. Keep Query Keys Stable

["user", userId]

["products", categoryId]

Avoid:

[Math.random()]

Stable keys improve hit rates. [[tanstack.com]](https://tanstack.com/query/v4/docs/framework/react/guides/caching), [[Animesh Sh...Evaluation | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1)

---

## 5\. Invalidate After Mutations

queryClient.invalidateQueries({

  queryKey: ["users"],

});

Otherwise LRU may return outdated data. [[Animesh Sh...Evaluation | PDF]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/React/Animesh%20Shrivastav_00002884_AI_Inteview_Evaluation.pdf?web=1), [[stackoverflow.com]](https://stackoverflow.com/questions/75783266/wheres-cache-in-react-querytanstack-where-do-they-actually-cache-the-data)

---

## 6\. Monitor Cache Hit Rate

Track:

Hits

Misses

Evictions

Memory Usage

A low hit rate usually means cache size is too small.

---

## 7\. Use Shared Cache in Micro Frontends

Since you're working with MFEs, a common pattern is:

Shell

  ↓

Shared LRU Cache

  ↓

MFE A

MFE B

MFE C

Useful for:

- Feature flags
- User profile
- Configuration
- Permissions

This prevents duplicate API calls across MFEs.

---

# Senior/Staff Interview Insight

For large React applications:

React Query

      ↓

LRU Cache

      ↓

IndexedDB

      ↓

Network

This creates a **multi-level cache hierarchy**:

- L1 → React Query memory cache
- L2 → LRU cache
- L3 → IndexedDB/local persistence
- L4 → Server API

Benefits:

- Faster renders
- Reduced API traffic
- Controlled memory usage
- Better offline support

React Query handles **freshness**, while LRU handles **memory pressure and eviction**. That's the key distinction interviewers typically look for. [[tanstack.com]](https://tanstack.com/query/v4/docs/framework/react/guides/caching), [[bing.com]](https://bing.com/search?q=React+Query+cache+LRU+caching), [[stackoverflow.com]](https://stackoverflow.com/questions/75783266/wheres-cache-in-react-querytanstack-where-do-they-actually-cache-the-data)
