## Custom `forEach()` Polyfill (Interview Question)

The native `forEach()` executes a callback for each element in an array and does **not return a new array**.

### Native `forEach()`

```javascript
const numbers = [1, 2, 3];

numbers.forEach((value, index) => {
  console.log(value, index);
});
```

Output:

```text
1 0
2 1
3 2
```

***

# Custom `forEach()` Implementation

```javascript
function customForEach(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i, arr);
  }
}
```

### Usage

```javascript
customForEach(
  [10, 20, 30],
  (value, index) => {
    console.log(value, index);
  }
);
```

Output:

```text
10 0
20 1
30 2
```

***

# Custom `forEach()` with `thisArg`

Native `forEach()` supports a second argument (`thisArg`).

### Polyfill

```javascript
function customForEach(
  arr,
  callback,
  thisArg
) {
  for (let i = 0; i < arr.length; i++) {
    callback.call(
      thisArg,
      arr[i],
      i,
      arr
    );
  }
}
```

### Usage

```javascript
const context = {
  prefix: "Value:"
};

customForEach(
  [1, 2, 3],
  function (value) {
    console.log(
      this.prefix,
      value
    );
  },
  context
);
```

Output:

```text
Value: 1
Value: 2
Value: 3
```

***

# `forEach()` Returns `undefined`

```javascript
const result =
  [1, 2, 3].forEach(x =>
    console.log(x)
  );

console.log(result);
```

Output:

```javascript
undefined
```

Unlike:

```javascript
map()
filter()
reduce()
```

it doesn't return a transformed array.

***

# Difference Between `forEach()` and `map()`

### forEach

```javascript
const arr = [1, 2, 3];

arr.forEach(num => {
  console.log(num * 2);
});
```

Output:

```text
2
4
6
```

Return value:

```javascript
undefined
```

***

### map

```javascript
const result =
  arr.map(num => num * 2);

console.log(result);
```

Output:

```javascript
[2, 4, 6]
```

***

# React Example

### Using `forEach()`

```javascript
const users = [
  { name: "Sudhir" },
  { name: "John" }
];

const names = [];

users.forEach(user => {
  names.push(user.name);
});

console.log(names);
```

Output:

```javascript
["Sudhir", "John"]
```

***

### Better with `map()`

```javascript
const names =
  users.map(
    user => user.name
  );

console.log(names);
```

Output:

```javascript
["Sudhir", "John"]
```

✅ More concise  
✅ Preferred in React

***

# Interview Polyfill (Handles Sparse Arrays)

The native `forEach()` skips empty slots.

```javascript
const arr = new Array(3);

arr.forEach(() =>
  console.log("run")
);
```

Output:

```text
(no output)
```

### Improved Polyfill

```javascript
function customForEach(
  arr,
  callback
) {
  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      callback(
        arr[i],
        i,
        arr
      );
    }
  }
}
```

This behaves like the native implementation.

***

# Interview Cheat Sheet

```javascript
// forEach
arr.forEach(callback);

// Custom forEach
function customForEach(arr, cb) {
  for (let i = 0; i < arr.length; i++) {
    cb(arr[i], i, arr);
  }
}

// map
arr.map(callback);

// filter
arr.filter(callback);

// reduce
arr.reduce(callback);
```

### Senior JavaScript Interview Answer

> `forEach()` is used for side effects such as logging, API calls, updating external variables, or DOM manipulation. Unlike `map()`, it does not return a new array. A custom `forEach()` can be implemented using a simple loop that executes the callback for each element while optionally supporting `thisArg` and sparse array behaviour similar to the native implementation.


# Difference Between `forEach()` and `map()`

This is one of the most common JavaScript and React interview questions.

***

## 1. `forEach()`

`forEach()` executes a callback for every element in the array.

✅ Used for side effects

✅ Does **not return** a new array

```javascript
const numbers = [1, 2, 3];

const result = numbers.forEach(num => {
  console.log(num * 2);
});

console.log(result);
```

Output:

```text
2
4
6

undefined
```

***

## 2. `map()`

`map()` transforms each element and returns a **new array**.

✅ Used for data transformation

✅ Returns new array

```javascript
const numbers = [1, 2, 3];

const result = numbers.map(
  num => num * 2
);

console.log(result);
```

Output:

```javascript
[2, 4, 6]
```

***

# Quick Comparison

| Feature                 | forEach() | map() |
| ----------------------- | --------- | ----- |
| Iterates array          | ✅         | ✅     |
| Returns new array       | ❌         | ✅     |
| Used for transformation | ❌         | ✅     |
| Used for side effects   | ✅         | ⚠️    |
| Chainable               | ❌         | ✅     |
| React JSX rendering     | ❌         | ✅     |

***

# React Example

### ❌ Wrong (forEach)

```jsx
function UserList({ users }) {
  const elements = [];

  users.forEach(user => {
    elements.push(
      <li key={user.id}>
        {user.name}
      </li>
    );
  });

  return <ul>{elements}</ul>;
}
```

Works, but not preferred.

***

### ✅ Correct (map)

```jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

Cleaner and more idiomatic React.

***

# Custom `forEach()` Implementation

```javascript
function customForEach(
  arr,
  callback
) {
  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      callback(arr[i], i, arr);
    }
  }
}
```

***

# React Example Using `customForEach()`

### Create Dropdown Options

```jsx
function customForEach(
  arr,
  callback
) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i, arr);
  }
}

function SkillsDropdown() {
  const skills = [
    "React",
    "TypeScript",
    "Node.js"
  ];

  const options = [];

  customForEach(
    skills,
    (skill, index) => {
      options.push(
        <option
          key={index}
          value={skill}
        >
          {skill}
        </option>
      );
    }
  );

  return (
    <select>
      {options}
    </select>
  );
}
```

***

# React Example: Building Table Rows

```jsx
function customForEach(
  arr,
  callback
) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

function UsersTable() {
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

  const rows = [];

  customForEach(
    users,
    user => {
      rows.push(
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
        </tr>
      );
    }
  );

  return (
    <table>
      <tbody>{rows}</tbody>
    </table>
  );
}
```

***

# Interview Question

### What is the output?

```javascript
const arr = [1, 2, 3];

const result = arr.forEach(
  x => x * 2
);

console.log(result);
```

Output:

```javascript
undefined
```

Reason:

`forEach()` always returns `undefined`.

***

### What about `map()`?

```javascript
const arr = [1, 2, 3];

const result = arr.map(
  x => x * 2
);

console.log(result);
```

Output:

```javascript
[2, 4, 6]
```

***

# Senior React Interview Answer

> Use `map()` when you need to transform data or render JSX because it returns a new array. Use `forEach()` when performing side effects such as logging, analytics tracking, or populating an external collection. In React rendering, `map()` is almost always preferred because it directly returns the JSX array that React can render.
