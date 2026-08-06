## Custom `map()` Polyfill (Interview Question)

You are correct:

✅ `map()` creates a **new array**

✅ Executes a callback for each existing element

✅ Does **not mutate** the original array

✅ Skips empty slots in sparse arrays

***

# Native `map()`

```javascript
const numbers = [1, 2, 3];

const doubled = numbers.map(
  num => num * 2
);

console.log(doubled);
```

Output:

```javascript
[2, 4, 6]
```

***

# Custom `map()` Implementation

```javascript
function customMap(arr, callback) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(
      callback(arr[i], i, arr)
    );
  }

  return result;
}
```

### Usage

```javascript
const numbers = [1, 2, 3];

const doubled = customMap(
  numbers,
  num => num * 2
);

console.log(doubled);
```

Output:

```javascript
[2, 4, 6]
```

***

# Improved Polyfill (Matches Native Behaviour)

Native `map()` skips sparse array slots.

```javascript
const arr = new Array(3);

console.log(arr);
```

Output:

```javascript
[ <3 empty items> ]
```

Native:

```javascript
arr.map(x => x);
```

Output:

```javascript
[ <3 empty items> ]
```

***

### Correct Polyfill

```javascript
function customMap(arr, callback) {
  const result = new Array(arr.length);

  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      result[i] = callback(
        arr[i],
        i,
        arr
      );
    }
  }

  return result;
}
```

***

# Callback Parameters

```javascript
customMap(
  [10, 20, 30],
  (value, index, array) => {
    console.log(value);
    console.log(index);

    return value * 2;
  }
);
```

Parameters:

```javascript
value
index
array
```

Same as native `map()`.

***

# React Example

Transform users into JSX.

```jsx
const users = [
  {
    id: 1,
    name: "Sudhir"
  },
  {
    id: 2,
    name: "John"
  }
];

function customMap(arr, callback) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(
      callback(arr[i], i)
    );
  }

  return result;
}

function App() {
  return (
    <>
      {customMap(
        users,
        user => (
          <div key={user.id}>
            {user.name}
          </div>
        )
      )}
    </>
  );
}
```

***

# map() vs forEach()

### forEach()

```javascript
const result =
  [1,2,3].forEach(
    x => x * 2
  );

console.log(result);
```

Output:

```javascript
undefined
```

***

### map()

```javascript
const result =
  [1,2,3].map(
    x => x * 2
  );

console.log(result);
```

Output:

```javascript
[2,4,6]
```

***

# Time and Space Complexity

### Custom map

```javascript
function customMap(arr, cb)
```

Time Complexity:

```text
O(n)
```

Space Complexity:

```text
O(n)
```

because a new array is created.

***

# Interview Cheat Sheet

```javascript
// Native
arr.map(callback);

// Custom
function customMap(arr, cb) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(
      cb(arr[i], i, arr)
    );
  }

  return result;
}
```

### Senior JavaScript Interview Answer

> `map()` is a non-mutating array method that transforms each element and returns a new array of the same length. Unlike `forEach()`, it is designed for data transformation and is heavily used in React for rendering lists and creating derived data structures. A custom `map()` implementation can be built using a loop that applies the callback to each element and stores the results in a new array.


## 1. `customMap()` with Sparse Arrays

One tricky behaviour of `map()` is that it **skips empty slots** (sparse arrays).

### Sparse Array

```javascript
const arr = new Array(5);

console.log(arr);
```

Output:

```javascript
[ <5 empty items> ]
```

***

### Native `map()`

```javascript
const result = arr.map((value, index) => {
  console.log("Running");
  return index;
});

console.log(result);
```

Output:

```javascript
[ <5 empty items> ]
```

Notice:

```text
"Running" is never printed
```

because the callback never executes.

***

### Custom Map Matching Native Behaviour

```javascript
function customMap(arr, callback) {
  const result = new Array(arr.length);

  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      result[i] = callback(
        arr[i],
        i,
        arr
      );
    }
  }

  return result;
}
```

***

### Example

```javascript
const sparse = [1, , 3, , 5];

const result = customMap(
  sparse,
  (value) => value * 2
);

console.log(result);
```

Output:

```javascript
[2, empty, 6, empty, 10]
```

This behaves similarly to native `map()`.

***

## 2. Understanding Map Callback Parameters

### Syntax

```javascript
array.map(
  (value, index, array) => {
    return something;
  }
);
```

Map provides **three parameters**.

***

# Parameter 1 → `value`

Current element being processed.

```javascript
const numbers = [10, 20, 30];

numbers.map((value) => {
  console.log(value);
});
```

Output:

```text
10
20
30
```

***

# Parameter 2 → `index`

Current position.

```javascript
const numbers = [10, 20, 30];

numbers.map((value, index) => {
  console.log(index);
});
```

Output:

```text
0
1
2
```

***

### Practical Example

```javascript
const users = [
  "Sudhir",
  "John",
  "Mike"
];

const result = users.map(
  (user, index) => ({
    id: index + 1,
    name: user
  })
);

console.log(result);
```

Output:

```javascript
[
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" },
  { id: 3, name: "Mike" }
]
```

***

# Parameter 3 → `array`

Reference to the original array.

```javascript
const numbers = [1, 2, 3];

numbers.map(
  (value, index, array) => {
    console.log(array);
    return value;
  }
);
```

Output:

```javascript
[1, 2, 3]
[1, 2, 3]
[1, 2, 3]
```

***

### Real Scenario

Get percentage of total.

```javascript
const scores = [50, 80, 70];

const total = scores.reduce(
  (sum, score) => sum + score,
  0
);

const percentages = scores.map(
  (score, index, array) =>
    Math.round(
      (score / total) * 100
    )
);

console.log(percentages);
```

Output:

```javascript
[25, 40, 35]
```

***

## React Example Using `customMap()`

```jsx
function customMap(arr, callback) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      result.push(
        callback(arr[i], i, arr)
      );
    }
  }

  return result;
}

function UserList() {
  const users = [
    { id: 1, name: "Sudhir" },
    { id: 2, name: "John" },
    { id: 3, name: "Mike" }
  ];

  return (
    <>
      {customMap(users, (user) => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

## Interview Question

### What is the output?

```javascript
const arr = [10, 20, 30];

const result = arr.map(
  (value, index) =>
    value + index
);

console.log(result);
```

### Output

```javascript
[10, 21, 32]
```

Calculation:

```javascript
10 + 0 = 10
20 + 1 = 21
30 + 2 = 32
```

***

## Senior JavaScript Interview Answer

> `map()` calls its callback with three arguments: `(value, index, array)`. The callback is executed only for existing elements and skips sparse array holes. It always returns a new array of the same length and is commonly used for transforming data, creating derived objects, and rendering lists in React via JSX.
