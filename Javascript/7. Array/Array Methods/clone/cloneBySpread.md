## Clone Array Using Spread Operator (`...`)

The **spread operator** is the most common and recommended way to clone arrays in modern JavaScript and React.

### Basic Example

```javascript
const originalArray = [1, 2, 3, 4, 5];

const clonedArray = [...originalArray];

console.log(clonedArray);
```

### Output

```javascript
[1, 2, 3, 4, 5]
```

***

## Verify It's a New Array

```javascript
const originalArray = [1, 2, 3];

const clonedArray = [...originalArray];

console.log(originalArray === clonedArray);
```

Output:

```javascript
false
```

✅ Different array references

***

## Spread Creates a Shallow Copy

### Primitive Values

```javascript
const numbers = [1, 2, 3];

const clone = [...numbers];

clone[0] = 100;

console.log(numbers);
console.log(clone);
```

Output:

```javascript
[1, 2, 3]

[100, 2, 3]
```

✅ Completely safe

***

## Shallow Copy Problem with Objects

```javascript
const users = [
  {
    id: 1,
    name: "Sudhir"
  }
];

const clone = [...users];

clone[0].name = "John";

console.log(users[0].name);
```

Output:

```javascript
John
```

❌ Object reference is shared

```javascript
users[0] === clone[0] // true
```

***

## Clone Array of Objects

```javascript
const users = [
  {
    id: 1,
    name: "Sudhir"
  }
];

const clone = users.map(user => ({
  ...user
}));

clone[0].name = "John";

console.log(users[0].name);
console.log(clone[0].name);
```

Output:

```javascript
Sudhir
John
```

✅ Objects are independently cloned

***

## Clone Nested Arrays

```javascript
const original = [
  [1, 2],
  [3, 4]
];

const clone = original.map(
  inner => [...inner]
);

clone[0][0] = 100;

console.log(original);
console.log(clone);
```

Output:

```javascript
original:
[
  [1, 2],
  [3, 4]
]

clone:
[
  [100, 2],
  [3, 4]
]
```

✅ Nested arrays copied

***

# React State Example

### Add New User

```javascript
setUsers(prev => [
  ...prev,
  newUser
]);
```

***

### Remove User

```javascript
setUsers(prev =>
  prev.filter(
    user => user.id !== id
  )
);
```

***

### Update User

```javascript
setUsers(prev =>
  prev.map(user =>
    user.id === id
      ? {
          ...user,
          active: true
        }
      : user
  )
);
```

***

### Update Nested Object

```javascript
setUsers(prev =>
  prev.map(user =>
    user.id === id
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

✅ React-friendly immutable update

***

## Spread vs Other Clone Methods

```javascript
const copy1 = [...arr];
const copy2 = Array.from(arr);
const copy3 = arr.slice();
const copy4 = [].concat(arr);
```

All are:

```text
✅ Shallow Copy
✅ New Array Reference
❌ Not Deep Copy
```

***

## Interview Cheat Sheet

```javascript
// Clone array
const clone = [...arr];

// Clone object
const cloneObj = { ...obj };

// Clone array of objects
const cloneUsers =
  users.map(user => ({
    ...user
  }));

// Deep clone
const deepClone =
  structuredClone(data);
```

### Senior React Interview Answer

> The spread operator (`...`) is the most commonly used method for cloning arrays in React because it is concise, readable, and works well with immutable state updates. However, it performs only a shallow copy, so nested objects and arrays must also be copied using spread, `map()`, or `structuredClone()` when necessary.


## Updating Nested Objects with the Spread Operator (`...`) in React

When updating nested state, you must create **new references for every level that changes**.

***

# Example 1: Update Nested Address

### State

```jsx
const [user, setUser] = useState({
  id: 1,
  name: "Sudhir",
  address: {
    city: "Pune",
    country: "India"
  }
});
```

### ✅ Correct Update

```jsx
setUser(prev => ({
  ...prev,
  address: {
    ...prev.address,
    city: "Mumbai"
  }
}));
```

### Result

```javascript
{
  id: 1,
  name: "Sudhir",
  address: {
    city: "Mumbai",
    country: "India"
  }
}
```

***

# Example 2: Update Nested Profile

### State

```jsx
const [user, setUser] = useState({
  name: "Sudhir",
  profile: {
    title: "React Developer",
    experience: 10
  }
});
```

### Update Experience

```jsx
setUser(prev => ({
  ...prev,
  profile: {
    ...prev.profile,
    experience: 11
  }
}));
```

***

# Example 3: Update Object Inside Array

### State

```jsx
const [users, setUsers] = useState([
  {
    id: 1,
    profile: {
      city: "Pune"
    }
  },
  {
    id: 2,
    profile: {
      city: "Delhi"
    }
  }
]);
```

### Update City

```jsx
setUsers(prev =>
  prev.map(user =>
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

***

# Example 4: Deeply Nested Object

### State

```jsx
const [employee, setEmployee] = useState({
  id: 1,
  profile: {
    personalInfo: {
      address: {
        city: "Pune",
        pinCode: "411057"
      }
    }
  }
});
```

### Update City

```jsx
setEmployee(prev => ({
  ...prev,
  profile: {
    ...prev.profile,
    personalInfo: {
      ...prev.profile.personalInfo,
      address: {
        ...prev.profile.personalInfo.address,
        city: "Mumbai"
      }
    }
  }
}));
```

***

# ❌ Common Mistake

```jsx
const copy = { ...user };

copy.address.city = "Mumbai";

setUser(copy);
```

Why is this wrong?

```javascript
copy.address === user.address // true
```

Both objects still share the same nested `address` reference.

***

# ✅ Rule to Remember

For every nested level you update:

```text
Object → spread (...)
Array  → map() or spread (...)
```

Example:

```jsx
setState(prev => ({
  ...prev,

  level1: {
    ...prev.level1,

    level2: {
      ...prev.level1.level2,

      property: newValue
    }
  }
}));
```

***

# React Interview One-Liner

> The spread operator performs a shallow copy, so when updating nested objects in React state, I create new references for every level being modified. This maintains immutability, prevents accidental mutations, and ensures React's rendering optimisations such as `React.memo` work correctly.
