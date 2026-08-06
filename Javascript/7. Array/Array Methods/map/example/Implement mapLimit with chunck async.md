```js
async function mapWithChunksAsync(array, mapper, chunkSize) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const mappedChunk = await Promise.all(chunk.map(mapper));
    results.push(...mappedChunk);
  }
  return results;
}

// Example async mapping function
async function asyncMapper(value) {
  return value * 2; // Perform some async operation
}

// Example usage of mapWithChunksAsync
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const chunkSize = 2;
mapWithChunksAsync(array, asyncMapper, chunkSize)
  .then((mappedArray) => {
    console.log(mappedArray); // Output: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
  })
  .catch((error) => {
    console.error(error);
  });

```

```js
// helper function to chop array in chunks of given size
Array.prototype.chop = function (size) {
  //temp array
  const temp = [...this];

  //if the size is not defined
  if (!size) {
    return temp;
  }

  //output
  const output = [];
  let i = 0;

  //iterate the array
  while (i < temp.length) {
    //slice the sub-array of a given size
    //and push them in output array
    output.push(temp.slice(i, i + size));
    i = i + size;
  }

  return output;
};

const mapLimit = (arr, limit, fn) => {
  // return a new promise
  return new Promise((resolve, reject) => {
    // chop the input array into the subarray of limit
    // [[1, 2, 3], [1, 2, 3]]
    let chopped = arr.chop(limit);
    
    // for all the subarrays of chopped
    // run it in series
    // that is one after another
    // initially it will take an empty array to resolve
    // merge the output of the subarray and pass it on to the next
    const final = chopped.reduce((a, b) => {
      return a.then((val) => {
        // run the sub-array values in parallel
        // pass each input to the iteratee function
        // and store their outputs
        // after all the tasks are executed
        // merge the output with the previous one and resolve
        return new Promise((resolve, reject) => {

          const results = [];
          let tasksCompleted = 0;
          b.forEach((e) => {
            fn(e, (error, value) => {
              if(error){
                reject(error);
              }else{
                results.push(value);
                tasksCompleted++;
                if (tasksCompleted >= b.length) {
                  resolve([...val, ...results]);
                }
              }
            });
          });
        });

      });
    }, Promise.resolve([]));

    // based on final promise state 
    // invoke the final promise.
    final
      .then((result) => {
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
```
Test Case 1: All the inputs resolve.

```js
Input:
let numPromise = mapLimit([1, 2, 3, 4, 5], 3, function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);
    callback(null, num);
  }, 2000);
});

numPromise
  .then((result) => console.log("success:" + result))
  .catch(() => console.log("no success"));

Output:
// first batch
2
4
6
// second batch
8
10
"success:2,4,6,8,10"
```

Test Case 2: Rejects.

```js
Input:
let numPromise = mapLimit([1, 2, 3, 4, 5], 3, function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);
    
    // throw error
    if(num === 6){
      callback(true);
    }else{
      callback(null, num);
    }
    
  }, 2000);
});

numPromise
  .then((result) => console.log("success:" + result))
  .catch(() => console.log("no success"));

Output:
// first batch
2
4
6
"no success"
```


A **chunk-based `mapLimit`** processes items in batches of size `limit`. Each batch runs in parallel using `Promise.all()`, and the next batch starts only after the current batch completes.

***

# Chunk-Based `mapLimit`

```javascript
async function mapLimit(items, limit, asyncMapper) {
  const results = [];

  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);

    const chunkResults = await Promise.all(
      chunk.map(asyncMapper)
    );

    results.push(...chunkResults);
  }

  return results;
}
```

***

# Example

```javascript
async function square(num) {
  await new Promise(resolve =>
    setTimeout(resolve, 1000)
  );

  console.log(`Processing ${num}`);

  return num * num;
}

(async () => {
  const result = await mapLimit(
    [1, 2, 3, 4, 5, 6],
    2,
    square
  );

  console.log(result);
})();
```

### Execution

```text
Batch 1:
1 2

Batch 2:
3 4

Batch 3:
5 6
```

### Output

```javascript
[1, 4, 9, 16, 25, 36]
```

***

# Visual Flow

```text
Input:
[1,2,3,4,5,6]

Limit:
2

Chunks:
[1,2]
[3,4]
[5,6]

Execution:
Promise.all([1,2])
↓
Promise.all([3,4])
↓
Promise.all([5,6])
```

***

# Error Handling Version

```javascript
async function mapLimit(items, limit, asyncMapper) {
  const results = [];

  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);

    const chunkResults = await Promise.allSettled(
      chunk.map(asyncMapper)
    );

    results.push(
      ...chunkResults.map(result =>
        result.status === "fulfilled"
          ? result.value
          : {
              error: result.reason.message
            }
      )
    );
  }

  return results;
}
```

### Example

```javascript
async function task(num) {
  if (num === 4) {
    throw new Error("Failed");
  }

  return num * 2;
}

const result = await mapLimit(
  [1, 2, 3, 4, 5],
  2,
  task
);

console.log(result);
```

### Output

```javascript
[
  2,
  4,
  6,
  { error: "Failed" },
  10
]
```

***

# React Example

```jsx
useEffect(() => {
  async function loadUsers() {
    const users = await mapLimit(
      [1, 2, 3, 4, 5],
      2,
      fetchUser
    );

    setUsers(users);
  }

  loadUsers();
}, []);
```

This prevents firing all requests simultaneously.

***

# Chunk Approach vs Worker Pool Approach

## Chunk Approach

```javascript
[1,2]
await

[3,4]
await

[5,6]
await
```

✅ Easy to understand

✅ Easy to implement

❌ If one task in a chunk is slow, the entire next chunk waits

***

## Worker Pool Approach

```text
Worker1: 1 → 3 → 5
Worker2: 2 → 4 → 6
```

✅ Better throughput

✅ Keeps workers busy

✅ Production-ready solution

***

# Interview Answer

If asked to implement `mapLimit` quickly, a chunk-based solution is often accepted:

```javascript
async function mapLimit(items, limit, mapper) {
  const result = [];

  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);

    result.push(
      ...(await Promise.all(
        chunk.map(mapper)
      ))
    );
  }

  return result;
}
```

**Complexity**

* Time: **O(n)**
* Space: **O(n)**
* Concurrency: **`limit` parallel operations per batch**

## 1. Chunk-Based `mapLimit()` with Progress Reporting

```javascript
async function mapLimit(
  items,
  limit,
  asyncMapper,
  onProgress
) {
  const results = [];
  let completed = 0;

  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);

    const chunkResults = await Promise.allSettled(
      chunk.map(asyncMapper)
    );

    chunkResults.forEach(result => {
      completed++;

      onProgress?.({
        completed,
        total: items.length,
        percent: Math.round(
          (completed / items.length) * 100
        )
      });

      results.push(result);
    });
  }

  return results;
}
```

### Usage

```javascript
await mapLimit(
  [1, 2, 3, 4, 5],
  2,
  asyncTask,
  ({ percent }) => {
    console.log(`${percent}%`);
  }
);
```

### Output

```text
20%
40%
60%
80%
100%
```

***

# 2. React Example with Error Handling

### API Call

```javascript
async function fetchUser(id) {
  const response = await fetch(
    `/api/users/${id}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed User ${id}`
    );
  }

  return response.json();
}
```

***

### Component

```jsx
import {
  useEffect,
  useState
} from "react";

function UsersPage() {
  const [users, setUsers] =
    useState([]);

  const [errors, setErrors] =
    useState([]);

  const [progress, setProgress] =
    useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      const result = await mapLimit(
        [1, 2, 3, 4, 5],
        2,
        fetchUser,
        ({ percent }) => {
          if (!cancelled) {
            setProgress(percent);
          }
        }
      );

      if (cancelled) return;

      const success = result
        .filter(
          r => r.status === "fulfilled"
        )
        .map(r => r.value);

      const failures = result
        .filter(
          r => r.status === "rejected"
        )
        .map(r => r.reason.message);

      setUsers(success);
      setErrors(failures);
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <h3>
        Progress: {progress}%
      </h3>

      <h4>Users</h4>

      {users.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}

      <h4>Errors</h4>

      {errors.map((error, idx) => (
        <div key={idx}>
          {error}
        </div>
      ))}
    </>
  );
}
```

***

# 3. Chunk-Based vs Worker-Pool `mapLimit`

## Chunk-Based Approach

```text
limit = 2

Chunk 1:
[1,2]

(wait)

Chunk 2:
[3,4]

(wait)

Chunk 3:
[5,6]
```

### Implementation

```javascript
for (...) {
  await Promise.all(chunk);
}
```

### Advantages

✅ Very easy to implement

✅ Easy to explain in interviews

✅ Simple progress reporting

✅ Good for small workloads

### Disadvantages

❌ Can waste time

Example:

```text
Task 1 = 1 second
Task 2 = 10 seconds
```

Chunk 2 must wait 10 seconds before starting.

***

## Worker Pool Approach

### Execution

```text
Worker 1:
1 → 3 → 5

Worker 2:
2 → 4 → 6
```

As soon as a worker finishes:

```text
Next item starts immediately
```

### Implementation

```javascript
async function worker() {
  while (...) {
    await mapper(item);
  }
}
```

### Advantages

✅ Better throughput

✅ More efficient

✅ No idle workers

✅ Ideal for large datasets

✅ Production-ready

### Disadvantages

❌ Slightly more complex

❌ Progress tracking needs extra logic

***

# Performance Example

Assume:

```text
Items = [1,2,3,4]

Task Times:
1 = 1 second
2 = 10 seconds
3 = 1 second
4 = 1 second

Limit = 2
```

## Chunk-Based

```text
Start:
1 2

Wait 10s

Start:
3 4
```

Total:

```text
≈ 11 seconds
```

***

## Worker Pool

```text
Worker A:
1 → 3 → 4

Worker B:
2
```

Total:

```text
≈ 10 seconds
```

Worker A stays busy instead of waiting.

***

# Senior Front-End Interview Answer

### Choose Chunk-Based When

* Simplicity matters
* Small to moderate workloads
* Batch processing APIs
* Interview coding rounds

```javascript
await Promise.all(chunk);
```

***

### Choose Worker Pool When

* Thousands of items
* API rate limiting
* File uploads
* Web scraping
* Playwright automation
* Enterprise applications

```javascript
worker()
worker()
worker()
```

The worker-pool model is generally considered the **production-grade solution** because it maximises concurrency utilisation while respecting the configured limit.



## React Progress Bar UI with Chunk-Based `mapLimit`

This example demonstrates:

✅ Chunk-based concurrency (`limit = 3`)  
✅ Progress bar UI  
✅ Error handling (`Promise.allSettled`)  
✅ React state updates  
✅ File upload / API request style implementation

***

### Chunk-Based `mapLimit`

```javascript
async function mapLimit(
  items,
  limit,
  asyncMapper,
  onProgress
) {
  const results = [];
  let completed = 0;

  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);

    const chunkResults = await Promise.allSettled(
      chunk.map(asyncMapper)
    );

    chunkResults.forEach(result => {
      completed++;

      onProgress?.({
        completed,
        total: items.length,
        percent: Math.round(
          (completed / items.length) * 100
        )
      });

      results.push(result);
    });
  }

  return results;
}
```

***

## React Component

```jsx
import React, { useState } from "react";

async function simulateApi(id) {
  await new Promise(resolve =>
    setTimeout(resolve, 1000)
  );

  if (id === 5) {
    throw new Error(
      `Request ${id} failed`
    );
  }

  return `Data-${id}`;
}

async function mapLimit(
  items,
  limit,
  mapper,
  onProgress
) {
  const results = [];
  let completed = 0;

  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);

    const chunkResults =
      await Promise.allSettled(
        chunk.map(mapper)
      );

    chunkResults.forEach(result => {
      completed++;

      onProgress?.({
        completed,
        total: items.length,
        percent: Math.round(
          (completed / items.length) * 100
        )
      });

      results.push(result);
    });
  }

  return results;
}

export default function App() {
  const [progress, setProgress] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [results, setResults] =
    useState([]);

  async function startProcessing() {
    setLoading(true);

    const response =
      await mapLimit(
        [1,2,3,4,5,6,7,8,9],
        3,
        simulateApi,
        ({ percent }) =>
          setProgress(percent)
      );

    setResults(response);

    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "20px auto"
      }}
    >
      <button
        onClick={startProcessing}
        disabled={loading}
      >
        Start Processing
      </button>

      {/* Progress Label */}
      <p>
        Progress: {progress}%
      </p>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "25px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#4caf50",
            transition:
              "width 0.3s ease"
          }}
        />
      </div>

      <h3>Results</h3>

      <ul>
        {results.map(
          (result, index) => (
            <li key={index}>
              {result.status ===
              "fulfilled"
                ? result.value
                : `❌ ${result.reason.message}`}
            </li>
          )
        )}
      </ul>
    </div>
  );
}
```

***

## Progress Flow

For:

```javascript
items = [1,2,3,4,5,6,7,8,9]
limit = 3
```

Execution:

```text
Chunk 1
1 2 3
↓
33%

Chunk 2
4 5 6
↓
66%

Chunk 3
7 8 9
↓
100%
```

***

## Production Enhancement

Show detailed progress:

```jsx
<p>
  {completed} of {total} items processed
</p>
```

Example:

```text
2 of 9 items processed
4 of 9 items processed
7 of 9 items processed
9 of 9 items processed
```

***

## Interview Answer

> A chunk-based `mapLimit` processes items in batches using `Promise.all()` or `Promise.allSettled()`. Progress can be reported after each item or chunk completion by maintaining a completed counter and calculating `(completed / total) * 100`. In React, this progress can be bound to state and rendered through a progress bar component, making it ideal for file uploads, batch API requests, data imports, and bulk processing workflows.


## React Progress Bar with Detailed Progress Text

Instead of showing only:

```text
Progress: 60%
```

show richer information:

```text
Processed: 6 / 10
Success: 5
Failed: 1
Current Batch: 2 / 4
Progress: 60%
```

***

## Enhanced Chunk-Based `mapLimit`

```javascript
async function mapLimit(
  items,
  limit,
  asyncMapper,
  onProgress
) {
  const results = [];

  let completed = 0;
  let successCount = 0;
  let failureCount = 0;

  const totalChunks = Math.ceil(
    items.length / limit
  );

  for (
    let chunkIndex = 0;
    chunkIndex < totalChunks;
    chunkIndex++
  ) {
    const start = chunkIndex * limit;
    const chunk = items.slice(
      start,
      start + limit
    );

    const chunkResults = await Promise.allSettled(
      chunk.map(asyncMapper)
    );

    chunkResults.forEach(result => {
      completed++;

      if (
        result.status === "fulfilled"
      ) {
        successCount++;
      } else {
        failureCount++;
      }

      onProgress?.({
        completed,
        total: items.length,
        successCount,
        failureCount,
        currentChunk:
          chunkIndex + 1,
        totalChunks,
        percent: Math.round(
          (completed /
            items.length) *
            100
        )
      });

      results.push(result);
    });
  }

  return results;
}
```

***

# React Component

```jsx
import { useState } from "react";

export default function App() {
  const [progress, setProgress] =
    useState({
      completed: 0,
      total: 0,
      successCount: 0,
      failureCount: 0,
      currentChunk: 0,
      totalChunks: 0,
      percent: 0
    });

  async function fakeApi(id) {
    await new Promise(resolve =>
      setTimeout(resolve, 1000)
    );

    if (id === 5 || id === 8) {
      throw new Error(
        `Failed ${id}`
      );
    }

    return `Success ${id}`;
  }

  async function start() {
    await mapLimit(
      [1,2,3,4,5,6,7,8,9,10],
      3,
      fakeApi,
      (progressInfo) => {
        setProgress(progressInfo);
      }
    );
  }

  return (
    <div>
      <button onClick={start}>
        Start Import
      </button>

      <h3>
        Progress: {progress.percent}%
      </h3>

      <div
        style={{
          width: "100%",
          height: "30px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${progress.percent}%`,
            height: "100%",
            background:
              "#4caf50",
            transition:
              "width 0.2s ease"
          }}
        />
      </div>

      <div
        style={{
          marginTop: "10px"
        }}
      >
        <p>
          Processed:
          {" "}
          {progress.completed}
          {" / "}
          {progress.total}
        </p>

        <p>
          Success:
          {" "}
          {progress.successCount}
        </p>

        <p>
          Failed:
          {" "}
          {progress.failureCount}
        </p>

        <p>
          Current Batch:
          {" "}
          {progress.currentChunk}
          {" / "}
          {progress.totalChunks}
        </p>
      </div>
    </div>
  );
}
```

***

# Sample UI During Execution

### After First Batch

```text
Progress: 30%

Processed: 3 / 10
Success: 3
Failed: 0
Current Batch: 1 / 4
```

***

### After Second Batch

```text
Progress: 60%

Processed: 6 / 10
Success: 5
Failed: 1
Current Batch: 2 / 4
```

***

### Completed

```text
Progress: 100%

Processed: 10 / 10
Success: 8
Failed: 2
Current Batch: 4 / 4
```

***

## Senior React Interview Enhancement

Add estimated remaining items:

```javascript
remaining:
total - completed
```

Display:

```jsx
<p>
  Remaining:
  {" "}
  {progress.total -
   progress.completed}
</p>
```

Final detailed dashboard:

```text
Progress: 80%

Processed: 8 / 10
Remaining: 2

Success: 7
Failed: 1

Current Batch: 3 / 4
```

This is the kind of progress reporting commonly used in bulk uploads, CSV imports, file processing, migration tools, and enterprise React dashboards.


## 1. Chunk-Based `mapLimit()` with Cancellation Support

The simplest approach is to use an `AbortController`.

```javascript
async function mapLimit(
  items,
  limit,
  asyncMapper,
  onProgress,
  signal
) {
  const results = [];

  let completed = 0;

  for (let i = 0; i < items.length; i += limit) {
    // Stop before starting next chunk
    if (signal?.aborted) {
      throw new Error("Operation cancelled");
    }

    const chunk = items.slice(i, i + limit);

    const chunkResults = await Promise.allSettled(
      chunk.map(item =>
        asyncMapper(item, signal)
      )
    );

    chunkResults.forEach(result => {
      completed++;

      onProgress?.({
        completed,
        total: items.length,
        percent: Math.round(
          (completed / items.length) * 100
        )
      });

      results.push(result);
    });
  }

  return results;
}
```

***

## Async Function Supporting Cancellation

```javascript
async function fetchData(
  id,
  signal
) {
  const response = await fetch(
    `/api/users/${id}`,
    { signal }
  );

  return response.json();
}
```

***

# React Example with Cancellation + Detailed Errors

```jsx
import {
  useState,
  useEffect
} from "react";

export default function UsersPage() {
  const [progress, setProgress] =
    useState(0);

  const [errors, setErrors] =
    useState([]);

  const [results, setResults] =
    useState([]);

  useEffect(() => {
    const controller =
      new AbortController();

    async function load() {
      try {
        const response =
          await mapLimit(
            [1,2,3,4,5,6,7],
            3,
            fetchUser,
            ({ percent }) => {
              setProgress(percent);
            },
            controller.signal
          );

        const success =
          response
            .filter(
              r =>
                r.status ===
                "fulfilled"
            )
            .map(r => r.value);

        const failed =
          response
            .filter(
              r =>
                r.status ===
                "rejected"
            )
            .map(r => ({
              message:
                r.reason.message
            }));

        setResults(success);
        setErrors(failed);
      } catch (error) {
        if (
          error.message !==
          "Operation cancelled"
        ) {
          console.error(error);
        }
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <h2>
        Progress: {progress}%
      </h2>

      <h3>Errors</h3>

      {errors.length === 0 ? (
        <p>No failures</p>
      ) : (
        <ul>
          {errors.map(
            (error, index) => (
              <li key={index}>
                {error.message}
              </li>
            )
          )}
        </ul>
      )}
    </>
  );
}
```

***

# Detailed Error Report UI

Instead of:

```text
Failed: 3
```

Show:

```jsx
<div>
  <h3>Error Summary</h3>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Error</th>
      </tr>
    </thead>

    <tbody>
      {errors.map(error => (
        <tr key={error.id}>
          <td>{error.id}</td>
          <td>{error.message}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

Example:

```text
+------+-------------------+
| Item | Error             |
+------+-------------------+
| 5    | User not found    |
| 8    | Network timeout   |
| 12   | Access denied     |
+------+-------------------+
```

***

# Performance Impact of Chunk Size

This is a common senior frontend interview topic.

## Chunk Size = 1

```javascript
limit = 1
```

Execution:

```text
1
2
3
4
5
```

Characteristics:

✅ Very safe

✅ Very low memory

❌ Slowest

***

## Chunk Size = 5

```javascript
limit = 5
```

Execution:

```text
1 2 3 4 5
(wait)
6 7 8 9 10
```

Characteristics:

✅ Faster

✅ Good API utilisation

⚠️ Moderate memory usage

***

## Chunk Size = 100

```javascript
limit = 100
```

Characteristics:

✅ Extremely fast

❌ Large memory pressure

❌ Can exceed API rate limits

❌ Risk of browser/network congestion

***

# Example

Assume:

```text
100 requests
Each request = 1 second
```

### limit = 1

```text
100 batches
≈ 100 seconds
```

***

### limit = 10

```text
10 batches
≈ 10 seconds
```

***

### limit = 100

```text
1 batch
≈ 1 second
```

But:

```text
100 active requests
```

which some APIs won't allow.

***

# Recommended Chunk Sizes

| Use Case              | Chunk Size    |
| --------------------- | ------------- |
| API Calls             | 3-10          |
| File Uploads          | 3-5           |
| Image Processing      | 5-20          |
| Web Scraping          | 2-10          |
| Playwright Automation | 2-5           |
| Local CPU Work        | CPU cores × 2 |

***

# Chunk-Based vs Worker-Pool Performance

### Chunk-Based

```text
[1,2,3]
(wait)
[4,5,6]
(wait)
```

If one operation in a batch is slow:

```text
everything waits
```

***

### Worker Pool

```text
Worker1 → 1 → 4 → 7
Worker2 → 2 → 5 → 8
Worker3 → 3 → 6 → 9
```

Benefits:

✅ Better CPU utilisation

✅ Better throughput

✅ No idle workers

✅ Preferred for large workloads

***

## Senior Interview Answer

> For chunk-based `mapLimit`, cancellation is typically implemented using `AbortController`, with cleanup triggered inside the React `useEffect` cleanup function. Chunk size directly affects throughput, memory usage, and API pressure. Small chunk sizes are safer but slower, while larger chunk sizes improve throughput at the cost of resource consumption. For production systems with large workloads, a worker-pool implementation generally provides better utilisation than a strict chunk-based approach because workers immediately pick up the next task without waiting for an entire batch to finish.
