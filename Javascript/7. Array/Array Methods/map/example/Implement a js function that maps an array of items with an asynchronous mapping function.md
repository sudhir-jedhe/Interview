Implement a js function that maps an array of items with an asynchronous
mapping function

This function takes an array of items and an asynchronous mapping function as input. 
The mapping function is called on each item in the array, and the
results are collected into an array of promises. 

The asyncMap function then
waits for all of the promises to resolve before returning the results.

```javascript
async function mapAsync(array, mapper) {
  // Use Promise.all to asynchronously map each value in the array
  const mappedValues = await Promise.all(array.map(mapper));
  return mappedValues;
}
// Example async mapping function
async function asyncMapper(value) {
  return value * 2; // Perform some async operation
}

// Example usage of mapAsync
const array = [1, 2, 3, 4, 5];
mapAsync(array, asyncMapper)
  .then((mappedArray) => {
    console.log(mappedArray); // Output: [2, 4, 6, 8, 10]
  })
  .catch((error) => {
    console.error(error);
  });
```


```js

async function asyncMap(array, asyncMappingFunction) {
  const promises = array.map(asyncMappingFunction);
  const results = await Promise.all(promises);
  return results;
}

const array = [1, 2, 3];
const asyncMappingFunction = async (item) => {
  // Do something asynchronous with the item
  return item * 2;
};

const results = await asyncMap(array, asyncMappingFunction);

console.log(results); // [2, 4, 6]

```

1. In this example, the asyncMap function is used to map the array of numbers to an array of doubled numbers. 

2. The asyncMappingFunction function simply multiplies the item by The asyncMap function then waits for all of the promises to resolve before returning the results. 
3. The asyncMap function can be used to map any array of items to an array of results, even if the mapping function is asynchronous. 
4. This can be useful for tasks such as fetching data from a remote server or performing other asynchronous operations.


Here's a clean **async map implementation** that works like `Array.prototype.map()`, but supports an asynchronous mapping function.

***

# Basic Async Map

```javascript
async function asyncMap(array, asyncMapper) {
  return Promise.all(
    array.map(asyncMapper)
  );
}
```

### Usage

```javascript
async function square(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num * num);
    }, 1000);
  });
}

(async () => {
  const result = await asyncMap(
    [1, 2, 3, 4],
    square
  );

  console.log(result);
})();
```

### Output

```javascript
[1, 4, 9, 16]
```

***

# How It Works

```javascript
array.map(asyncMapper)
```

Produces:

```javascript
[
  Promise,
  Promise,
  Promise,
  Promise
]
```

Then:

```javascript
Promise.all(...)
```

Waits for all promises to finish.

***

# With Callback Parameters

Just like native `map()`:

```javascript
async function asyncMap(arr, mapper) {
  return Promise.all(
    arr.map((item, index, array) =>
      mapper(item, index, array)
    )
  );
}
```

### Example

```javascript
const result = await asyncMap(
  [10, 20, 30],
  async (value, index) => ({
    value,
    index
  })
);

console.log(result);
```

Output:

```javascript
[
  { value: 10, index: 0 },
  { value: 20, index: 1 },
  { value: 30, index: 2 }
]
```

***

# Error Handling

If one promise fails:

```javascript
async function getUser(id) {
  if (id === 3) {
    throw new Error("User not found");
  }

  return `User-${id}`;
}

try {
  const result = await asyncMap(
    [1, 2, 3, 4],
    getUser
  );
} catch (error) {
  console.log(error.message);
}
```

Output:

```text
User not found
```

`Promise.all()` fails fast.

***

# Partial Error Handling

If you want all results even when some fail:

```javascript
async function asyncMapSafe(
  array,
  asyncMapper
) {
  const promises = array.map(
    async item => {
      try {
        return {
          success: true,
          data: await asyncMapper(item)
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  );

  return Promise.all(promises);
}
```

### Output

```javascript
[
  { success: true, data: "User-1" },
  { success: true, data: "User-2" },
  { success: false, error: "User not found" },
  { success: true, data: "User-4" }
]
```

***

# Sequential Async Map

Runs one task at a time.

```javascript
async function asyncMapSeries(
  arr,
  asyncMapper
) {
  const result = [];

  for (const item of arr) {
    result.push(
      await asyncMapper(item)
    );
  }

  return result;
}
```

### Execution

```text
1 → 2 → 3 → 4
```

instead of

```text
1,2,3,4 together
```

***

# Interview Follow-up: `map` vs `asyncMap`

### Normal Map

```javascript
const result =
  [1, 2, 3].map(
    x => x * 2
  );

console.log(result);
```

Output:

```javascript
[2, 4, 6]
```

***

### Async Map

```javascript
const result =
  [1, 2, 3].map(
    async x => x * 2
  );

console.log(result);
```

Output:

```javascript
[
  Promise,
  Promise,
  Promise
]
```

To get actual values:

```javascript
const values =
  await Promise.all(result);

console.log(values);
```

Output:

```javascript
[2, 4, 6]
```

***

## Interview-Ready Version

```javascript
async function asyncMap(
  array,
  asyncMapper
) {
  return Promise.all(
    array.map(asyncMapper)
  );
}
```

**Time Complexity:** `O(n)`  
**Concurrency:** All tasks run in parallel  
**Returns:** `Promise<Array>` preserving the original order of results.


## 1. `asyncMap` with Concurrency Limit

A basic `asyncMap()` using `Promise.all()` runs **all tasks simultaneously**:

```javascript
async function asyncMap(items, mapper) {
  return Promise.all(
    items.map(mapper)
  );
}
```

For large arrays, this can create thousands of promises.

### Concurrency-Limited Version

```javascript
async function asyncMapLimit(
  items,
  limit,
  mapper
) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex++;

      if (currentIndex >= items.length) {
        break;
      }

      results[currentIndex] =
        await mapper(
          items[currentIndex],
          currentIndex
        );
    }
  }

  const workers = Array(
    Math.min(limit, items.length)
  )
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
}
```

### Usage

```javascript
async function square(num) {
  await new Promise(resolve =>
    setTimeout(resolve, 1000)
  );

  return num * num;
}

const result = await asyncMapLimit(
  [1, 2, 3, 4, 5],
  2,
  square
);

console.log(result);
```

Output:

```javascript
[1, 4, 9, 16, 25]
```

Only **2 tasks run concurrently**.

***

# 2. `asyncMap` with Error Handling

## Fail-Fast Version

Similar to `Promise.all()`.

```javascript
async function asyncMap(
  items,
  mapper
) {
  return Promise.all(
    items.map(mapper)
  );
}
```

### Example

```javascript
async function getUser(id) {
  if (id === 3) {
    throw new Error("User not found");
  }

  return `User-${id}`;
}

try {
  const result = await asyncMap(
    [1, 2, 3, 4],
    getUser
  );
} catch (error) {
  console.log(error.message);
}
```

Output:

```text
User not found
```

All processing stops.

***

## Partial Error Collection

Continue even if individual tasks fail.

```javascript
async function asyncMapSafe(
  items,
  mapper
) {
  const promises = items.map(
    async (item) => {
      try {
        return {
          success: true,
          value: await mapper(item)
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }
  );

  return Promise.all(promises);
}
```

### Output

```javascript
[
  {
    success: true,
    value: "User-1"
  },
  {
    success: true,
    value: "User-2"
  },
  {
    success: false,
    error: "User not found"
  },
  {
    success: true,
    value: "User-4"
  }
]
```

***

# 3. `asyncMap` vs `mapLimit`

Many interviews ask this exact question.

***

## `asyncMap`

```javascript
await asyncMap(
  items,
  mapper
);
```

Implementation:

```javascript
Promise.all(
  items.map(mapper)
);
```

### Behaviour

```text
Input: [1,2,3,4,5]

Start:
1
2
3
4
5

All run immediately
```

Concurrency:

```text
5
```

If there are 1000 items:

```text
1000 concurrent operations
```

***

## `mapLimit`

```javascript
await mapLimit(
  items,
  2,
  mapper
);
```

### Behaviour

```text
1 2
3 4
5
```

Only 2 at a time.

Concurrency:

```text
2
```

Maximum.

***

## Visual Comparison

### asyncMap

```text
Items: 1 2 3 4 5

Time 0:
1 2 3 4 5
```

Everything launches immediately.

***

### mapLimit(limit = 2)

```text
Time 0:
1 2

Time 1:
3 4

Time 2:
5
```

Controlled throughput.

***

# When to Use Which?

### Use `asyncMap`

```javascript
await asyncMap(
  users,
  fetchUser
);
```

✅ Small datasets

✅ Few API calls

✅ Fast execution

✅ Simpler code

***

### Use `mapLimit`

```javascript
await mapLimit(
  users,
  5,
  fetchUser
);
```

✅ Large datasets

✅ API rate limits

✅ File uploads

✅ Playwright automation

✅ Batch processing

✅ Web scraping

***

# React Example

```jsx
useEffect(() => {
  async function loadUsers() {
    const users =
      await asyncMapLimit(
        [1, 2, 3, 4, 5],
        2,
        fetchUser
      );

    setUsers(users);
  }

  loadUsers();
}, []);
```

This prevents flooding the backend with too many requests at once.

***

## Interview Summary

| Feature                   | asyncMap | mapLimit |
| ------------------------- | -------- | -------- |
| Preserves Order           | ✅        | ✅        |
| Uses Promise.all          | ✅        | ❌        |
| Concurrency Control       | ❌        | ✅        |
| Suitable for Small Arrays | ✅        | ✅        |
| Suitable for Large Arrays | ❌        | ✅        |
| Rate Limit Friendly       | ❌        | ✅        |
| Memory Efficient          | ❌        | ✅        |

### Senior Frontend Interview Answer

> `asyncMap` executes all async operations in parallel using `Promise.all`, making it simple and fast for small workloads. `mapLimit` adds concurrency control, ensuring that only a fixed number of operations run simultaneously. In production systems, especially when dealing with APIs, uploads, or automation tasks, `mapLimit` is preferred because it prevents resource exhaustion while still maintaining high throughput and preserving result order.
