implement a custom mapLimit function that takes 4 arguments

inputs: An array of inputs

limit: The maximum number of operations at any given time.

iterateeFn: The async function that should be called with each input to generate the corresponding output. It will have two arguments:

input: The input being processed

callback: A function that will be called when the input is finished processing. It will be provided with one argument, the processed output.

callback: A function that should be called with the array of outputs once all inputs have been processed.

At any given point, your program can make max 2 calls i.e. at any given point your program can process 1, 2 or 2, 3 or so on user ids.

Implement a mapLimit function that is similar to the Array.map() which returns a promise that resolves on the list of output by mapping each input through an asynchronous iteratee function or rejects it if any error occurs. It also accepts a limit to decide how many operations can occur at a time.

The asynchronous iteratee function will accept a input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result.

```js
function getUserById(id, callback) {
  // simulating async request
  const randomRequestTime = Math.floor(Math.random() * 100) + 200;
 
  setTimeout(() => {
    callback("User" + id)
  }, randomRequestTime);
}

function mapLimit(inputs, limit, iterateeFn, callback) {
    executeMap(inputs, limit, iterateeFn).then(results => callback(results));
  }


  async function executeMap(inputs, limit, iterateeFn) {
    let results = [];
    let i = 0;
    while (i < inputs.length) {
      let currentCall = [];
      while (currentCall.length < limit) {
        if (i < inputs.length) {
          currentCall.push(inputs[i++]);
        } else {
          break;
        }
      }
      const currentResults = await Promise.all(currentCall.map(val => executeRequest(val, iterateeFn)));
      currentResults.forEach(result => results.push(result));
    }
    return results;
  }
  
  function executeRequest(input, iterateeFn) {
    return new Promise(resolve => {
      iterateeFn(input, val => {
        resolve(val);
      });
    });
  }
  
  mapLimit([1,2,3,4,5], 2, getUserById, (allResults) => {
    console.log('output:', allResults) // ["User1", "User2", "User3", "User4", "User5"]
  })
```



```js
function getUserById(id, callback) {
  // simulating async request
  const randomRequestTime = Math.floor(Math.random() * 100) + 200;

  setTimeout(() => {
    callback("User" + id);
  }, randomRequestTime);
}

const chop = (arr, size) => {
  const temp = [...arr];
  if (!size) {
    return temp;
  }
  const output = [];
  let i = 0;
  while (i < temp.length) {
    output.push(temp.slice(i, i + size));
    i = i + size;
  }
  return output;
};

function mapLimit(inputs, limit, iterateeFn, callback) {
  // write your solution here
  let choppedArr = chop(inputs, limit);
  const reduceResult = choppedArr.reduce((acc, curr) => {
    return new Promise((resolve) => {
      let arr = [];
      curr.forEach((x) => {
        iterateeFn(x, (callbackVal) => {
          arr.push(callbackVal);
          if (curr.length === arr.length) {
            acc.then((accRes) => {
              resolve([...accRes, ...arr]);
            });
          }
        });
      });
    });
  }, Promise.resolve([]));
  reduceResult.then((results) => {
    console.log("results", results);
    callback(results);
  });
}

mapLimit([1, 2, 3, 4, 5], 2, getUserById, (allResults) => {
  console.print("output:", allResults); // ["User1", "User2", "User3", "User4", "User5"]
});
```

```js
async function asyncMapWithLimit(array, mappingFunction, limit) {
  const queue = [];
  const results = [];

  for (const item of array) {
    queue.push(mappingFunction(item));
  }

  while (queue.length > 0) {
    const promises = queue.splice(0, limit);
    const resolvedPromises = await Promise.all(promises);
    results.push(...resolvedPromises);
  }

  return results;
}

// Implement a js function that maps an array of items with an asynchronous
// mapping function while not exceeding the concurrency limit

// array: The array of items to map. mappingFunction: The asynchronous mapping
// function. limit: The maximum number of concurrent asynchronous operations.
// The function works by first creating a queue of all the asynchronous
// operations to be performed. Then, it iterates over the queue, starting a new
// asynchronous operation for each item in the queue, up to the concurrency
// limit. Once all of the asynchronous operations have been started, the
// function waits for all of them to finish before returning the results. Here
// is an example of how to use the asyncMapWithLimit fu

const array = [1, 2, 3, 4, 5];

const mappingFunction = async (item) => {
  // Perform some asynchronous operation on the item.
  return item * 2;
};

const results = await asyncMapWithLimit(array, mappingFunction, 2);

console.log(results); // [2, 4, 6, 8, 10]
// In this example, the asyncMapWithLimit function is used to map an array of
// numbers to an array of numbers that are twice as large, while not exceeding a
// concurrency limit of 2. The function returns an array of the results, which
// is then logged to the console.

```


This is a popular **JavaScript interview question** (similar to `async.mapLimit` from the `async` library).

### Problem

Implement a `mapLimit()` function that accepts:

```javascript
mapLimit(inputs, limit, asyncFn, callback)
```

#### Arguments

* `inputs` → Array of items
* `limit` → Maximum concurrent operations
* `asyncFn` → Async function to execute for each item
* `callback` → Called when all operations complete

***

## Example Usage

```javascript
function asyncSquare(num, cb) {
  setTimeout(() => {
    cb(null, num * num);
  }, 1000);
}

mapLimit(
  [1, 2, 3, 4, 5],
  2,
  asyncSquare,
  (err, results) => {
    console.log(results);
  }
);
```

### Expected Output

```javascript
[1, 4, 9, 16, 25]
```

Only **2 async operations run simultaneously**.

***

# Solution

```javascript
function mapLimit(
  inputs,
  limit,
  asyncFn,
  callback
) {
  const results = new Array(inputs.length);

  let completed = 0;
  let running = 0;
  let index = 0;

  function runNext() {
    // All tasks finished
    if (completed === inputs.length) {
      return callback(null, results);
    }

    // Fill available slots
    while (
      running < limit &&
      index < inputs.length
    ) {
      const currentIndex = index;
      const input = inputs[index];

      index++;
      running++;

      asyncFn(input, (err, result) => {
        if (err) {
          return callback(err);
        }

        results[currentIndex] = result;

        completed++;
        running--;

        runNext();
      });
    }
  }

  runNext();
}
```

***

# Dry Run

```javascript
inputs = [1,2,3,4,5]
limit = 2
```

### Start

```text
running = 0
```

Launch:

```text
1
2
```

Now:

```text
running = 2
```

***

### Task 1 finishes

```text
results[0] = 1
running = 1
```

Launch:

```text
3
```

Now:

```text
running = 2
```

***

### Task 2 finishes

Launch:

```text
4
```

And so on...

Maximum concurrent tasks remains:

```text
2
```

***

# Promise-Based Version (Modern JavaScript)

```javascript
async function mapLimit(
  inputs,
  limit,
  asyncFn
) {
  const results = [];
  const executing = [];

  for (const [index, item] of inputs.entries()) {
    const promise = Promise.resolve()
      .then(() => asyncFn(item))
      .then(result => {
        results[index] = result;
      });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);

      executing.splice(
        executing.findIndex(
          p => p === promise
        ),
        1
      );
    }
  }

  await Promise.all(executing);

  return results;
}
```

### Usage

```javascript
async function square(num) {
  return new Promise(resolve => {
    setTimeout(
      () => resolve(num * num),
      1000
    );
  });
}

mapLimit(
  [1, 2, 3, 4, 5],
  2,
  square
).then(console.log);
```

Output:

```javascript
[1, 4, 9, 16, 25]
```

***

# Time Complexity

```text
O(n)
```

where:

```javascript
n = inputs.length
```

### Space Complexity

```text
O(n)
```

for storing results.

***

# Senior Frontend Interview Answer

The key idea is:

1. Maintain a queue of pending tasks.
2. Track currently running tasks.
3. Never allow `running > limit`.
4. Start a new task whenever one finishes.
5. Preserve the original order of results.

This pattern is commonly used for:

* API rate limiting
* File uploads
* Bulk data processing
* Controlled parallel requests
* Playwright/WebDriver test execution queues


## `mapLimit()` with `async/await` (Modern Implementation)

`mapLimit()` allows you to process an array while limiting the number of concurrent async operations.

### Example

```javascript
async function mapLimit(inputs, limit, asyncFn) {
  const results = new Array(inputs.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < inputs.length) {
      const currentIndex = nextIndex++;

      results[currentIndex] =
        await asyncFn(inputs[currentIndex]);
    }
  }

  const workers = Array(
    Math.min(limit, inputs.length)
  )
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
}
```

***

## Usage Example

```javascript
async function fetchUser(id) {
  await new Promise(resolve =>
    setTimeout(resolve, 1000)
  );

  return `User-${id}`;
}

(async () => {
  const result = await mapLimit(
    [1, 2, 3, 4, 5],
    2,
    fetchUser
  );

  console.log(result);
})();
```

### Output

```javascript
[
  "User-1",
  "User-2",
  "User-3",
  "User-4",
  "User-5"
]
```

Only **2 requests run concurrently**.

***

# Error Handling in `mapLimit`

### Fail Fast Strategy

If any task fails:

```javascript
async function mapLimit(inputs, limit, asyncFn) {
  const results = new Array(inputs.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < inputs.length) {
      const currentIndex = nextIndex++;

      results[currentIndex] =
        await asyncFn(inputs[currentIndex]);
    }
  }

  const workers = Array(
    Math.min(limit, inputs.length)
  )
    .fill(null)
    .map(() => worker());

  return Promise.all(workers)
    .then(() => results);
}
```

### Example

```javascript
async function task(num) {
  if (num === 3) {
    throw new Error("Failed");
  }

  return num * 2;
}

try {
  const result = await mapLimit(
    [1, 2, 3, 4],
    2,
    task
  );
} catch (error) {
  console.log(error.message);
}
```

Output:

```text
Failed
```

***

# Continue Processing Even if Some Tasks Fail

Sometimes you want all tasks to finish.

```javascript
async function mapLimit(inputs, limit, asyncFn) {
  const results = new Array(inputs.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < inputs.length) {
      const currentIndex = nextIndex++;

      try {
        results[currentIndex] =
          await asyncFn(
            inputs[currentIndex]
          );
      } catch (error) {
        results[currentIndex] = {
          error: error.message
        };
      }
    }
  }

  const workers = Array(
    Math.min(limit, inputs.length)
  )
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
}
```

### Output Example

```javascript
[
  2,
  4,
  { error: "Failed" },
  8
]
```

***

# Optimising `mapLimit()` for Large Arrays

### Problem

For very large input arrays:

```javascript
100000+
500000+
1000000+
```

creating many promises at once can consume significant memory.

***

## Efficient Worker Pool Approach

```javascript
async function mapLimit(inputs, limit, asyncFn) {
  const results = new Array(inputs.length);

  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex++;

      if (currentIndex >= inputs.length) {
        return;
      }

      results[currentIndex] =
        await asyncFn(
          inputs[currentIndex]
        );
    }
  }

  const workers = [];

  for (
    let i = 0;
    i < Math.min(limit, inputs.length);
    i++
  ) {
    workers.push(worker());
  }

  await Promise.all(workers);

  return results;
}
```

### Why Better?

Instead of:

```text
100000 promises
```

you only create:

```text
limit promises
```

Example:

```javascript
limit = 5
```

Only:

```javascript
5 workers
```

exist throughout execution.

Memory usage remains stable.

***

# Real-World Use Cases

### API Rate Limiting

```javascript
await mapLimit(
  userIds,
  5,
  fetchUser
);
```

Only 5 API calls run simultaneously.

***

### File Uploads

```javascript
await mapLimit(
  files,
  3,
  uploadFile
);
```

Only 3 uploads at a time.

***

### Playwright Automation

```javascript
await mapLimit(
  urls,
  4,
  scrapePage
);
```

Prevents browser overload.

***

# Time Complexity

For:

```javascript
n = inputs.length
```

### Time

```text
O(n)
```

### Space

```text
O(n) results
O(limit) active workers
```

***

## Senior Frontend Interview Answer

> `mapLimit()` combines the behaviour of `map()` and concurrency control. The most scalable implementation uses a worker-pool pattern, where only `limit` async workers run at any time. For production systems, I generally add error handling (fail-fast or collect-errors mode), preserve result ordering, and minimise memory usage by keeping only a fixed number of active promises regardless of input size.
## 1. `mapLimit()` with Cancellation Support (AbortController)

In real-world applications, you may want to cancel pending operations when:

* User navigates away
* Component unmounts
* Search term changes
* Request timeout occurs

### Implementation

```javascript
async function mapLimit(
  inputs,
  limit,
  asyncFn,
  signal
) {
  const results = new Array(inputs.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < inputs.length) {
      if (signal?.aborted) {
        throw new Error("Operation cancelled");
      }

      const currentIndex = nextIndex++;

      results[currentIndex] =
        await asyncFn(
          inputs[currentIndex],
          signal
        );
    }
  }

  const workers = Array(
    Math.min(limit, inputs.length)
  )
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
}
```

***

### Usage

```javascript
const controller =
  new AbortController();

setTimeout(() => {
  controller.abort();
}, 3000);

try {
  const result = await mapLimit(
    [1, 2, 3, 4, 5],
    2,
    asyncTask,
    controller.signal
  );
} catch (error) {
  console.log(error.message);
}
```

Output:

```text
Operation cancelled
```

***

# 2. Understanding Concurrency with Examples

Assume:

```javascript
inputs = [1,2,3,4,5]
```

Each task takes:

```text
1 second
```

***

## Limit = 1

```javascript
await mapLimit(
  inputs,
  1,
  asyncTask
);
```

Execution:

```text
1
then 2
then 3
then 4
then 5
```

Total:

```text
≈ 5 seconds
```

***

## Limit = 2

```javascript
await mapLimit(
  inputs,
  2,
  asyncTask
);
```

Execution:

```text
1 2
3 4
5
```

Timeline:

```text
Second 0 -> 1,2
Second 1 -> 3,4
Second 2 -> 5
```

Total:

```text
≈ 3 seconds
```

***

## Limit = 5

```javascript
await mapLimit(
  inputs,
  5,
  asyncTask
);
```

Execution:

```text
1 2 3 4 5
```

All run simultaneously.

Total:

```text
≈ 1 second
```

***

## Visual Diagram

### limit = 2

```text
Worker-1: 1 → 3 → 5

Worker-2: 2 → 4
```

Maximum concurrent tasks:

```text
2
```

Always.

***

# 3. React Example: Using mapLimit in a Component

Imagine fetching user details.

### API Function

```javascript
async function fetchUser(id) {
  const response =
    await fetch(`/api/users/${id}`);

  return response.json();
}
```

***

### React Component

```jsx
import {
  useEffect,
  useState
} from "react";

function UsersList() {
  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    async function loadUsers() {
      const userIds =
        [1, 2, 3, 4, 5];

      const result =
        await mapLimit(
          userIds,
          2,
          fetchUser
        );

      setUsers(result);
    }

    loadUsers();
  }, []);

  return (
    <>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

# React Example with Cancellation

Very important during interviews.

```jsx
useEffect(() => {
  const controller =
    new AbortController();

  async function loadUsers() {
    try {
      const result =
        await mapLimit(
          [1,2,3,4,5],
          2,
          fetchUser,
          controller.signal
        );

      setUsers(result);
    } catch (error) {
      console.log(error.message);
    }
  }

  loadUsers();

  return () => {
    controller.abort();
  };
}, []);
```

Benefits:

✅ Prevents memory leaks

✅ Avoids updating unmounted components

✅ Cancels unnecessary API requests

***

# Production Use Cases

### File Uploads

```javascript
await mapLimit(
  files,
  3,
  uploadFile
);
```

Only 3 uploads at once.

***

### API Rate Limiting

```javascript
await mapLimit(
  userIds,
  5,
  fetchUser
);
```

Prevents overwhelming the backend.

***

### Playwright Automation

```javascript
await mapLimit(
  urls,
  4,
  scrapePage
);
```

Controls browser resource consumption.

***

# Senior Frontend Interview Answer

> `mapLimit()` is a concurrency-control utility that processes items similarly to `map()`, but limits the number of async operations running simultaneously. In production React applications, I typically implement it using a worker-pool pattern, support cancellation with `AbortController`, preserve result ordering, and use it for controlled API calls, file uploads, bulk processing, and rate-limited workflows. The key advantage is balancing throughput and resource usage while avoiding overwhelming APIs or the browser.
## 1. `mapLimit()` with Partial Error Handling

Instead of failing the entire operation when one task fails, collect both successes and failures.

```javascript
async function mapLimit(inputs, limit, asyncFn) {
  const results = new Array(inputs.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < inputs.length) {
      const currentIndex = nextIndex++;

      try {
        const data = await asyncFn(
          inputs[currentIndex]
        );

        results[currentIndex] = {
          success: true,
          data
        };
      } catch (error) {
        results[currentIndex] = {
          success: false,
          error: error.message
        };
      }
    }
  }

  const workers = Array(
    Math.min(limit, inputs.length)
  )
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
}
```

### Usage

```javascript
async function fetchUser(id) {
  if (id === 3) {
    throw new Error("User Not Found");
  }

  return `User-${id}`;
}

const result = await mapLimit(
  [1, 2, 3, 4],
  2,
  fetchUser
);

console.log(result);
```

### Output

```javascript
[
  { success: true, data: "User-1" },
  { success: true, data: "User-2" },
  {
    success: false,
    error: "User Not Found"
  },
  { success: true, data: "User-4" }
]
```

***

# 2. `mapLimit()` with Progress Reporting

Very useful for:

* File uploads
* Bulk API processing
* Image processing
* Migration scripts

### Implementation

```javascript
async function mapLimit(
  inputs,
  limit,
  asyncFn,
  onProgress
) {
  const results = new Array(inputs.length);

  let nextIndex = 0;
  let completed = 0;

  async function worker() {
    while (nextIndex < inputs.length) {
      const currentIndex = nextIndex++;

      try {
        results[currentIndex] =
          await asyncFn(
            inputs[currentIndex]
          );
      } finally {
        completed++;

        onProgress?.({
          completed,
          total: inputs.length,
          percent:
            Math.round(
              (completed /
                inputs.length) *
                100
            )
        });
      }
    }
  }

  const workers = Array(
    Math.min(limit, inputs.length)
  )
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
}
```

### Usage

```javascript
await mapLimit(
  [1, 2, 3, 4, 5],
  2,
  asyncTask,
  progress => {
    console.log(
      `${progress.percent}% Complete`
    );
  }
);
```

Output:

```text
20% Complete
40% Complete
60% Complete
80% Complete
100% Complete
```

***

# React Progress Bar Example

```jsx
const [progress, setProgress] =
  useState(0);

await mapLimit(
  files,
  3,
  uploadFile,
  ({ percent }) => {
    setProgress(percent);
  }
);
```

```jsx
<div>
  Progress: {progress}%
</div>
```

***

# 3. `mapLimit()` Cancellation Cleanup in React

This is a favourite Senior React interview topic.

### Problem

User leaves page before requests finish.

```text
Request still running
Component unmounted
State update occurs
React warning
Memory leak
```

***

## Correct Cleanup Pattern

```jsx
import {
  useEffect,
  useState
} from "react";

function UsersPage() {
  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    const controller =
      new AbortController();

    async function loadUsers() {
      try {
        const result =
          await mapLimit(
            [1, 2, 3, 4, 5],
            2,
            (id) =>
              fetch(
                `/api/users/${id}`,
                {
                  signal:
                    controller.signal
                }
              ).then(r => r.json()),
            controller.signal
          );

        setUsers(result);
      } catch (error) {
        if (
          error.name !==
          "AbortError"
        ) {
          console.error(error);
        }
      }
    }

    loadUsers();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

## Why Cleanup Matters

Without cleanup:

```text
User navigates away
Request finishes
setState fires
Component no longer exists
```

Potential issues:

```text
Memory leaks
Unnecessary requests
Race conditions
Stale data
```

***

## Additional Protection

```javascript
let mounted = true;

try {
  const result =
    await mapLimit(...);

  if (mounted) {
    setUsers(result);
  }
} finally {
  mounted = false;
}
```

Most modern applications prefer:

```javascript
AbortController
```

because it cancels the actual network request.

***

# Concurrency + Progress Visualisation

```text
Input: [1,2,3,4,5,6]
Limit: 2

Worker-1: 1 → 3 → 5
Worker-2: 2 → 4 → 6

Progress:
16%
33%
50%
66%
83%
100%
```

Only two tasks run at any moment while progress updates continuously.

***

# Senior Frontend Interview Answer

> In production, a robust `mapLimit()` implementation should support:
>
> * ✅ Concurrency limits
> * ✅ Result ordering
> * ✅ Partial error collection
> * ✅ Progress reporting
> * ✅ Cancellation via `AbortController`
> * ✅ React cleanup on unmount
>
> This pattern is commonly used for bulk API requests, file uploads, data imports, Playwright automation execution, and any rate-limited workload where controlled parallelism is required.
