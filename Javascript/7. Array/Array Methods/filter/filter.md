The `filter()` method in JavaScript is a powerful utility for creating a new array containing only the elements that pass a specified test (the predicate callback). Let's break this functionality down into detail with an example and explain each step.

### Key Features of `filter()`

1. **Callback Arguments**:
   - **Element Value**: The current element being processed.
   - **Index**: The index of the current element.
   - **Array**: The array being traversed.

2. **Return Behavior**:
   - If the callback returns `true` for an element, it is included in the resulting array.
   - If no elements pass the test, the resulting array will be empty.

3. **Optional `thisArg`**:
   - You can provide a value to use as `this` in the callback function.

4. **Non-Mutating**:
   - The `filter()` method does not modify the original array; it creates a new one.

---

### Code Example

#### Basic Usage

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter even numbers
const evenNumbers = numbers.filter((value) => value % 2 === 0);

console.log(evenNumbers); // [2, 4, 6, 8, 10]
```

#### Using `Index` and `Array` Arguments

```javascript
const numbers = [1, 2, 3, 4, 5];

// Filter values greater than their index
const result = numbers.filter((value, index) => value > index);

console.log(result); // [2, 3, 4, 5]
```

#### Using `thisArg`

```javascript
const numbers = [1, 2, 3, 4, 5];

const context = {
  threshold: 3,
};

// Use `thisArg` to access external context
const greaterThanThreshold = numbers.filter(function (value) {
  return value > this.threshold;
}, context);

console.log(greaterThanThreshold); // [4, 5]
```

---

### Edge Cases

#### Empty Array

```javascript
const emptyResult = [1, 2, 3].filter((value) => value > 5);
console.log(emptyResult); // []
```

#### Original Array Unchanged

```javascript
const numbers = [1, 2, 3];
numbers.filter((value) => value > 2);

console.log(numbers); // [1, 2, 3] (original array is intact)
```

---

### Benefits of `filter()`
- **Declarative**: Simplifies the logic for filtering data.
- **Non-Mutating**: Ensures immutability of the original data.
- **Flexible**: Supports dynamic and reusable predicate functions.

By understanding the above, you can harness the full potential of `filter()` to handle various data filtering needs in JavaScript.


Your explanation is good. Here's an enhanced **Interview + React Developer version** of `filter()` that senior JavaScript interviewers often expect.

# JavaScript `filter()` Method

The `filter()` method creates a **new array** containing only the elements that satisfy a condition.

## Syntax

```javascript
array.filter(
  (element, index, array) => {
    return condition;
  },
  thisArg
);
```

***

# How `filter()` Works

```javascript
const numbers = [1, 2, 3, 4, 5];

const result = numbers.filter(
  num => num > 3
);

console.log(result);
```

### Output

```javascript
[4, 5]
```

### Internal Process

```text
1 > 3 → false ❌
2 > 3 → false ❌
3 > 3 → false ❌
4 > 3 → true  ✅
5 > 3 → true  ✅
```

Result:

```javascript
[4, 5]
```

***

# Callback Parameters

```javascript
const numbers = [10, 20, 30];

numbers.filter(
  (value, index, array) => {
    console.log(value);
    console.log(index);
    console.log(array);

    return value > 15;
  }
);
```

### Parameters

| Parameter | Description     |
| --------- | --------------- |
| value     | Current element |
| index     | Current index   |
| array     | Original array  |

***

# Filter Even Numbers

```javascript
const numbers =
  [1,2,3,4,5,6,7,8,9,10];

const evenNumbers =
  numbers.filter(
    num => num % 2 === 0
  );

console.log(evenNumbers);
```

Output:

```javascript
[2,4,6,8,10]
```

***

# Filter Odd Numbers

```javascript
const oddNumbers =
  numbers.filter(
    num => num % 2 !== 0
  );
```

Output:

```javascript
[1,3,5,7,9]
```

***

# Filter Array of Objects

Very common React interview question.

```javascript
const users = [
  {
    id: 1,
    active: true
  },
  {
    id: 2,
    active: false
  }
];

const activeUsers =
  users.filter(
    user => user.active
  );

console.log(activeUsers);
```

Output:

```javascript
[
  {
    id: 1,
    active: true
  }
]
```

***

# Remove One Item Using Filter

React Example:

```javascript
const users = [
  { id: 1 },
  { id: 2 },
  { id: 3 }
];

const updatedUsers =
  users.filter(
    user => user.id !== 2
  );

console.log(updatedUsers);
```

Output:

```javascript
[
  { id: 1 },
  { id: 3 }
]
```

This pattern is extremely common in React state updates.

***

# React State Example

### Delete User

```jsx
setUsers(prev =>
  prev.filter(
    user => user.id !== id
  )
);
```

***

### Remove Completed Tasks

```jsx
setTasks(prev =>
  prev.filter(
    task => !task.completed
  )
);
```

***

# Using Index

```javascript
const letters =
  ['a', 'b', 'c', 'd'];

const result =
  letters.filter(
    (_, index) => index % 2 === 0
  );

console.log(result);
```

Output:

```javascript
['a', 'c']
```

***

# Using `thisArg`

```javascript
const numbers =
  [1,2,3,4,5];

const context = {
  threshold: 3
};

const result =
  numbers.filter(
    function(num) {
      return num > this.threshold;
    },
    context
  );

console.log(result);
```

Output:

```javascript
[4,5]
```

***

# Filter Does NOT Mutate Original Array

```javascript
const numbers = [1,2,3,4];

const result =
  numbers.filter(
    num => num > 2
  );

console.log(numbers);
console.log(result);
```

Output:

```javascript
[1,2,3,4]

[3,4]
```

✅ Original array unchanged

***

# Empty Array Result

```javascript
const result =
  [1,2,3]
    .filter(
      x => x > 10
    );

console.log(result);
```

Output:

```javascript
[]
```

***

# Chaining with map()

```javascript
const result =
  [1,2,3,4,5]
    .filter(x => x % 2 === 0)
    .map(x => x * 10);

console.log(result);
```

Output:

```javascript
[20,40]
```

***

# Custom Filter Polyfill

Interview favourite.

```javascript
function customFilter(
  arr,
  callback
) {
  const result = [];

  for(let i = 0; i < arr.length; i++) {
    if(callback(arr[i], i, arr)) {
      result.push(arr[i]);
    }
  }

  return result;
}

console.log(
  customFilter(
    [1,2,3,4],
    num => num > 2
  )
);
```

Output:

```javascript
[3,4]
```

***

# `filter()` vs `find()`

### filter()

Returns all matches.

```javascript
const result =
  [1,2,3,4]
    .filter(x => x > 2);
```

Output:

```javascript
[3,4]
```

***

### find()

Returns first match.

```javascript
const result =
  [1,2,3,4]
    .find(x => x > 2);
```

Output:

```javascript
3
```

***

# Interview Cheat Sheet

```javascript
// Even numbers
arr.filter(x => x % 2 === 0);

// Remove item
arr.filter(item => item.id !== id);

// Active users
users.filter(user => user.active);

// First match
arr.find(x => x > 5);

// Transform
arr.map(x => x * 2);
```

## Senior React Interview One-Liner

> `filter()` is a non-mutating array method that returns a new array containing only elements that satisfy a condition. In React, it's commonly used for removing items from state, filtering lists for rendering, implementing search functionality, and maintaining immutable state updates.



## React Example: Filtering a List in State Using `filter()`

`filter()` is commonly used in React to:

* Remove items
* Search/filter lists
* Show active/inactive records
* Implement Todo delete functionality

***

# Example 1: Remove User from State

### State

```jsx
import { useState } from "react";

export default function App() {
  const [users, setUsers] = useState([
    { id: 1, name: "Sudhir" },
    { id: 2, name: "John" },
    { id: 3, name: "Mike" }
  ]);

  const deleteUser = (id) => {
    setUsers(prev =>
      prev.filter(user => user.id !== id)
    );
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name}

          <button
            onClick={() =>
              deleteUser(user.id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Before

```javascript
[
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" },
  { id: 3, name: "Mike" }
]
```

Delete:

```javascript
deleteUser(2);
```

### After

```javascript
[
  { id: 1, name: "Sudhir" },
  { id: 3, name: "Mike" }
]
```

***

# Example 2: Filter Active Users

### State

```jsx
const [users] = useState([
  {
    id: 1,
    name: "Sudhir",
    active: true
  },
  {
    id: 2,
    name: "John",
    active: false
  }
]);
```

### Filter

```jsx
const activeUsers =
  users.filter(
    user => user.active
  );
```

### Render

```jsx
return (
  <>
    {activeUsers.map(user => (
      <p key={user.id}>
        {user.name}
      </p>
    ))}
  </>
);
```

Output:

```text
Sudhir
```

***

# Example 3: Search Functionality

### State

```jsx
const [search, setSearch] =
  useState("");

const [users] = useState([
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" },
  { id: 3, name: "Mike" }
]);
```

### Filter

```jsx
const filteredUsers =
  users.filter(user =>
    user.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );
```

### Render

```jsx
<>
  <input
    value={search}
    onChange={e =>
      setSearch(e.target.value)
    }
  />

  {filteredUsers.map(user => (
    <p key={user.id}>
      {user.name}
    </p>
  ))}
</>
```

Typing:

```text
su
```

Shows:

```text
Sudhir
```

***

# Example 4: Remove Completed Tasks

### State

```jsx
const [tasks, setTasks] =
  useState([
    {
      id: 1,
      title: "Learn React",
      completed: true
    },
    {
      id: 2,
      title: "Learn Redux",
      completed: false
    }
  ]);
```

### Remove Completed

```jsx
const removeCompleted = () => {
  setTasks(prev =>
    prev.filter(
      task => !task.completed
    )
  );
};
```

### Result

```javascript
[
  {
    id: 2,
    title: "Learn Redux",
    completed: false
  }
]
```

***

# Example 5: Combined `filter()` + `map()`

Very common interview pattern.

```jsx
{
  users
    .filter(user => user.active)
    .map(user => (
      <p key={user.id}>
        {user.name}
      </p>
    ));
}
```

### Flow

```text
users
  → filter(active users)
  → map(render users)
```

***

# Why `filter()` Is React-Friendly

`filter()`:

✅ Returns a new array

✅ Does not mutate state

✅ Works perfectly with React's immutable update pattern

✅ Helps React detect changes efficiently

***

## Interview Answer

> In React, `filter()` is commonly used to remove items from state, implement search functionality, display subsets of data, and render conditionally filtered lists. Since `filter()` returns a new array without mutating the original one, it aligns perfectly with React's immutable state update principles.
## 1. React Example: Filtering with Multiple Conditions

Imagine a user management screen where you want to show only:

* Active users
* React developers
* Experience > 5 years

```jsx
import { useState } from "react";

export default function App() {
  const [users] = useState([
    {
      id: 1,
      name: "Sudhir",
      active: true,
      skill: "React",
      experience: 10
    },
    {
      id: 2,
      name: "John",
      active: false,
      skill: "React",
      experience: 8
    },
    {
      id: 3,
      name: "Mike",
      active: true,
      skill: "Angular",
      experience: 7
    }
  ]);

  const filteredUsers = users.filter(
    user =>
      user.active &&
      user.skill === "React" &&
      user.experience > 5
  );

  return (
    <>
      {filteredUsers.map(user => (
        <p key={user.id}>
          {user.name}
        </p>
      ))}
    </>
  );
}
```

### Output

```text
Sudhir
```

***

## Multiple Dynamic Conditions

```jsx
const filteredUsers = users.filter(user => {
  const matchesSearch =
    user.name.toLowerCase()
      .includes(search.toLowerCase());

  const matchesStatus =
    activeOnly
      ? user.active
      : true;

  const matchesRole =
    role === "All"
      ? true
      : user.role === role;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesRole
  );
});
```

This pattern is common in:

* Employee directories
* Admin dashboards
* CRM applications
* TurboTax-style filtering UIs

***

# 2. Performance Tips for `filter()` in React

## ❌ Bad: Filter on Every Render

```jsx
function UserList({ users }) {
  const filteredUsers =
    users.filter(
      user => user.active
    );

  return (
    <>
      {filteredUsers.map(...)}
    </>
  );
}
```

Every render executes:

```text
filter()
```

again.

***

## ✅ Use `useMemo`

```jsx
import { useMemo } from "react";

const filteredUsers = useMemo(
  () =>
    users.filter(
      user => user.active
    ),
  [users]
);
```

Now filtering only runs when:

```javascript
users
```

changes.

***

## ✅ Filter Before map()

Good:

```jsx
{
  users
    .filter(user => user.active)
    .map(user => (
      <UserCard
        key={user.id}
        user={user}
      />
    ));
}
```

***

## ✅ Use React.memo

```jsx
const UserCard = React.memo(
  ({ user }) => {
    return <p>{user.name}</p>;
  }
);
```

Combined with immutable updates:

```jsx
setUsers(prev =>
  prev.map(...)
);
```

React skips unnecessary re-renders.

***

## ✅ For Large Lists Use Virtualisation

Libraries:

```javascript
react-window
```

```javascript
react-virtualized
```

Example:

```jsx
const activeUsers =
  users.filter(
    user => user.active
  );
```

When:

```text
10,000+ users
```

render only visible rows.

***

# 3. Filter with Async Data Fetching

A very common React interview question.

## Fetch + Filter

```jsx
import {
  useEffect,
  useState
} from "react";

export default function Users() {
  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response =
        await fetch(
          "/api/users"
        );

      const data =
        await response.json();

      const activeUsers =
        data.filter(
          user => user.active
        );

      setUsers(activeUsers);
    }

    fetchUsers();
  }, []);

  return (
    <>
      {users.map(user => (
        <p key={user.id}>
          {user.name}
        </p>
      ))}
    </>
  );
}
```

***

## Search After Fetching

```jsx
const [search, setSearch] =
  useState("");

const filteredUsers =
  users.filter(user =>
    user.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );
```

```jsx
<input
  value={search}
  onChange={e =>
    setSearch(e.target.value)
  }
/>
```

***

## Fetch + useMemo + Search

Production-ready pattern:

```jsx
const filteredUsers = useMemo(
  () =>
    users.filter(user =>
      user.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    ),
  [users, search]
);
```

Benefits:

✅ Avoids unnecessary filtering

✅ Scales better

✅ Cleaner code

✅ React.memo friendly

***

# Senior React Interview Cheat Sheet

### Remove Item

```jsx
setUsers(prev =>
  prev.filter(
    user => user.id !== id
  )
);
```

### Active Users

```jsx
users.filter(
  user => user.active
);
```

### Multiple Conditions

```jsx
users.filter(
  user =>
    user.active &&
    user.role === "Admin"
);
```

### Search

```jsx
users.filter(user =>
  user.name.includes(search)
);
```

### Optimised Filtering

```jsx
const filteredUsers =
  useMemo(
    () => users.filter(...),
    [users, search]
  );
```

### Interview One-Liner

> In React, `filter()` is commonly used for search, deletion, and conditional rendering. For large datasets, filtering should be memoised with `useMemo`, combined with immutable state updates, and paired with `React.memo` or list virtualisation to avoid unnecessary re-renders and improve performance.
## 1. Dynamic Search + Multiple Filters in React

This is a common pattern in admin dashboards, employee portals, and enterprise applications.

```jsx
import { useState, useMemo } from "react";

function UsersList() {
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const users = [
    {
      id: 1,
      name: "Sudhir",
      role: "React Developer",
      active: true
    },
    {
      id: 2,
      name: "John",
      role: "Angular Developer",
      active: false
    },
    {
      id: 3,
      name: "Mike",
      role: "React Developer",
      active: true
    }
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        activeOnly
          ? user.active
          : true;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [users, search, activeOnly]);

  return (
    <>
      <input
        placeholder="Search..."
        value={search}
        onChange={e =>
          setSearch(e.target.value)
        }
      />

      <label>
        <input
          type="checkbox"
          checked={activeOnly}
          onChange={() =>
            setActiveOnly(prev => !prev)
          }
        />
        Active Only
      </label>

      {filteredUsers.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </>
  );
}
```

***

# 2. Why `useMemo` Helps Filtering Performance

## Without useMemo

```jsx
const filteredUsers =
  users.filter(
    user => user.active
  );
```

This runs on every render:

```text
User typing
State update
Parent rerender
Filter executes again
```

Even when `users` haven't changed.

***

## With useMemo

```jsx
const filteredUsers = useMemo(
  () =>
    users.filter(
      user => user.active
    ),
  [users]
);
```

Now filtering only executes when:

```javascript
users
```

changes.

***

### Real Example

```jsx
const filteredUsers = useMemo(
  () => {
    console.log("Filtering...");

    return users.filter(
      user => user.active
    );
  },
  [users]
);
```

Output:

```text
Filtering...
```

only when `users` changes.

Not:

```text
Every button click
Every keystroke
Every parent rerender
```

***

## Benefits

### ✅ Reduced CPU Work

Instead of:

```text
10000 users filtered
on every render
```

Filtering runs only when needed.

***

### ✅ Better React Performance

Works well with:

```jsx
React.memo()
```

```jsx
useCallback()
```

```jsx
useMemo()
```

***

### ✅ Large Dataset Optimisation

For tables containing:

```text
1,000+
10,000+
50,000+ records
```

Memoisation can significantly reduce unnecessary computations.

***

# 3. Filtering with Pagination

Very common interview question.

***

## Step 1: State

```jsx
const [search, setSearch] =
  useState("");

const [currentPage, setCurrentPage] =
  useState(1);

const pageSize = 5;
```

***

## Step 2: Filter Data

```jsx
const filteredUsers = useMemo(
  () =>
    users.filter(user =>
      user.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    ),
  [users, search]
);
```

***

## Step 3: Apply Pagination

```jsx
const paginatedUsers = useMemo(() => {
  const start =
    (currentPage - 1) * pageSize;

  const end =
    start + pageSize;

  return filteredUsers.slice(
    start,
    end
  );
}, [
  filteredUsers,
  currentPage
]);
```

***

## Step 4: Render

```jsx
<>
  <input
    value={search}
    onChange={e =>
      setSearch(e.target.value)
    }
  />

  {paginatedUsers.map(user => (
    <p key={user.id}>
      {user.name}
    </p>
  ))}

  <button
    onClick={() =>
      setCurrentPage(
        prev => prev - 1
      )
    }
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <button
    onClick={() =>
      setCurrentPage(
        prev => prev + 1
      )
    }
  >
    Next
  </button>
</>
```

***

## Calculate Total Pages

```jsx
const totalPages =
  Math.ceil(
    filteredUsers.length /
      pageSize
  );
```

***

## Generate Page Numbers

```jsx
const pages = Array.from(
  { length: totalPages },
  (_, i) => i + 1
);
```

Render:

```jsx
{
  pages.map(page => (
    <button
      key={page}
      onClick={() =>
        setCurrentPage(page)
      }
    >
      {page}
    </button>
  ));
}
```

***

# Production-Level Pattern

```jsx
const filteredData = useMemo(
  () => applyFilters(
    data,
    filters
  ),
  [data, filters]
);

const paginatedData = useMemo(
  () => paginate(
    filteredData,
    currentPage,
    pageSize
  ),
  [
    filteredData,
    currentPage,
    pageSize
  ]
);
```

### Flow

```text
API Data
    ↓
Filter
    ↓
Sort
    ↓
Pagination
    ↓
Render
```

***

# Senior React Interview Answer

> For large datasets, I first memoise filtering using `useMemo` to avoid recalculating results on every render. After filtering, I apply pagination using `slice()` to render only the current page of data. This improves performance, reduces DOM work, and scales well for enterprise dashboards, data tables, and search-driven applications.
## 1. Combining `filter()` with `sort()` in React

A very common requirement in dashboards and data tables.

### Example: Filter Active Users and Sort by Experience

```jsx
import { useMemo } from "react";

function UsersList({ users }) {
  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(user => user.active)
      .sort((a, b) => b.experience - a.experience);
  }, [users]);

  return (
    <>
      {filteredAndSortedUsers.map(user => (
        <div key={user.id}>
          {user.name} - {user.experience} Years
        </div>
      ))}
    </>
  );
}
```

### Data

```javascript
[
  {
    id: 1,
    name: "Sudhir",
    experience: 10,
    active: true
  },
  {
    id: 2,
    name: "John",
    experience: 5,
    active: true
  }
]
```

### Output

```text
Sudhir - 10 Years
John - 5 Years
```

***

## Important React Note

`sort()` mutates the array.

### ❌ Avoid

```javascript
users.sort(...)
```

### ✅ Safer

```javascript
[...users]
  .filter(...)
  .sort(...)
```

Example:

```javascript
const result = useMemo(() => {
  return [...users]
    .filter(user => user.active)
    .sort((a, b) =>
      a.name.localeCompare(b.name)
    );
}, [users]);
```

***

# 2. Using `useCallback` with Filtering

### Problem

Consider:

```jsx
function Parent() {
  const [search, setSearch] = useState("");

  const filterUsers = user =>
    user.name.includes(search);

  return (
    <UserList
      users={users}
      filterFn={filterUsers}
    />
  );
}
```

Every render:

```text
New function created
```

This can cause unnecessary child re-renders.

***

## Solution: `useCallback`

```jsx
const filterUsers = useCallback(
  user =>
    user.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      ),
  [search]
);
```

Now React reuses the same function reference until:

```javascript
search
```

changes.

***

## React.memo + useCallback

### Child Component

```jsx
const UserList = React.memo(
  ({ users, filterFn }) => {
    const filteredUsers =
      users.filter(filterFn);

    return (
      <>
        {filteredUsers.map(user => (
          <p key={user.id}>
            {user.name}
          </p>
        ))}
      </>
    );
  }
);
```

### Parent Component

```jsx
const filterUsers = useCallback(
  user =>
    user.active,
  []
);
```

Benefits:

✅ Stable function reference

✅ Fewer re-renders

✅ Better React.memo performance

***

## When NOT to Use useCallback

For simple filtering:

```jsx
const filteredUsers = useMemo(
  () =>
    users.filter(
      user => user.active
    ),
  [users]
);
```

Usually:

```text
useMemo ✅
```

is more useful than:

```text
useCallback ✅
```

because you're caching the filtered result rather than the predicate function.

***

# 3. Server-Side Filtering in React

For large datasets:

```text
10,000+
50,000+
100,000+ rows
```

don't download everything and filter on the client.

Instead, send filters to the API.

***

## Client-Side (Not Ideal)

```jsx
const filteredUsers =
  users.filter(user =>
    user.name.includes(search)
  );
```

All data must already be loaded.

***

## Server-Side Filtering

### React

```jsx
import {
  useEffect,
  useState
} from "react";

function Users() {
  const [search, setSearch] =
    useState("");

  const [users, setUsers] =
    useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response =
        await fetch(
          `/api/users?search=${search}`
        );

      const data =
        await response.json();

      setUsers(data);
    }

    fetchUsers();
  }, [search]);

  return (
    <>
      <input
        value={search}
        onChange={e =>
          setSearch(e.target.value)
        }
      />

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

## API Example

```javascript
GET /api/users?search=sudhir
```

Backend:

```javascript
SELECT *
FROM Users
WHERE name LIKE '%sudhir%'
```

***

## Server-Side Filtering + Pagination

This is how enterprise applications usually work.

### Frontend

```javascript
GET /api/users
  ?search=react
  &page=1
  &pageSize=10
```

### Backend

```javascript
SELECT *
FROM Users
WHERE role='React'
LIMIT 10
OFFSET 0
```

Benefits:

✅ Smaller payloads

✅ Faster UI

✅ Better scalability

✅ Lower browser memory usage

***

# Senior React Interview Answer

### Client-Side Filtering

```jsx
users
  .filter(...)
  .sort(...)
```

Use when:

* Small datasets
* Data already available in memory

***

### Optimised Client-Side

```jsx
const filteredUsers = useMemo(
  () => users.filter(...),
  [users]
);
```

Use `useMemo` to avoid unnecessary recalculations.

***

### Server-Side Filtering

```jsx
fetch(
  `/api/users?search=${search}`
)
```

Use when:

* Large datasets
* Paginated tables
* Enterprise dashboards
* Audit logs
* Search-heavy applications

**Interview one-liner:**

> For small datasets I use `useMemo` to combine filtering and sorting efficiently on the client. For large datasets, I push filtering, sorting, and pagination to the server so only the required records are transferred and rendered.
## React Example: Combining `filter()`, `sort()`, and `useCallback()`

This is a common pattern in enterprise applications where users can:

* Search employees
* Filter active records
* Sort by name or experience
* Optimise rendering performance

***

### Parent Component

```jsx
import {
  useState,
  useMemo,
  useCallback
} from "react";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const users = [
    {
      id: 1,
      name: "Sudhir",
      experience: 10,
      active: true
    },
    {
      id: 2,
      name: "John",
      experience: 5,
      active: false
    },
    {
      id: 3,
      name: "Mike",
      experience: 8,
      active: true
    }
  ];

  // Stable filter function
  const filterUser = useCallback(
    (user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        activeOnly
          ? user.active
          : true;

      return (
        matchesSearch &&
        matchesStatus
      );
    },
    [search, activeOnly]
  );

  // Memoized filter + sort
  const filteredUsers = useMemo(() => {
    return [...users]
      .filter(filterUser)
      .sort(
        (a, b) =>
          b.experience -
          a.experience
      );
  }, [users, filterUser]);

  return (
    <>
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <label>
        <input
          type="checkbox"
          checked={activeOnly}
          onChange={() =>
            setActiveOnly(
              prev => !prev
            )
          }
        />
        Active Only
      </label>

      <UserList users={filteredUsers} />
    </>
  );
}
```

***

### Memoised Child Component

```jsx
import React from "react";

const UserList = React.memo(
  ({ users }) => {
    console.log(
      "UserList Rendered"
    );

    return (
      <>
        {users.map(user => (
          <div key={user.id}>
            {user.name}
            {" - "}
            {user.experience} Years
          </div>
        ))}
      </>
    );
  }
);

export default UserList;
```

***

# Why `useCallback()` Helps Here

Without `useCallback()`:

```jsx
const filterUser = user =>
  user.active;
```

Every render creates:

```text
new function reference
```

Therefore:

```javascript
filterUser !== previousFilterUser
```

This causes:

```text
useMemo recalculates
React.memo children may re-render
```

***

### With `useCallback()`

```jsx
const filterUser = useCallback(
  user => user.active,
  []
);
```

React reuses the same function reference.

Benefits:

✅ Fewer recalculations

✅ Stable dependencies

✅ Better React.memo performance

✅ Useful when passing functions to child components

***

# Filter + Sort Interview Pattern

```jsx
const result = useMemo(() => {
  return [...users]
    .filter(user =>
      user.active
    )
    .sort(
      (a, b) =>
        a.name.localeCompare(
          b.name
        )
    );
}, [users]);
```

### Flow

```text
Users
  ↓
Filter
  ↓
Sort
  ↓
Render
```

***

# React Performance Best Practice

### Use `useMemo`

```jsx
const filteredUsers =
  useMemo(
    () =>
      users.filter(...),
    [users]
  );
```

### Use `useCallback`

```jsx
const filterFn =
  useCallback(...);
```

### Use `React.memo`

```jsx
const UserList =
  React.memo(...);
```

Together they reduce unnecessary renders and computations.

***

## Senior React Interview Answer

> When filtering and sorting large datasets in React, I typically use `useMemo` to cache the computed list and `useCallback` to stabilise any predicate functions passed as dependencies or props. Combined with `React.memo`, this prevents unnecessary recalculations and child re-renders, which is especially important for enterprise dashboards and data-heavy applications.
