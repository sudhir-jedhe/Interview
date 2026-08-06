```javascript
function addContinentProperty(objectsArray, continent) {
  // Use map() to create a new array with modified objects
  return objectsArray.map((obj) => {
    // Create a new object with the same properties as the original object
    // and add the 'continent' property with the provided value
    return {
      ...obj, // Spread operator to copy existing properties
      continent: continent, // Add or overwrite the 'continent' property
    };
  });
}

// Example usage:
let countries = [
  { name: "USA", population: 331000000 },
  { name: "Canada", population: 38000000 },
  { name: "Brazil", population: 213000000 },
];
let countriesWithContinent = addContinentProperty(countries, "North America");
console.log(countriesWithContinent);

````


To **create a new array with modified objects**, use `map()` and the **spread operator (`...`)**.

## Example 1: Modify a Property

### Original Array

```javascript
const users = [
  {
    id: 1,
    name: "Sudhir",
    active: false
  },
  {
    id: 2,
    name: "John",
    active: false
  }
];
```

### Create New Array

```javascript
const updatedUsers = users.map(user => ({
  ...user,
  active: true
}));

console.log(updatedUsers);
```

### Output

```javascript
[
  {
    id: 1,
    name: "Sudhir",
    active: true
  },
  {
    id: 2,
    name: "John",
    active: true
  }
]
```

✅ Original array remains unchanged.

***

## Example 2: Modify One Object Only

```javascript
const updatedUsers = users.map(user =>
  user.id === 1
    ? {
        ...user,
        active: true
      }
    : user
);

console.log(updatedUsers);
```

### Output

```javascript
[
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
]
```

***

## Example 3: Add New Property

```javascript
const updatedUsers = users.map(user => ({
  ...user,
  role: "React Developer"
}));

console.log(updatedUsers);
```

### Output

```javascript
[
  {
    id: 1,
    name: "Sudhir",
    active: false,
    role: "React Developer"
  },
  {
    id: 2,
    name: "John",
    active: false,
    role: "React Developer"
  }
]
```

***

## Example 4: Modify Nested Object

```javascript
const users = [
  {
    id: 1,
    profile: {
      city: "Pune"
    }
  }
];

const updatedUsers = users.map(user => ({
  ...user,
  profile: {
    ...user.profile,
    city: "Mumbai"
  }
}));

console.log(updatedUsers);
```

### Output

```javascript
[
  {
    id: 1,
    profile: {
      city: "Mumbai"
    }
  }
]
```

✅ Nested object updated immutably.

***

## React State Example

```jsx
const [users, setUsers] = useState([
  {
    id: 1,
    name: "Sudhir",
    active: false
  }
]);

const activateUser = id => {
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
};
```

### Before

```javascript
[
  {
    id: 1,
    active: false
  }
]
```

### After

```javascript
[
  {
    id: 1,
    active: true
  }
]
```

***

## Interview One-Liner

```javascript
const newArray = oldArray.map(item => ({
  ...item,
  property: newValue
}));
```

✅ Creates a new array

✅ Creates new object references

✅ Preserves immutability

✅ React-friendly

✅ Most common pattern for updating objects inside arrays in React applications.


## React Example: Updating Nested Objects Immutably

When working with React state, **never mutate nested objects directly**. Always create new references for every level that changes.

***

# Example 1: Update Nested Address Object

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

### ✅ Update City Immutably

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

# Example 2: Update Object Inside Array

### State

```jsx
const [users, setUsers] = useState([
  {
    id: 1,
    profile: {
      city: "Pune",
      role: "React Developer"
    }
  },
  {
    id: 2,
    profile: {
      city: "Delhi",
      role: "Angular Developer"
    }
  }
]);
```

### ✅ Update User Profile

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

# Example 3: Deeply Nested Object

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

### ✅ Update Address

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

# ❌ Wrong Approach (Mutation)

```jsx
const copy = { ...user };

copy.address.city = "Mumbai";

setUser(copy);
```

Problem:

```javascript
copy.address === user.address
// true
```

The nested object is still shared.

***

# Using Immer (Cleaner for Deep Updates)

```jsx
import { produce } from "immer";

setEmployee(prev =>
  produce(prev, draft => {
    draft.profile.personalInfo.address.city =
      "Mumbai";
  })
);
```

### Benefits

✅ Less boilerplate

✅ Easier to read

✅ Still immutable

✅ Used heavily with Redux Toolkit

***

# React Interview Pattern

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

### Rule of Thumb

```text
Object → Spread (...)
Array  → map() / filter()
Deeply Nested State → Immer
```

### Senior React Interview Answer

> To update nested objects immutably in React, create new references for every level that changes using the spread operator. For arrays, use `map()` or `filter()`. For deeply nested state, Immer provides a cleaner solution while preserving immutability and React's rendering optimisations.
