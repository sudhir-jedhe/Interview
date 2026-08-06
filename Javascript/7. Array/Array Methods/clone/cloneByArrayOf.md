If by **"clone ByArrayof"** you mean **cloning using `Array.of()`**, it's important to know that **`Array.of()` is not a cloning method**.

## What `Array.of()` Does

`Array.of()` creates a new array from the arguments passed to it.

```javascript
const arr = Array.of(1, 2, 3);

console.log(arr);
```

Output:

```javascript
[1, 2, 3]
```

***

## ❌ Wrong Way to Clone

```javascript
const original = [1, 2, 3];

const cloned = Array.of(original);

console.log(cloned);
```

Output:

```javascript
[[1, 2, 3]]
```

Notice that it creates an array containing the original array as a single element.

***

## ✅ Clone Using `Array.of()` + Spread

```javascript
const original = [1, 2, 3];

const cloned = Array.of(...original);

console.log(cloned);
```

Output:

```javascript
[1, 2, 3]
```

This works because:

```javascript
Array.of(...original)
```

becomes:

```javascript
Array.of(1, 2, 3)
```

***

## Shallow Copy Problem

```javascript
const users = [
  { id: 1, name: "Sudhir" }
];

const cloned = Array.of(...users);

cloned[0].name = "John";

console.log(users[0].name);
```

Output:

```javascript
John
```

Because:

```javascript
users[0] === cloned[0]
```

The object reference is shared.

***

## Clone Array of Objects

```javascript
const users = [
  { id: 1, name: "Sudhir" },
  { id: 2, name: "John" }
];

const cloned = Array.of(
  ...users.map(user => ({
    ...user
  }))
);

cloned[0].name = "Mike";

console.log(users[0].name);   // Sudhir
console.log(cloned[0].name);  // Mike
```

***

## Comparison

```javascript
const clone1 = [...arr];
const clone2 = Array.from(arr);
const clone3 = arr.slice();
const clone4 = [].concat(arr);
const clone5 = Array.of(...arr);
```

All produce a **shallow copy** for arrays of primitives.

***

## Interview Answer

`Array.of()` is primarily used to **create arrays**, not to clone them.

```javascript
Array.of(1, 2, 3); // [1, 2, 3]
```

For cloning, prefer:

```javascript
const clone = [...arr];
```

or

```javascript
const clone = Array.from(arr);
```

because they are clearer and more commonly used in modern React applications.

## `Array.of()` vs `Array.from()` for Cloning Arrays

Although both create arrays, they serve **different purposes**.

***

# 1. Basic Syntax

### `Array.of()`

Creates an array from the arguments passed.

```javascript
const arr = Array.of(1, 2, 3);

console.log(arr);
```

Output:

```javascript
[1, 2, 3]
```

***

### `Array.from()`

Creates an array from an iterable or array-like object.

```javascript
const arr = Array.from([1, 2, 3]);

console.log(arr);
```

Output:

```javascript
[1, 2, 3]
```

***

# 2. Cloning an Existing Array

### Using `Array.of()`

```javascript
const original = [1, 2, 3];

const clone = Array.of(...original);

console.log(clone);
```

Output:

```javascript
[1, 2, 3]
```

Notice the spread operator is required.

***

### Using `Array.from()`

```javascript
const original = [1, 2, 3];

const clone = Array.from(original);

console.log(clone);
```

Output:

```javascript
[1, 2, 3]
```

More direct and readable.

***

# 3. Common Mistake with `Array.of()`

```javascript
const original = [1, 2, 3];

const clone = Array.of(original);

console.log(clone);
```

Output:

```javascript
[
  [1, 2, 3]
]
```

You get a nested array because `Array.of()` treats the entire array as one argument.

***

# 4. Array-Like Objects

### `Array.from()` ✅

```javascript
function demo() {
  const args = Array.from(arguments);

  console.log(args);
}

demo(1, 2, 3);
```

Output:

```javascript
[1, 2, 3]
```

***

### `Array.of()` ❌

```javascript
function demo() {
  const args = Array.of(arguments);

  console.log(args);
}
```

Output:

```javascript
[
  Arguments(3)
]
```

Not what you usually want.

***

# 5. Mapping While Cloning

### `Array.from()`

```javascript
const doubled = Array.from(
  [1, 2, 3],
  x => x * 2
);

console.log(doubled);
```

Output:

```javascript
[2, 4, 6]
```

Single operation:

```text
Clone + Transform
```

***

### `Array.of()`

```javascript
const doubled =
  Array.of(...[1, 2, 3])
       .map(x => x * 2);
```

Requires an extra step.

***

# 6. Shallow Copy Behaviour

Both perform shallow copying.

```javascript
const users = [
  { name: "Sudhir" }
];

const clone1 = Array.from(users);
const clone2 = Array.of(...users);

clone1[0].name = "John";

console.log(users[0].name);
```

Output:

```javascript
John
```

Because:

```javascript
users[0] === clone1[0]
```

and

```javascript
users[0] === clone2[0]
```

***

# Performance

### Cloning

```javascript
const clone1 = Array.from(arr);
const clone2 = Array.of(...arr);
```

Generally:

```text
Array.from() → Designed for cloning/conversion
Array.of()   → Designed for creation
```

For cloning, `Array.from()` is usually the better semantic choice.

***

# Interview Comparison Table

| Feature                   | Array.of()        | Array.from() |
| ------------------------- | ----------------- | ------------ |
| Create New Array          | ✅                 | ✅            |
| Clone Existing Array      | ⚠️ Requires `...` | ✅ Direct     |
| Convert Iterable          | ❌                 | ✅            |
| Convert Array-Like Object | ❌                 | ✅            |
| Mapping Function          | ❌                 | ✅            |
| Shallow Copy              | ✅                 | ✅            |
| Deep Copy                 | ❌                 | ❌            |
| Readability for Cloning   | Low               | High         |
| React Usage               | Rare              | Common       |

***

# React Recommendation

For React state updates, prefer:

```javascript
const clone = [...arr];
```

or

```javascript
const clone = Array.from(arr);
```

Avoid:

```javascript
Array.of(...arr);
```

because it's less common and doesn't communicate the cloning intent as clearly.

### Senior Interview One-Liner

> `Array.of()` is primarily for creating arrays from arguments, while `Array.from()` is designed for converting and cloning iterable or array-like objects. For cloning, `Array.from()` is more expressive, supports mapping, and is generally preferred over `Array.of()`.
>
## React Example: Updating Nested Objects with `map()`

A very common React pattern is updating an object inside an array while keeping everything immutable.

***

# Example 1: Update User City

### Initial State

```jsx
const [users, setUsers] = useState([
  {
    id: 1,
    name: "Sudhir",
    profile: {
      city: "Pune",
      country: "India"
    }
  },
  {
    id: 2,
    name: "John",
    profile: {
      city: "London",
      country: "UK"
    }
  }
]);
```

***

### Update City of User 1

```jsx
setUsers(prevUsers =>
  prevUsers.map(user =>
    user.id === 1
      ? {
          ...user,
          profile: {
            ...user.profile,
            city: "Mumbai"
          }
        }
      : user
  )
);
```

### Result

```javascript
[
  {
    id: 1,
    name: "Sudhir",
    profile: {
      city: "Mumbai",
      country: "India"
    }
  },
  {
    id: 2,
    name: "John",
    profile: {
      city: "London",
      country: "UK"
    }
  }
]
```

✅ Only the modified user gets a new reference.

***

# Example 2: Toggle User Status

### State

```jsx
const [users, setUsers] = useState([
  {
    id: 1,
    profile: {
      active: false
    }
  }
]);
```

### Update

```jsx
setUsers(prev =>
  prev.map(user =>
    user.id === 1
      ? {
          ...user,
          profile: {
            ...user.profile,
            active: !user.profile.active
          }
        }
      : user
  )
);
```

***

# Example 3: Update Nested Employee Object

### State

```jsx
const [departments, setDepartments] = useState([
  {
    id: 1,
    name: "Engineering",
    manager: {
      id: 101,
      name: "Apoorva"
    }
  }
]);
```

### Update Manager Name

```jsx
setDepartments(prev =>
  prev.map(department =>
    department.id === 1
      ? {
          ...department,
          manager: {
            ...department.manager,
            name: "John"
          }
        }
      : department
  )
);
```

***

# Example 4: Deeply Nested Object

### State

```jsx
const [employees, setEmployees] = useState([
  {
    id: 1,
    profile: {
      address: {
        city: "Pune",
        pin: "411057"
      }
    }
  }
]);
```

### Update Address

```jsx
setEmployees(prev =>
  prev.map(employee =>
    employee.id === 1
      ? {
          ...employee,
          profile: {
            ...employee.profile,
            address: {
              ...employee.profile.address,
              city: "Mumbai"
            }
          }
        }
      : employee
  )
);
```

***

# ❌ Common Shallow Copy Mistake

```jsx
const copy = [...users];

copy[0].profile.city = "Mumbai";

setUsers(copy);
```

Problem:

```javascript
copy[0] === users[0] // true
```

```javascript
copy[0].profile === users[0].profile // true
```

The nested `profile` object is still shared.

***

# ✅ Interview Pattern

Whenever you update nested state:

```text
Array       → map()
Object      → spread (...)
Nested Obj  → spread (...)
```

Template:

```jsx
setState(prev =>
  prev.map(item =>
    item.id === targetId
      ? {
          ...item,
          nestedObject: {
            ...item.nestedObject,
            property: newValue
          }
        }
      : item
  )
);
```

### Senior React Interview One-Liner

> "When updating nested objects in React state, I use `map()` to create a new array and spread operators to create new object references only for the modified branches. This preserves immutability, prevents shallow-copy bugs, and works efficiently with `React.memo`, `useMemo`, and Redux Toolkit."
