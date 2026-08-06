## Clone Object Using `Object.assign()`

`Object.assign()` is a classic way to create a **shallow copy** of an object.

### Syntax

```javascript
const clone = Object.assign({}, originalObject);
```

***

## Basic Example

```javascript
const user = {
  name: "Sudhir",
  role: "Project Lead"
};

const clonedUser = Object.assign({}, user);

console.log(clonedUser);
```

Output:

```javascript
{
  name: "Sudhir",
  role: "Project Lead"
}
```

***

## Verify New Reference

```javascript
const user = {
  name: "Sudhir"
};

const clone = Object.assign({}, user);

console.log(user === clone);
```

Output:

```javascript
false
```

✅ New object created.

***

# Equivalent to Spread Operator

```javascript
const clone1 = Object.assign({}, user);

const clone2 = {
  ...user
};
```

Both produce:

```javascript
{
  name: "Sudhir"
}
```

Modern React code typically prefers:

```javascript
const clone = {
  ...user
};
```

because it's shorter and easier to read.

***

# Shallow Copy Problem

### Nested Object

```javascript
const user = {
  name: "Sudhir",
  address: {
    city: "Pune"
  }
};

const clone = Object.assign({}, user);

clone.address.city = "Mumbai";

console.log(user.address.city);
```

Output:

```javascript
Mumbai
```

❌ Nested object reference is shared.

### Why?

```text
user.address === clone.address
```

Returns:

```javascript
true
```

***

# Clone Nested Objects

```javascript
const user = {
  name: "Sudhir",
  address: {
    city: "Pune"
  }
};

const clone = {
  ...user,
  address: {
    ...user.address
  }
};

clone.address.city = "Mumbai";

console.log(user.address.city);
```

Output:

```javascript
Pune
```

✅ Nested object cloned.

***

# Clone Array of Objects Using Object.assign

```javascript
const users = [
  {
    id: 1,
    name: "Sudhir"
  }
];

const clonedUsers = users.map(user =>
  Object.assign({}, user)
);

clonedUsers[0].name = "John";

console.log(users[0].name);
console.log(clonedUsers[0].name);
```

Output:

```javascript
Sudhir
John
```

***

# React State Example

### Update User Name

```jsx
setUser(prev =>
  Object.assign({}, prev, {
    name: "John"
  })
);
```

Equivalent spread version:

```jsx
setUser(prev => ({
  ...prev,
  name: "John"
}));
```

✅ Spread is preferred in modern React.

***

# Object.assign vs Spread

| Feature          | Object.assign | Spread (`...`) |
| ---------------- | ------------- | -------------- |
| Shallow Copy     | ✅             | ✅              |
| Deep Copy        | ❌             | ❌              |
| Clone Object     | ✅             | ✅              |
| Readability      | Good          | Better         |
| React Popularity | Low           | High           |
| Modern JS Style  | Older         | Preferred      |

***

# Interview Cheat Sheet

```javascript
// Object clone
const clone = Object.assign({}, obj);

// Array clone
const clone = [...arr];

// Array of objects
const clone = arr.map(item => ({
  ...item
}));

// Deep clone
const clone = structuredClone(data);
```

### Senior React Interview Answer

> `Object.assign({}, obj)` creates a new object reference but only performs a shallow copy. Nested objects and arrays remain shared references. In modern React applications, object spread (`{...obj}`) is generally preferred for readability, while `structuredClone()` or carefully layered spreads are used when deep cloning is required.


# 1. Cloning Nested Objects with `Object.assign()`

## ❌ Shallow Copy Example

```javascript
const user = {
  name: "Sudhir",
  address: {
    city: "Pune",
    country: "India"
  }
};

const clonedUser = Object.assign({}, user);

clonedUser.address.city = "Mumbai";

console.log(user.address.city);
console.log(clonedUser.address.city);
```

### Output

```javascript
Mumbai
Mumbai
```

### Why?

```javascript
user.address === clonedUser.address
```

Output:

```javascript
true
```

The nested `address` object is still shared.

***

## ✅ Clone Nested Object Properly

```javascript
const user = {
  name: "Sudhir",
  address: {
    city: "Pune",
    country: "India"
  }
};

const clonedUser = Object.assign(
  {},
  user,
  {
    address: Object.assign(
      {},
      user.address
    )
  }
);

clonedUser.address.city = "Mumbai";

console.log(user.address.city);
console.log(clonedUser.address.city);
```

### Output

```javascript
Pune
Mumbai
```

Now both objects are independent.

***

# Multiple Nested Levels

```javascript
const employee = {
  name: "Sudhir",
  profile: {
    address: {
      city: "Pune"
    }
  }
};

const clone = Object.assign(
  {},
  employee,
  {
    profile: Object.assign(
      {},
      employee.profile,
      {
        address: Object.assign(
          {},
          employee.profile.address
        )
      }
    )
  }
);

clone.profile.address.city =
  "Mumbai";

console.log(
  employee.profile.address.city
);
```

Output:

```javascript
Pune
```

✅ Works, but becomes verbose quickly.

***

# 2. Shallow vs Deep Copy with `Object.assign()`

## Shallow Copy

```javascript
const product = {
  id: 1,
  details: {
    price: 100
  }
};

const copy = Object.assign(
  {},
  product
);
```

Memory:

```text
product
  └── details ──► { price: 100 }

copy
  └── details ──► Same Object
```

Changing:

```javascript
copy.details.price = 200;
```

also changes:

```javascript
product.details.price
```

***

## Deep Copy

```javascript
const copy = {
  ...product,
  details: {
    ...product.details
  }
};
```

Memory:

```text
product.details ─► Object A

copy.details ─► Object B
```

Independent references.

***

# 3. Object.assign() vs Spread Operator

## Object.assign()

```javascript
const clone =
  Object.assign({}, user);
```

***

## Spread

```javascript
const clone = {
  ...user
};
```

Both produce the same result.

***

## Comparison

| Feature         | Object.assign() | Spread (`...`) |
| --------------- | --------------- | -------------- |
| Clone Object    | ✅               | ✅              |
| Shallow Copy    | ✅               | ✅              |
| Deep Copy       | ❌               | ❌              |
| Clone Arrays    | ❌               | ✅              |
| Readability     | Good            | Excellent      |
| React Usage     | Less Common     | Very Common    |
| Modern JS Style | Older           | Preferred      |

***

## Updating React State

### Using Object.assign()

```javascript
setUser(prev =>
  Object.assign({}, prev, {
    name: "John"
  })
);
```

### Using Spread

```javascript
setUser(prev => ({
  ...prev,
  name: "John"
}));
```

Most React teams prefer:

```javascript
{
  ...prev,
  name: "John"
}
```

because it's cleaner and easier to read.

***

# React Nested Update Example

### Object.assign()

```javascript
setUser(prev =>
  Object.assign({}, prev, {
    address: Object.assign(
      {},
      prev.address,
      {
        city: "Mumbai"
      }
    )
  })
);
```

### Spread (Cleaner)

```javascript
setUser(prev => ({
  ...prev,
  address: {
    ...prev.address,
    city: "Mumbai"
  }
}));
```

Both are correct, but spread is far more common in modern React codebases.

***

# Interview Cheat Sheet

```javascript
// Shallow clone
const clone1 =
  Object.assign({}, obj);

// Shallow clone
const clone2 = {
  ...obj
};

// Deep clone (modern)
const clone3 =
  structuredClone(obj);

// Deep clone (legacy)
const clone4 =
  JSON.parse(
    JSON.stringify(obj)
  );
```

### Senior React Interview Answer

> `Object.assign()` and the spread operator both create shallow copies. Neither performs deep cloning. In modern React applications, the spread operator is generally preferred because it is more concise and readable. For nested updates, every modified level must be copied to maintain immutability, while `structuredClone()` should be used when a true deep clone of complex data structures is required.


## React Example: Updating Nested Objects with `Object.assign()`

Although modern React typically uses the **spread operator (`...`)**, you can achieve the same immutable updates using `Object.assign()`.

***

# Example 1: Update Nested Address

### Initial State

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

### ✅ Update City Using Object.assign()

```jsx
setUser(prev =>
  Object.assign({}, prev, {
    address: Object.assign({}, prev.address, {
      city: "Mumbai"
    })
  })
);
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
    designation: "React Developer",
    experience: 10
  }
});
```

### Update Experience

```jsx
setUser(prev =>
  Object.assign({}, prev, {
    profile: Object.assign({}, prev.profile, {
      experience: 11
    })
  })
);
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

### Update User City

```jsx
setUsers(prev =>
  prev.map(user =>
    user.id === 1
      ? Object.assign({}, user, {
          profile: Object.assign(
            {},
            user.profile,
            {
              city: "Mumbai"
            }
          )
        })
      : user
  )
);
```

***

# Example 4: Deeply Nested Object

### State

```jsx
const [employee, setEmployee] = useState({
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
setEmployee(prev =>
  Object.assign({}, prev, {
    profile: Object.assign({}, prev.profile, {
      personalInfo: Object.assign(
        {},
        prev.profile.personalInfo,
        {
          address: Object.assign(
            {},
            prev.profile.personalInfo.address,
            {
              city: "Mumbai"
            }
          )
        }
      )
    })
  })
);
```

✅ Works correctly but becomes quite verbose.

***

# Equivalent Spread Version (Cleaner)

The same update using spreads:

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

Most React teams prefer this because it's easier to read.

***

# Why Not This?

### ❌ Wrong

```jsx
const copy = Object.assign({}, user);

copy.address.city = "Mumbai";

setUser(copy);
```

Problem:

```javascript
copy.address === user.address
// true
```

The nested object is still shared because `Object.assign()` only performs a **shallow copy**.

***

# Interview Cheat Sheet

### Shallow Clone

```javascript
const clone = Object.assign({}, obj);
```

### Nested Immutable Update

```javascript
Object.assign({}, parent, {
  child: Object.assign({}, parent.child, {
    value: newValue
  })
});
```

### Modern React Alternative

```javascript
{
  ...parent,
  child: {
    ...parent.child,
    value: newValue
  }
}
```

### Senior React Interview Answer

> `Object.assign()` creates a shallow copy, so for nested React state updates I must use `Object.assign()` at every level that changes. While it works correctly, modern React codebases generally prefer the spread operator because it is more concise and readable. Both approaches preserve immutability and help React detect state changes efficiently.
