If `transformNamesToUppercase` means converting all names in an array to uppercase, you can use `map()`:

### Example 1: Array of Strings

```javascript
function transformNamesToUppercase(names) {
  return names.map(name => name.toUpperCase());
}

const names = ["Sudhir", "John", "Mike"];

console.log(
  transformNamesToUppercase(names)
);
```

### Output

```javascript
["SUDHIR", "JOHN", "MIKE"]
```

***

### Example 2: Array of Objects

```javascript
function transformNamesToUppercase(users) {
  return users.map(user => ({
    ...user,
    name: user.name.toUpperCase()
  }));
}

const users = [
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" },
  { id: 3, name: "Mike" }
];

console.log(
  transformNamesToUppercase(users)
);
```

### Output

```javascript
[
  { id: 1, name: "SUDHIR" },
  { id: 2, name: "JOHN" },
  { id: 3, name: "MIKE" }
]
```

***

### Custom `map()` Version

```javascript
function customMap(arr, callback) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i, arr));
  }

  return result;
}

function transformNamesToUppercase(names) {
  return customMap(
    names,
    name => name.toUpperCase()
  );
}

console.log(
  transformNamesToUppercase([
    "Sudhir",
    "John",
    "Mike"
  ])
);
```

### Output

```javascript
["SUDHIR", "JOHN", "MIKE"]
```

### Time Complexity

```text
O(n)
```

### Space Complexity

```text
O(n)
```

This is a common JavaScript interview example to demonstrate the use of `map()` for transforming array data without mutating the original array.
 


 ## Optimised `transformNamesToUppercase` with Error Handling

### Basic Version

```javascript
function transformNamesToUppercase(names) {
  return names.map(name => name.toUpperCase());
}
```

***

# Optimised for Large Arrays

For very large arrays (100k+ items), pre-allocating the result array can be slightly more memory-efficient than using `map()`.

```javascript
function transformNamesToUppercase(names) {
  const result = new Array(names.length);

  for (let i = 0; i < names.length; i++) {
    result[i] = names[i].toUpperCase();
  }

  return result;
}
```

### Usage

```javascript
const names = [
  "Sudhir",
  "John",
  "Mike"
];

console.log(
  transformNamesToUppercase(names)
);
```

### Output

```javascript
[
  "SUDHIR",
  "JOHN",
  "MIKE"
]
```

***

# Add Error Handling

### Validate Input

```javascript
function transformNamesToUppercase(names) {
  if (!Array.isArray(names)) {
    throw new TypeError(
      "Input must be an array"
    );
  }

  const result = new Array(names.length);

  for (let i = 0; i < names.length; i++) {
    if (typeof names[i] !== "string") {
      throw new TypeError(
        `Item at index ${i} is not a string`
      );
    }

    result[i] =
      names[i].toUpperCase();
  }

  return result;
}
```

### Usage

```javascript
try {
  const result =
    transformNamesToUppercase([
      "Sudhir",
      123,
      "Mike"
    ]);

  console.log(result);
} catch (error) {
  console.error(error.message);
}
```

### Output

```text
Item at index 1 is not a string
```

***

# Fault-Tolerant Version (Skip Invalid Entries)

Instead of throwing an error:

```javascript
function transformNamesToUppercase(names) {
  return names.map((name, index) => {
    if (typeof name !== "string") {
      console.warn(
        `Invalid value at index ${index}`
      );

      return null;
    }

    return name.toUpperCase();
  });
}
```

### Input

```javascript
[
  "Sudhir",
  123,
  null,
  "Mike"
]
```

### Output

```javascript
[
  "SUDHIR",
  null,
  null,
  "MIKE"
]
```

***

# React Example

```jsx
const users = [
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" }
];

const upperCaseUsers = users.map(
  user => ({
    ...user,
    name: user.name.toUpperCase()
  })
);

console.log(upperCaseUsers);
```

### Output

```javascript
[
  {
    id: 1,
    name: "SUDHIR"
  },
  {
    id: 2,
    name: "JOHN"
  }
]
```

***

## Senior Interview Answer

```javascript
function transformNamesToUppercase(names) {
  if (!Array.isArray(names)) {
    throw new TypeError(
      "Expected an array"
    );
  }

  return names.map((name, index) => {
    if (typeof name !== "string") {
      throw new TypeError(
        `Invalid string at index ${index}`
      );
    }

    return name.toUpperCase();
  });
}
```

### Complexity

* **Time Complexity:** `O(n)`
* **Space Complexity:** `O(n)`

✅ Non-mutating  
✅ Type-safe  
✅ Handles invalid input  
✅ Suitable for React and production applications.


## 1. Async `transformNamesToUppercase` with Concurrency Limit

For large arrays, you can limit concurrent processing using a worker-pool approach.

```javascript
async function transformNamesToUppercase(
  names,
  limit = 5
) {
  if (!Array.isArray(names)) {
    throw new TypeError(
      "Input must be an array"
    );
  }

  const results = new Array(names.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex++;

      if (currentIndex >= names.length) {
        break;
      }

      const value = names[currentIndex];

      if (typeof value !== "string") {
        console.error(
          `Invalid entry at index ${currentIndex}:`,
          value
        );

        results[currentIndex] = {
          success: false,
          error: `Invalid string at index ${currentIndex}`
        };

        continue;
      }

      // Simulate async work
      await Promise.resolve();

      results[currentIndex] =
        value.toUpperCase();
    }
  }

  const workers = Array(
    Math.min(limit, names.length)
  )
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
}
```

***

## Logging Invalid Entries

```javascript
const names = [
  "Sudhir",
  123,
  null,
  "John",
  undefined,
  "Mike"
];

const result =
  await transformNamesToUppercase(
    names,
    2
  );

console.log(result);
```

### Console Output

```text
Invalid entry at index 1: 123
Invalid entry at index 2: null
Invalid entry at index 4: undefined
```

### Result

```javascript
[
  "SUDHIR",
  {
    success: false,
    error: "Invalid string at index 1"
  },
  {
    success: false,
    error: "Invalid string at index 2"
  },
  "JOHN",
  {
    success: false,
    error: "Invalid string at index 4"
  },
  "MIKE"
]
```

***

## React Example with Error Handling

```jsx
import { useState } from "react";

export default function App() {
  const [names, setNames] =
    useState([]);

  const [errors, setErrors] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  async function handleTransform() {
    setLoading(true);

    try {
      const result =
        await transformNamesToUppercase(
          [
            "Sudhir",
            123,
            "John",
            null,
            "Mike"
          ],
          2
        );

      const validNames =
        result.filter(
          item =>
            typeof item === "string"
        );

      const invalidItems =
        result.filter(
          item =>
            typeof item === "object"
        );

      setNames(validNames);
      setErrors(invalidItems);
    } catch (error) {
      setErrors([
        {
          error: error.message
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleTransform}
        disabled={loading}
      >
        Transform Names
      </button>

      <h3>Valid Names</h3>

      <ul>
        {names.map((name, index) => (
          <li key={index}>
            {name}
          </li>
        ))}
      </ul>

      <h3>Error List</h3>

      {errors.length === 0 ? (
        <p>No errors</p>
      ) : (
        <ul>
          {errors.map(
            (error, index) => (
              <li key={index}>
                {error.error}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
```

***

## Alternative: Fail Fast Version

If invalid entries should stop processing:

```javascript
async function transformNamesToUppercase(
  names
) {
  if (!Array.isArray(names)) {
    throw new TypeError(
      "Input must be an array"
    );
  }

  return Promise.all(
    names.map(async (name, index) => {
      if (
        typeof name !== "string"
      ) {
        throw new TypeError(
          `Invalid string at index ${index}`
        );
      }

      return name.toUpperCase();
    })
  );
}
```

### Usage

```javascript
try {
  const result =
    await transformNamesToUppercase([
      "Sudhir",
      123,
      "John"
    ]);

  console.log(result);
} catch (error) {
  console.error(error.message);
}
```

Output:

```text
Invalid string at index 1
```

***

## Interview Discussion Points

### Concurrency-Limited Version

✅ Scales to large arrays

✅ Controls resource usage

✅ Collects partial failures

✅ Suitable for APIs and async processing

### Fail-Fast Version

✅ Simpler implementation

✅ Immediate failure detection

✅ Useful when all data must be valid

### Complexity

```text
Time Complexity: O(n)
Space Complexity: O(n)
Active Workers: O(limit)
```

This pattern is very similar to production-grade `mapLimit()` implementations used for API processing, batch uploads, Playwright automation, and large-scale data transformation.



Here are **Jest unit tests** for the async `transformNamesToUppercase` function with concurrency limit and error handling.

***

## Function Under Test

```javascript
export async function transformNamesToUppercase(
  names,
  limit = 5
) {
  if (!Array.isArray(names)) {
    throw new TypeError(
      "Input must be an array"
    );
  }

  const results = new Array(names.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex++;

      if (currentIndex >= names.length) {
        break;
      }

      const value = names[currentIndex];

      if (typeof value !== "string") {
        console.error(
          `Invalid entry at index ${currentIndex}:`,
          value
        );

        results[currentIndex] = {
          success: false,
          error: `Invalid string at index ${currentIndex}`
        };

        continue;
      }

      results[currentIndex] =
        value.toUpperCase();
    }
  }

  const workers = Array(
    Math.min(limit, names.length)
  )
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
}
```

***

# Unit Tests (Jest)

```javascript
import {
  transformNamesToUppercase
} from "./transformNamesToUppercase";

describe(
  "transformNamesToUppercase",
  () => {
    test(
      "should convert all names to uppercase",
      async () => {
        const result =
          await transformNamesToUppercase([
            "Sudhir",
            "John",
            "Mike"
          ]);

        expect(result).toEqual([
          "SUDHIR",
          "JOHN",
          "MIKE"
        ]);
      }
    );

    test(
      "should return empty array for empty input",
      async () => {
        const result =
          await transformNamesToUppercase(
            []
          );

        expect(result).toEqual([]);
      }
    );

    test(
      "should handle invalid entries",
      async () => {
        const result =
          await transformNamesToUppercase([
            "Sudhir",
            123,
            null,
            "Mike"
          ]);

        expect(result).toEqual([
          "SUDHIR",
          {
            success: false,
            error:
              "Invalid string at index 1"
          },
          {
            success: false,
            error:
              "Invalid string at index 2"
          },
          "MIKE"
        ]);
      }
    );

    test(
      "should throw when input is not an array",
      async () => {
        await expect(
          transformNamesToUppercase(
            "invalid"
          )
        ).rejects.toThrow(
          "Input must be an array"
        );
      }
    );

    test(
      "should preserve original order",
      async () => {
        const result =
          await transformNamesToUppercase([
            "b",
            "a",
            "c"
          ]);

        expect(result).toEqual([
          "B",
          "A",
          "C"
        ]);
      }
    );

    test(
      "should work with custom concurrency limit",
      async () => {
        const result =
          await transformNamesToUppercase(
            [
              "one",
              "two",
              "three",
              "four"
            ],
            2
          );

        expect(result).toEqual([
          "ONE",
          "TWO",
          "THREE",
          "FOUR"
        ]);
      }
    );
  }
);
```

***

# Test Console Logging

To verify invalid entries are logged:

```javascript
test(
  "should log invalid entries",
  async () => {
    const errorSpy =
      jest.spyOn(
        console,
        "error"
      );

    await transformNamesToUppercase([
      "Sudhir",
      123
    ]);

    expect(
      errorSpy
    ).toHaveBeenCalledWith(
      "Invalid entry at index 1:",
      123
    );

    errorSpy.mockRestore();
  }
);
```

***

# Concurrency Verification Test

If you want to verify that concurrency limits are respected:

```javascript
test(
  "should not exceed concurrency limit",
  async () => {
    let running = 0;
    let maxRunning = 0;

    async function asyncTransform(
      names,
      limit
    ) {
      const results = [];
      let index = 0;

      async function worker() {
        while (
          index < names.length
        ) {
          const current =
            index++;

          running++;

          maxRunning =
            Math.max(
              maxRunning,
              running
            );

          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                10
              )
          );

          results[current] =
            names[
              current
            ].toUpperCase();

          running--;
        }
      }

      await Promise.all(
        Array(limit)
          .fill(null)
          .map(worker)
      );

      return results;
    }

    await asyncTransform(
      [
        "a",
        "b",
        "c",
        "d",
        "e"
      ],
      2
    );

    expect(
      maxRunning
    ).toBeLessThanOrEqual(
      2
    );
  }
);
```

***

## Coverage Checklist

✅ Valid names converted to uppercase  
✅ Empty array handling  
✅ Invalid entries handling  
✅ Input validation  
✅ Order preservation  
✅ Custom concurrency limit  
✅ Console logging verification  
✅ Concurrency limit verification

These tests are suitable for **Jest + React projects** and cover both functionality and edge cases.


## 1. How to Mock Async Workers in Tests

When testing concurrency logic, you don't want real API calls or long delays.

### Mock Async Worker

```javascript
const mockWorker = jest.fn(
  async (name) => {
    return name.toUpperCase();
  }
);
```

### Test

```javascript
test("should call worker for every item", async () => {
  const result =
    await transformNamesToUppercase(
      ["sudhir", "john"],
      2,
      mockWorker
    );

  expect(mockWorker)
    .toHaveBeenCalledTimes(2);

  expect(result).toEqual([
    "SUDHIR",
    "JOHN"
  ]);
});
```

***

## Mock Delayed Worker

Useful when testing concurrency.

```javascript
const delayedWorker = jest.fn(
  (name) =>
    new Promise(resolve => {
      setTimeout(
        () => resolve(name.toUpperCase()),
        50
      );
    })
);
```

This allows simulation of long-running operations.

***

# 2. Test for Empty Array Input

This is an important edge case.

### Function Behaviour

```javascript
await transformNamesToUppercase([]);
```

Expected:

```javascript
[]
```

### Test

```javascript
test(
  "should return empty array for empty input",
  async () => {
    const result =
      await transformNamesToUppercase(
        []
      );

    expect(result).toEqual([]);
  }
);
```

***

### Verify Workers Are Not Started

```javascript
test(
  "should not execute worker when input is empty",
  async () => {
    const worker = jest.fn();

    await transformNamesToUppercase(
      [],
      2,
      worker
    );

    expect(worker)
      .not.toHaveBeenCalled();
  }
);
```

***

# 3. Testing Concurrency Limit Enforcement

A favourite Senior Frontend interview test.

We track:

```text
Current running workers
Maximum running workers
```

Then verify:

```text
maxRunning <= limit
```

***

## Example

```javascript
test(
  "should respect concurrency limit",
  async () => {
    let running = 0;
    let maxRunning = 0;

    const worker = jest.fn(
      async (name) => {
        running++;

        maxRunning = Math.max(
          maxRunning,
          running
        );

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              50
            )
        );

        running--;

        return name.toUpperCase();
      }
    );

    await asyncMapLimit(
      [
        "a",
        "b",
        "c",
        "d",
        "e"
      ],
      2,
      worker
    );

    expect(maxRunning)
      .toBeLessThanOrEqual(2);
  }
);
```

***

## Strict Concurrency Verification

For:

```javascript
limit = 3
```

```javascript
test(
  "should never exceed limit",
  async () => {
    let running = 0;
    let peak = 0;

    const worker = async item => {
      running++;

      peak = Math.max(
        peak,
        running
      );

      await new Promise(
        r => setTimeout(r, 20)
      );

      running--;

      return item;
    };

    await asyncMapLimit(
      Array.from(
        { length: 20 },
        (_, i) => i
      ),
      3,
      worker
    );

    expect(peak).toBe(3);
  }
);
```

***

# Bonus: Testing Result Order Preservation

Concurrency should not change output order.

```javascript
test(
  "should preserve result order",
  async () => {
    const worker = async item => {
      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            Math.random() * 100
          )
      );

      return item.toUpperCase();
    };

    const result =
      await asyncMapLimit(
        ["a", "b", "c", "d"],
        2,
        worker
      );

    expect(result).toEqual([
      "A",
      "B",
      "C",
      "D"
    ]);
  }
);
```

Even though completion order may be:

```text
B
A
D
C
```

result must remain:

```javascript
[
  "A",
  "B",
  "C",
  "D"
]
```

***

# Recommended Jest Test Suite

```text
✅ Valid transformation
✅ Empty array
✅ Invalid entries
✅ Input validation
✅ Preserve original order
✅ Custom limit
✅ Concurrency enforcement
✅ Worker invocation count
✅ Error handling
✅ Progress callback
✅ Cancellation behaviour
```

### Senior Interview Answer

> To test a concurrency-limited async mapper, I mock async workers with controlled delays, track active worker counts to verify concurrency limits, test order preservation independently of execution order, and cover edge cases such as empty arrays, invalid inputs, cancellation, and partial failures. This ensures both correctness and performance guarantees.
Add test for invalid input typesExplain how to test progress callback in transformNamesToUppercase